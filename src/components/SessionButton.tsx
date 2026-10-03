// src/components/SessionButton.tsx
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from './UI';
import { ic } from '../utils/icons';

export const SessionButton = () => {
  const { loggedIn, user, login } = useAppContext();
  const navigate = useNavigate();

  if (!loggedIn) {
    return <Button variant="ghost-dark" onClick={login}>{ic('users', 18)} Iniciar sesión</Button>;
  }

  return (
    <div onClick={() => navigate('/cuenta')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 12px 6px 6px', borderRadius: 999, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--cream)', transition: 'background 0.2s' }}>
      <div style={{ background: 'var(--accent)', color: '#fff', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
        {user?.initials}
      </div>
      <span style={{ fontSize: 14, fontWeight: 500 }}>{user?.name.split(' ')[0]}</span>
      <span style={{ opacity: 0.7 }}>{ic('chevD', 16)}</span>
    </div>
  );
};