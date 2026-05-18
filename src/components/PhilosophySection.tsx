import { CSSProperties, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { philosophyPillars } from '../data/siteContent';

type PhilosophySectionProps = {
  prefersReducedMotion: boolean;
};

export function PhilosophySection({ prefersReducedMotion }: PhilosophySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="panel content-panel"
      id="philosophy"
      aria-labelledby="philosophy-title"
    >
      <div className="hero-image" aria-hidden="true">
        <motion.div
          className="hero-image-backdrop philosophy-image-backdrop"
        />
        <div className="hero-image-glow" />
      </div>

      <motion.div
        className="section-inner"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: prefersReducedMotion, amount: 0.35 }}
        transition={
          prefersReducedMotion ? { duration: 0 } : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <p className="eyebrow">Our Philosophy</p>
        <h2 id="philosophy-title">Capital guided by standards that outlast cycles</h2>

        <div className="philosophy-grid">
          {philosophyPillars.map((pillar, index) => (
            <motion.article
              className="pillar"
              key={pillar}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={
                prefersReducedMotion ? { duration: 0 } : { delay: index * 0.06 }
              }
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{pillar}</h3>
            </motion.article>
          ))}
        </div>

        <p className="philosophy-copy">
          SMS takes pride in delivering guidance, experience, and expertise through mentorship and
          internship pathways, while keeping investment decisions anchored to clear process and
          relationship-led trust.
        </p>
      </motion.div>
    </section>
  );
}