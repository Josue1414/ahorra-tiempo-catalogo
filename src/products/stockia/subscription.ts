export type SubscriptionDuration = 1 | 3 | 6 | 12;
export type StockiaPlanCode = 'BASICO' | 'ESTANDAR' | 'PLUS';

export interface SubscriptionPlan {
  code: StockiaPlanCode;
  name: string;
  monthlyPrice: number;
  features: string[];
  discounts: Record<SubscriptionDuration, number>;
}

export const stockiaPlans: SubscriptionPlan[] = [
  {
    code: 'BASICO',
    name: 'Básico',
    monthlyPrice: 300,
    discounts: { 1: 0, 3: 25, 6: 50, 12: 150 },
    features: [
      '2 dispositivos',
      'Hasta 4 usuarios',
      'Operación local'
    ]
  },
  {
    code: 'ESTANDAR',
    name: 'Estándar',
    monthlyPrice: 400,
    discounts: { 1: 0, 3: 30, 6: 60, 12: 200 },
    features: [
      'Hasta 5 dispositivos',
      'Hasta 4 usuarios',
      'Sincronización en la nube'
    ]
  },
  {
    code: 'PLUS',
    name: 'Plus',
    monthlyPrice: 500,
    discounts: { 1: 0, 3: 50, 6: 100, 12: 300 },
    features: [
      'Hasta 6 dispositivos',
      'Hasta 8 usuarios',
      'Sincronización en la nube'
    ]
  }
];

export function getStockiaQuote(plan: SubscriptionPlan, months: SubscriptionDuration) {
  const subtotal = plan.monthlyPrice * months;
  const discount = plan.discounts[months];

  return {
    subtotal,
    discount,
    total: subtotal - discount
  };
}
