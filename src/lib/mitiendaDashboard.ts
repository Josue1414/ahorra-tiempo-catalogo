import { supabase } from './supabase';

export interface MitiendaTeamMember {
  userId: string;
  name: string;
  role: string;
  active: boolean;
  createdAt: string;
}

export interface MitiendaStoreMetrics {
  subscriptionId: string;
  storeId: string | null;
  name: string;
  plan: string;
  months: number;
  paymentMethod: string;
  status: string;
  isFreeTrial: boolean;
  expiresAt: string;
  blocked: boolean;
  maxDevices: number | null;
  team: MitiendaTeamMember[];
  activeTeamCount: number;
  ownerName: string | null;
}

export interface MitiendaPayment {
  suscripcion_id: string;
  concepto: string;
  meses_pagados: number;
  monto_pagado: number;
  metodo: string;
  estado: string;
  created_at: string;
}

export interface MitiendaDashboardResponse {
  accountEmail: string;
  stores: MitiendaStoreMetrics[];
  payments: MitiendaPayment[];
  warning?: string;
}

export async function loadMitiendaDashboard(): Promise<MitiendaDashboardResponse> {
  const { data, error } = await supabase.functions.invoke<MitiendaDashboardResponse>('mitienda-dashboard');
  if (error) throw new Error(error.message || 'No se pudieron cargar las métricas de MiTienda.');
  if (!data || !Array.isArray(data.stores) || !Array.isArray(data.payments)) {
    throw new Error('El servicio de métricas devolvió una respuesta incompleta.');
  }
  return data;
}
