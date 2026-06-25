import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { capabilityCards } from '../data/siteContent';

type CapabilitiesSectionProps = {
  prefersReducedMotion: boolean;
};

function getCircularOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;
  const half = total / 2;

  if (offset > half) offset -= total;
  if (offset < -half) offset += total;

  return offset;
}

export function CapabilitiesSection({ prefersReducedMotion }: CapabilitiesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const activeCard = capabilityCards[activeIndex];
  const cardTransition = prefersReducedMotion
    ? { duration: 0 }
    : isMobileView
      ? { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const }
    : { type: 'spring' as const, stiffness: 210, damping: 26 };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const updateMobileView = () => setIsMobileView(mediaQuery.matches);

    updateMobileView();
    mediaQuery.addEventListener('change', updateMobileView);

    return () => mediaQuery.removeEventListener('change', updateMobileView);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % capabilityCards.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  const showCard = (index: number) => {
    setActiveIndex(index);
  };

  const cardCount = capabilityCards.length;
  const prevIndex = (activeIndex - 1 + cardCount) % cardCount;
  const nextIndex = (activeIndex + 1) % cardCount;
  const prevCard = capabilityCards[prevIndex];
  const nextCard = capabilityCards[nextIndex];

  const goPrev = () => showCard(prevIndex);
  const goNext = () => showCard(nextIndex);

  return (
    <section className="panel content-panel compact-panel" id="capabilities" aria-labelledby="capabilities-title">
      <motion.div
        className="section-inner capabilities-intro"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: prefersReducedMotion, amount: 0.35 }}
        transition={
          prefersReducedMotion ? { duration: 0 } : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <h2 id="capabilities-title">Capabilities</h2>
        <p className="capabilities-subtitle">Five pillars supporting a single disciplined investment philosophy.</p>
      </motion.div>

      <div
        className="capability-carousel"
        aria-live="polite"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          const nextTarget = event.relatedTarget instanceof Node ? event.relatedTarget : null;
          if (!nextTarget || !event.currentTarget.contains(nextTarget)) setIsPaused(false);
        }}
      >
        <div className="carousel-stage">
          <button
            type="button"
            className="carousel-nav carousel-nav--prev"
            onClick={goPrev}
            aria-label={`Previous: ${prevCard.title}`}
          >
            <ChevronLeft size={28} strokeWidth={1.75} aria-hidden="true" />
          </button>

          <div className="carousel-stack-wrap">
            <div className="carousel-stack">
              {capabilityCards.map((card, index) => {
                const offset = getCircularOffset(index, activeIndex, cardCount);
                const distance = Math.abs(offset);
                const isActive = offset === 0;
                const isVisible = isMobileView ? isActive : distance <= 1;

                return (
                  <motion.button
                    type="button"
                    key={card.title}
                    className={`carousel-card ${isActive ? 'active' : 'inactive'}`}
                    onClick={() => showCard(index)}
                    aria-pressed={isActive}
                    aria-label={isActive ? card.title : `Show ${card.title}`}
                    aria-hidden={!isVisible}
                    tabIndex={isVisible ? 0 : -1}
                    style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
                    animate={{
                      x: isMobileView ? '-50%' : `calc(-50% + ${offset * 92}px)`,
                      y: isMobileView ? 0 : isActive ? 0 : 12,
                      scale: isMobileView ? 1 : isActive ? 1 : 0.93,
                      minHeight: isMobileView ? 224 : isActive ? 252 : 212,
                      opacity: isVisible ? (isActive ? 1 : 0.88) : 0,
                      zIndex: isActive ? 12 : offset === -1 ? 10 : 11,
                    }}
                    transition={cardTransition}
                  >
                    {isActive ? (
                      <div className="carousel-card-body">
                        <p>{card.text}</p>
                      </div>
                    ) : null}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="carousel-nav carousel-nav--next"
            onClick={goNext}
            aria-label={`Next: ${nextCard.title}`}
          >
            <ChevronRight size={28} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <p className="carousel-caption">{activeCard.title}</p>
        <div className="carousel-controls" aria-label="Capability selector">
          {capabilityCards.map((card, index) => (
            <button
              key={card.title}
              type="button"
              className={index === activeIndex ? 'active' : ''}
              onClick={() => showCard(index)}
              aria-label={`Go to ${card.title}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
