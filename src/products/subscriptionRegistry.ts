import type { ComponentType } from 'react';
import type { Product } from '../types';
import StockiaSubscriptionSection from './stockia/components/suscripcion/SeccionSuscripcion';
import type { PaymentMethod } from './stockia/components/suscripcion/FormularioSuscripcion';

export interface ProductSubscriptionProps {
  alContinuar: (metodo: PaymentMethod) => void;
}

export const subscriptionSections: Partial<Record<Product['id'], ComponentType<ProductSubscriptionProps>>> = {
  stockia: StockiaSubscriptionSection
};
