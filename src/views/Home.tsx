import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products, platformSlide } from '../data/products';
import { useAppContext } from '../context/AppContext';
import { Brand, Badge, Button } from '../components/UI';
import { SessionButton } from '../components/SessionButton';
import { ic } from '../utils/icons';
import { useReveal } from '../hooks/useReveal';
import { Modal } from '../components/Modal';
import type { Product } from '../types';

const slideProgressColors: Record<Product['id'], string> = {
  stockia: 'bg-[#0e9f6e]',
  citalis: 'bg-[#2f9ec4]',
  turnia: 'bg-[#d97b29]',
  mesa: 'bg-[#8a5cd6]'
};

const productTextColors: Record<Product['id'], string> = {
  stockia: 'text-[#0e9f6e]',
  citalis: 'text-[#2f9ec4]',
  turnia: 'text-[#d97b29]',
  mesa: 'text-[#8a5cd6]'
};

const revealDelays = ['delay-0', 'delay-75', 'delay-150', 'delay-[225ms]'];

export const Home = () => {
  useReveal();
  const navigate = useNavigate();
  const { addToast } = useAppContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  const slides = [platformSlide, ...products];

  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % slides.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [isHovering, slides.length]);

  const handleCardClick = (idx: number) => {
    const slide = slides[idx];
    if (slide.id === 'plat') {
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
    } else if (slide.enabled) {
      navigate(`/producto/${slide.id}`);
    } else {
      addToast('Disponible próximamente', 'warn');
    }
  };

  return (
    <div>
      <section
        className="relative flex min-h-[min(900px,100svh)] flex-col overflow-hidden md:min-h-[760px]"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${activeIndex === i ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 z-10 bg-[linear-gradient(160deg,var(--hero),var(--hero-d))] mix-blend-multiply" />
            {slide.img ? (
              <img
                src={slide.img}
                alt=""
                className={`h-full w-full object-cover transition-transform duration-[7500ms] ease-out ${activeIndex === i ? 'scale-100' : 'scale-[1.07]'}`}
              />
            ) : (
              <div
                aria-hidden="true"
                className="h-full w-full"
                style={{ background: `linear-gradient(135deg, ${'color' in slide ? slide.color : '#3d9be3'}, #172335)` }}
              />
            )}
            <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,rgba(21,52,84,0.9),rgba(21,52,84,0.3))]" />
          </div>
        ))}

        <div className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-12 lg:px-20">
          <Brand cream />
          <SessionButton />
        </div>

        <div className="relative z-10 flex flex-1 items-center px-6 py-10 sm:px-12 lg:px-20">
          <div className="max-w-3xl rounded-3xl border border-white/10 bg-[#102b46]/45 p-5 shadow-2xl backdrop-blur-[2px] sm:p-8">
            {slides[activeIndex].heroT ? (
              <h1
                className="mb-5 max-w-3xl text-[clamp(2rem,3.6vw,3.75rem)] text-[var(--cream)]"
                dangerouslySetInnerHTML={{ __html: slides[activeIndex].heroT }}
              />
            ) : (
              <h1 className="mb-5 max-w-3xl text-[clamp(2rem,3.6vw,3.75rem)] text-[var(--cream)]">
                Próximamente: {slides[activeIndex].name}
              </h1>
            )}
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-white sm:mb-10 sm:text-lg lg:text-xl">
              {slides[activeIndex].heroS || `Estamos preparando ${slides[activeIndex].name}. Conoce los productos disponibles de la suite.`}
            </p>
            <div className="flex flex-wrap gap-4">
              {slides[activeIndex].id === 'plat' ? (
                <>
                  <Button
                    variant="cream"
                    onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Descubrir productos
                  </Button>
                  <Button variant="ghost-dark" onClick={() => setShowCallModal(true)}>
                    Agendar llamada
                  </Button>
                </>
              ) : (
                slides[activeIndex].enabled ? (
                  <Button variant="cream" onClick={() => handleCardClick(activeIndex)}>
                    Ver producto →
                  </Button>
                ) : (
                  <Button
                    variant="cream"
                    onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Conocer productos
                  </Button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 px-6 py-6 sm:gap-4 sm:px-12 lg:px-20 md:grid-cols-5">
          {slides.map((slide, i) => {
            const isActive = activeIndex === i;
            const subtitle = slide.id === 'plat' ? slide.sub : slide.tag;
            const progressColor = slide.id === 'plat' ? 'bg-[var(--accent)]' : slideProgressColors[slide.id];
            return (
              <button
                type="button"
                key={slide.id}
                onClick={() => handleCardClick(i)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`cursor-pointer overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                  isActive
                    ? 'border-transparent bg-[var(--cream)] text-[var(--ink)]'
                    : 'border-white/10 bg-[rgba(14,38,62,0.46)] text-[var(--cream)] backdrop-blur-[10px]'
                }`}
              >
                <div className="h-14 overflow-hidden sm:h-[68px]">
                  {slide.thumb ? (
                    <img
                      src={slide.thumb}
                      alt=""
                      className={`h-full w-full object-cover ${isActive ? '' : 'grayscale opacity-60'}`}
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="h-full w-full"
                      style={{ background: `linear-gradient(135deg, ${'color' in slide ? slide.color : '#3d9be3'}, #172335)` }}
                    />
                  )}
                </div>
                <div className="px-4 py-3 sm:px-5 sm:py-4">
                  <div className="truncate font-[var(--font-heading)] text-sm font-semibold sm:text-base">
                    {slide.name}
                  </div>
                  <div className={`truncate text-xs sm:text-[13px] ${isActive ? 'opacity-70' : 'opacity-70'}`}>
                    {subtitle}
                  </div>
                </div>
                <div className="h-[3px] w-full bg-black/10">
                  <div
                    className={`h-full ${
                      progressColor
                    } ${isActive && !isHovering ? 'w-full transition-[width] duration-[5200ms] ease-linear' : 'w-0 transition-none'}`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section id="productos" className="container py-20 sm:py-24">
        <div className="reveal mb-12 text-center sm:mb-16">
          <span className="text-[13px] font-bold tracking-[1.5px] text-[var(--accent)]">PRODUCTOS</span>
          <h2 className="my-4 text-[clamp(2rem,4vw,3.25rem)]">Una suite. Cuatro formas de ganar tiempo.</h2>
          <p className="mx-auto max-w-[600px] text-lg text-[var(--mut)] sm:text-xl">
            Cada herramienta está diseñada para resolver un problema específico de tu negocio. Úsalas por separado o combínalas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`reveal overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/60 ${product.enabled ? 'cursor-pointer' : 'cursor-default'} ${revealDelays[i]}`}
              onClick={() => product.enabled ? navigate(`/producto/${product.id}`) : addToast('Disponible próximamente', 'warn')}
              role="link"
              tabIndex={0}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  product.enabled ? navigate(`/producto/${product.id}`) : addToast('Disponible próximamente', 'warn');
                }
              }}
            >
              <div className="h-44 overflow-hidden">
                {product.thumb ? (
                  <img
                    src={product.thumb}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div
                    aria-label={`${product.name}, próximamente`}
                    className="flex h-full flex-col items-center justify-center gap-3 text-white"
                    style={{ background: `linear-gradient(135deg, ${product.color}, #172335)` }}
                  >
                    <Badge text={product.badge} color="rgba(255,255,255,0.2)" />
                    <span className="text-sm font-medium tracking-wide">Próximamente</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <Badge text={product.badge} color={product.color} />
                <h3 className="mt-4 text-3xl">{product.name}</h3>
                <p className="mb-4 text-sm text-[var(--mut)]">{product.tag}</p>
                <ul className="mb-6 flex flex-col gap-2">
                  {product.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-center gap-2 text-sm text-[var(--ink)]">
                      <span className={productTextColors[product.id]}>{ic('check', 16)}</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-[var(--line)] pt-4">
                  <span className={`text-sm font-semibold ${productTextColors[product.id]}`}>
                    {product.enabled ? 'Ver producto →' : 'Próximamente'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal isOpen={showCallModal} onClose={() => setShowCallModal(false)} title="Agenda una llamada">
        <form
          onSubmit={event => {
            event.preventDefault();
            addToast('Te contactaremos en menos de 24 horas', 'success');
            setShowCallModal(false);
          }}
          className="flex flex-col gap-4"
        >
          <input
            required
            type="text"
            placeholder="Nombre completo"
            className="rounded-lg border-0 bg-white/10 p-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            required
            type="email"
            placeholder="Email de trabajo"
            className="rounded-lg border-0 bg-white/10 p-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <Button variant="blue" type="submit" className="mt-2 justify-center">Solicitar llamada</Button>
        </form>
      </Modal>
    </div>
  );
};
