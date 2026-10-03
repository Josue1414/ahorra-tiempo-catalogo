// src/data/products.ts
import { Product, PlatformSlide } from '../types';

export const platformSlide: PlatformSlide = {
  id: 'plat', name: 'Plataforma', sub: 'La suite completa',
  img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1900',
  thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
  heroT: 'Tu negocio, ordenado.<br/>Tu tiempo, de vuelta.',
  heroS: 'Cuatro productos que trabajan por ti, para que dediques tus horas a lo que de verdad importa.',
  cta: [['Descubrir productos', 'scroll'], ['Agendar llamada', 'call']]
};

export const products: Product[] = [
  {
    id: 'stockia', name: 'Ahorra Tiempo', badge: 'AT', color: '#0e9f6e', rgb: '14,159,110',
    tag: 'Punto de venta e inventario',
    heroT: 'Tu negocio, ordenado. Tu tiempo, de vuelta.',
    heroS: 'Cuatro productos que trabajan por ti, para que dediques tus horas a lo que de verdad importa.',
    desc: 'Únete hoy y descubre cómo un negocio ordenado te regala las horas que pierdes en tareas repetitivas. Cuatro herramientas. Un solo objetivo: que tu tiempo vuelva a ser tuyo.',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1900',
    thumb: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400',
    monthly: 300,
    bullets: ['Cobra en segundos', 'Inventario siempre bajo control', 'Historial y reportes claros'],
    detailedFeats: [
      {
        t: 'Cobra rápido, con métodos flexibles y pantalla para el cliente',
        d: 'En caja selecciona tu método de cobro: efectivo (el sistema recomienda cuánto dar de cambio), tarjeta o transferencia. El pago con tarjeta no está ligado directamente a la app; el cajero solo confirma cuando ya se realizó por fuera. Habilita una segunda vista para que el cliente vea lo que se está cobrando, el monto a pagar y, desde la configuración, muestra tus datos bancarios para transferencias.',
        img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800'
      },
      {
        t: 'Inventario inteligente con fotos y modo celular',
        d: 'La app tiene un modo acoplado a celulares muy práctico: usa la cámara del celular para escanear códigos de barras de los empaques, o genera nuevos, y agrega productos al instante. Recibe alertas de bajo stock y stock en ceros. Las imágenes de los productos se toman de una carpeta local elegida por ti (cada dispositivo debe tener esa misma carpeta para mostrar las imágenes). Tu inventario se guarda localmente y en la nube, sincronizado en tiempo real por internet, sirviendo como respaldo si pierdes tus datos locales.',
        img: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&q=80&w=800'
      },
      {
        t: 'Ventas garantizadas con Red Local e Historial permanente',
        d: 'Conecta varias cajas a la misma red WiFi (Red Local). Una PC elegida por ti será el "Cerebro"; así, aunque no haya internet, las cajas siguen conectadas sin desactualizarse. El historial de ventas se almacena de manera local y en internet, mostrando en línea solo las últimas 15 horas del día, para después pasar a almacenarse permanentemente en la computadora principal. Puedes exportar todo el historial viejo a Excel por las fechas que elijas.',
        img: 'https://images.unsplash.com/photo-1581351114515-5645511af41b?auto=format&fit=crop&q=80&w=800'
      },
      {
        t: 'Pesaje directo y control riguroso de productos especiales',
        d: 'Agrega productos por peso (Kg o Lt) y usa tu báscula conectada para agilizar la venta. Además, ten un control más riguroso en la venta de productos bajo autorización o receta (como medicamentos): el sistema bloqueará la venta en caja hasta que el cajero confirme la autorización o capture una foto de evidencia obligatoria.',
        img: 'https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?auto=format&fit=crop&q=80&w=800'
      },
      {
        t: 'Control de tu equipo (Software multi-dispositivo)',
        d: 'Conecta hasta 5 dispositivos por tienda (PC, celular o tablet por internet) y administra 4 usuarios por tienda (entre Dueño, supervisores y trabajadores). El servicio se entrega al Dueño para que pueda ajustarlo a su comodidad, incluyendo el manejo de horarios y turnos de los trabajadores. Aclaración importante: solo se proporciona el servicio del programa (instalado en PC Windows como .exe o por la web); no se entregan aparatos físicos como escáneres, básculas ni impresoras de etiquetas o tickets.',
        img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
      }
    ],
    mock: { side: ['Inicio', 'Ventas', 'Inventario', 'Reportes', 'Ajustes'], main: 'stock' },
    enabled: true
  },
  {
    id: 'citalis', name: 'Citalis', badge: 'CT', color: '#2f9ec4', rgb: '47,158,196', tag: 'Citas y agendas', heroT: '', heroS: '', desc: '', img: '', thumb: '', monthly: 39, bullets: [], detailedFeats: [], mock: { side: [], main: 'cal' }, enabled: false
  },
  {
    id: 'turnia', name: 'Turnia', badge: 'RH', color: '#d97b29', rgb: '217,123,41', tag: 'Personal', heroT: '', heroS: '', desc: '', img: '', thumb: '', monthly: 35, bullets: [], detailedFeats: [], mock: { side: [], main: 'team' }, enabled: false
  },
  {
    id: 'mesa', name: 'Mesa', badge: 'RS', color: '#8a5cd6', rgb: '138,92,214', tag: 'Restaurantes', heroT: '', heroS: '', desc: '', img: '', thumb: '', monthly: 59, bullets: [], detailedFeats: [], mock: { side: [], main: 'kds' }, enabled: false
  }
];