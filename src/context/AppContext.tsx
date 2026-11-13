import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type ToastType = 'success' | 'warn' | 'info';
interface ToastInfo { id: number; msg: string; type: ToastType; }

interface AccountUser {
  initials: string;
  name: string;
  email: string;
  plan: string;
}

export interface PromotionalRegistration {
  email: string;
  password: string;
  fullName: string;
  storeName: string;
  pin: string;
  promoCode: string;
  planCode: 'BASICO' | 'ESTANDAR' | 'PLUS';
  durationMonths: 1 | 3 | 6 | 12;
}

interface PromotionResponse {
  registrationId: string;
  status: 'trial_active' | 'failed';
  promoDays: number | null;
  expiresAt: string | null;
  error?: string;
}

export interface RegistrationResult {
  needsEmailConfirmation: boolean;
  promoDays: number | null;
  activationComplete: boolean;
  activationMessage?: string;
}

interface AppContextType {
  toasts: ToastInfo[];
  addToast: (msg: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
  authReady: boolean;
  loggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerWithPromotion: (registration: PromotionalRegistration) => Promise<RegistrationResult>;
  logout: () => Promise<void>;
  user: AccountUser | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

let toastId = 0;

const getAuthErrorMessage = (message: string, isSignup = false) => {
  const normalizedMessage = message.toLowerCase();
  if (normalizedMessage.includes('invalid login credentials')) return 'El correo o la contraseña no son correctos.';
  if (normalizedMessage.includes('email not confirmed')) return 'Confirma tu correo antes de iniciar sesión.';
  if (normalizedMessage.includes('user already registered')) return 'Ya existe una cuenta con ese correo. Inicia sesión.';
  if (isSignup && (normalizedMessage.includes('database error saving new user') || normalizedMessage.includes('promo_code'))) {
    return 'No se pudo crear la cuenta. Verifica que el código promocional sea válido y no se haya usado, y que la migración esté aplicada en Supabase.';
  }
  return message;
};

const getFunctionErrorMessage = async (error: { message: string; context?: unknown }) => {
  if (error.context instanceof Response) {
    const body: unknown = await error.context.clone().json().catch(() => null);
    if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
      return body.error;
    }
  }
  return error.message || 'No se pudo completar la activación promocional.';
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const removeToast = (id: number) => {
    setToasts(previous => previous.filter(toast => toast.id !== id));
  };

  const addToast = (msg: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts(previous => [...previous, { id, msg, type }]);
    setTimeout(() => removeToast(id), 2800);
  };

  useEffect(() => {
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setAuthReady(true);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error('Error al restaurar la sesión de Supabase:', error);
        addToast('No se pudo restaurar la sesión. Intenta iniciar sesión de nuevo.', 'warn');
      }
      setSession(data.session);
      setAuthReady(true);
    }).catch((error: unknown) => {
      if (!active) return;
      console.error('Error al restaurar la sesión de Supabase:', error);
      addToast('No se pudo validar la sesión. Intenta iniciar sesión de nuevo.', 'warn');
      setAuthReady(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });
    if (error) throw new Error(getAuthErrorMessage(error.message));

    if (data.user.app_metadata.registration_status === 'trial_provisioning') {
      const { data: activation, error: activationError } = await supabase.functions.invoke<PromotionResponse>(
        'mitienda-register-promotion',
        { body: { password } }
      );

      if (activationError) {
        addToast(await getFunctionErrorMessage(activationError), 'warn');
      } else if (activation?.status === 'trial_active') {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) console.error('No se pudo actualizar la sesión después de activar MiTienda:', refreshError);
      } else if (activation?.status === 'failed') {
        addToast(activation.error ?? 'No se pudo terminar de activar MiTienda. Intenta de nuevo.', 'warn');
      }
    }

