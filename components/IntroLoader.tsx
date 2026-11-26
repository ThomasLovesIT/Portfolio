'use client';
import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';

// Runs in <head> before first paint: skip the loader for the rest of the session, or when motion is reduced.
export const introScript = `try{if(sessionStorage.getItem('intro')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='skip'}catch(e){}`;

const word = 'mx-4 whitespace-nowrap text-[clamp(72px,20vw,300px)] font-extrabold leading-none tracking-[-.055em]';

// First-visit loader: "Thomas." fills with accent from the bottom, then slides up. Signals TypedIntro via html[data-intro] + 'intro-done'.
export default function IntroLoader() {
  const [phase, setPhase] = useState<'run' | 'exit' | 'gone'>('run');
  const fill = useRef<HTMLDivElement>(null), num = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (phase === 'run') lenis.stop(); else lenis.start();
  }, [lenis, phase]);

  useEffect(() => {
    const html = document.documentElement;
    if (html.dataset.intro) { setPhase('gone'); return; }
    const t0 = performance.now();
    let shown = 0, raf = 0;
    const loop = (t: number) => {
      const lin = Math.min((t - t0) / 1200, 1);
      // Hold at 90% until the page has loaded, but never longer than 3s.
      const target = document.readyState === 'complete' || t - t0 > 3000 ? 1 - (1 - lin) ** 3 : Math.min(1 - (1 - lin) ** 3, 0.9);
      shown += (target - shown) * 0.2;
      if (target === 1 && shown > 0.995) shown = 1;
      fill.current!.style.clipPath = `inset(${(1 - shown) * 100}% -10% -10% -10%)`;
      num.current!.textContent = String(Math.round(shown * 100));
      if (shown < 1) { raf = requestAnimationFrame(loop); return; }
      try { sessionStorage.setItem('intro', '1'); } catch {}
      html.dataset.intro = 'done';
      dispatchEvent(new Event('intro-done'));
      setPhase('exit');
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (phase === 'gone') return null;
  return (
    <div aria-hidden="true" onTransitionEnd={() => setPhase('gone')}
      className={`intro-loader fixed inset-0 z-[100] flex items-center justify-center bg-ink transition-transform duration-900 ease-reveal ${phase === 'exit' ? '-translate-y-full' : ''}`}>
      <div className="relative">
        <div className={`${word} text-white/12`}>Thomas<span className="text-accent">.</span></div>
        <div ref={fill} className={`${word} absolute inset-0 text-accent`} style={{ clipPath: 'inset(100% -10% -10% -10%)' }}>Thomas.</div>
      </div>
      <div className="absolute bottom-6 right-[clamp(20px,4vw,56px)] font-mono text-xs text-cream">
        <span ref={num}>0</span><span className="text-white/40">%</span>
      </div>
    </div>
  );
}
