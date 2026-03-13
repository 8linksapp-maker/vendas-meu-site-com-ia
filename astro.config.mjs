// astro.config.mjs
// Configuração do Astro para a página de vendas do curso "Meu Site Com IA"
// SSR via adapter Node para suporte a API routes do painel admin
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // applyBaseStyles: false — evita que o preflight do Tailwind injete estilos
  // globais nas páginas do admin, que usam CSS próprio sem Tailwind
  integrations: [tailwind({ applyBaseStyles: false })],
});
