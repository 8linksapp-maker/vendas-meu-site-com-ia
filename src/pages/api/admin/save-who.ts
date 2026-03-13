// api/admin/save-who.ts
// Salva seção "Para Quem É" — avatares com ícone, título e descrição.
import type { APIRoute } from 'astro';
import { SESSION_COOKIE, verifyToken } from '../../../utils/auth';
import { readContent, writeContent } from '../../../utils/saveContent';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get(SESSION_COOKIE)?.value || '';
  if (!(await verifyToken(token))) return new Response('Unauthorized', { status: 401 });

  const body = await request.json();
  const c = readContent();
  const count = parseInt(body.count, 10) || 0;
  const items = [];

  for (let i = 0; i < count; i++) {
    items.push({
      icon: body[`icon_${i}`] || '',
      title: body[`title_${i}`] || '',
      description: body[`desc_${i}`] || '',
    });
  }

  c.whoIsFor = items;
  await writeContent(c);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
