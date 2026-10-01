export type DisplayTransform = { type: 'LAST_SEGMENT'; delimiter: string };

export function getLastHierarchySegment(value: string | null): string | null {
  if (value === null) return null;
  const trimmed = value.trim();
  const parts = trimmed.split(';').map((part) => part.trim()).filter(Boolean);
  return parts.at(-1) ?? trimmed;
}

export function applyDisplayTransform(value: unknown, transform?: DisplayTransform): unknown {
  if (!transform || transform.type !== 'LAST_SEGMENT' || typeof value !== 'string') return value;
  if (transform.delimiter !== ';') return value;
  return getLastHierarchySegment(value);
}
