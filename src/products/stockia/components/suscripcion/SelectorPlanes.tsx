// src/components/suscripcion/SelectorPlanes.tsx
import { ic } from '../../../../utils/icons';
import { Button } from '../../../../components/UI';
import type { SubscriptionPlan } from '../../subscription';

interface SelectorPlanesProps {
  planes: SubscriptionPlan[];
  alSuscribir: (plan: SubscriptionPlan) => void;
}

export default function SelectorPlanes({ planes, alSuscribir }: SelectorPlanesProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', width: '100%' }}>
      {planes.map(plan => (
        <div key={plan.code} className="glass" style={{ borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--ink)' }}>{plan.name}</h3>
          <div style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--ink)', lineHeight: 1, marginBottom: '24px' }}>
            ${plan.monthlyPrice}
            <span style={{ fontSize: '1rem', color: 'var(--mut)', fontFamily: 'var(--font-body)', fontWeight: 400 }}> /mes</span>
          </div>
          
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flex: 1 }}>
            {plan.features.map(feature => (
              <li key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: 'var(--ink)' }}>
                <span style={{ color: 'var(--ok)', marginTop: '2px' }}>{ic('check', 16)}</span> 
                {feature}
              </li>
            ))}
          </ul>
          
          <Button variant="dark" style={{ width: '100%', justifyContent: 'center' }} onClick={() => alSuscribir(plan)}>
            Elegir {plan.name}
          </Button>
        </div>
      ))}
    </div>
  );
}