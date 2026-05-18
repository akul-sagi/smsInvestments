import { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Mail } from 'lucide-react';
import type { SectionId } from '../data/siteContent';

type HeroSectionProps = {
  scrollProgress: number;
  onJump: (id: SectionId) => void;
  prefersReducedMotion: boolean;
};

export function HeroSection({ scrollProgress, onJump, prefersReducedMotion }: HeroSectionProps) {
  const parallaxShift = prefersReducedMotion ? 0 : Math.min(scrollProgress * 420, 140);

  return (
    <section className="panel hero-panel" id="landing" aria-labelledby="landing-title">
      <div
        className="hero-image"
        aria-hidden="true"
        style={
          {
            '--parallax-shift': `${parallaxShift}px`,
          } as CSSProperties
        }
      >
        <div className="hero-image-backdrop" />
        <div className="hero-image-glow" />
      </div>
      <motion.div
        className="hero-content"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
        animate={prefersReducedMotion ? false : { opacity: 1, y: 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">London capital markets office</p>
        <h1 id="landing-title">SMS Investments</h1>
        <p className="hero-copy">
          A single family office deploying proprietary capital through disciplined momentum strategies, rigorous risk
          management, and global market insight.
        </p>
        <div className="hero-actions">
          <button type="button" className="primary-action" onClick={() => onJump('contact')}>
            <Mail size={18} aria-hidden="true" />
            Contact the office
          </button>
          <button
            type="button"
            className="icon-action"
            onClick={() => onJump('about')}
            aria-label="Scroll to About Us"
          >
            <ArrowDown size={20} aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
