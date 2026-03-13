// api/admin/save-value-stack.ts
// Salva stack de valor — itens base e pro.
import type { APIRoute } from 'astro';
import { SESSION_COOKIE, verifyToken } from '../../../utils/auth';
import { readContent, writeContent } from '../../../utils/saveContent';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get(SESSION_COOKIE)?.value || '';
  if (!(await verifyToken(token))) return new Response('Unauthorized', { status: 401 });

  const body = await request.json();
  const c = readContent();

  const baseCount = parseInt(body.base_count, 10) || 0;
  const base = [];
  for (let i = 0; i < baseCount; i++) {
    base.push({
      item: body[`base_item_${i}`] || '',
      from: body[`base_from_${i}`] || '',
      tag:  body[`base_tag_${i}`]  || 'incluso',
    });
  }

  const proCount = parseInt(body.pro_count, 10) || 0;
  const pro = [];
  for (let i = 0; i < proCount; i++) {
    pro.push({
      item: body[`pro_item_${i}`] || '',
      from: body[`pro_from_${i}`] || '',
      tag:  body[`pro_tag_${i}`]  || 'exclusivo Pro',
    });
  }

  c.valueStack = base;
  c.valueStackPro = pro;
  await writeContent(c);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
