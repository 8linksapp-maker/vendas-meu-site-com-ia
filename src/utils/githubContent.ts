// utils/githubContent.ts
// Persistência do content.json via GitHub API.
// Quando GITHUB_TOKEN e GITHUB_REPO estão definidos, grava no repositório.
// Caso contrário, grava em disco (dev local).

const CONTENT_PATH = 'src/data/content.json';

export async function writeToGitHub(data: object): Promise<void> {
  const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  const repo = import.meta.env.GITHUB_REPO || process.env.GITHUB_REPO;

  if (!token || !repo) {
    throw new Error('GITHUB_TOKEN e GITHUB_REPO são obrigatórios para gravar no GitHub.');
  }

  const [owner, repoName] = repo.split('/').filter(Boolean);
  if (!owner || !repoName) {
    throw new Error('GITHUB_REPO deve ser no formato owner/repo');
  }

  const content = JSON.stringify(data, null, 2);
  const contentBase64 = typeof Buffer !== 'undefined'
    ? Buffer.from(content, 'utf-8').toString('base64')
    : btoa(unescape(encodeURIComponent(content)));

  // 1. Buscar sha atual do arquivo
  const getRes = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/contents/${CONTENT_PATH}`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  let sha: string | undefined;

  if (getRes.ok) {
    const file = await getRes.json();
    sha = file.sha;
  } else if (getRes.status === 404) {
    // Arquivo não existe — será criado (não envia sha)
  } else {
    const err = await getRes.text();
    throw new Error(`GitHub GET falhou (${getRes.status}): ${err}`);
  }

  // 2. Atualizar arquivo
  const body: Record<string, string> = {
    message: `chore: atualiza content.json via admin (${new Date().toISOString().slice(0, 19)})`,
    content: contentBase64,
  };
  if (sha) body.sha = sha;

  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repoName}/contents/${CONTENT_PATH}`,
    {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.text();
    throw new Error(`GitHub PUT falhou (${putRes.status}): ${err}`);
  }
}
