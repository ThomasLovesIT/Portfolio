'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { Shot } from '@/lib/content';

// Vertical scroll through a tall section drives a sideways track pinned in a sticky viewport.
export default function ScreenCarousel({ shots }: { shots: Shot[] }) {
  const sec = useRef<HTMLElement>(null), track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const s = sec.current, t = track.current;
      // Refs clear on unmount before the effect cleanup cancels the frame; stop the loop then.
      if (!s || !t) return;
      const max = s.offsetHeight - innerHeight;
      const pr = max > 0 ? Math.max(0, Math.min(1, -s.getBoundingClientRect().top / max)) : 0;
      t.style.transform = `translate3d(${-pr * Math.max(0, t.scrollWidth - innerWidth)}px,0,0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={sec} className="relative bg-ink text-cream" style={{ height: `${shots.length * 70 + 40}vh` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="px-page mb-7 flex justify-between font-mono text-xs text-cream/60">
          <span>{'// inside the build'}</span><span>{shots.length} screens</span>
        </div>
        <div ref={track} className="px-page flex w-max gap-7 will-change-transform">
          {shots.map((s, i) => (
            <figure key={i} className="m-0 w-[88vw] flex-none md:w-[min(68vw,980px)]">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] border border-white/8 bg-[#1d1d1d]">
                {s.src ? <Image src={s.src} alt={s.label} fill sizes="(max-width: 768px) 88vw, 980px" className="object-cover object-left-top" />
                  : <div className="flex size-full items-center justify-center bg-[repeating-linear-gradient(135deg,#1a1a1a_0_12px,#202020_12px_24px)] font-mono text-[13px] text-[#777]">[ screenshot ]</div>}
              </div>
              <figcaption className="mt-3.5 font-mono text-xs text-cream/70">{String(i + 1).padStart(2, '0')} — {s.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
