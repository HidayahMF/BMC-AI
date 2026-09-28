import type { AIProvider, ToolResult } from './provider.js';
export class MockAIProvider implements AIProvider {
  async generate({ message }: { message: string }): Promise<ToolResult> { return { answer: `Mode development: permintaan diterima untuk "${message}". Hubungkan approved business tool setelah metadata dan relationship terverifikasi.`, data: {}, sources: [], toolsUsed: [] }; }
  async *stream(input: { message: string }) { yield (await this.generate(input)).answer; }
}
