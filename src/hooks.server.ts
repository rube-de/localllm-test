import { redirect, type Handle } from '@sveltejs/kit';
import { SESSION_COOKIE, verifySessionToken } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(SESSION_COOKIE);
  event.locals.authed = verifySessionToken(token);

  const path = event.url.pathname;
  if (path.startsWith('/admin') && path !== '/admin/login' && !event.locals.authed) {
    throw redirect(303, `/admin/login?next=${encodeURIComponent(path)}`);
  }

  const response = await resolve(event);

  // Sandboxed iframes use srcdoc, so frame-src 'self' is sufficient.
  // No allow-same-origin on iframes -> hermetic origins.
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "frame-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
};
