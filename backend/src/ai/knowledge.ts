import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const docsRoots = [join(process.cwd(), 'docs'), join(process.cwd(), '..', 'docs')];
export async function approvedKnowledge(query: string) {
  const entries = await Promise.all(docsRoots.map(async (root) => (await readdir(root).catch(() => [] as string[])).filter((file) => file.endsWith('.md')).map((file) => ({ root, file }))));
  const files = entries.flat().slice(0, 60);
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const excerpts: string[] = [];
  for (const entry of files) {
    const content = await readFile(join(entry.root, entry.file), 'utf8');
    if (!terms.length || terms.some((term) => content.toLowerCase().includes(term))) excerpts.push(`## ${entry.file}\n${content.slice(0, 12000)}`);
  }
  return excerpts.slice(0, 8);
}
