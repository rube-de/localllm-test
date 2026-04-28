import { db, models, submissions, tests } from '$lib/server/db';
import { count } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const [t] = await db.select({ n: count() }).from(tests);
  const [m] = await db.select({ n: count() }).from(models);
  const [s] = await db.select({ n: count() }).from(submissions);
  return {
    counts: {
      tests: t?.n ?? 0,
      models: m?.n ?? 0,
      submissions: s?.n ?? 0
    }
  };
};
