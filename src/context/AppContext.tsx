// src/context/AppContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { userMock, subsMock, invoicesMock } from '../data/account';

type ToastType = 'success' | 'warn' | 'info';
interface ToastInfo { id: number; msg: string; type: ToastType; }

interface AppContextType {
  toasts: ToastInfo[];
  addToast: (msg: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
  loggedIn: boolean;
  login: () => void;
  logout: () => void;
  user: typeof userMock | null;
  subs: typeof subsMock;
  invoices: typeof invoicesMock;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

let toastId = 0;

export function AppProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const addToast = (msg: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => removeToast(id), 2800);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = () => {
    setLoggedIn(true);
    addToast('Sesión iniciada correctamente', 'success');
  };
  const logout = () => {
    setLoggedIn(false);
    addToast('Sesión cerrada. ¡Hasta pronto!', 'info');
  };

  return (
    <AppContext.Provider value={{
      toasts, addToast, removeToast,
      loggedIn, login, logout,
      user: loggedIn ? userMock : null,
      subs: subsMock, invoices: invoicesMock
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};