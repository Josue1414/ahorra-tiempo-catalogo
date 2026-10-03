// src/views/ProductDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useAppContext } from '../context/AppContext';
import { Badge, Button } from '../components/UI';
import { ic } from '../utils/icons';
import { useReveal } from '../hooks/useReveal';
import { Modal } from '../components/Modal';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedIn, subs, addToast } = useAppContext();
  const p = products.find(x => x.id === id);
  useReveal();

  const [showSubModal, setShowSubModal] = useState(false);

  useEffect(() => {
    if (!p) navigate('/');
    else window.scrollTo(0, 0);
  }, [p, navigate]);

  if (!p) return null;

  const isSubbed = loggedIn && subs.some(s => s.pid === p.id);
  const nextIdx = (products.findIndex(x => x.id === p.id) + 1) % products.length;
  const nextP = products[nextIdx];

  return (
    <div style={{ '--pc': p.color, '--prgb': p.rgb } as React.CSSProperties}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <Link to="/" style={{ color: 'var(--mut)', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
          {ic('arrowL', 16)} Todos los productos
        </Link>

        {/* Hero Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div className="reveal">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <Badge text={p.badge} color={p.color} />
              <span style={{ fontWeight: 600, fontSize: 18 }}>{p.name}</span>
              <span style={{ color: 'var(--mut)' }}>·</span>
              <span style={{ color: 'var(--mut)' }}>{p.tag}</span>
            </div>
            <h1 style={{ fontSize: '3.5rem', marginBottom: 24 }}>{p.heroT}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--mut)', marginBottom: 40 }}>{p.heroS}</p>
            <div style={{ display: 'flex', gap: 16 }}>
              {isSubbed ? (
                <Button variant="dark" to="/cuenta">Gestionar suscripción</Button>
              ) : (
                <Button variant="dark" onClick={() => setShowSubModal(true)}>Empezar ahora</Button>
              )}
            </div>
          </div>
          
          <div className="reveal" style={{ animation: 'float 7s ease-in-out infinite alternate', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: -20, background: `radial-gradient(circle, rgba(var(--prgb),0.2) 0%, transparent 70%)`, zIndex: -1 }} />
            <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', border: '1px solid var(--line)', height: 400 }}>
              <div style={{ background: '#f8f9fa', padding: '12px 16px', display: 'flex', gap: 8, borderBottom: '1px solid var(--line)' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <div style={{ display: 'flex', height: 'calc(100% - 41px)' }}>
                <div style={{ width: 120, borderRight: '1px solid var(--line)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {p.mock.side.map((item, i) => (
                    <div key={i} style={{ fontSize: 13, color: i === 1 ? 'var(--pc)' : 'var(--mut)', fontWeight: i === 1 ? 600 : 400 }}>{item}</div>
                  ))}
                </div>
                <div style={{ flex: 1, padding: 24, background: `rgba(var(--prgb), 0.03)` }}>
                  <div style={{ width: '40%', height: 24, background: 'rgba(0,0,0,0.05)', borderRadius: 4, marginBottom: 24 }} />
                  <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                     <div style={{ flex: 1, height: 80, background: '#fff', borderRadius: 8, border: '1px solid var(--line)' }} />
                     <div style={{ flex: 1, height: 80, background: '#fff', borderRadius: 8, border: '1px solid var(--line)' }} />
                  </div>
                  <div style={{ height: 140, background: '#fff', borderRadius: 8, border: '1px solid var(--line)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Features (Zig-Zag) */}
        <div style={{ marginTop: 120 }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 60, textAlign: 'center' }}>Todo lo que incluye</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
            {p.detailedFeats.map((feat, i) => (
              <div key={i} className="zig-zag-row reveal" style={{ display: 'flex', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', gap: 48, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: 16, color: 'var(--ink)' }}>{feat.t}</h3>
                  <p style={{ color: 'var(--mut)', fontSize: '1.1rem', lineHeight: 1.6 }}>{feat.d}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <img src={feat.img} alt={feat.t} style={{ width: '100%', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', objectFit: 'cover', aspectRatio: '4/3' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div style={{ marginTop: 120, textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 40 }}>Un precio simple, todo incluido.</h2>
          
          <div className="glass reveal" style={{ maxWidth: 800, margin: '0 auto', borderRadius: 24, padding: 40, textAlign: 'left', display: 'flex', gap: 40, alignItems: 'center' }}>
            <div style={{ flex: 1, borderRight: '1px solid var(--line)', paddingRight: 40 }}>
              <div style={{ fontSize: '4rem', fontFamily: 'var(--font-heading)', color: 'var(--ink)', lineHeight: 1 }}>
                ${p.monthly}
              </div>
              <div style={{ color: 'var(--mut)', marginTop: 8 }}>MXN / mes</div>
            </div>
            <div style={{ flex: 1 }}>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {['Módulos completos', 'Usuarios y sucursales ilimitadas', 'Soporte técnico', 'Sin plazos forzosos'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: 'var(--ok)' }}>{ic('check', 16)}</span> {item}</li>
                ))}
              </ul>
              <Button variant="dark" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowSubModal(true)}>
                Suscribirme ahora
              </Button>
            </div>
          </div>
        </div>

        {/* Next Product Banner */}
        <div style={{ marginTop: 120 }}>
          <div onClick={() => { if(nextP.enabled) navigate(`/producto/${nextP.id}`); else addToast('Próximamente', 'warn'); }} className="glass" style={{ padding: 40, borderRadius: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
            <div>
              <div style={{ color: 'var(--mut)', fontSize: 14, marginBottom: 8 }}>Siguiente producto</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: nextP.color }}>{nextP.name}</div>
            </div>
            <div style={{ color: nextP.color }}>{ic('arrowR', 32)}</div>
          </div>
        </div>
      </div>

      <Modal isOpen={showSubModal} onClose={() => setShowSubModal(false)} title={`Suscribirse a ${p.name}`}>
        <form onSubmit={e => { e.preventDefault(); addToast(`¡Suscripción a ${p.name} activada!`, 'success'); setShowSubModal(false); navigate('/cuenta'); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
           <p style={{ color: 'var(--mut)' }}>Plan mensual — ${p.monthly} MXN/mes</p>
           <input required type="email" placeholder="Tu correo electrónico" style={{ padding: 12, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
           <Button variant="blue" type="submit" style={{ justifyContent: 'center' }}>Continuar al pago</Button>
        </form>
      </Modal>

      <style>{`
        @keyframes float { 0% { transform: translateY(0px); } 100% { transform: translateY(-20px); } }
        @media (max-width: 768px) {
          .zig-zag-row { flex-direction: column !important; text-align: center; }
          .zig-zag-row > div { width: 100%; }
        }
      `}</style>
    </div>
  );
};