import { useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ic } from '../../../../utils/icons';
import {
  getStockiaQuote,
  type SubscriptionDuration,
  type SubscriptionPlan
} from '../../subscription';

export type PaymentMethod = 'domiciliado' | 'oxxo' | 'tarjeta';

interface FormularioSuscripcionProps {
  plan: SubscriptionPlan;
  planes: SubscriptionPlan[];
  alVolver: () => void;
  alCompletar: (metodo: PaymentMethod) => void;
  alCambiarPlan: (plan: SubscriptionPlan) => void;
}

const mesesDisponibles: SubscriptionDuration[] = [1, 3, 6, 12];

const money = (amount: number) =>
  amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

export default function FormularioSuscripcion({
  plan,
  planes,
  alVolver,
  alCompletar,
  alCambiarPlan
}: FormularioSuscripcionProps) {
  const [planListOpen, setPlanListOpen] = useState(false);
  const [storesInfoOpen, setStoresInfoOpen] = useState(false);
  const [months, setMonths] = useState<SubscriptionDuration>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('oxxo');
  const [showPin, setShowPin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    email: '',
    emailConfirmation: '',
    username: '',
    storeName: '',
    pin: '',
    password: '',
    passwordConfirmation: ''
  });

  const quote = getStockiaQuote(plan, months);

  const updateField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    const normalizedValue = name === 'pin'
      ? value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
      : name === 'email' || name === 'emailConfirmation'
        ? value.trimStart()
        : value;

    setForm(current => ({ ...current, [name]: normalizedValue }));
    setFormError('');
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    if (form.email.trim().toLowerCase() !== form.emailConfirmation.trim().toLowerCase()) {
      setFormError('Los correos electrónicos no coinciden.');
      return;
    }
    if (!/^[A-Z]{2}\d{4}$/.test(form.pin)) {
      setFormError('El PIN debe tener exactamente 2 letras y 4 números (por ejemplo, AB1234).');
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,128}$/.test(form.password)) {
      setFormError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.');
      return;
    }
    if (form.password !== form.passwordConfirmation) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    setForm(current => ({ ...current, pin: '', password: '', passwordConfirmation: '' }));
    alCompletar(paymentMethod);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid var(--line)',
    background: 'rgba(255,255,255,0.8)',
    color: 'var(--ink)',
    fontSize: '15px',
    outline: 'none'
  } as const;
  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--mut)',
    marginBottom: '8px'
  } as const;
  const sectionHeadingStyle = {
    fontSize: '1.2rem',
    marginBottom: '16px',
    borderBottom: '1px solid var(--line)',
    paddingBottom: '8px'
  } as const;
  const secretFieldStyle = { ...inputStyle, paddingRight: '48px' } as const;
  const visibilityButtonStyle = {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--mut)',
    padding: '4px'
  };

  return (
    <div className="glass" style={{ maxWidth: '720px', margin: '0 auto', borderRadius: '24px', padding: 'clamp(20px, 5vw, 40px)', textAlign: 'left' }}>
      <button
        type="button"
        onClick={alVolver}
        style={{ color: 'var(--mut)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px' }}
      >
        {ic('arrowL', 16)} Volver a los planes
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Crear una tienda MiTienda</h3>
        <p style={{ color: 'var(--mut)', fontSize: '14px' }}>
          Completa los datos del dueño y del comercio. El correo puede tener varias tiendas.
        </p>
      </div>

      <div style={{ background: 'rgba(var(--prgb), 0.1)', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(var(--prgb), 0.2)', overflow: 'hidden' }}>
        <button
          type="button"
          aria-expanded={planListOpen}
          onClick={() => setPlanListOpen(open => !open)}
          style={{ width: '100%', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}
        >
          <span>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--pc)', fontWeight: 600, textTransform: 'uppercase' }}>Plan seleccionado</span>
            <span style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>{plan.name}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <strong style={{ fontSize: '20px', color: 'var(--ink)' }}>{money(plan.monthlyPrice)}<small style={{ fontSize: '13px', color: 'var(--mut)', fontWeight: 400 }}> / mes</small></strong>
            {ic('chevD', 20)}
          </span>
        </button>
        {planListOpen && (
          <div style={{ borderTop: '1px solid rgba(var(--prgb), 0.2)', padding: '12px 20px', background: 'rgba(255,255,255,0.5)' }}>
            {planes.map(option => (
              <button
                key={option.code}
                type="button"
                aria-pressed={option.code === plan.code}
                onClick={() => {
                  alCambiarPlan(option);
                  setPlanListOpen(false);
                }}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '12px', borderRadius: '8px', background: option.code === plan.code ? 'var(--cream)' : 'transparent', textAlign: 'left' }}
              >
                <span style={{ fontWeight: option.code === plan.code ? 700 : 500 }}>{option.name}</span>
                <span>{money(option.monthlyPrice)} / mes</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '28px', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px' }}>
        <button
          type="button"
          aria-expanded={storesInfoOpen}
          onClick={() => setStoresInfoOpen(open => !open)}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', textAlign: 'left', fontWeight: 600 }}
        >
          ¿Ya tienes tiendas MiTienda con este correo?
          {ic('chevD', 18)}
        </button>
        {storesInfoOpen && (
          <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--mut)' }}>
            Tus tiendas se mostrarán aquí únicamente después de verificar tu correo e iniciar sesión. Así evitamos revelar las tiendas asociadas a correos de otras personas. Este catálogo aún no está conectado al servicio de consulta.
          </p>
        )}
      </div>

      <form onSubmit={submitForm} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <section>
          <h3 style={sectionHeadingStyle}>Duración y precio</h3>
          <fieldset style={{ border: 0, padding: 0 }}>
            <legend style={{ ...labelStyle, marginBottom: '12px' }}>Elige el periodo que quieres contratar</legend>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
              {mesesDisponibles.map(duration => {
                const optionQuote = getStockiaQuote(plan, duration);
                return (
                  <label key={duration} style={{ border: months === duration ? '2px solid var(--pc)' : '1px solid var(--line)', background: months === duration ? 'rgba(var(--prgb), 0.05)' : '#fff', borderRadius: '8px', padding: '12px 8px', textAlign: 'center', cursor: paymentMethod === 'tarjeta' && duration !== 1 ? 'not-allowed' : 'pointer', opacity: paymentMethod === 'tarjeta' && duration !== 1 ? 0.55 : 1 }}>
                    <input
                      type="radio"
                      name="duration"
                      value={duration}
                      checked={months === duration}
                      disabled={paymentMethod === 'tarjeta' && duration !== 1}
                      onChange={() => setMonths(duration)}
                    />
                    <span style={{ display: 'block', fontWeight: 600 }}>{duration} {duration === 1 ? 'mes' : 'meses'}</span>
                    <span style={{ display: 'block', fontSize: '13px' }}>{money(optionQuote.total)}</span>
                    {optionQuote.discount > 0 && (
                      <span style={{ display: 'block', fontSize: '12px', color: 'var(--ok)' }}>Ahorras {money(optionQuote.discount)}</span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </section>

        <section>
          <h3 style={sectionHeadingStyle}>Datos de la cuenta y del comercio</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label htmlFor="subscription-email" style={labelStyle}>Correo electrónico</label>
              <input id="subscription-email" type="email" name="email" autoComplete="email" required maxLength={254} value={form.email} onChange={updateField} style={inputStyle} placeholder="tu@correo.com" />
            </div>
            <div>
              <label htmlFor="subscription-email-confirmation" style={labelStyle}>Confirmar correo electrónico</label>
              <input id="subscription-email-confirmation" type="email" name="emailConfirmation" autoComplete="email" required maxLength={254} value={form.emailConfirmation} onChange={updateField} style={inputStyle} placeholder="Repite tu correo" />
            </div>
            <div>
              <label htmlFor="subscription-username" style={labelStyle}>Nombre de usuario / dueño</label>
              <input id="subscription-username" type="text" name="username" autoComplete="name" required minLength={2} maxLength={80} value={form.username} onChange={updateField} style={inputStyle} placeholder="Nombre del dueño" />
            </div>
            <div>
              <label htmlFor="subscription-store-name" style={labelStyle}>Nombre del comercio</label>
              <input id="subscription-store-name" type="text" name="storeName" required minLength={2} maxLength={120} value={form.storeName} onChange={updateField} style={inputStyle} placeholder="Ej. Abarrotes La Esperanza" />
            </div>
            <div>
              <label htmlFor="subscription-pin" style={labelStyle}>PIN (2 letras y 4 números)</label>
              <p id="subscription-pin-help" style={{ marginBottom: '8px', color: 'var(--mut)', fontSize: '13px' }}>
                PIN de acceso rápido para identificar al dueño en MiTienda; no sustituye la contraseña de tu cuenta.
              </p>
              <div style={{ position: 'relative' }}>
                <input id="subscription-pin" type={showPin ? 'text' : 'password'} name="pin" autoComplete="off" required minLength={6} maxLength={6} pattern="[A-Za-z]{2}[0-9]{4}" title="Escribe 2 letras seguidas de 4 números, por ejemplo AB1234" aria-describedby="subscription-pin-help" value={form.pin} onChange={updateField} style={secretFieldStyle} placeholder="AB1234" />
                <button type="button" onClick={() => setShowPin(visible => !visible)} aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'} aria-pressed={showPin} style={visibilityButtonStyle}>
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="subscription-password" style={labelStyle}>Contraseña</label>
              <p id="subscription-password-help" style={{ marginBottom: '8px', color: 'var(--mut)', fontSize: '13px' }}>
                Mínimo 8 caracteres, una mayúscula y un carácter especial (por ejemplo, ! o #).
              </p>
              <div style={{ position: 'relative' }}>
                <input id="subscription-password" type={showPassword ? 'text' : 'password'} name="password" autoComplete="new-password" required minLength={8} maxLength={128} pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,128}" title="Usa al menos 8 caracteres, una mayúscula y un carácter especial." aria-describedby="subscription-password-help" value={form.password} onChange={updateField} style={secretFieldStyle} placeholder="Mínimo 8 caracteres" />
                <button type="button" onClick={() => setShowPassword(visible => !visible)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword} style={visibilityButtonStyle}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="subscription-password-confirmation" style={labelStyle}>Confirmar contraseña</label>
              <div style={{ position: 'relative' }}>
                <input id="subscription-password-confirmation" type={showPasswordConfirmation ? 'text' : 'password'} name="passwordConfirmation" autoComplete="new-password" required minLength={8} maxLength={128} pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,128}" title="Usa al menos 8 caracteres, una mayúscula y un carácter especial." value={form.passwordConfirmation} onChange={updateField} style={secretFieldStyle} placeholder="Repite tu contraseña" />
                <button type="button" onClick={() => setShowPasswordConfirmation(visible => !visible)} aria-label={showPasswordConfirmation ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'} aria-pressed={showPasswordConfirmation} style={visibilityButtonStyle}>
                  {showPasswordConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 style={sectionHeadingStyle}>Forma de pago</h3>
          <fieldset style={{ border: 0, padding: 0, display: 'grid', gap: '12px' }}>
            <legend style={{ ...labelStyle, marginBottom: '12px' }}>Selecciona cómo pagarás</legend>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', border: paymentMethod === 'domiciliado' ? '2px solid var(--pc)' : '1px solid var(--line)', borderRadius: '10px', padding: '14px', cursor: 'pointer', background: '#fff' }}>
              <input type="radio" name="paymentMethod" value="domiciliado" checked={paymentMethod === 'domiciliado'} onChange={() => setPaymentMethod('domiciliado')} />
              <span><strong>Pago domiciliado</strong><span style={{ display: 'block', color: 'var(--mut)', fontSize: '13px' }}>Cargo automático cada {months} {months === 1 ? 'mes' : 'meses'}; requiere autorizar el mandato de pago.</span></span>
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', border: paymentMethod === 'oxxo' ? '2px solid var(--pc)' : '1px solid var(--line)', borderRadius: '10px', padding: '14px', cursor: 'pointer', background: '#fff' }}>
              <input type="radio" name="paymentMethod" value="oxxo" checked={paymentMethod === 'oxxo'} onChange={() => setPaymentMethod('oxxo')} />
              <span><strong>Pago único en OXXO</strong><span style={{ display: 'block', color: 'var(--mut)', fontSize: '13px' }}>Pagas este periodo con una ficha; no se renueva automáticamente.</span></span>
            </label>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', border: paymentMethod === 'tarjeta' ? '2px solid var(--pc)' : '1px solid var(--line)', borderRadius: '10px', padding: '14px', cursor: 'pointer', background: '#fff' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="tarjeta"
                checked={paymentMethod === 'tarjeta'}
                onChange={() => {
                  setPaymentMethod('tarjeta');
                  setMonths(1);
                }}
              />
              <span><strong>Tarjeta · un solo mes</strong><span style={{ display: 'block', color: 'var(--mut)', fontSize: '13px' }}>Pago único por un mes, sin renovación automática. La opción estará disponible al conectar la pasarela.</span></span>
            </label>
          </fieldset>
        </section>

        <section aria-label="Resumen de la contratación" style={{ border: '1px solid var(--line)', borderRadius: '12px', padding: '18px', background: 'rgba(255,255,255,0.55)' }}>
          <h3 style={{ ...sectionHeadingStyle, marginBottom: '12px' }}>Resumen</h3>
          <div style={{ display: 'grid', gap: '6px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}><span>Plan {plan.name} · {months} {months === 1 ? 'mes' : 'meses'}</span><span>{money(quote.subtotal)}</span></div>
            {quote.discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ok)' }}><span>Descuento del paquete</span><span>-{money(quote.discount)}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: '10px', marginTop: '4px', fontWeight: 700, fontSize: '18px' }}><span>Total a pagar</span><span>{money(quote.total)}</span></div>
            <span style={{ color: 'var(--mut)' }}>
              {paymentMethod === 'domiciliado'
                ? `Renovación domiciliada cada ${months} ${months === 1 ? 'mes' : 'meses'}`
                : paymentMethod === 'oxxo' ? 'Pago único en OXXO' : 'Pago único con tarjeta · un mes'}
            </span>
          </div>
        </section>

        {formError && <p role="alert" style={{ color: '#b42318', fontSize: '14px' }}>{formError}</p>}

        <div role="note" style={{ borderRadius: '10px', padding: '14px', background: 'rgba(255,190,46,0.14)', color: 'var(--ink)', fontSize: '13px' }}>
          La integración con Supabase y la pasarela de pago aún no está conectada. Al continuar solo validaremos el formulario en esta pantalla: no se creará una cuenta, no se cobrará y no se enviarán ni guardarán tus datos.
        </div>

        <button type="submit" style={{ width: '100%', background: 'var(--coal)', color: '#fff', padding: '14px', borderRadius: '8px', fontWeight: 600, fontSize: '16px' }}>
          Validar datos y continuar
        </button>
      </form>
    </div>
  );
}
