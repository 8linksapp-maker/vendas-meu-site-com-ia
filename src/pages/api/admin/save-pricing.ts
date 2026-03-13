// api/admin/save-pricing.ts
// Salva alterações de preços e links de checkout no content.json.
import type { APIRoute } from 'astro';
import { SESSION_COOKIE, verifyToken } from '../../../utils/auth';
import { readContent, writeContent } from '../../../utils/saveContent';

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = cookies.get(SESSION_COOKIE)?.value || '';
  if (!(await verifyToken(token))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const c = readContent();

  c.pricing.base.price = body.base_price;
  c.pricing.base.cta = body.base_cta;
  c.pricing.base.link = body.base_link;
  c.pricing.pro.price = body.pro_price;
  c.pricing.pro.cta = body.pro_cta;
  c.pricing.pro.link = body.pro_link;
  c.urgency.text = body.urgency_text;
  c.urgency.active = body.urgency_active === 'on' || body.urgency_active === true;
  c.hero.ctaBase = body.hero_cta_base;
  c.hero.ctaPro = body.hero_cta_pro;

  await writeContent(c);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
