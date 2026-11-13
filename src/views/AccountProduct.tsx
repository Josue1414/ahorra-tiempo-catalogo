import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/UI';
import { useAppContext } from '../context/AppContext';
import { loadMitiendaDashboard, type MitiendaDashboardResponse, type MitiendaStoreMetrics } from '../lib/mitiendaDashboard';
import { ic } from '../utils/icons';
import { useReveal } from '../hooks/useReveal';

const SUPPORT_EMAIL = 'hola.ahorratiempo@gmail.com';

const planNames: Record<string, string> = {
  BASICO: 'Básico',
  ESTANDAR: 'Estándar',
  PLUS: 'Plus'
};

const paymentNames: Record<string, string> = {
  MP_DOMICILIADO: 'Mercado Pago domiciliado',
  OXXO: 'OXXO',
  PRUEBA_GRATIS: 'Prueba promocional',
  GRATIS_ADMIN: 'Prueba otorgada por Admin'
};

const formatDate = (value: string | null) => {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Sin fecha' : date.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
};

const statusLabel = (store: MitiendaStoreMetrics) => {
  if (store.blocked) return 'Bloqueada';
  if (new Date(store.expiresAt).getTime() <= Date.now()) return 'Vencida';
  if (store.isFreeTrial) return 'Prueba promocional';
  if (store.status === 'PENDIENTE_OXXO') return 'Pago pendiente';
  return 'Activa';
};

