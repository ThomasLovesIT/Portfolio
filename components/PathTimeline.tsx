'use client';
import { useEffect, useRef, useState } from 'react';
import { PATH_D, milestones } from '@/lib/content';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function PathTimeline() {
  const wrap = useRef<HTMLDivElement>(null), path = useRef<SVGPathElement>(null), head = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<boolean[]>(() => milestones.map(() => false));

  useEffect(() => {
    const p = path.current!, w = wrap.current!, h = head.current!;
    // Pre-sample with a running-max Y so scroll progress (a Y position) maps through the loop in the curve.
    const total = p.getTotalLength(), N = 700, s: { l: number; x: number; y: number; cm: number }[] = [];
    let cm = -1;
    for (let i = 0; i <= N; i++) { const l = (total * i) / N, q = p.getPointAtLength(l); cm = Math.max(cm, q.y); s.push({ l, x: q.x, y: q.y, cm }); }
    const nodeLens = milestones.map((n) => {
      let best = 0, bd = Infinity;
      for (const q of s) { const d = (q.x - n.x) ** 2 + (q.y - n.y) ** 2; if (d < bd) { bd = d; best = q.l; } }
      return best;
    });
    p.style.strokeDasharray = `${total} ${total}`;
    p.style.strokeDashoffset = `${total}`;
    p.style.opacity = '1';

    let len = 0, shown = -1, raf = 0;
    const loop = () => {
      const r = w.getBoundingClientRect(), ty = clamp((innerHeight * 0.6 - r.top) / r.height, 0, 1) * 2000;
      let target = 0;
      for (const q of s) { if (q.cm <= ty) target = q.l; else break; }
      len += (target - len) * 0.09;
      if (Math.abs(len - shown) > 0.3) {
        shown = len;
        p.style.strokeDashoffset = `${total - len}`;
        const pt = p.getPointAtLength(len);
        h.style.left = pt.x / 10 + '%'; h.style.top = pt.y / 20 + '%';
        const next = nodeLens.map((l) => len >= l - 2);
        setOn((prev) => (next.every((v, i) => v === prev[i]) ? prev : next));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrap} className="relative mx-auto mt-10 aspect-[1000/2000] max-h-[2000px] w-full max-w-[1100px]">
      <svg viewBox="0 0 1000 2000" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <path d={PATH_D} fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1.5" strokeDasharray="3 7" vectorEffect="non-scaling-stroke" />
        <path ref={path} d={PATH_D} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke"
          style={{ opacity: 0, filter: 'drop-shadow(0 0 6px rgba(255,255,255,.9)) drop-shadow(0 0 18px rgba(255,255,255,.5))' }} />
      </svg>
      {milestones.map((n, i) => (
        <div key={n.num} className="absolute size-0" style={{ left: n.x / 10 + '%', top: n.y / 20 + '%' }}>
          <div className="absolute -left-2 -top-2 size-4 rounded-full border-2 border-white transition-all duration-400"
            style={{ background: on[i] ? '#fff' : '#3A1FFF', boxShadow: on[i] ? '0 0 16px #fff' : 'none' }} />
          <div className="absolute -top-3.5 w-[min(38vw,380px)]"
            style={{ [n.side]: 28, textAlign: n.side, opacity: on[i] ? 1 : 0.28, transform: `translateY(${on[i] ? 0 : 14}px)`, transition: 'opacity .6s, transform .8s cubic-bezier(.2,.8,.2,1)' }}>
            <div className="font-mono text-[11px] text-white/80">{n.num} · {n.when}</div>
            <div className="mb-3 mt-2 text-[clamp(28px,4vw,56px)] font-extrabold leading-none tracking-[-.045em]">{n.title}</div>
            <div className="text-[clamp(14px,1.3vw,17px)] leading-normal text-white/88 text-pretty">{n.body}</div>
          </div>
        </div>
      ))}
      <div ref={head} className="absolute size-0" style={{ left: '15%', top: 0 }}>
        <div className="absolute -left-[22px] -top-[22px] size-11 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.55),rgba(255,255,255,0)_70%)]" />
        <div className="absolute -left-1.5 -top-1.5 size-3 rounded-full bg-white shadow-[0_0_14px_#fff]" />
      </div>
    </div>
  );
}
