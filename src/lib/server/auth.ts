import { createHmac, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { ADMIN_PASSWORD_HASH, SESSION_SECRET } from '$env/static/private';

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const SESSION_COOKIE = 'session';

export async function verifyPassword(plain: string): Promise<boolean> {
  if (!ADMIN_PASSWORD_HASH) return false;
  return bcrypt.compare(plain, ADMIN_PASSWORD_HASH);
}

function sign(payload: string): string {
  return createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
}

export function createSessionToken(): string {
  const iat = Date.now();
  const payload = `admin:${iat}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf('.');
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return false;
  const [scope, iatStr] = payload.split(':');
  if (scope !== 'admin') return false;
  const iat = Number(iatStr);
  if (!Number.isFinite(iat)) return false;
  if (Date.now() - iat > SESSION_TTL_MS) return false;
  return true;
}

export const SESSION_COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: true,
  maxAge: 60 * 60 * 24 * 30 // seconds
};
