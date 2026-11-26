'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { projects } from '@/lib/content';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function WorkList() {
  const [hover, setHover] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(hover);
  hoverRef.current = hover;
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => setCanHover(matchMedia('(hover: hover)').matches), []);

  // Preview trails the mouse and tilts with velocity (mouse − card), settling flat at −3°.
  useEffect(() => {
    if (!canHover) return;
    const tv = { rot: 0, ry: 0, rx: 0, sc: 0.8 };
    let raf = 0;
    const loop = () => {
      const on = !!hoverRef.current, p = pos.current;
      const dx = mouse.current.x - p.x, dy = mouse.current.y - p.y;
      if (on) { p.x += dx * 0.1; p.y += dy * 0.1; }
      tv.rot += (clamp(-3 + dx * 0.09, -16, 12) - tv.rot) * 0.12;
      tv.ry += (clamp(dx * 0.12, -18, 18) - tv.ry) * 0.12;
      tv.rx += (clamp(-dy * 0.12, -14, 14) - tv.rx) * 0.12;
      tv.sc += ((on ? 1 : 0.8) - tv.sc) * 0.15;
      const el = card.current;
      if (el) {
        el.style.left = p.x + 'px'; el.style.top = p.y + 'px';
        el.style.transform = `translate(-50%,-62%) perspective(900px) rotate(${tv.rot}deg) rotateY(${tv.ry}deg) rotateX(${tv.rx}deg) scale(${tv.sc})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [canHover]);

  const hp = projects.find((p) => p.slug === hover);
  const img = hp?.shots[0].src;

  return (
    <>
      <div className="mt-11 border-t border-ink/14" onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => { mouse.current = { x: e.clientX, y: e.clientY }; }}>
        {projects.map((p) => {
          const on = hover === p.slug;
          return (
            <Link key={p.slug} href={`/work/${p.slug}`}
              onMouseEnter={(e) => { if (!hover) pos.current = { x: e.clientX, y: e.clientY }; setHover(p.slug); }}
              className="grid grid-cols-1 items-center gap-x-6 gap-y-3 border-b border-ink/14 py-[26px] pr-1 md:grid-cols-[minmax(0,1fr)_auto_auto]"
              style={{ color: on ? '#3A1FFF' : '#111', paddingLeft: on ? 22 : 4, transition: 'color .25s, padding .35s cubic-bezier(.2,.8,.2,1)' }}>
              <span className="flex min-w-0 flex-wrap items-baseline gap-3.5">
                <span className="text-[clamp(26px,3.4vw,46px)] font-bold leading-[1.05] tracking-[-.035em]">{p.title}</span>
                <span className="text-[clamp(14px,1.3vw,18px)] font-medium text-muted">{p.sub}</span>
              </span>
              <span className="flex flex-wrap gap-1.5 md:justify-end">
                {p.tags.map((t) => (
                  <span key={t} className="whitespace-nowrap rounded-md border border-ink/18 bg-chip px-[9px] py-1 font-mono text-[11px] text-ink">{t}</span>
                ))}
              </span>
              <span className="min-w-[110px] font-mono text-xs text-muted md:text-right">{p.period}</span>
            </Link>
          );
        })}
      </div>
      {canHover && (
        <div ref={card} aria-hidden="true" className="pointer-events-none fixed z-40 w-[min(420px,40vw)] will-change-transform"
          style={{ opacity: hp ? 1 : 0, transition: 'opacity .3s' }}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-ph shadow-[0_30px_60px_-20px_rgba(17,17,17,.5)]">
            {img ? <Image src={img} alt="" fill sizes="420px" className="object-cover object-left-top" />
              : hp && <div className="flex size-full items-center justify-center bg-[repeating-linear-gradient(135deg,#E6E2D6_0_10px,#DDD8CB_10px_20px)] font-mono text-xs text-muted">[ {hp.title} preview ]</div>}
          </div>
        </div>
      )}
    </>
  );
}
