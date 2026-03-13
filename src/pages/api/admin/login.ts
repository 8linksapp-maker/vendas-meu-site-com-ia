// api/admin/login.ts
// API route de autenticação do admin.
// Compara a senha enviada com ADMIN_PASSWORD (env) e grava cookie de sessão.
import type { APIRoute } from 'astro';
import { SESSION_COOKIE, signToken } from '../../../utils/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { password } = await request.json();
  const expected = import.meta.env.ADMIN_PASSWORD || 'admin123';

  if (password !== expected) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = await signToken('admin');
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    sameSite: 'lax',
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
