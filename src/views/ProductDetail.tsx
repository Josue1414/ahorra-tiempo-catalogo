import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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

const ImageCarousel = ({ images, label }: { images: string[]; label: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const goToImage = (direction: -1 | 1) => {
    setActiveIndex(current => (current + direction + images.length) % images.length);
    setControlsVisible(true);
  };

  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setTimeout(() => {
      setActiveIndex(current => (current + 1) % images.length);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, images.length]);

  useEffect(() => {
    if (!controlsVisible) return;
    const timer = window.setTimeout(() => setControlsVisible(false), 3500);
    return () => window.clearTimeout(timer);
  }, [activeIndex, controlsVisible]);

  useEffect(() => {
    if (!isExpanded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
      if (images.length > 1 && event.key === 'ArrowLeft') goToImage(-1);
      if (images.length > 1 && event.key === 'ArrowRight') goToImage(1);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [images.length, isExpanded]);

  const controlVisibility = controlsVisible
    ? 'pointer-events-auto opacity-100'
    : 'pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100';

  return (
    <>
      <div
        role="group"
        aria-roledescription="carrusel"
        aria-label={`Imágenes de ${label}`}
        className="group relative aspect-video w-full overflow-hidden rounded-3xl bg-[#f3f5f7] shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
      >
        <img
          src={images[activeIndex]}
          alt={`${label} (${activeIndex + 1} de ${images.length})`}
          className="h-full w-full object-contain"
        />
        <button
          type="button"
          aria-label={`Ampliar imagen de ${label}`}
          onClick={() => {
            setControlsVisible(true);
            setIsExpanded(true);
          }}
          className="absolute inset-0 z-0 cursor-zoom-in"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Imagen anterior"
              onClick={() => goToImage(-1)}
              className={`absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--ink)] shadow-md transition-all hover:bg-white ${controlVisibility}`}
            >
              {ic('arrowL', 20)}
            </button>
            <button
              type="button"
              aria-label="Imagen siguiente"
              onClick={() => goToImage(1)}
              className={`absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--ink)] shadow-md transition-all hover:bg-white ${controlVisibility}`}
            >
              {ic('arrowR', 20)}
            </button>
            <div className={`absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/45 px-3 py-2 transition-opacity ${controlVisibility}`}>
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  aria-label={`Mostrar imagen ${index + 1}`}
                  aria-pressed={activeIndex === index}
                  onClick={() => {
                    setActiveIndex(index);
                    setControlsVisible(true);
                  }}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    activeIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {isExpanded && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada: ${label}`}
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4 sm:p-8"
        >
          <button
            type="button"
            autoFocus
            aria-label="Cerrar imagen ampliada"
            onClick={() => setIsExpanded(false)}
            className="fixed right-5 top-5 z-[10001] flex min-h-12 items-center gap-2 rounded-full px-4 font-semibold shadow-xl transition-transform hover:scale-105"
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #ffffff',
              boxShadow: '0 0 0 3px rgba(0,0,0,0.65), 0 10px 24px rgba(0,0,0,0.55)',
              color: '#172335'
            }}
          >
            {ic('x', 22)}
            <span>Cerrar</span>
          </button>
          <div
            className="group relative flex h-full w-full items-center justify-center"
            onClick={event => event.stopPropagation()}
          >
            <img
              src={images[activeIndex]}
              alt={`${label} (${activeIndex + 1} de ${images.length})`}
              onClick={() => setControlsVisible(true)}
              className="max-h-full max-w-full object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Imagen anterior"
                  onClick={() => goToImage(-1)}
                  className={`absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--ink)] shadow-lg transition-all hover:bg-white sm:left-4 ${controlVisibility}`}
                >
                  {ic('arrowL', 24)}
                </button>
                <button
                  type="button"
                  aria-label="Imagen siguiente"
                  onClick={() => goToImage(1)}
                  className={`absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--ink)] shadow-lg transition-all hover:bg-white sm:right-4 ${controlVisibility}`}
                >
                  {ic('arrowR', 24)}
                </button>
                <div className={`absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-3 py-2 transition-opacity ${controlVisibility}`}>
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      aria-label={`Mostrar imagen ${index + 1}`}
                      aria-pressed={activeIndex === index}
                      onClick={() => {
                        setActiveIndex(index);
                        setControlsVisible(true);
                      }}
                      className={`h-2.5 w-2.5 rounded-full transition-colors ${
                        activeIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

const FeatureImageCarousel = ({ feature }: { feature: Product['detailedFeats'][number] }) => (
  <ImageCarousel
    images={feature.images?.length ? feature.images : [feature.img]}
    label={feature.t}
  />
);

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useAppContext();
  const product = products.find(item => item.id === id);
  useReveal();

  useEffect(() => {
    if (!product) navigate('/');
    else window.scrollTo(0, 0);
  }, [product, navigate]);

  if (!product) return null;

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
              <Button variant="dark" onClick={handleEmpezar}>Empezar ahora</Button>
            </div>
          </div>

          <div className="reveal relative animate-[float_7s_ease-in-out_infinite_alternate]">
            <div className={`absolute -inset-5 z-0 ${theme.glow}`} />
            {product.heroImages?.length ? (
              <ImageCarousel images={product.heroImages} label={`Capturas de ${product.name}`} />
            ) : (
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
            )}
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
                  <FeatureImageCarousel feature={feature} />
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
