import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { SectionId } from '../data/siteContent';
import { sections } from '../data/siteContent';

/**
 * Distance from viewport top to where section content should sit (fixed pill header).
 * Keep in sync with `scroll-padding-top` in `styles.css`.
 */
const HEADER_CLEARANCE_PX = 80;

const SNAP_IDLE_MS = 140;
const WHEEL_GESTURE_IDLE_MS = 140;
const WHEEL_DELTA_THRESHOLD = 10;

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

function getPanelSnapPoints(): number[] {
  const main = document.querySelector('main');
  if (!main) return [0];

  return Array.from(main.children)
    .filter((child): child is HTMLElement => child instanceof HTMLElement && Boolean(child.id))
    .map((el) => panelScrollStart(el));
}

function directionalSnapPoint(scrollY: number, points: number[], direction: 'up' | 'down'): number {
  if (!points.length) return 0;

  for (const point of points) {
    if (Math.abs(scrollY - point) <= 1) return point;
  }

  for (let i = 0; i < points.length - 1; i++) {
    if (scrollY > points[i] && scrollY < points[i + 1]) {
      return direction === 'down' ? points[i + 1] : points[i];
    }
  }

  if (scrollY < points[0]) return points[0];
  return points[points.length - 1];
}

function adjacentSnapPoint(scrollY: number, points: number[], direction: 'up' | 'down'): number {
  if (!points.length) return 0;

  const nearestIndex = points.reduce((nearest, point, i) => {
    return Math.abs(point - scrollY) < Math.abs(points[nearest] - scrollY) ? i : nearest;
  }, 0);

  if (direction === 'down') {
    return points[Math.min(nearestIndex + 1, points.length - 1)];
  }

  return points[Math.max(nearestIndex - 1, 0)];
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
  const snapIdleTimerRef = useRef<number>(0);
  const isSnappingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const wheelGestureIdleTimerRef = useRef<number>(0);
  const isWheelGestureActiveRef = useRef(false);
  const hasConsumedWheelGestureRef = useRef(false);
  const wheelDeltaAccumulatorRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const scrollDeltaRef = useRef(0);

  const snapToDirectionalPanel = useCallback(() => {
    if (isSnappingRef.current || isProgrammaticScrollRef.current) return;

    const points = getPanelSnapPoints();
    const currentY = window.scrollY;
    const direction = scrollDeltaRef.current >= 0 ? 'down' : 'up';
    scrollDeltaRef.current = 0;

    const targetY = directionalSnapPoint(currentY, points, direction);

    if (Math.abs(currentY - targetY) <= 1) return;

    isSnappingRef.current = true;
    window.scrollTo({
      top: targetY,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    window.setTimeout(
      () => {
        isSnappingRef.current = false;
      },
      prefersReducedMotion ? 0 : 420,
    );
  }, [prefersReducedMotion]);

  useEffect(() => {
    const releaseWheelGesture = () => {
      isWheelGestureActiveRef.current = false;
      hasConsumedWheelGestureRef.current = false;
      wheelDeltaAccumulatorRef.current = 0;
    };

    const scheduleWheelGestureRelease = () => {
      window.clearTimeout(wheelGestureIdleTimerRef.current);
      wheelGestureIdleTimerRef.current = window.setTimeout(
        releaseWheelGesture,
        WHEEL_GESTURE_IDLE_MS,
      );
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
        return;
      }

      event.preventDefault();

      if (!isWheelGestureActiveRef.current) {
        isWheelGestureActiveRef.current = true;
        hasConsumedWheelGestureRef.current = false;
        wheelDeltaAccumulatorRef.current = 0;
      }

      scheduleWheelGestureRelease();
      wheelDeltaAccumulatorRef.current += event.deltaY;

      if (hasConsumedWheelGestureRef.current || isProgrammaticScrollRef.current) return;

      if (Math.abs(wheelDeltaAccumulatorRef.current) < WHEEL_DELTA_THRESHOLD) return;

      const points = getPanelSnapPoints();
      const direction = wheelDeltaAccumulatorRef.current > 0 ? 'down' : 'up';
      const currentY = window.scrollY;
      const targetY = adjacentSnapPoint(currentY, points, direction);
      wheelDeltaAccumulatorRef.current = 0;

      if (Math.abs(currentY - targetY) <= 1) return;

      window.clearTimeout(snapIdleTimerRef.current);
      scrollDeltaRef.current = 0;
      isSnappingRef.current = true;
      hasConsumedWheelGestureRef.current = true;

      window.scrollTo({
        top: targetY,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });

      window.setTimeout(
        () => {
          isSnappingRef.current = false;
        },
        prefersReducedMotion ? 0 : 420,
      );
    };

    const updateFromScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
      setActiveSection(computeActiveSection());
    };

    const onScroll = () => {
      const currentY = window.scrollY;
      scrollDeltaRef.current += currentY - lastScrollYRef.current;
      lastScrollYRef.current = currentY;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        updateFromScroll();
      });

      if (isSnappingRef.current || isProgrammaticScrollRef.current || isWheelGestureActiveRef.current) return;

      window.clearTimeout(snapIdleTimerRef.current);
      snapIdleTimerRef.current = window.setTimeout(snapToDirectionalPanel, SNAP_IDLE_MS);
    };

    const onScrollEnd = () => {
      window.clearTimeout(snapIdleTimerRef.current);
      if (isWheelGestureActiveRef.current) {
        scrollDeltaRef.current = 0;
        return;
      }
      snapToDirectionalPanel();
    };

    updateFromScroll();
    lastScrollYRef.current = window.scrollY;
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', onScrollEnd, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.clearTimeout(snapIdleTimerRef.current);
      window.clearTimeout(wheelGestureIdleTimerRef.current);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('resize', onScroll);
    };
  }, [snapToDirectionalPanel]);

  const jumpTo = useCallback(
    (id: SectionId) => {
      const el = document.getElementById(id);
      if (!el) return;

      window.clearTimeout(snapIdleTimerRef.current);
      scrollDeltaRef.current = 0;
      isProgrammaticScrollRef.current = true;

      if (id === 'landing') {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      } else {
        const raw = panelScrollStart(el);
        window.scrollTo({
          top: Math.max(0, raw),
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
        });
      }

      window.setTimeout(
        () => {
          isProgrammaticScrollRef.current = false;
        },
        prefersReducedMotion ? 50 : 700,
      );
    },
    [prefersReducedMotion],
  );

  return { activeSection, scrollProgress, jumpTo, prefersReducedMotion };
};
