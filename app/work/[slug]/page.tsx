import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ScreenCarousel from '@/components/ScreenCarousel';
import { projects, site } from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: `${p.title} — ${site.name}`, description: p.summary } : {};
}

const metaLabel = 'mb-2 font-mono text-[11px] text-muted';

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i], next = projects[(i + 1) % projects.length], hero = p.shots[0]?.src;
  const links = [[p.liveUrl, 'Live site ↗'], [p.repoUrl, 'GitHub ↗']].filter(([u]) => u) as [string, string][];
  const meta = [['WHEN', p.period], ['STACK', p.stack], ['ROLE', p.role]];

  return (
    <main>
      <section className="px-page relative mx-auto max-w-page pb-10 pt-[130px]">
        <span data-cursor={p.cursor} className="absolute right-[20%] top-[250px] size-px" />
        <div className="flex justify-between font-mono text-xs">
          <Link href="/#work" className="text-accent">← All work</Link>
          <span className="text-muted">{p.idx} / {String(projects.length).padStart(2, '0')}</span>
        </div>
        <h1 data-reveal="" className="mb-0 mt-7 text-[clamp(56px,11vw,170px)] font-extrabold leading-[.88] tracking-[-.055em]">{p.title}</h1>
        <div className="mt-3.5 text-[clamp(18px,2vw,26px)] font-medium tracking-[-.02em] text-muted">{p.sub}</div>
        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 border-t border-ink/14 py-5">
          {meta.map(([k, v]) => <div key={k}><div className={metaLabel}>{k}</div><div className="font-semibold">{v}</div></div>)}
          {links.length > 0 && (
            <div>
              <div className={metaLabel}>LINKS</div>
              <div className="flex gap-3.5 font-semibold">{links.map(([u, l]) => <a key={l} href={u} target="_blank" rel="noreferrer">{l}</a>)}</div>
            </div>
          )}
        </div>
        <div data-reveal="" className="relative mt-5 aspect-[16/10] overflow-hidden rounded-[10px] bg-ph shadow-[0_30px_80px_-30px_rgba(17,17,17,.35)]">
          {hero ? <Image src={hero} alt={p.title} fill priority sizes="(max-width: 1360px) 100vw, 1250px" className="object-cover object-left-top" />
            : <div className="flex size-full items-center justify-center bg-[repeating-linear-gradient(135deg,#E6E2D6_0_12px,#ECE8DD_12px_24px)] font-mono text-[13px] text-muted">[ hero screenshot ]</div>}
        </div>
      </section>

      <section className="px-page mx-auto max-w-page py-25">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-8">
          <div className="font-mono text-xs text-accent">{'// the project'}</div>
          <p data-reveal="" className="m-0 text-[clamp(24px,3vw,42px)] font-semibold leading-[1.2] tracking-[-.03em] text-pretty sm:col-span-2">{p.summary}</p>
        </div>
        <div className="mt-[110px] font-mono text-xs text-accent">{'// the story'}</div>
        <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-7">
          {p.story.map((s) => (
            <div key={s.n} data-reveal="" className="border-t border-ink/20 pt-4">
              <div className="font-mono text-[11px] text-accent">{s.n}</div>
              <div className="mb-2.5 mt-2 text-[22px] font-bold tracking-[-.02em]">{s.h}</div>
              <div className="text-[15px] leading-[1.55] text-body2 text-pretty">{s.b}</div>
            </div>
          ))}
        </div>
      </section>

      <ScreenCarousel shots={p.shots} />

      <section className="px-page mx-auto max-w-page pb-[130px] pt-[110px]">
        <div className="font-mono text-xs text-muted">NEXT PROJECT</div>
        <Link href={`/work/${next.slug}`} className="mt-3.5 block text-[clamp(48px,9vw,130px)] font-extrabold leading-[.9] tracking-[-.055em] !text-ink hover:!text-accent">
          {next.title} →
        </Link>
      </section>
    </main>
  );
}
