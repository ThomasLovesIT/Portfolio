'use client';
import { useState } from 'react';
import { track } from '@vercel/analytics';
import { contact } from '@/lib/content';
import { EMAIL_RE } from '@/lib/validate';

const input = 'border-0 border-b-2 border-ink/20 bg-transparent px-1 font-semibold tracking-[-.02em] text-ink outline-none focus:border-accent';
const label = 'mb-2.5 font-mono text-[11px] text-muted';

function Chips({ list, value, set, name }: { list: string[]; value: number; set: (i: number) => void; name: string }) {
  return (
    <span role="radiogroup" aria-label={name}>
      {list.map((l, i) => (
        <button key={l} type="button" role="radio" aria-checked={value === i} onClick={() => set(i)}
          className="mx-[3px] cursor-pointer rounded-full border-[1.5px] border-ink px-3.5 py-1.5 align-[.25em] text-[.55em] font-semibold transition-all duration-200"
          style={{ background: value === i ? '#111' : 'transparent', color: value === i ? '#F2EFE6' : '#111' }}>
          {l}
        </button>
      ))}
    </span>
  );
}

export default function Contact() {
  const [f, setF] = useState({ name: '', company: '', email: '', message: '', role: 0, start: 0 });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return setError('Please add your name.');
    if (!EMAIL_RE.test(f.email.trim())) return setError('Please add a valid email.');
    setError(''); setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not send right now.');
      setStatus('sent');
      track('Contact sent');
    } catch (err) {
      setError((err as Error).message); setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <div className="mt-14 text-[clamp(28px,4vw,56px)] font-bold leading-[1.1] tracking-[-.04em]">
        Thanks{f.name.trim() ? `, ${f.name.trim()}` : ''} — <span className="text-accent">I&apos;ll reply within a day.</span>
      </div>
    );
  }

  return (
    <form onSubmit={send} noValidate>
      <div className="mt-14 max-w-[1040px] text-[clamp(22px,2.8vw,38px)] font-medium leading-[1.9] tracking-[-.025em]">
        Hi, I&apos;m <input aria-label="Your name" value={f.name} onChange={set('name')} placeholder="your name" className={`${input} w-[8.5em]`} /> from{' '}
        <input aria-label="Your company" value={f.company} onChange={set('company')} placeholder="your company" className={`${input} w-[8.5em]`} />. I&apos;m hiring for{' '}
        <Chips name="Role type" list={contact.roles} value={f.role} set={(role) => setF({ ...f, role })} />, ideally starting{' '}
        <Chips name="Start" list={contact.starts} value={f.start} set={(start) => setF({ ...f, start })} />. You can reach me at{' '}
        <input aria-label="Your email" type="email" value={f.email} onChange={set('email')} placeholder="you@company.com" className={`${input} w-[9.5em]`} />.
      </div>
      <div className="mt-11 max-w-[560px]">
        <label htmlFor="msg" className={`block ${label}`}>ANYTHING ELSE? (OPTIONAL)</label>
        <textarea id="msg" value={f.message} onChange={set('message')} rows={3} placeholder="Tell me about the role, the team, the problem…"
          className="w-full resize-none border-0 border-b-[1.5px] border-ink/20 bg-transparent py-1.5 text-base text-ink outline-none focus:border-accent" />
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-5">
        <button type="submit" disabled={status === 'sending'}
          className="flex cursor-pointer items-center gap-2.5 rounded-full bg-orange px-[26px] py-4 text-base font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60">
          {status === 'sending' ? 'Sending…' : 'Send message'} <span>↗</span>
        </button>
        <span className="font-mono text-[11px] text-muted">Goes straight to my inbox. No spam, no lists.</span>
      </div>
      {error && <p role="alert" className="mt-4 font-mono text-xs text-orange">{error}</p>}
    </form>
  );
}
