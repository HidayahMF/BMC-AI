import type { Intent } from '../intents/schema.js';
import type { SemanticPlan } from '../../semantic/schema.js';
export interface IntentProvider { parseIntent(message: string): Promise<Intent>; answerKnowledge(message: string, excerpts: string[]): Promise<string>; }
export interface IntentProvider { parseSemanticPlan(message: string, metadata: unknown): Promise<SemanticPlan>; }
