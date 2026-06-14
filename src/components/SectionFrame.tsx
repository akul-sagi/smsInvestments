import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { SectionId } from '../data/siteContent';

type SectionFrameProps = {
  id: SectionId;
  kicker: string;
  title: string;
  children: ReactNode;
  compact?: boolean;
  hideTitle?: boolean;
  prefersReducedMotion: boolean;
};

export function SectionFrame({
  id,
  kicker,
  title,
  children,
  compact = false,
  hideTitle = false,
  prefersReducedMotion,
}: SectionFrameProps) {
  return (
    <section
      className={`panel content-panel ${compact ? 'compact-panel' : ''}`}
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <motion.div
        className="section-inner"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: prefersReducedMotion, amount: 0.35 }}
        transition={
          prefersReducedMotion ? { duration: 0 } : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <p className="eyebrow">{kicker}</p>
        {!hideTitle ? <h2 id={`${id}-title`}>{title}</h2> : null}
        {children}
      </motion.div>
    </section>
  );
}
