# BMC AI Data Security Architecture

## Boundary

The external AI model is an untrusted intent and knowledge component. It has no database credentials, does not import SQL drivers, cannot execute SQL, and must never receive database rows or repository results.

## Live Data Flow

```text
User
  -> AI Intent Parser
  -> validated Intent (Zod)
  -> Backend Action Executor
  -> fixed parameterized repository query
  -> SQL Server
  -> Backend Deterministic Formatter
  -> Frontend

SQL result -X-> AI Model
```

`GeminiProvider.parseIntent()` ends after producing a validated intent. `executeAction()` runs afterward. There is no function response or second provider call containing live data.

## Knowledge Flow

Knowledge questions are answered from approved local Markdown documentation only. The provider may receive user text and selected documentation excerpts. Knowledge retrieval never imports repositories or database clients and never queries SQL Server or MySQL.

Responses identify their mode:

- `LIVE_BACKEND`: live rows were retrieved and formatted by trusted backend code.
- `KNOWLEDGE`: answer is based on approved documentation.
- `BLOCKED`: capability is not enabled because its source or formula is not validated.

## Customer Ambiguity

Customer candidates are returned directly by the backend. The selected intent is stored in the backend session. User selection invokes the backend action executor directly; candidate rows are never sent back to Gemini.

## Runtime Isolation

The current repository implements a logical boundary in one backend process: AI provider modules use `backend/src/ai/config/env.ts`, which contains only `GEMINI_API_KEY`, `AI_MODEL`, and `AI_TIMEOUT_MS`; repositories use the separate database configuration. A production deployment must physically split these into an AI service and data service.

The AI service/container must not be able to connect to SQL Server or MySQL host/ports. Only the data service may have database network routes and database credentials. The data service must not have `GEMINI_API_KEY`.

## Guardrails

- All Gemini output is untrusted and validated with Zod.
- Database actions use existing fixed parameterized repository queries.
- Arbitrary SQL and `execute_sql` are rejected.
- Production output, delivery progress/remaining, and ETA remain blocked.
- Audit events contain request ID, intent/action, and status only; raw rows and sensitive result payloads are not logged.
