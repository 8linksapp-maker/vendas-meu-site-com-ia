// api/admin/logout.ts
// Limpa o cookie de sessão do admin.
import type { APIRoute } from 'astro';
import { SESSION_COOKIE } from '../../../utils/auth';

export const GET: APIRoute = ({ cookies }) => {
  cookies.delete(SESSION_COOKIE, { path: '/' });
  return new Response(null, {
    status: 302,
    headers: { Location: '/admin/login' },
  });
};
