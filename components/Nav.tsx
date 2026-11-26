'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { site } from '@/lib/content';

const ITEMS = [['top', 'About'], ['work', 'Work'], ['path', 'Path'], ['contact', 'Contact']] as const;
const pill = 'pointer-events-auto rounded-full border border-ink/8 bg-cream/85 backdrop-blur-[10px]';

export default function Nav() {
  const isHome = usePathname() === '/';
  const lenis = useLenis();
  const [active, setActive] = useState('top');
  const lock = useRef(0);

  useEffect(() => {
    if (!isHome) return;
    const spy = () => {
      if (performance.now() < lock.current) return;
      let act = 'top';
      for (const [id] of ITEMS) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * 0.45) act = id; }
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) act = 'contact';
      setActive(act);
    };
    spy();
    addEventListener('scroll', spy, { passive: true });
    return () => removeEventListener('scroll', spy);
  }, [isHome]);

  const go = (id: string) => (e: React.MouseEvent) => {
    if (!isHome) return; // Link navigates to /#id; SmoothScroll lands on the section
    e.preventDefault();
    lock.current = performance.now() + 1500;
    setActive(id);
    lenis?.scrollTo(`#${id}`, { offset: -20, duration: 1.4 });
  };
  const current = isHome ? active : 'work';

  return (
    <div className="px-page pointer-events-none fixed inset-x-0 top-5 z-50 flex items-center justify-between">
      <Link href="/" onClick={(e) => { if (isHome) { e.preventDefault(); lenis?.scrollTo(0); } }}
        className={`${pill} flex items-center gap-2 px-3.5 py-2 text-sm font-bold tracking-[-.01em] !text-ink`}>
        <span className="size-2 rounded-full bg-accent" /><span className="sr-only sm:not-sr-only">{site.domain}</span>
      </Link>
      <nav className={`${pill} relative z-[51] flex gap-0.5 p-1 font-mono text-xs`}>
        {ITEMS.map(([id, label]) => (
          <Link key={id} href={isHome ? `#${id}` : `/#${id}`} onClick={go(id)}
            className="rounded-full px-[13px] py-[7px] transition-[background,color] duration-300 hover:opacity-85"
            style={{ background: current === id ? '#3A1FFF' : 'transparent', color: current === id ? '#fff' : '#111' }}>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
