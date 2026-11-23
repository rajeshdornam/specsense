import { useEffect, useRef } from 'react';

/**
 * Attaches IntersectionObserver to trigger .reveal → .visible CSS transitions
 * when elements scroll into view.
 *
 * @param {Object} options
 * @param {number} options.threshold - 0–1, default 0.12
 * @param {string} options.rootMargin - e.g. "0px 0px -40px 0px"
 */
export function useScrollReveal({ threshold = 0.12, rootMargin = '0px 0px -40px 0px' } = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const els = container.querySelectorAll('.reveal');
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold, rootMargin }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return containerRef;
}

/**
 * Single-element scroll reveal hook.
 */
export function useRevealEl({ threshold = 0.15 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('reveal');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
