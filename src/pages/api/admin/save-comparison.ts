// api/admin/save-comparison.ts
// Salva tabela comparativa WordPress vs JAMstack.
import type { APIRoute } from 'astro';
import { SESSION_COOKIE, verifyToken } from '../../../utils/auth';
import { readContent, writeContent } from '../../../utils/saveContent';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get(SESSION_COOKIE)?.value || '';
  if (!(await verifyToken(token))) return new Response('Unauthorized', { status: 401 });

  const body = await request.json();
  const c = readContent();
  const count = parseInt(body.count, 10) || 0;
  const rows = [];

  for (let i = 0; i < count; i++) {
    rows.push({
      feature:   body[`feat_${i}`] || '',
      wordpress: body[`wp_${i}`]   || '',
      jamstack:  body[`jam_${i}`]  || '',
    });
  }

  c.comparison = rows;
  await writeContent(c);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
