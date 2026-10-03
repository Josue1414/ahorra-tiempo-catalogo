// src/views/Home.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, platformSlide } from '../data/products';
import { useAppContext } from '../context/AppContext';
import { Brand, Badge, Button } from '../components/UI';
import { SessionButton } from '../components/SessionButton';
import { ic } from '../utils/icons';
import { useReveal } from '../hooks/useReveal';
import { Modal } from '../components/Modal';

export const Home = () => {
  useReveal();
  const navigate = useNavigate();
  const { addToast } = useAppContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  
  const slides = [platformSlide, ...products];

  // Carousel logic
  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % slides.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [isHovering, slides.length]);

  const handleCardClick = (idx: number) => {
    const slide = slides[idx];
    if (slide.id === 'plat') {
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const prod = slide as typeof products[0];
      if (prod.enabled) {
        navigate(`/producto/${prod.id}`);
      } else {
        addToast('Disponible próximamente', 'warn');
      }
    }
  };

  return (
    <div>
      <section style={{ height: '100svh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        {/* Backgrounds */}
        {slides.map((s, i) => (
          <div key={s.id} style={{ position: 'absolute', inset: 0, opacity: activeIndex === i ? 1 : 0, transition: 'opacity 1s ease', zIndex: 0 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, var(--hero), var(--hero-d))', mixBlendMode: 'multiply' }} />
            <img src={s.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: activeIndex === i ? 'scale(1)' : 'scale(1.07)', transition: 'transform 7.5s ease-out' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(21,52,84,0.9), rgba(21,52,84,0.3))' }} />
          </div>
        ))}

        {/* Top bar */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', padding: '24px 40px' }}>
          <Brand cream />
          <SessionButton />
        </div>

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', alignItems: 'center', padding: '0 40px' }}>
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ color: 'var(--cream)', fontSize: '4rem', marginBottom: 20 }} dangerouslySetInnerHTML={{ __html: slides[activeIndex].heroT }} />
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.25rem', marginBottom: 40, lineHeight: 1.5 }}>
              {slides[activeIndex].heroS}
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              {slides[activeIndex].id === 'plat' ? (
                <>
                  <Button variant="cream" onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}>Descubrir productos</Button>
                  <Button variant="ghost-dark" onClick={() => setShowCallModal(true)}>Agendar llamada</Button>
                </>
              ) : (
                <Button variant="cream" onClick={() => handleCardClick(activeIndex)}>Ver producto →</Button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div style={{ position: 'relative', zIndex: 10, padding: '24px 40px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
          {slides.map((s, i) => {
            const isActive = activeIndex === i;
            return (
              <div key={s.id} onClick={() => handleCardClick(i)} onMouseEnter={() => setActiveIndex(i)} style={{ background: isActive ? 'var(--cream)' : 'rgba(14,38,62,0.46)', backdropFilter: 'blur(10px)', borderRadius: 16, cursor: 'pointer', transition: 'all 0.3s', overflow: 'hidden', color: isActive ? 'var(--ink)' : 'var(--cream)', border: isActive ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ height: 58, overflow: 'hidden' }}>
                  <img src={s.thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isActive ? 'none' : 'grayscale(100%) opacity(0.6)' }} />
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, fontSize: 15, fontFamily: 'var(--font-heading)' }}>{s.name}</div>
                  <div style={{ fontSize: 12, opacity: isActive ? 0.7 : 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.id === 'plat' ? s.sub : (s as any).tag}</div>
                </div>
                {/* Progress bar */}
                <div style={{ height: 3, background: 'rgba(0,0,0,0.1)', width: '100%' }}>
                  <div style={{ height: '100%', background: s.id === 'plat' ? 'var(--accent)' : (s as any).color, width: isActive && !isHovering ? '100%' : '0%', transition: isActive && !isHovering ? 'width 5.2s linear' : 'none' }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" className="container" style={{ padding: '100px 24px' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 13, letterSpacing: 1.5 }}>PRODUCTOS</span>
          <h2 style={{ fontSize: '3rem', margin: '16px 0' }}>Una suite. Cuatro formas de ganar tiempo.</h2>
          <p style={{ color: 'var(--mut)', fontSize: '1.2rem', maxWidth: 600, margin: '0 auto' }}>Cada herramienta está diseñada para resolver un problema específico de tu negocio. Úsalas por separado o combínalas.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {products.map((p, i) => (
            <div key={p.id} className="glass reveal" style={{ borderRadius: 24, overflow: 'hidden', cursor: p.enabled ? 'pointer' : 'default', transitionDelay: `${i * 70}ms` }} onClick={() => p.enabled ? navigate(`/producto/${p.id}`) : addToast('Disponible próximamente', 'warn')}>
              <div style={{ height: 200, overflow: 'hidden' }}>
                <img src={p.thumb} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="zoom-on-hover" />
              </div>
              <div style={{ padding: 24 }}>
                <Badge text={p.badge} color={p.color} />
                <h3 style={{ fontSize: '1.8rem', marginTop: 16 }}>{p.name}</h3>
                <p style={{ color: 'var(--mut)', fontSize: 14, marginBottom: 16 }}>{p.tag}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {p.bullets.map((b, bi) => (
                    <li key={bi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--ink)' }}>
                      <span style={{ color: p.color }}>{ic('check', 16)}</span> {b}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                  
                  <span style={{ color: p.color, fontWeight: 600, fontSize: 14 }}>{p.enabled ? 'Ver producto →' : 'Próximamente'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal isOpen={showCallModal} onClose={() => setShowCallModal(false)} title="Agenda una llamada">
        <form onSubmit={(e) => { e.preventDefault(); addToast('Te contactaremos en menos de 24 horas', 'success'); setShowCallModal(false); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input required type="text" placeholder="Nombre completo" style={{ padding: 12, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
          <input required type="email" placeholder="Email de trabajo" style={{ padding: 12, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff' }} />
          <Button variant="blue" type="submit" style={{ justifyContent: 'center', marginTop: 8 }}>Solicitar llamada</Button>
        </form>
      </Modal>

      <style>{`.zoom-on-hover:hover { transform: scale(1.05); }`}</style>
    </div>
  );
};