// api/admin/save-hero.ts
// Salva hero (headline, subheadline, badge) e stats no content.json.
import type { APIRoute } from 'astro';
import { SESSION_COOKIE, verifyToken } from '../../../utils/auth';
import { readContent, writeContent } from '../../../utils/saveContent';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get(SESSION_COOKIE)?.value || '';
  if (!(await verifyToken(token))) return new Response('Unauthorized', { status: 401 });

  const body = await request.json();
  const c = readContent();

  c.hero.badge = body.badge;
  c.hero.headline = body.headline;
  c.hero.subheadline = body.subheadline;

  const statsCount = parseInt(body.stats_count, 10) || 0;
  const stats = [];
  for (let i = 0; i < statsCount; i++) {
    stats.push({ value: body[`stat_val_${i}`] || '', label: body[`stat_label_${i}`] || '' });
  }
  if (stats.length) c.hero.stats = stats;

  await writeContent(c);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
