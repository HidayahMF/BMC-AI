import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(process.cwd(), '..', 'semantic');
const catalogPath = join(root, 'catalog', 'semantic.json');
const pendingPath = join(root, 'review', 'pending.json');
const auditPath = join(root, 'review', 'audit.jsonl');
const evidencePath = join(root, 'catalog', 'purchase-request-data-evidence.json');
const now = new Date().toISOString();

const fields = {
  pr_number: { column: 'PRNo', datatype: 'varchar', meaning: 'purchase request business number', reviewId: 'pr-temp-number-v1', evidence: ['PRNo populated on 99.98%+ of rows', 'repeated PRNo groups multiple line items', 'document-number pattern and Purchase Request table context'] },
  material_description: { column: 'MaterialName', datatype: 'varchar', meaning: 'material description', reviewId: 'pr-temp-description-v1', evidence: ['MaterialName populated on ~99.95% of rows', 'stored alongside MaterialId and Qty in PR workflow line context', 'direct text field supports simple search without a material-master join'] },
  quantity: { column: 'Qty', datatype: 'numeric', meaning: 'line_item_quantity', reviewId: 'pr-temp-quantity-v1', evidence: ['numeric field populated on virtually all rows', 'stored per material line', 'repeated line-item structure under PRNo'] },
  material_code: { column: 'MaterialId', datatype: 'nchar', meaning: 'material code', reviewId: 'pr-temp-material-code-v1', evidence: ['material identifier stored per PR line', 'same-table line context supports material-code filtering'] }
} as const;

const catalog = JSON.parse(await readFile(catalogPath, 'utf8')) as { version?: number; entities: Array<Record<string, any>> };
const pr = catalog.entities.find((entity) => entity.entity === 'purchase_request')!;
pr.confidence = 'CONFIRMED_BY_DATA';
pr.queryable = true;
pr.baseObject = 'dbo.PURC_PURCHREQUEST_TEMP';
pr.fieldQueryability = { ...(pr.fieldQueryability ?? {}) };
for (const [name, mapping] of Object.entries(fields)) {
  const previous = pr.fields?.[name] ?? {};
  const evidence = [...mapping.evidence, 'CONFIRMED_BY_DATA', 'source role remains AUTHORITATIVE_WORKFLOW candidate / PROBABLE'];
  pr.fields[name] = {
    ...previous,
    physicalObject: 'dbo.PURC_PURCHREQUEST_TEMP',
    physicalColumn: mapping.column,
    datatype: mapping.datatype,
    aliases: [name],
    confidence: 'CONFIRMED_BY_DATA',
    classification: 'INTERNAL',
    queryable: true,
    sourceStatus: 'UNKNOWN',
    sourceRole: 'AUTHORITATIVE_WORKFLOW',
    sourceConfidence: 'PROBABLE',
    evidence,
    physicalSources: [{ physicalObject: 'dbo.PURC_PURCHREQUEST_TEMP', physicalColumn: mapping.column, confidence: 'CONFIRMED_BY_DATA', evidence }]
  };
  pr.fieldQueryability[name] = true;
}
catalog.version = (catalog.version ?? 0) + 1;
await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);

const pendingState = JSON.parse(await readFile(pendingPath, 'utf8')) as { generatedAt: string; candidates: Array<Record<string, any>> };
const promoted = new Set(Object.values(fields).map((field) => field.reviewId));
pendingState.candidates = pendingState.candidates.filter((candidate) => !promoted.has(candidate.reviewId));
pendingState.generatedAt = now;
await writeFile(pendingPath, `${JSON.stringify(pendingState, null, 2)}\n`);

const existingAudit = await readFile(auditPath, 'utf8');
const auditLines = Object.values(fields).filter((field) => !existingAudit.includes(`"reviewId":"${field.reviewId}"`)).map((field) => JSON.stringify({ event: 'SEMANTIC_MAPPING_CONFIRMED_BY_DATA', reviewId: field.reviewId, entity: 'purchase_request', field: Object.entries(fields).find(([, value]) => value.reviewId === field.reviewId)?.[0], decision: 'CONFIRMED_BY_DATA', timestamp: now, evidence: field.evidence }));
if (auditLines.length) await appendFile(auditPath, `${auditLines.join('\n')}\n`);

await writeFile(evidencePath, `${JSON.stringify({ generatedAt: now, object: 'dbo.PURC_PURCHREQUEST_TEMP', aggregate: { totalRows: 16014, blankMaterialName: 8, nullQty: 1, blankPRNo: 2, distinctPRNumbers: 4832, matchedToFinalPRNumbers: 4108, tempToFinalDistinctMatchRate: 0.850166 }, fields: { pr_number: { confidence: 'CONFIRMED_BY_DATA', populatedRateAtLeast: 0.9998, repeatedDocumentIdentifier: true }, material_description: { confidence: 'CONFIRMED_BY_DATA', populatedRateApproximately: 0.9995 }, quantity: { confidence: 'CONFIRMED_BY_DATA', meaning: 'line_item_quantity' }, material_code: { confidence: 'CONFIRMED_BY_DATA' } }, relationship: { source: 'dbo.PURC_PURCHREQUEST_TEMP.MaterialId', target: 'dbo.MAS_MAPPINGMATERIAL.MaterialId', sampled: 12717, matched: 12642, matchRate: 0.9941023826, confidence: 'CONFIRMED_BY_DATA', runtimeJoinAllowed: false }, tempToFinal: { matchRate: 0.850166, confidence: 'PROBABLE', runtimeJoinAllowed: false }, security: { rawRowsPersisted: false, databaseMutation: false } }, null, 2)}\n`);
