import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (url.pathname !== '/admin/login' && !locals.authed) {
    throw redirect(303, `/admin/login?next=${encodeURIComponent(url.pathname)}`);
  }
  return { authed: locals.authed };
};
