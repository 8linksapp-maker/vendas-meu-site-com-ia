// astro.config.mjs
// Configuração do Astro para a página de vendas do curso "Meu Site Com IA"
// SSR via adapter Vercel para deploy correto na plataforma.
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  // applyBaseStyles: false — evita que o preflight do Tailwind injete estilos
  // globais nas páginas do admin, que usam CSS próprio sem Tailwind
  integrations: [tailwind({ applyBaseStyles: false })],
});
