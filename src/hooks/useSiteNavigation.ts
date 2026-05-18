import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { SectionId } from '../data/siteContent';
import { sections } from '../data/siteContent';

/**
 * Distance from viewport top to where section content should sit (fixed pill header).
 * Keep in sync with `scroll-padding-top` in `styles.css`.
 */
const HEADER_CLEARANCE_PX = 80;

/**
 * Scroll `Y` where this panel’s top meets the document scrollport top (sticky stack:
 * sum of previous siblings’ `offsetHeight` inside `main`).
 *
 * `jumpTo` scrolls to this value exactly so the previous panel does not peek under the
 * viewport top. Header overlap is handled by panel padding and `scroll-padding-top` on
 * `html` for native anchor navigation, not by shortening programmatic scroll.
 */
function panelScrollStart(el: HTMLElement): number {
  const main = el.closest('main');
  if (!main) {
    let y = 0;
    let node: HTMLElement | null = el;
    while (node) {
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return y;
  }

  let y = 0;
  for (const child of main.children) {
    if (child === el) break;
    if (child instanceof HTMLElement) y += child.offsetHeight;
  }
  return y;
}

function computeActiveSection(): SectionId {
  const scrollY = window.scrollY;
  const trigger = scrollY + HEADER_CLEARANCE_PX;
  let active: SectionId = sections[0].id;

  for (const { id } of sections) {
    const node = document.getElementById(id);
    if (!node) continue;
    const start = panelScrollStart(node);
    if (start <= trigger) active = id;
  }

  return active;
}

export function useSiteNavigation() {
  const [activeSection, setActiveSection] = useState<SectionId>('landing');
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const updateFromScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
      setActiveSection(computeActiveSection());
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        updateFromScroll();
      });
    };

    updateFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const jumpTo = useCallback(
    (id: SectionId) => {
      const el = document.getElementById(id);
      if (!el) return;

      if (id === 'landing') {
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }

      const raw = panelScrollStart(el);
      window.scrollTo({
        top: Math.max(0, raw),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [prefersReducedMotion],
  );

  return { activeSection, scrollProgress, jumpTo, prefersReducedMotion };
}
