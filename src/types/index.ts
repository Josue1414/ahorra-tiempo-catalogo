// src/types/index.ts
export type IconName = 'box'|'calendar'|'users'|'utensils'|'clock'|'phone'|'bell'|'zap'|'chart'|'shield'|'creditCard'|'smartphone'|'refresh'|'check'|'arrowR'|'arrowL'|'chevD'|'download'|'logout'|'x'|'info';

export interface Product {
  id: 'stockia'|'citalis'|'turnia'|'mesa';
  name: string;
  badge: string;
  color: string;
  rgb: string;
  tag: string;
  heroT: string;
  heroS: string;
  desc: string;
  img: string;
  thumb: string;
  monthly: number;
  bullets: string[];
  // Nuevo formato para características detalladas con imagen
  detailedFeats: { t: string; d: string; img: string }[];
  mock: { side: string[]; main: 'stock'|'cal'|'team'|'kds' };
  enabled: boolean;
}

export interface PlatformSlide {
  id: 'plat';
  name: 'Plataforma';
  sub: string;
  img: string;
  thumb: string;
  heroT: string;
  heroS: string;
  cta: [[string, 'scroll'|'call'], [string, 'scroll'|'call']];
}

export interface Sub {
  pid: Product['id'];
  plan: 'Plan anual'|'Plan mensual';
  renewal: string;
  sid: string;
  ver: string;
  users: string;
  upct: number;
  uptime: string;
  api: string;
  backup: string;
  since: string;
  monthly: number;
}

export interface Invoice { date: string; concept: string; amount: string; status: string; }