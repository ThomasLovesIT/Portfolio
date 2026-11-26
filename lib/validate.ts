export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactMsg = { name: string; company: string; email: string; message: string; role: string; start: string };

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Validates an untrusted contact payload. Returns the cleaned message or an error string.
export function parseContact(body: unknown, roles: string[], starts: string[]): ContactMsg | string {
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const name = str(b.name, 100).replace(/[\r\n]+/g, ' ');
  const company = str(b.company, 100).replace(/[\r\n]+/g, ' ');
  const email = str(b.email, 200);
  if (!name) return 'Please add your name.';
  if (!EMAIL_RE.test(email)) return 'Please add a valid email.';
  return {
    name, company, email,
    message: str(b.message, 5000),
    role: roles[Number(b.role)] ?? roles[0],
    start: starts[Number(b.start)] ?? starts[0],
  };
}
