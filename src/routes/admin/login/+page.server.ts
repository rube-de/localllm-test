import { fail, redirect } from '@sveltejs/kit';
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  createSessionToken,
  verifyPassword
} from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.authed) {
    const next = url.searchParams.get('next') ?? '/admin';
    throw redirect(303, next);
  }
};

export const actions: Actions = {
  default: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const password = String(data.get('password') ?? '');
    if (!password) return fail(400, { error: 'Password required.' });

    const ok = await verifyPassword(password);
    if (!ok) return fail(401, { error: 'Invalid password.' });

    cookies.set(SESSION_COOKIE, createSessionToken(), SESSION_COOKIE_OPTIONS);
    const next = url.searchParams.get('next') ?? '/admin';
    throw redirect(303, next);
  }
};
