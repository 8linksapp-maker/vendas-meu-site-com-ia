// api/admin/save-faq.ts
// Salva alterações no FAQ do content.json.
import type { APIRoute } from 'astro';
import { SESSION_COOKIE, verifyToken } from '../../../utils/auth';
import { readContent, writeContent } from '../../../utils/saveContent';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get(SESSION_COOKIE)?.value || '';
  if (!(await verifyToken(token))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const count = parseInt(body.count, 10);
  const faq = [];

  for (let i = 0; i < count; i++) {
    faq.push({
      q: body[`q_${i}`] || '',
      a: body[`a_${i}`] || '',
    });
  }

  const c = readContent();
  c.faq = faq;
  await writeContent(c);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
