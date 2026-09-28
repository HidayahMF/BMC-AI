export type ToolResult = { answer: string; data: unknown; sources: string[]; toolsUsed: string[] };
export interface AIProvider { generate(input: { message: string; context?: unknown }): Promise<ToolResult>; stream(input: { message: string; context?: unknown }): AsyncIterable<string>; }
