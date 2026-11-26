import { contact, site } from '@/lib/content';
import { parseContact } from '@/lib/validate';

const err = (error: string, status: number) => Response.json({ error }, { status });

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid request.', 400); }
  const m = parseContact(body, contact.roles, contact.starts);
  if (typeof m === 'string') return err(m, 400);

  const key = process.env.RESEND_API_KEY;
  if (!key) { console.error('contact: RESEND_API_KEY is not set'); return err('Email is not set up yet. Please email me directly.', 503); }

  const text = `Hi, I'm ${m.name}${m.company ? ` from ${m.company}` : ''}. I'm hiring for ${m.role}, ideally starting ${m.start}.\n` +
    `Reach me at ${m.email}.\n\n${m.message || '(no extra message)'}`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? 'Portfolio <onboarding@resend.dev>',
      to: process.env.CONTACT_TO ?? site.email,
      reply_to: m.email,
      subject: `Portfolio: ${m.name}${m.company ? ` (${m.company})` : ''}`,
      text,
    }),
  });
  if (!res.ok) { console.error('contact: resend failed', res.status, await res.text()); return err('Could not send right now. Please email me directly.', 502); }
  return Response.json({ ok: true });
}
