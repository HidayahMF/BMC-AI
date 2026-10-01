# Semantic Profile Safety

The semantic profiler is a trusted backend/admin process. It reads SQL Server column metadata from `semantic/catalog/schema.json` and selects a SQL profile only from the normalized SQL Server datatype.

## Type Safety

- Numeric types use numeric `MIN`, `MAX`, `COUNT`, and null statistics.
- `bit` uses `CONVERT(int, column)` only for distinct counting.
- Native date/time types use native `MIN` and `MAX`; no generic conversion is used.
- `time` produces a time range, not a date range.
- String types use bounded string length statistics.
- XML, legacy text, binary, geography, geometry, `sql_variant`, and unknown types are skipped.
- No generic `TRY_CONVERT(datetime2, column)` exists in the profiler.

## Failure Isolation

Each column is profiled in its own try/catch. A failed column produces `PROFILE_ERROR` with a safe SQL error code and the profiler continues. Views are conservatively marked `SKIPPED_EXPENSIVE_VIEW`; large objects can be marked `SKIPPED_LARGE_OBJECT` using `SEMANTIC_PROFILE_MAX_ROWS`.

The report persists derived statistics only. It does not persist raw values or send any database result to Gemini.
