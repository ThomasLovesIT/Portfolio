'use client';
import { useEffect } from 'react';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { track } from '@vercel/analytics';
import { site } from '@/lib/content';

const events: Record<string, string> = { [site.resume]: 'Resume', [site.github]: 'GitHub', [site.linkedin]: 'LinkedIn' };

// Cookie-free page views, plus one delegated listener so links in server components get counted too.
export default function Analytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const name = events[(e.target as Element).closest('a')?.getAttribute('href') ?? ''];
      if (name) track(name);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return <VercelAnalytics />;
}
