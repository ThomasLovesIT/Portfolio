import type { Metadata } from 'next';
import { Schibsted_Grotesk, JetBrains_Mono, Caveat } from 'next/font/google';
import 'lenis/dist/lenis.css';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import AgentCursor from '@/components/AgentCursor';
import Reveal from '@/components/Reveal';
import { site } from '@/lib/content';

const grotesk = Schibsted_Grotesk({ variable: '--font-grotesk', subsets: ['latin'] });
const mono = JetBrains_Mono({ variable: '--font-jbmono', subsets: ['latin'] });
const caveat = Caveat({ variable: '--font-caveat', subsets: ['latin'], weight: '700' });

export const metadata: Metadata = {
  title: `${site.name} — Web Developer`,
  description: 'Full-stack web developer building business systems and websites for real clients.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable} ${caveat.variable}`}>
      <body>
        <SmoothScroll>
          <Nav />
          {children}
          <footer className="px-page flex flex-wrap justify-between gap-3 border-t border-ink/12 py-7 font-mono text-[11px] text-muted">
            <span>© 2026 {site.name}</span>
            <span>Designed &amp; built by hand</span>
          </footer>
          <AgentCursor />
          <Reveal />
        </SmoothScroll>
      </body>
    </html>
  );
}
