import type { Customer } from '../types/business.js';

type PendingResolution = { originalMessage: string; candidates: Customer[]; expiresAt: number };
const sessions = new Map<string, PendingResolution>();
const ttlMs = 30 * 60 * 1000;

function cleanup() { const now = Date.now(); for (const [id, value] of sessions) if (value.expiresAt <= now) sessions.delete(id); }
export function setPendingCustomerResolution(sessionId: string, originalMessage: string, candidates: Customer[]) { cleanup(); sessions.set(sessionId, { originalMessage, candidates, expiresAt: Date.now() + ttlMs }); }
export function getPendingCustomerResolution(sessionId: string) { cleanup(); return sessions.get(sessionId); }
export function clearPendingCustomerResolution(sessionId: string) { sessions.delete(sessionId); }
