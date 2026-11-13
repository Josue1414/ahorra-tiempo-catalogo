import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Badge, Button } from '../components/UI';
import { loadMitiendaDashboard, type MitiendaDashboardResponse } from '../lib/mitiendaDashboard';
import { ic } from '../utils/icons';
import { useReveal } from '../hooks/useReveal';

const formatDate = (value: string | null) => {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Sin fecha' : date.toLocaleDateString('es-MX');
};

const formatMoney = (value: number) => value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

export const Account = () => {
  const { authReady, loggedIn, user, logout, addToast } = useAppContext();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<MitiendaDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  useReveal();

  useEffect(() => {
    if (authReady && !loggedIn) {
      navigate('/iniciar-sesion', { replace: true, state: { returnTo: '/cuenta' } });
    }
  }, [authReady, loggedIn, navigate]);

  useEffect(() => {
    if (!authReady || !loggedIn) return;
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
  }, [authReady, loggedIn]);

  const activeTeamCount = useMemo(
    () => dashboard?.stores.reduce((total, store) => total + store.activeTeamCount, 0) ?? 0,
    [dashboard]
  );
  const nextExpiration = useMemo(() => {
    const now = Date.now();
    return dashboard?.stores
      .map(store => store.expiresAt)
      .filter(expiration => new Date(expiration).getTime() >= now)
      .sort((left, right) => new Date(left).getTime() - new Date(right).getTime())[0] ?? null;
  }, [dashboard]);

  if (!authReady || !loggedIn || !user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/iniciar-sesion', { replace: true });
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'No se pudo cerrar la sesión.', 'warn');
    }
  };

  const metrics = [
    { icon: 'box', label: 'Tiendas MiTienda', value: isLoading ? '…' : String(dashboard?.stores.length ?? 0) },
    { icon: 'users', label: 'Usuarios activos', value: isLoading ? '…' : String(activeTeamCount) },
    { icon: 'calendar', label: 'Próximo vencimiento', value: isLoading ? '…' : formatDate(nextExpiration) }
  ] as const;

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div className="flex flex-wrap items-start justify-between gap-6" style={{ marginBottom: 40 }}>
        <div>
          <Link to="/" style={{ color: 'var(--mut)', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            {ic('arrowL', 16)} Volver al inicio
          </Link>
          <div className="flex items-center gap-4 sm:gap-5">
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>
              {user.initials}
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0 }}>Hola, {user.name.split(' ')[0]}</h1>
              <p style={{ color: 'var(--mut)' }}>{user.email} · {user.plan}</p>
            </div>
          </div>
        </div>
        <Button variant="glass" onClick={handleLogout}>{ic('logout', 16)} Cerrar sesión</Button>
      </div>

      {user.plan === 'Activación pendiente' && (
        <div role="status" className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          Tu registro está creado, pero MiTienda todavía no termina de activarse. Cierra sesión e inicia de nuevo para reintentar; si el problema continúa, contacta soporte.
        </div>
      )}

      {dashboard?.warning && (
        <div role="status" className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          {dashboard.warning}
        </div>
      )}

      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {metrics.map(metric => (
          <div key={metric.label} className="glass reveal flex items-center gap-4 rounded-2xl p-5">
            <span style={{ color: 'var(--accent)' }}>{ic(metric.icon, 24)}</span>
            <div>
              <div className="text-sm text-[var(--mut)]">{metric.label}</div>
              <div className="font-semibold">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      <section className="glass reveal rounded-2xl p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Badge text="MiTienda" color="#0e9f6e" />
            <div>
              <h2 className="text-2xl">Punto de Venta e Inventario</h2>
              <p className="text-sm text-[var(--mut)]">Suscripciones y tiendas vinculadas a tu cuenta.</p>
            </div>
          </div>
          {!isLoading && dashboard?.stores.length ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900">
              {dashboard.stores.length} {dashboard.stores.length === 1 ? 'tienda' : 'tiendas'}
            </span>
          ) : null}
        </div>

        {isLoading && <p role="status" className="py-5 text-sm text-[var(--mut)]">Cargando tus métricas…</p>}
        {loadError && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{loadError}</p>}
        {!isLoading && !loadError && !dashboard?.stores.length && (
          <div className="rounded-xl border border-[var(--line)] bg-white/50 p-5">
            <p className="mb-4 text-sm text-[var(--mut)]">Aún no hay tiendas MiTienda vinculadas a esta cuenta.</p>
            <Button variant="dark" to="/producto/stockia">Conocer MiTienda</Button>
          </div>
        )}

        {!isLoading && !loadError && Boolean(dashboard?.stores.length) && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white/60 p-4">
              <div className="text-sm text-[var(--mut)]">Tiendas registradas</div>
              <div className="mt-1 text-xl font-semibold">{dashboard?.stores.length}</div>
            </div>
            <div className="rounded-xl bg-white/60 p-4">
              <div className="text-sm text-[var(--mut)]">Usuarios trabajadores activos</div>
              <div className="mt-1 text-xl font-semibold">{activeTeamCount}</div>
            </div>
            <div className="rounded-xl bg-white/60 p-4">
              <div className="text-sm text-[var(--mut)]">Próximo vencimiento</div>
              <div className="mt-1 text-xl font-semibold">{formatDate(nextExpiration)}</div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="dark" to="/cuenta/producto/stockia">Ir a producto →</Button>
          <Button variant="glass" to="/producto/stockia">Descripción de producto</Button>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-5 text-2xl">Pagos recientes</h2>
        {isLoading && <p role="status" className="text-sm text-[var(--mut)]">Cargando pagos…</p>}
        {!isLoading && !loadError && !dashboard?.payments.length && (
          <p className="glass rounded-xl p-5 text-sm text-[var(--mut)]">No hay pagos registrados para tus tiendas.</p>
        )}
        {!isLoading && !loadError && Boolean(dashboard?.payments.length) && (
          <div className="glass overflow-x-auto rounded-2xl">
            <table className="w-full border-collapse text-left">
              <thead className="bg-black/[0.03]">
                <tr>
                  <th className="px-5 py-4 text-sm font-semibold">Fecha</th>
                  <th className="px-5 py-4 text-sm font-semibold">Concepto</th>
                  <th className="px-5 py-4 text-sm font-semibold">Método</th>
                  <th className="px-5 py-4 text-right text-sm font-semibold">Importe</th>
                  <th className="px-5 py-4 text-sm font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {dashboard?.payments.map((payment, index) => (
                  <tr key={`${payment.suscripcion_id}-${payment.created_at}-${index}`} className="border-t border-[var(--line)]">
                    <td className="px-5 py-4 text-sm">{formatDate(payment.created_at)}</td>
                    <td className="px-5 py-4 text-sm">{payment.concepto}</td>
                    <td className="px-5 py-4 text-sm">{payment.metodo}</td>
                    <td className="px-5 py-4 text-right text-sm font-semibold">{formatMoney(payment.monto_pagado)}</td>
                    <td className="px-5 py-4 text-sm">{payment.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
