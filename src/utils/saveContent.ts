// utils/saveContent.ts
// Utilitário para ler e gravar o content.json.
// Se GITHUB_TOKEN e GITHUB_REPO estiverem definidos → grava no GitHub (produção).
// Caso contrário → grava em disco (desenvolvimento local).
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { writeToGitHub } from './githubContent';

const CONTENT_PATH = join(process.cwd(), 'src/data/content.json');

export function readContent(): any {
  return JSON.parse(readFileSync(CONTENT_PATH, 'utf-8'));
}

export async function writeContent(data: any): Promise<void> {
  const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  const repo = import.meta.env.GITHUB_REPO || process.env.GITHUB_REPO;

  if (token && repo) {
    await writeToGitHub(data);
    return;
  }

  // Fallback: grava em disco (dev local)
  writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
