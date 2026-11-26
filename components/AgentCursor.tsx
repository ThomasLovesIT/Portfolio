'use client';
import { useEffect, useRef, useState } from 'react';
import { site } from '@/lib/content';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// Scripted cursor that glides to the active [data-cursor] anchor and shows its message.
export default function AgentCursor() {
  const [msg, setMsg] = useState('');
  const [bub, setBub] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pos = { x: -200, y: 300 };
    let raf = 0, bt = 0, cur = '';
    const loop = (t: number) => {
      const vh = innerHeight, vw = innerWidth;
      const anchors = [...document.querySelectorAll<HTMLElement>('[data-cursor]')];
      let a = anchors[0];
      anchors.forEach((el) => { if (el.parentElement!.getBoundingClientRect().top < vh * 0.55) a = el; });
      if (a && ref.current) {
        const r = a.getBoundingClientRect(), fast = a.hasAttribute('data-caret-cur');
        const k = fast ? 0.22 : 0.045, wob = fast ? 0.2 : 1;
        const tx = clamp(r.left + (fast ? 4 : 0), 20, vw - 280) + Math.sin(t / 1100) * 10 * wob;
        const ty = clamp(r.top + (fast ? 6 : 0), 90, vh - 140) + Math.cos(t / 1300) * 8 * wob;
        pos.x += (tx - pos.x) * k; pos.y += (ty - pos.y) * k;
        ref.current.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)`;
        const m = a.dataset.cursor ?? '';
        if (m !== cur) { cur = m; setMsg(m); setBub(false); clearTimeout(bt); bt = window.setTimeout(() => setBub(true), 900); }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); clearTimeout(bt); };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-60" style={{ transform: 'translate3d(-200px,300px,0)' }}>
      <svg width="22" height="22" viewBox="0 0 22 22" className="block drop-shadow-[0_2px_3px_rgba(0,0,0,.25)]">
        <path d="M3 2 L19 10 L11 12 L8 20 Z" fill="#FF5A2C" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <div className="absolute left-[18px] top-[18px] flex flex-col items-start gap-2">
        <span className="whitespace-nowrap rounded-[5px] bg-orange px-2 py-[3px] font-mono text-[11px] font-medium text-white">{site.cursorName}</span>
        <span className="w-max max-w-[240px] rounded-xl rounded-tl-[3px] bg-white px-[13px] py-[9px] text-sm font-medium leading-[1.35] text-ink shadow-[0_10px_30px_-8px_rgba(17,17,17,.3),0_0_0_1px_rgba(17,17,17,.06)]"
          style={{ opacity: bub ? 1 : 0, transform: `translateY(${bub ? 0 : 6}px)`, transition: 'opacity .35s, transform .45s cubic-bezier(.2,.8,.2,1)' }}>
          {msg}
        </span>
      </div>
    </div>
  );
}
