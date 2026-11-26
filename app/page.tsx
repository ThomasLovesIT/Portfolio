import Image from 'next/image';
import TypedIntro from '@/components/TypedIntro';
import WorkList from '@/components/WorkList';
import PathTimeline from '@/components/PathTimeline';
import Contact from '@/components/Contact';
import { site, cursorMessages } from '@/lib/content';

const h2 = 'm-0 text-[clamp(56px,10vw,150px)] font-extrabold leading-[.9] tracking-[-.055em]';
const metaLabel = 'mb-2 font-mono text-[11px] text-muted';
const ulink = '!text-ink border-b border-ink';

export default function Home() {
  return (
    <main>
      <section id="top" className="px-page relative mx-auto max-w-page pb-20 pt-[clamp(120px,16vh,180px)]">
        <div data-reveal="" className="mb-5 font-mono text-xs tracking-[.04em] text-accent">{site.heroLabel}</div>
        <h1 data-reveal="" className="m-0 text-[clamp(56px,9.5vw,150px)] font-extrabold leading-[.88] tracking-[-.055em]">
          {site.name}<span className="text-accent">.</span>
        </h1>
        <div className="mt-[clamp(40px,7vh,72px)] flex flex-wrap items-end gap-[clamp(28px,5vw,72px)]">
          <div className="relative aspect-[4/5] flex-[0_0_min(300px,100%)] overflow-hidden rounded-md bg-ph">
            <Image src="/portrait.jpg" alt={`Portrait of ${site.name}`} fill priority sizes="300px" className="object-cover" style={{ objectPosition: '46% 30%' }} />
          </div>
          <div className="max-w-[680px] flex-[1_1_360px]"><TypedIntro /></div>
        </div>
      </section>

      <section id="work" className="px-page relative mx-auto max-w-page pb-30 pt-25">
        <span data-cursor={cursorMessages.work} className="absolute right-[30%] top-[330px] size-px" />
        <div className="mb-3.5 font-mono text-xs text-accent">{"// what I've built"}</div>
        <div className="relative">
          <h2 data-reveal="" className={h2}>Selected work.</h2>
          <span aria-hidden="true" className="pointer-events-none absolute right-[4%] top-[-10%] rotate-[-8deg] font-hand text-[clamp(48px,8vw,120px)] font-bold leading-none text-orange">shipped!</span>
        </div>
        <WorkList />
        <div className="mt-7 font-mono text-xs text-muted">Click a project for the full case study →</div>
      </section>

      <section id="path" className="px-page relative overflow-hidden bg-accent pb-40 pt-30 text-white">
        <span data-cursor={cursorMessages.path} className="absolute right-[22%] top-[220px] size-px" />
        <div className="mx-auto max-w-page">
          <div className="mb-3.5 font-mono text-xs text-white/75">{'// from first commit to now'}</div>
          <h2 data-reveal="" className={h2}>The path.</h2>
          <PathTimeline />
        </div>
      </section>

      <section id="contact" className="px-page relative mx-auto max-w-page pb-25 pt-[130px]">
        <span data-cursor={cursorMessages.contact} className="absolute right-[16%] top-[200px] size-px" />
        <div className="mb-3.5 font-mono text-xs text-accent">{'// contact'}</div>
        <h2 data-reveal="" className="m-0 text-[clamp(64px,12vw,180px)] font-extrabold leading-[.88] tracking-[-.06em]">
          Say <span className="text-accent">hello.</span>
        </h2>
        <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 border-y border-ink/14 py-[22px]">
          <div className="min-w-0 sm:col-span-2">
            <div className={metaLabel}>EMAIL</div>
            <a href={`mailto:${site.email}`} className={`${ulink} break-all font-semibold`}>{site.email}</a>
          </div>
          <div>
            <div className={metaLabel}>ELSEWHERE</div>
            <div className="flex gap-3.5 font-semibold">
              <a href={site.github} target="_blank" rel="noreferrer" className={ulink}>GitHub</a>
              <a href={site.linkedin} target="_blank" rel="noreferrer" className={ulink}>LinkedIn</a>
            </div>
          </div>
          <div><div className={metaLabel}>BASED IN</div><div className="font-semibold">{site.location}</div></div>
          <div><div className={metaLabel}>REPLY TIME</div><div className="font-semibold">{site.replyTime}</div></div>
        </div>
        <Contact />
      </section>
    </main>
  );
}
