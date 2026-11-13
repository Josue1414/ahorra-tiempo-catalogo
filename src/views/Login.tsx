import { useEffect, useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Brand } from '../components/UI';
import { useAppContext } from '../context/AppContext';
import { ic } from '../utils/icons';

export const Login = () => {
  const { authReady, loggedIn, login } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (authReady && loggedIn) navigate('/cuenta', { replace: true });
  }, [authReady, loggedIn, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/cuenta', { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 15px',
    borderRadius: '10px',
    border: '1px solid var(--line)',
    background: 'rgba(255,255,255,0.82)',
    color: 'var(--ink)',
    fontSize: '15px'
  } as const;

  return (
    <div className="container flex min-h-[75vh] items-center justify-center py-16">
      <section className="glass w-full max-w-[460px] rounded-3xl p-6 shadow-xl sm:p-10">
        <Link to="/" className="mb-10 inline-flex">
          <Brand />
        </Link>
        <div className="mb-8">
          <h1 className="mb-2 text-3xl">Iniciar sesión</h1>
          <p className="text-sm text-[var(--mut)]">Accede a las métricas y paquetes de tu cuenta.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-medium">Correo electrónico</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={event => setEmail(event.currentTarget.value)}
              style={inputStyle}
              placeholder="tu@correo.com"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-medium">Contraseña</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                maxLength={128}
                value={password}
                onChange={event => setPassword(event.currentTarget.value)}
                style={{ ...inputStyle, paddingRight: '52px' }}
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword(visible => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-[var(--mut)] transition-colors hover:text-[var(--ink)] focus-visible:outline"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !authReady}
            style={{
              width: '100%',
              padding: '13px 16px',
              borderRadius: '999px',
              background: 'var(--coal)',
              color: 'var(--cream)',
              fontSize: '15px',
              fontWeight: 600,
              opacity: isSubmitting || !authReady ? 0.65 : 1
            }}
          >
            {isSubmitting ? 'Verificando…' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-8 border-t border-[var(--line)] pt-6 text-sm text-[var(--mut)]">
          <p>¿Aún no tienes cuenta? Elige el producto y el plan que deseas contratar para iniciar tu registro.</p>
          <Link to="/" className="mt-4 inline-flex items-center gap-2 font-semibold text-[var(--accent-d)]">
            {ic('arrowL', 16)} Explorar productos
          </Link>
        </div>
      </section>
    </div>
  );
};
