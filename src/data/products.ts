// src/data/products.ts
import { Product, PlatformSlide } from '../types';

export const platformSlide: PlatformSlide = {
  id: 'plat', name: 'Plataforma', sub: 'La suite completa',
  img: '/Descanso.jpg',
  thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
  heroT: 'Tu negocio, ordenado.<br/>Tu tiempo, de vuelta.',
  heroS: 'Cuatro productos que trabajan por ti, para que dediques tus horas a lo que de verdad importa.',
  cta: [['Descubrir productos', 'scroll'], ['Agendar llamada', 'call']]
};

export const products: Product[] = [
  {
    id: 'stockia', 
    name: 'MiTienda', 
    badge: 'POS', 
    color: '#0e9f6e', 
    rgb: '14,159,110',
    tag: 'Punto de Venta e Inventario',
    heroT: 'Control total de tu negocio. Aún sin Internet.',
    heroS: 'Un sistema de punto de venta rápido y confiable diseñado para abarrotes, farmacias y comercios locales. Sincroniza múltiples cajas en red local y mantén tu inventario seguro en la nube.',
    desc: 'Deja de perder horas cuadrando cuentas y buscando precios. MiTienda es la herramienta que te ayuda a cobrar en segundos, gestionar fiados, controlar mermas y conectar tu báscula, todo con la tranquilidad de que tus datos siempre están respaldados.',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1900',
    thumb: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400',
    heroImages: [
      '/vistaMiTienda/Vista-Punto-de-venta.png',
      '/vistaMiTienda/Historial.png',
      '/vistaMiTienda/Vista-Corte-caja.png'
    ],
    monthly: 300,
    bullets: [
      'Cobros ultrarrápidos con CoDi y pantalla dual', 
      'Sincronización híbrida: Funciona offline por red local', 
      'Fiados, control de báscula y venta a granel',
      'Alertas de caducidad e inventario bajo'
    ],
    // Para ampliar un carrusel, agrega `images: ['URL de imagen 1', 'URL de imagen 2']` al feature; se muestran en ese orden. Si se omite, se usa `img`.
    detailedFeats: [
      {
        t: 'Cobros ágiles, múltiples métodos y transparencia total',
        d: 'Agiliza tus cobros aceptando efectivo (el sistema calcula tu cambio), pagos con tarjeta o transferencia. Habilita una Pantalla Cliente para mostrar al instante el carrito de compras, el total y un código QR de CoDi o MercadoPago (BYOK) para cobrar sin comisiones. Todo se refleja al instante, dándole seguridad y confianza a tus clientes.',
        img: '/vistaMiTienda/VistaCliente.png',
        images: [
          '/vistaMiTienda/VistaCliente.png',
          '/vistaMiTienda/CobroCodi.png',
          '/vistaMiTienda/VistaClienteCoDi.png',
          '/vistaMiTienda/VistaCobro.png',
          '/vistaMiTienda/Vista-Punto-de-venta.png'
        ]
      },
      {
        t: 'Ventas garantizadas, con o sin internet',
        d: 'Olvídate de las interrupciones. Conecta hasta 5 cajas a tu propio WiFi (Red Local). Una computadora actúa como "Cerebro", manteniendo todas tus cajas sincronizadas al milisegundo incluso si se cae el internet. Cuando la conexión regresa, el Cerebro respalda automáticamente tu historial, cortes de caja y movimientos de stock de forma segura en la nube.',
        img: '/vistaMiTienda/Configuracion2.png',
        images: ['/vistaMiTienda/Configuracion2.png']
      },
      {
        t: 'Control inteligente de inventario y alertas preventivas',
        d: 'Gestionar tu mercancía nunca fue tan fácil. Usa tu celular o escáner para agregar productos en segundos. Genera etiquetas personalizadas, controla las existencias, y recibe notificaciones cuando un producto está por agotarse o a punto de caducar (sistema de lotes). Además, tu catálogo y fotos se almacenan directamente en tus dispositivos para garantizar velocidad pura.',
        img: '/vistaMiTienda/Vista-Inventario.png',
        images: [
          '/vistaMiTienda/Vista-Inventario.png',
          '/vistaMiTienda/AlertaStock.png',
          '/vistaMiTienda/Editar-inventario2.png',
          '/vistaMiTienda/Editar-invenytario.png',
          '/vistaMiTienda/AlertaCaducidad.png'
        ]
      },
      {
        t: 'Venta a granel fluida y control de productos restringidos',
        d: '¿Vendes por kilo o litro? Conecta directamente tu báscula serial/USB o ingresa el peso manualmente; el sistema imprimirá la etiqueta con el precio exacto al instante. Para productos delicados o medicamentos, el sistema puede exigir un PIN de supervisor o una foto de evidencia (como una receta) antes de autorizar la venta.',
        img: '/vistaMiTienda/Agranel.png',
        images: [
          '/vistaMiTienda/Agranel.png',
          '/vistaMiTienda/Configuracion.png'
        ]
      },
      {
        t: 'Manejo de personal y seguridad anti-robos',
        d: 'Da acceso hasta a 4 usuarios por tienda con perfiles claros: Dueño, Supervisor y Trabajador. Controla qué días pueden iniciar turno, evita cancelaciones no autorizadas mediante PIN, y mantén una libreta digital de Fiados privada y local. Tu suscripción te da acceso a actualizaciones continuas y soporte, pagando únicamente por la licencia de software (hardware no incluido).',
        img: '/vistaMiTienda/GestionEquipo.png',
        images: [
          '/vistaMiTienda/Fiados.png',
          '/vistaMiTienda/GestionEquipo.png',
          '/vistaMiTienda/Panel.png',
          '/vistaMiTienda/Panel2.png',
          '/vistaMiTienda/Vista-Corte-caja.png',
          '/vistaMiTienda/Configuracion3.png',
          '/vistaMiTienda/Configuracion4.png'
        ]
      }
    ],
    mock: { side: ['Caja', 'Inventario', 'Pantalla Cliente', 'Reportes', 'Ajustes'], main: 'stock' },
    enabled: true
  },
  {
    id: 'citalis', name: 'Citalis', badge: 'CT', color: '#2f9ec4', rgb: '47,158,196', tag: 'Citas y agendas', heroT: '', heroS: '', desc: '', img: '/Citas.jpg', thumb: '/Citas.jpg', heroImages: ['/Citas.jpg'], monthly: 39, bullets: [], detailedFeats: [], mock: { side: [], main: 'cal' }, enabled: false
  },
  {
    id: 'turnia', name: 'Asistencias', badge: 'RH', color: '#d97b29', rgb: '217,123,41', tag: 'Personal', heroT: '', heroS: '', desc: '', img: '/ControlPersonal.jpg', thumb: '/ControlPersonal.jpg', heroImages: ['/ControlPersonal.jpg'], monthly: 35, bullets: [], detailedFeats: [], mock: { side: [], main: 'team' }, enabled: false
  },
  {
    id: 'mesa', name: 'Mesa', badge: 'RS', color: '#8a5cd6', rgb: '138,92,214', tag: 'Restaurantes', heroT: '', heroS: '', desc: '', img: '/restaurantes.jpg', thumb: '/restaurantes.jpg', heroImages: ['/restaurantes.jpg'], monthly: 59, bullets: [], detailedFeats: [], mock: { side: [], main: 'kds' }, enabled: false
  }
];