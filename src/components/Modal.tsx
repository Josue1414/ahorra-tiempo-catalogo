// src/components/Modal.tsx
import React, { useEffect } from 'react';
import { ic } from '../utils/icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,15,25,0.4)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#242b37', color: 'var(--cream)', width: '90%', maxWidth: 440, borderRadius: 22, padding: 32, boxShadow: '0 25px 50px rgba(0,0,0,0.3)', animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, color: 'var(--mut)' }}>{ic('x', 24)}</button>
        <h3 style={{ fontSize: 24, marginBottom: 24 }}>{title}</h3>
        {children}
      </div>
      <style>{`@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
};