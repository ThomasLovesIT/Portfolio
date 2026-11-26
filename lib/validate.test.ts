// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseContact } from './validate.ts';

const roles = ['a', 'b'], starts = ['x', 'y'];

test('requires name and valid email', () => {
  assert.equal(parseContact({ email: 'a@b.co' }, roles, starts), 'Please add your name.');
  assert.equal(parseContact({ name: 'A', email: 'nope' }, roles, starts), 'Please add a valid email.');
  assert.equal(parseContact(null, roles, starts), 'Please add your name.');
});

test('cleans and maps fields', () => {
  const r = parseContact({ name: ' Ann\r\nBcc: x ', email: 'ann@co.io', role: 1, start: 99 }, roles, starts);
  assert.deepEqual(r, { name: 'Ann Bcc: x', company: '', email: 'ann@co.io', message: '', role: 'b', start: 'x' });
});
