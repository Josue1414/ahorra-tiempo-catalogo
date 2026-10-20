import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useAppContext } from '../context/AppContext';
import { Badge, Button } from '../components/UI';
import { ic } from '../utils/icons';
import { useReveal } from '../hooks/useReveal';
import { subscriptionSections } from '../products/subscriptionRegistry';
import type { Product } from '../types';

const productTheme: Record<Product['id'], { text: string; glow: string; panel: string }> = {
  stockia: {
    text: 'text-[#0e9f6e]',
    glow: 'bg-[radial-gradient(circle,rgba(14,159,110,0.2)_0%,transparent_70%)]',
    panel: 'bg-[#0e9f6e]/[0.03]'
  },
  citalis: {
    text: 'text-[#2f9ec4]',
    glow: 'bg-[radial-gradient(circle,rgba(47,158,196,0.2)_0%,transparent_70%)]',
    panel: 'bg-[#2f9ec4]/[0.03]'
  },
  turnia: {
    text: 'text-[#d97b29]',
    glow: 'bg-[radial-gradient(circle,rgba(217,123,41,0.2)_0%,transparent_70%)]',
    panel: 'bg-[#d97b29]/[0.03]'
  },
  mesa: {
    text: 'text-[#8a5cd6]',
    glow: 'bg-[radial-gradient(circle,rgba(138,92,214,0.2)_0%,transparent_70%)]',
    panel: 'bg-[#8a5cd6]/[0.03]'
  }
};

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedIn, subs, addToast } = useAppContext();
  const product = products.find(item => item.id === id);
  useReveal();

  useEffect(() => {
    if (!product) navigate('/');
    else window.scrollTo(0, 0);
  }, [product, navigate]);

  if (!product) return null;

  const isSubbed = loggedIn && subs.some(subscription => subscription.pid === product.id);
  const nextIdx = (products.findIndex(item => item.id === product.id) + 1) % products.length;
  const nextProduct = products[nextIdx];
  const theme = productTheme[product.id];
  const SubscriptionSection = subscriptionSections[product.id];

  const handleEmpezar = () => {
    document.getElementById('seccion-suscripcion')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleIntentoDeSuscripcion = (metodo: 'domiciliado' | 'oxxo' | 'tarjeta') => {
    const metodoTexto = metodo === 'domiciliado'
      ? 'pago domiciliado'
      : metodo === 'oxxo' ? 'pago único en OXXO' : 'pago con tarjeta';
    addToast(`Datos validados. La integración de ${metodoTexto} todavía no está disponible; no se creó una suscripción.`, 'warn');
  };

  return (
    <div>
      <div className="container pb-20 pt-16 sm:pt-20">
        <Link
          to="/"
          className="mb-12 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/55 px-4 py-2 text-[var(--mut)] transition-colors hover:text-[var(--ink)]"
        >
          {ic('arrowL', 16)} Todos los productos
        </Link>

        <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="reveal">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge text={product.badge} color={product.color} />
              <span className="text-lg font-semibold">{product.name}</span>
              <span className="text-[var(--mut)]">·</span>
              <span className="text-[var(--mut)]">{product.tag}</span>
            </div>
            <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl">{product.heroT}</h1>
            <p className="mb-10 text-lg text-[var(--mut)] sm:text-xl">{product.heroS}</p>
            <div className="flex flex-wrap gap-4">
              {isSubbed && product.id !== 'stockia' ? (
                <Button variant="dark" to="/cuenta">Gestionar suscripción</Button>
              ) : (
                <>
                  <Button variant="dark" onClick={handleEmpezar}>
                    {isSubbed ? 'Contratar otra tienda' : 'Empezar ahora'}
                  </Button>
                  {isSubbed && <Button variant="glass" to="/cuenta">Gestionar suscripciones</Button>}
                </>
              )}
            </div>
          </div>

          <div className="reveal relative animate-[float_7s_ease-in-out_infinite_alternate]">
            <div className={`absolute -inset-5 z-0 ${theme.glow}`} />
            <div className="relative z-10 h-[320px] overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_25px_50px_rgba(0,0,0,0.1)] sm:h-[400px]">
              <div className="flex gap-2 border-b border-[var(--line)] bg-[#f8f9fa] px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex h-[calc(100%-41px)]">
                <div className="flex w-[120px] shrink-0 flex-col gap-3 border-r border-[var(--line)] p-3 sm:p-4">
                  {product.mock.side.map((item, i) => (
                    <div
                      key={i}
                      className={`truncate text-xs sm:text-[13px] ${i === 1 ? `${theme.text} font-semibold` : 'text-[var(--mut)]'}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className={`min-w-0 flex-1 p-4 sm:p-6 ${theme.panel}`}>
                  <div className="mb-6 h-6 w-2/5 rounded bg-black/5" />
                  <div className="mb-6 flex gap-4">
                    <div className="h-20 min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-white" />
                    <div className="h-20 min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-white" />
                  </div>
                  <div className="h-[140px] rounded-lg border border-[var(--line)] bg-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-28 sm:mt-36">
          <h2 className="mb-14 text-center text-4xl sm:mb-16 sm:text-5xl">Todo lo que incluye</h2>

          <div className="flex flex-col gap-16 sm:gap-20">
            {product.detailedFeats.map((feature, i) => (
              <div
                key={i}
                className={`reveal flex flex-col items-center gap-8 rounded-3xl border border-white/35 bg-white/20 p-5 text-center shadow-sm backdrop-blur-sm sm:p-8 md:gap-12 md:text-left ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="w-full min-w-0 flex-1">
                  <h3 className="mb-4 text-2xl text-[var(--ink)] sm:text-3xl">{feature.t}</h3>
                  <p className="text-base leading-relaxed text-[var(--mut)] sm:text-lg">{feature.d}</p>
                </div>
                <div className="w-full min-w-0 flex-1">
                  <img
                    src={feature.img}
                    alt={feature.t}
                    className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {SubscriptionSection ? (
          <SubscriptionSection alContinuar={handleIntentoDeSuscripcion} />
        ) : (
          <section id="seccion-suscripcion" className="mt-24 text-center sm:mt-[120px]">
            <h2 className="mb-4 text-4xl">Suscripción próximamente</h2>
            <p className="text-[var(--mut)]">Este producto todavía no tiene su flujo de contratación configurado.</p>
          </section>
        )}

        <section className="mt-24 sm:mt-[120px]">
          <button
            type="button"
            onClick={() => {
              if (nextProduct.enabled) navigate(`/producto/${nextProduct.id}`);
              else addToast('Próximamente', 'warn');
            }}
            className="flex w-full cursor-pointer items-center justify-between rounded-3xl border border-white/20 bg-white/70 p-6 text-left shadow-lg backdrop-blur-md transition-all hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60 sm:p-10"
          >
            <span>
              <span className="mb-2 block text-sm text-[var(--mut)]">Siguiente producto</span>
              <span className={`block text-2xl font-bold ${productTheme[nextProduct.id].text}`}>
                {nextProduct.name}
              </span>
            </span>
            <span className={productTheme[nextProduct.id].text}>{ic('arrowR', 32)}</span>
          </button>
        </section>
      </div>
    </div>
  );
};
