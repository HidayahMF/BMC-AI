export async function executeTool(name: string, _args: unknown) {
  return { ok: false, error: `Unknown approved tool: ${name}` } as const;
}
