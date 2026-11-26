'use client';
import { useEffect, useState } from 'react';
import { intro, site, cursorMessages } from '@/lib/content';

type Seg = (typeof intro)[number];
const segLen = (s: Seg) => (s[0] === 'c' ? 4 : s[1].length);
const TOTAL = intro.reduce((a, s) => a + segLen(s), 0);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const charAt = (i: number) => {
  let pos = 0;
  for (const s of intro) { const L = segLen(s); if (i < pos + L) return s[0] === 'c' ? '#' : s[1][i - pos]; pos += L; }
  return '';
};

const para = 'm-0 text-[clamp(20px,2.1vw,28px)] leading-[1.55] tracking-[-.015em] text-pretty';
const chipCls = 'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-ink/10 bg-white px-2.5 align-[.08em] text-[.82em] font-semibold';
const Chip = ({ s, style }: { s: ['c', string, string]; style?: React.CSSProperties }) => (
  <span className={chipCls} style={style}><span className="font-mono text-[.85em] text-accent">{s[2]}</span>{s[1]}</span>
);
const link = '!text-ink border-b border-ink pb-0.5';

export default function TypedIntro() {
  const [n, setN] = useState(0);
  const [blink, setBlink] = useState(1);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(TOTAL); return; }
    let start = 0, typeN = 0, last = 0, pauseUntil = 0, raf = 0;
    const loop = (t: number) => {
      const now = performance.now(), dt = Math.min(64, now - last);
      last = now;
      const work = document.getElementById('work');
      if (work && work.getBoundingClientRect().top < innerHeight * 0.6) typeN = TOTAL; // scrolled past: skip
      if (now - start > 700 && typeN < TOTAL && now >= pauseUntil) {
        const prev = Math.floor(typeN);
        typeN = Math.min(TOTAL, typeN + dt * 0.034 * (1 + Math.random() * 0.6));
        const n2 = Math.floor(typeN);
        if (n2 > prev) { const ch = charAt(n2 - 1); if (ch === '.' || ch === ',') pauseUntil = now + 260; else if (ch === '#') pauseUntil = now + 140; }
      }
      const f = Math.floor(typeN);
      setN(f);
      setBlink(Math.floor(t / 450) % 2 ? 1 : 0.15);
      if (f < TOTAL) raf = requestAnimationFrame(loop);
    };
    const go = () => { start = last = performance.now(); raf = requestAnimationFrame(loop); };
    // Wait for IntroLoader to slide away; html[data-intro] is set once it's skipped or finished.
    if (document.documentElement.dataset.intro) go(); else addEventListener('intro-done', go, { once: true });
    return () => { removeEventListener('intro-done', go); cancelAnimationFrame(raf); };
  }, []);

  const done = n >= TOTAL;
  let pos = 0;
  return (
    <>
      <div className="relative">
        <p className={para}>
          <span className="sr-only">{intro.map((s) => s[1]).join('')}</span>
          <span aria-hidden="true" className="invisible">
            {intro.map((s, i) => (s[0] === 't' ? <span key={i}>{s[1]}</span> : <Chip key={i} s={s} />))}
          </span>
        </p>
        <p aria-hidden="true" className={`${para} absolute inset-0`}>
          {intro.map((s, i) => {
            const L = segLen(s), loc = n - pos;
            pos += L;
            if (s[0] === 't') return <span key={i}>{s[1].slice(0, clamp(loc, 0, L))}</span>;
            if (loc <= 0) return null;
            return <Chip key={i} s={s} style={{ transform: `scale(${loc >= L ? 1 : 0.6})`, transformOrigin: 'left center', transition: 'opacity .18s, transform .3s cubic-bezier(.3,1.6,.5,1)' }} />;
          })}
          <span data-cursor={done ? cursorMessages.heroDone : cursorMessages.heroTyping} data-caret-cur=""
            className="ml-0.5 inline-block h-[1em] w-0.5 bg-orange align-[-.12em]" style={{ opacity: done ? 0 : blink }} />
        </p>
      </div>
      <div className="mt-7 flex flex-wrap gap-5 font-mono text-xs"
        style={{ opacity: done ? 1 : 0, transform: `translateY(${done ? 0 : 8}px)`, transition: 'opacity .5s, transform .6s cubic-bezier(.2,.8,.2,1)' }}>
        <a href={site.github} target="_blank" rel="noreferrer" className={link}>github ↗</a>
        <a href={site.linkedin} target="_blank" rel="noreferrer" className={link}>linkedin ↗</a>
        <a href={site.resume} target="_blank" className={link}>resume.pdf ↗</a>
        <span className="flex items-center gap-2 text-muted"><span className="size-[7px] rounded-full bg-ok" />open to work</span>
      </div>
    </>
  );
}
