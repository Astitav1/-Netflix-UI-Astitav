import { useState, useEffect, useRef } from 'react';

// ── useDebounce ────────────────────────────────────────────────────────────
// Returns a debounced value after `delay` ms of no changes.
// Use this to delay search API calls until the user stops typing.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cleanup on every value change
  }, [value, delay]);

  return debounced;
}


// ── useIntersectionObserver ────────────────────────────────────────────────
// Returns a ref + boolean `isIntersecting`.
// Attach the ref to a sentinel element at the bottom of a list to trigger
// infinite scroll / lazy loading.
export function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    observer.observe(el);
    return () => observer.disconnect(); // prevent memory leak
  }, []);

  return { ref, isIntersecting };
}


// ── useOnlineStatus ────────────────────────────────────────────────────────
// Tracks browser online/offline status in real time.
export function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const setOn  = () => setOnline(true);
    const setOff = () => setOnline(false);

    window.addEventListener('online',  setOn);
    window.addEventListener('offline', setOff);
    return () => {
      window.removeEventListener('online',  setOn);
      window.removeEventListener('offline', setOff);
    };
  }, []);

  return online;
}


// ── useScrolled ───────────────────────────────────────────────────────────
// Returns true when window scroll > threshold (for navbar styling).
export function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);

  return scrolled;
}
