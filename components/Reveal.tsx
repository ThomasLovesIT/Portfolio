'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Slide-up reveal for [data-reveal] elements below the fold. Never hides text: only transform is animated.
export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { (e.target as HTMLElement).style.transform = 'none'; io.unobserve(e.target); }
    }), { threshold: 0.12 });
    const t = setTimeout(() => document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      if (el.dataset.rv) return;
      el.dataset.rv = '1';
      el.style.transition = 'transform 1.1s cubic-bezier(.16,1,.3,1)';
      if (el.getBoundingClientRect().top < innerHeight * 0.95) return;
      el.style.transform = 'translateY(40px)';
      io.observe(el);
    }), 30);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [pathname]);
  return null;
}
