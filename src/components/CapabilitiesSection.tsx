import { useState } from 'react';
import { motion } from 'framer-motion';
import { capabilityCards } from '../data/siteContent';
import { SectionFrame } from './SectionFrame';

type CapabilitiesSectionProps = {
  prefersReducedMotion: boolean;
};

export function CapabilitiesSection({ prefersReducedMotion }: CapabilitiesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = capabilityCards[activeIndex];
  const springTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 210, damping: 26 };

  return (
    <SectionFrame
      id="capabilities"
      kicker="Capabilities"
      title="Five strengths, one disciplined operating model"
      compact
      prefersReducedMotion={prefersReducedMotion}
    >
      <div className="capability-carousel" aria-live="polite">
        <div className="carousel-stage">
          {capabilityCards.map((card, index) => {
            const Icon = card.icon;
            const offset = index - activeIndex;
            const distance = Math.abs(offset);
            return (
              <motion.button
                type="button"
                key={card.title}
                className={`carousel-card ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
                aria-label={`Show ${card.title}`}
                animate={{
                  x: offset * 280,
                  scale: index === activeIndex ? 1 : 0.82,
                  opacity: distance > 2 ? 0 : index === activeIndex ? 1 : 0.52,
                  zIndex: 10 - distance,
                }}
                transition={springTransition}
              >
                <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                <Icon size={28} aria-hidden="true" />
                <h3>{card.title}</h3>
                {index === activeIndex && <p>{card.text}</p>}
              </motion.button>
            );
          })}
        </div>
        <div className="carousel-controls" aria-label="Capability selector">
          {capabilityCards.map((card, index) => (
            <button
              key={card.title}
              type="button"
              className={index === activeIndex ? 'active' : ''}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to ${card.title}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
        <p className="carousel-caption">{activeCard.title}</p>
      </div>
    </SectionFrame>
  );
}
