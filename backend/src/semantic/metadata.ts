import { relevantEntities } from './catalog.js';
export function relevantMetadata(query: string) { return relevantEntities(query).map((entity) => ({ entity: entity.entity, aliases: entity.aliases, domain: entity.domain, fields: Object.fromEntries(Object.entries(entity.fields).map(([name, field]) => [name, { aliases: field.aliases, datatype: field.datatype, confidence: field.confidence }])) })); }
