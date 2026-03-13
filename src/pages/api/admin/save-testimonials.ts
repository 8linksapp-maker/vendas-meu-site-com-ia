// api/admin/save-testimonials.ts
// Salva alterações nos depoimentos no content.json.
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
  const testimonials = [];

  for (let i = 0; i < count; i++) {
    testimonials.push({
      name:  body[`name_${i}`]  || '',
      role:  body[`role_${i}`]  || '',
      text:  body[`text_${i}`]  || '',
      image: body[`image_${i}`] || '',
    });
  }

  const c = readContent();
  c.testimonials = testimonials;
  await writeContent(c);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
