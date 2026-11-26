'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ReactLenis, useLenis } from 'lenis/react';

function RouteScroll() {
  const lenis = useLenis();
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (!lenis) return;
    if (first.current) { first.current = false; return; } // keep the browser's own position on first load
    const el = location.hash ? document.querySelector<HTMLElement>(location.hash) : null;
    lenis.scrollTo(el ?? 0, { offset: -20, immediate: true });
  }, [pathname, lenis]);
  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.085, smoothWheel: true }}>
      <RouteScroll />
      {children}
    </ReactLenis>
  );
}