const pinResetMailto = (
  email: string,
  store: MitiendaStoreMetrics
) => {
  const subject = `Solicitud de restablecimiento de PIN - ${store.name}`;
  const body = [
    'Solicito el restablecimiento del PIN del dueño de MiTienda.',
    '',
    `Correo de la cuenta: ${email}`,
    `Nombre de la tienda: ${store.name}`,
    `Paquete: ${planNames[store.plan] ?? store.plan}`,
    `Nombre registrado con rol de dueño: ${store.ownerName ?? 'Por confirmar'}`,
    '',
    'Entiendo que el servicio tiene un costo extra de $100 MXN.'
  ].join('\n');

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const AccountProduct = () => {
  const { id } = useParams();
  const { authReady, loggedIn, user } = useAppContext();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<MitiendaDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  useReveal();

  useEffect(() => {
    if (id !== 'stockia') navigate('/cuenta', { replace: true });
  }, [id, navigate]);

  useEffect(() => {
    if (authReady && !loggedIn) {
      navigate('/iniciar-sesion', { replace: true, state: { returnTo: `/cuenta/producto/${id}` } });
    }
  }, [authReady, loggedIn, navigate, id]);

  useEffect(() => {
    if (!authReady || !loggedIn || id !== 'stockia') return;
    let active = true;
    setIsLoading(true);
    setLoadError('');

    void loadMitiendaDashboard()
      .then(data => {
        if (active) setDashboard(data);
      })
      .catch(error => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : 'No se pudieron cargar las métricas de MiTienda.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authReady, loggedIn, id]);

  if (!authReady || !loggedIn || !user || id !== 'stockia') return null;

  const stores = dashboard?.stores ?? [];
  const teamCount = stores.reduce((total, store) => total + store.team.length, 0);
  const activeTeamCount = stores.reduce((total, store) => total + store.activeTeamCount, 0);

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <Link to="/cuenta" className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--mut)] hover:text-[var(--ink)]">
            {ic('arrowL', 16)} Volver a mi cuenta
          </Link>
          <h1 className="text-3xl sm:text-4xl">Métricas de MiTienda</h1>
          <p className="mt-2 text-[var(--mut)]">Tiendas, paquetes, vencimientos y usuarios vinculados a {user.email}.</p>
        </div>
        <Button variant="glass" to="/producto/stockia">Descripción de producto</Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Tiendas', value: isLoading ? '…' : String(stores.length) },
          { label: 'Usuarios registrados', value: isLoading ? '…' : String(teamCount) },
          { label: 'Usuarios activos', value: isLoading ? '…' : String(activeTeamCount) }
        ].map(metric => (
          <div key={metric.label} className="glass rounded-xl p-5">
            <div className="text-sm text-[var(--mut)]">{metric.label}</div>
            <div className="mt-1 text-2xl font-semibold">{metric.value}</div>
          </div>
        ))}
      </div>

      {dashboard?.warning && (
        <div role="status" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          {dashboard.warning}
        </div>
      )}
      {isLoading && <p role="status" className="glass rounded-xl p-5 text-sm text-[var(--mut)]">Cargando las tiendas y sus usuarios…</p>}
      {loadError && <p role="alert" className="rounded-xl bg-red-50 p-5 text-sm text-red-800">{loadError}</p>}
      {!isLoading && !loadError && stores.length === 0 && (
        <div className="glass rounded-xl p-6">
          <p className="text-[var(--mut)]">No hay tiendas MiTienda vinculadas a esta cuenta.</p>
          <Link to="/producto/stockia" className="mt-4 inline-flex font-semibold text-[var(--accent-d)]">Ver MiTienda</Link>
        </div>
      )}

      {!isLoading && !loadError && stores.length > 0 && (
        <div className="grid gap-6">
          {stores.map(store => (
            <section key={store.subscriptionId} className="glass reveal overflow-hidden rounded-2xl">
              <div className="border-b border-[var(--line)] p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">{store.name}</h2>
                    <p className="mt-1 text-sm text-[var(--mut)]">ID de tienda: {store.storeId ?? 'Sin vincular'}</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-900">{statusLabel(store)}</span>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric label="Paquete contratado" value={planNames[store.plan] ?? store.plan} />
                  <Metric label="Método de pago" value={paymentNames[store.paymentMethod] ?? store.paymentMethod} />
                  <Metric label={store.isFreeTrial ? 'Fin del periodo gratuito' : 'Fecha de vencimiento'} value={formatDate(store.expiresAt)} />
                  <Metric label="Dispositivos permitidos" value={store.maxDevices === null ? 'No disponible' : String(store.maxDevices)} />
                  <Metric label="Usuarios activos" value={`${store.activeTeamCount} de ${store.team.length}`} />
                  <Metric label="Dueño registrado" value={store.ownerName ?? 'No se encontró el usuario dueño'} />
                  <Metric label="Duración contratada" value={store.months > 0 ? `${store.months} ${store.months === 1 ? 'mes' : 'meses'}` : store.isFreeTrial ? 'Prueba promocional' : 'No disponible'} />
                  <Metric label="Estado de la cuenta" value={store.blocked ? 'Bloqueada por Admin' : statusLabel(store)} />
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <h3 className="mb-4 text-lg font-semibold">Usuarios de esta tienda</h3>
                {store.team.length === 0 ? (
                  <p className="text-sm text-[var(--mut)]">No se encontraron usuarios registrados.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead className="bg-black/[0.03]">
                        <tr>
                          <th className="px-4 py-3 text-sm font-semibold">Nombre</th>
                          <th className="px-4 py-3 text-sm font-semibold">Rol</th>
                          <th className="px-4 py-3 text-sm font-semibold">Estado</th>
                          <th className="px-4 py-3 text-sm font-semibold">Registrado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {store.team.map(member => (
                          <tr key={member.userId} className="border-t border-[var(--line)]">
                            <td className="px-4 py-3 text-sm">{member.name}</td>
                            <td className="px-4 py-3 text-sm">{roleName(member.role)}</td>
                            <td className="px-4 py-3 text-sm">{member.active ? 'Activo' : 'Inactivo'}</td>
                            <td className="px-4 py-3 text-sm">{formatDate(member.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
                  <h3 className="font-semibold text-amber-950">¿Olvidaste el PIN del dueño?</h3>
                  <p className="mt-1 text-sm text-amber-950">
                    El restablecimiento se gestiona por Admin y tiene un costo extra de $100 MXN. Envía el correo de tu cuenta, el nombre de la tienda, el paquete y el nombre registrado del dueño.
                  </p>
                  <a
                    href={pinResetMailto(user.email, store)}
                    className="mt-3 inline-flex rounded-full bg-[var(--coal)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85"
                  >
                    Solicitar por correo
                  </a>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-white/55 p-3">
    <div className="text-xs text-[var(--mut)]">{label}</div>
    <div className="mt-1 text-sm font-medium">{value}</div>
  </div>
);

const roleName = (role: string) => {
  if (role === 'DUENO') return 'Dueño';
  if (role === 'SUPERVISOR') return 'Supervisor';
  if (role === 'TRABAJADOR') return 'Trabajador';
  return role;
};
