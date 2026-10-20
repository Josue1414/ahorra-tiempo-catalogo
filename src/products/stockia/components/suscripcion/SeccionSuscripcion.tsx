// src/components/suscripcion/SeccionSuscripcion.tsx
import { useState } from 'react';
import SelectorPlanes from './SelectorPlanes';
import FormularioSuscripcion from './FormularioSuscripcion';
import { stockiaPlans } from '../../subscription';
import type { SubscriptionPlan } from '../../subscription';
import type { PaymentMethod } from './FormularioSuscripcion';

interface SeccionSuscripcionProps {
  alContinuar: (metodo: PaymentMethod) => void;
}

export default function SeccionSuscripcion({ alContinuar }: SeccionSuscripcionProps) {
  const [planSeleccionado, setPlanSeleccionado] = useState<SubscriptionPlan | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const planes = stockiaPlans;

  const manejarSuscripcion = (plan: SubscriptionPlan) => {
    setPlanSeleccionado(plan);
    setMostrarFormulario(true);
  };

  return (
    <div className="mt-24 text-center sm:mt-[120px]" id="seccion-suscripcion">
      <h2 className="mb-4 text-4xl sm:text-5xl">Elige tu plan ideal</h2>
      <p className="mb-10 text-lg text-[var(--mut)] sm:mb-12">
        Selecciona la opción que mejor se adapte a las necesidades de tu negocio.
      </p>

      {mostrarFormulario && planSeleccionado ? (
        <FormularioSuscripcion
          plan={planSeleccionado}
          planes={planes}
          alVolver={() => setMostrarFormulario(false)}
          alCompletar={alContinuar}
          alCambiarPlan={setPlanSeleccionado}
        />
      ) : (
        <SelectorPlanes planes={planes} alSuscribir={manejarSuscripcion} />
      )}
    </div>
  );
}