    addToast('Sesión iniciada correctamente', 'success');
  };

  const registerWithPromotion = async (registration: PromotionalRegistration): Promise<RegistrationResult> => {
    const input = {
      promoCode: registration.promoCode.trim().toUpperCase(),
      fullName: registration.fullName.trim(),
      storeName: registration.storeName.trim(),
      pinHash: btoa(registration.pin),
      planCode: registration.planCode,
      durationMonths: registration.durationMonths
    };

    if (session) {
      const { data, error } = await supabase.functions.invoke<PromotionResponse>(
        'mitienda-register-promotion',
        { body: { password: registration.password, registration: input } }
      );
      if (error) throw new Error(await getFunctionErrorMessage(error));
      if (!data) throw new Error('El servicio no devolvió el resultado del código promocional.');
      if (data.status === 'trial_active') {
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) console.error('No se pudo actualizar la sesión después de activar MiTienda:', refreshError);
      }
      return {
        needsEmailConfirmation: false,
        promoDays: data.promoDays,
        activationComplete: data.status === 'trial_active',
        activationMessage: data.error
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email: registration.email.trim().toLowerCase(),
      password: registration.password,
      options: {
        data: {
          full_name: registration.fullName.trim(),
          store_name: registration.storeName.trim(),
          promo_code: input.promoCode,
          pin_hash: input.pinHash,
          product_id: 'stockia',
          plan_code: registration.planCode,
          duration_months: registration.durationMonths
        }
      }
    });
    if (error) throw new Error(getAuthErrorMessage(error.message, true));
    if (!data.user) throw new Error('Supabase no devolvió los datos de la cuenta recién creada.');

    const promoDays = Number(data.user.app_metadata.promo_days);
    if (!Number.isInteger(promoDays) || promoDays < 1 || promoDays > 90) {
      throw new Error('La cuenta se creó, pero Supabase no devolvió la duración de la promoción.');
    }

    if (!data.session) {
      addToast('Cuenta creada. Confirma tu correo; al iniciar sesión se activará MiTienda.', 'success');
      return { needsEmailConfirmation: true, promoDays, activationComplete: false };
    }

    const registrationId = data.user.app_metadata.pending_registration_id;
    if (typeof registrationId !== 'string') {
      addToast('La cuenta se creó, pero falta la solicitud de activación. Contacta soporte.', 'warn');
      return {
        needsEmailConfirmation: false,
        promoDays,
        activationComplete: false,
        activationMessage: 'La cuenta se creó, pero no se encontró la solicitud de activación.'
      };
    }

    const { data: activation, error: activationError } = await supabase.functions.invoke<PromotionResponse>(
      'mitienda-register-promotion',
      { body: { password: registration.password, registrationId } }
    );

    if (activationError) {
      const activationMessage = await getFunctionErrorMessage(activationError);
      addToast('La cuenta se creó, pero falta terminar la activación de MiTienda.', 'warn');
      return { needsEmailConfirmation: false, promoDays, activationComplete: false, activationMessage };
    }
    if (!activation) {
      return {
        needsEmailConfirmation: false,
        promoDays,
        activationComplete: false,
        activationMessage: 'La cuenta se creó, pero el servicio no confirmó la activación.'
      };
    }
    if (activation.status === 'failed') {
      addToast('La cuenta se creó, pero falta terminar la activación de MiTienda.', 'warn');
      return {
        needsEmailConfirmation: false,
        promoDays: activation.promoDays ?? promoDays,
        activationComplete: false,
        activationMessage: activation.error
      };
    }

    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) console.error('No se pudo actualizar la sesión después de activar MiTienda:', refreshError);
    addToast('Cuenta y prueba gratuita de MiTienda activadas.', 'success');
    return { needsEmailConfirmation: false, promoDays: activation.promoDays ?? promoDays, activationComplete: true };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    addToast('Sesión cerrada. ¡Hasta pronto!', 'info');
  };

  const authUser = session?.user ?? null;
  const user = useMemo<AccountUser | null>(() => {
    if (!authUser) return null;
    const metadata = authUser.user_metadata;
    const metadataName = typeof metadata.full_name === 'string' ? metadata.full_name.trim() : '';
    const name = metadataName || authUser.email?.split('@')[0] || 'Usuario';
    const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'U';
    const registrationStatus = authUser.app_metadata.registration_status;

    return {
      initials,
      name,
      email: authUser.email ?? '',
      plan: registrationStatus === 'trial_provisioning'
        ? 'Activación pendiente'
        : registrationStatus === 'trial_active'
          ? 'Prueba gratis'
          : registrationStatus === 'payment_pending'
            ? 'Pago pendiente'
            : 'Cuenta AhorraTiempo'
    };
  }, [authUser]);

  return (
    <AppContext.Provider value={{
      toasts, addToast, removeToast,
      authReady,
      loggedIn: Boolean(session),
      login, registerWithPromotion, logout,
      user
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
