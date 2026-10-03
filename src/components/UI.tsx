// src/components/UI.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ic } from '../utils/icons';
import { useAppContext } from '../context/AppContext';

export const Brand = ({ cream = false }: { cream?: boolean }) => (
  <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: cream ? 'var(--cream)' : 'var(--ink)', fontWeight: 600, fontSize: '19px', textShadow: cream ? '0 2px 4px rgba(0,0,0,0.1)' : 'none' }}>
    Ahorra <span style={{ color: 'var(--accent)' }}>{ic('clock', 20)}</span> Tiempo
  </Link>
);

export const Badge = ({ text, color }: { text: string; color: string }) => (
  <div style={{ background: color, color: '#fff', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
    {text}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'dark'|'cream'|'ghost-dark'|'glass'|'blue';
  href?: string;
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button = ({ variant = 'dark', href, to, children, style, ...props }: ButtonProps) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
    borderRadius: '999px', fontSize: '15px', fontWeight: 600, transition: 'all 0.2s',
    cursor: 'pointer', border: '1px solid transparent', textDecoration: 'none'
  };
  
  let varStyle: React.CSSProperties = {};
  if (variant === 'dark') varStyle = { background: 'var(--coal)', color: 'var(--cream)', boxShadow: '0 10px 20px rgba(0,0,0,0.15)' };
  if (variant === 'cream') varStyle = { background: 'var(--cream)', color: 'var(--ink)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' };
  if (variant === 'ghost-dark') varStyle = { background: 'rgba(20,30,40,0.4)', color: 'var(--cream)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' };
  if (variant === 'glass') varStyle = { background: 'rgba(255,255,255,0.5)', color: 'var(--ink)', border: '1px solid var(--glass-brd)' };
  if (variant === 'blue') varStyle = { background: 'var(--accent)', color: '#fff' };

  const merged = { ...baseStyle, ...varStyle, ...style };
  
  if (to) return <Link to={to} style={merged} {...(props as any)}>{children}</Link>;
  if (href) return <a href={href} style={merged} {...(props as any)}>{children}</a>;
  return <button style={merged} {...props}>{children}</button>;
};

export const ToastList = () => {
  const { toasts } = useAppContext();
  
  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{ background: '#242b37', color: '#fff', padding: '12px 20px', borderRadius: 999, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', animation: 'slideUp 0.3s ease-out' }}>
          <span style={{ color: t.type === 'success' ? 'var(--ok)' : t.type === 'warn' ? '#fbbf24' : 'var(--accent)' }}>
            {ic(t.type === 'success' ? 'check' : 'info', 18)}
          </span>
          {t.msg}
        </div>
      ))}
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};