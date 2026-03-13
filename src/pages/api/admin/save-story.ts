// api/admin/save-story.ts
// Salva seção "Sobre / História" — imagem, título, parágrafos.
import type { APIRoute } from 'astro';
import { SESSION_COOKIE, verifyToken } from '../../../utils/auth';
import { readContent, writeContent } from '../../../utils/saveContent';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get(SESSION_COOKIE)?.value || '';
  if (!(await verifyToken(token))) return new Response('Unauthorized', { status: 401 });

  const body = await request.json();
  const c = readContent();

  c.story.image = body.image || '';
  c.story.title = body.title || '';

  const count = parseInt(body.p_count, 10) || 0;
  const paragraphs = [];
  for (let i = 0; i < count; i++) {
    const p = body[`p_${i}`];
    if (p) paragraphs.push(p);
  }
  c.story.paragraphs = paragraphs;

  const credCount = parseInt(body.cred_count, 10) || 0;
  const credentials = [];
  for (let i = 0; i < credCount; i++) {
    credentials.push({
      icon: body[`cred_icon_${i}`] || '',
      text: body[`cred_text_${i}`] || '',
    });
  }
  c.story.credentials = credentials;

  await writeContent(c);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
