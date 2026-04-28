import { db, tests, testVersions } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const rows = await db
    .select({
      id: tests.id,
      name: tests.name,
      slug: tests.slug,
      currentVersionId: tests.currentVersionId,
      currentVersionNumber: testVersions.versionNumber,
      prompt: testVersions.prompt
    })
    .from(tests)
    .leftJoin(testVersions, eq(testVersions.id, tests.currentVersionId))
    .orderBy(tests.name);

  return {
    tests: rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      currentVersionNumber: r.currentVersionNumber,
      promptPreview: r.prompt ? r.prompt.slice(0, 120) : null
    }))
  };
};
