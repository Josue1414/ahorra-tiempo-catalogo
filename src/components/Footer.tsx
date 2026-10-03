// src/components/Footer.tsx
import React from 'react';
import { Brand} from './UI';
import { useAppContext } from '../context/AppContext';
import { ic } from '../utils/icons';

export const Footer = () => {
  const { addToast } = useAppContext();
  const handleProx = (e: React.MouseEvent) => {
    e.preventDefault();
    addToast('Disponible próximamente en la versión completa', 'warn');
  };

  return (
    <footer style={{ background: 'linear-gradient(to bottom, #1e2530, #171c25)', color: 'var(--cream)', paddingTop: 64, paddingBottom: 24, borderTop: '4px solid var(--accent)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          <div>
            <Brand cream />
            <p style={{ color: 'var(--mut)', fontSize: 14, marginTop: 16, marginBottom: 24 }}>La suite de software que opera tu negocio de punta a punta.</p>
            <form onSubmit={e => { e.preventDefault(); addToast('¡Suscrito al newsletter!', 'success'); }} style={{ display: 'flex', gap: 8 }}>
              <input type="email" required placeholder="Tu email" style={{ padding: '8px 12px', borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', flex: 1 }} />
              <button type="submit" style={{ background: 'var(--accent)', color: '#fff', padding: '8px 12px', borderRadius: 6, fontWeight: 600 }}>Suscribirme</button>
            </form>
          </div>
          <div>
            <h4 style={{ marginBottom: 16 }}>Productos</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--mut)', fontSize: 14 }}>
              <li><a href="#/producto/stockia">Stockia</a></li>
              <li><a href="#/producto/citalis">Citalis</a></li>
              <li><a href="#/producto/turnia">Turnia</a></li>
              <li><a href="#/producto/mesa">Mesa</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: 16 }}>Empresa</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--mut)', fontSize: 14 }}>
              <li><a href="#" onClick={handleProx}>Sobre nosotros</a></li>
              <li><a href="#" onClick={handleProx}>Blog</a></li>
              <li><a href="#" onClick={handleProx}>Trabaja con nosotros</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: 16 }}>Contacto</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, color: 'var(--mut)', fontSize: 14 }}>
              <li style={{ display: 'flex', gap: 8 }}>{ic('phone', 16)} +34 910 246 800</li>
              <li style={{ display: 'flex', gap: 8 }}>{ic('info', 16)} hola@ahorratiempo.com</li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', color: 'var(--mut)', fontSize: 13 }}>
          <span>© 2026 Ahorra-Tiempo S.L.</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" onClick={handleProx}>Privacidad</a>
            <a href="#" onClick={handleProx}>Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};