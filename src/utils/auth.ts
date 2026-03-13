// utils/auth.ts
// Utilitário de autenticação simples por cookie para o painel admin.
// Usa HMAC SHA-256 via Web Crypto API (sem dependência externa).

export const SESSION_COOKIE = 'vendas_admin_session';
const SECRET = import.meta.env.ADMIN_SECRET || 'admin123';

export async function signToken(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${payload}.${b64}`;
}

export async function verifyToken(token: string): Promise<boolean> {
  const [payload] = token.split('.');
  if (!payload) return false;
  const expected = await signToken(payload);
  return token === expected;
}
