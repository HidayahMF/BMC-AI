import { toolRegistry, type ToolName } from './registry.js';

export async function executeTool(name: string, args: unknown) {
  if (!(name in toolRegistry)) return { ok: false, error: `Unknown approved tool: ${name}` };
  const tool = toolRegistry[name as ToolName];
  const parsed = tool.input.safeParse(args);
  if (!parsed.success) return { ok: false, error: 'Tool arguments failed validation.' };
  try { return { ok: true, data: await tool.execute(parsed.data as never) }; }
  catch { return { ok: false, error: 'Approved tool failed to read business data.' }; }
}
