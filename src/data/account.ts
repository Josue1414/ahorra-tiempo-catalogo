// src/data/account.ts
import { Sub, Invoice } from '../types';

export const userMock = {
  initials: 'MI',
  name: 'Marta Iglesias',
  email: 'marta@tiendasballester.com',
  plan: 'Suite · Anual'
};

export const subsMock: Sub[] = [
  { pid: 'stockia', plan: 'Plan anual', renewal: '12 jun 2026', sid: 'SUB-ST-2481', ver: '4.2.1', users: '12/25', upct: 48, uptime: '99.98 %', api: '48.2 k', backup: 'hace 2 h', since: '2023', monthly: 24 },
  { pid: 'turnia', plan: 'Plan anual', renewal: '3 mar 2026', sid: 'SUB-RH-1047', ver: '3.9.0', users: '28/40', upct: 70, uptime: '99.99 %', api: '21.7 k', backup: 'hace 40 min', since: '2022', monthly: 29 },
  { pid: 'mesa', plan: 'Plan mensual', renewal: '30 nov 2025', sid: 'SUB-RS-5533', ver: '5.0.3', users: '9/15', upct: 60, uptime: '99.95 %', api: '132 k', backup: 'hace 18 min', since: '2024', monthly: 59 }
];

export const invoicesMock: Invoice[] = [
  { date: '01 nov 2025', concept: 'Suite', amount: '$112.00', status: 'Pagada' },
  { date: '01 oct 2025', concept: 'Suite', amount: '$112.00', status: 'Pagada' },
  { date: '12 sep 2025', concept: 'Mesa — ampliación de dispositivos', amount: '$18.00', status: 'Pagada' },
  { date: '01 sep 2025', concept: 'Suite', amount: '$112.00', status: 'Pagada' }
];