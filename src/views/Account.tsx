// src/views/Account.tsx
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { products } from '../data/products';
import { Badge, Button } from '../components/UI';
import { ic } from '../utils/icons';
import { useReveal } from '../hooks/useReveal';

export const Account = () => {
  const { loggedIn, user, subs, invoices, logout, addToast } = useAppContext();
  const navigate = useNavigate();
  useReveal();

  useEffect(() => {
    if (!loggedIn) {
      addToast('Debes iniciar sesión para ver tu cuenta', 'warn');
      navigate('/');
    }
  }, [loggedIn, navigate, addToast]);

  if (!loggedIn || !user) return null;

  const handleProx = () => addToast('Próximamente disponible', 'warn');

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div className="flex flex-wrap items-start justify-between gap-6" style={{ marginBottom: 48 }}>
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
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button variant="glass" onClick={logout}>{ic('logout', 16)} Cerrar sesión</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 20, marginBottom: 48 }}>
        {[
          { i: 'shield', l: 'Plan de cuenta', v: user.plan },
          { i: 'box', l: 'Productos activos', v: `${subs.length} de ${products.length}` },
          { i: 'calendar', l: 'Próxima renovación', v: '30 nov 2025' },
          { i: 'creditCard', l: 'Consumo mensual', v: '$112.00' }
        ].map((c, i) => (
          <div key={i} className="glass reveal" style={{ padding: 20, borderRadius: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ color: 'var(--accent)' }}>{ic(c.i as any, 24)}</div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--mut)' }}>{c.l}</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{c.v}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Subscriptions */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: 24 }}>Productos contratados</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: 24, marginBottom: 64 }}>
        {subs.map((s, i) => {
          const p = products.find(x => x.id === s.pid)!;
          return (
            <div key={i} className="glass reveal" style={{ borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ padding: 24, borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Badge text={p.badge} color={p.color} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--mut)' }}>{p.tag}</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(11,122,80,0.1)', color: 'var(--ok)', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Activo</div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--mut)', marginBottom: 8 }}>Uso de licencias: {s.users} ({s.upct}%)</div>
                <div style={{ height: 4, background: 'rgba(0,0,0,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${s.upct}%`, height: '100%', background: p.color }} />
                </div>
              </div>
              <div style={{ padding: 24, background: 'rgba(255,255,255,0.3)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, fontSize: 13 }}>
                <div><div style={{ color: 'var(--mut)' }}>ID Suscripción</div><div style={{ fontWeight: 500 }}>{s.sid}</div></div>
                <div><div style={{ color: 'var(--mut)' }}>Versión</div><div style={{ fontWeight: 500 }}>v{s.ver}</div></div>
                <div><div style={{ color: 'var(--mut)' }}>Renovación</div><div style={{ fontWeight: 500 }}>{s.renewal}</div></div>
                <div><div style={{ color: 'var(--mut)' }}>Uptime</div><div style={{ fontWeight: 500 }}>{s.uptime}</div></div>
                <div><div style={{ color: 'var(--mut)' }}>Llamadas API</div><div style={{ fontWeight: 500 }}>{s.api}</div></div>
                <div><div style={{ color: 'var(--mut)' }}>Último backup</div><div style={{ fontWeight: 500 }}>{s.backup}</div></div>
              </div>
              <div style={{ padding: 16, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--mut)' }}>{s.plan} · Cliente desde {s.since}</div>
                <Button variant="dark" to={`/producto/${p.id}`}>Abrir producto →</Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invoices */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: 24 }}>Facturación reciente</h2>
      <div className="glass reveal" style={{ borderRadius: 16, overflowX: 'auto', marginBottom: 64 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(0,0,0,0.03)' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: 14 }}>Fecha</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: 14 }}>Concepto</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: 14 }}>Estado</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, fontSize: 14, textAlign: 'right' }}>Importe</th>
              <th style={{ padding: '16px 24px' }}></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i} style={{ borderTop: '1px solid var(--line)' }}>
                <td style={{ padding: '16px 24px', fontSize: 14 }}>{inv.date}</td>
                <td style={{ padding: '16px 24px', fontSize: 14 }}>{inv.concept}</td>
                <td style={{ padding: '16px 24px' }}><span style={{ background: 'rgba(11,122,80,0.1)', color: 'var(--ok)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{inv.status}</span></td>
                <td style={{ padding: '16px 24px', fontSize: 14, fontWeight: 600, textAlign: 'right' }}>{inv.amount}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right' }}><button onClick={handleProx} style={{ color: 'var(--mut)' }}>{ic('download', 18)}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};