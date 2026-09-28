# Database Discovery

Discovery is intentionally explicit and read-only. Candidate SQL Server metadata is collected by `backend/scripts/discover-sqlserver.ts`; MySQL metadata is collected through `mysql2` by `backend/scripts/discover-mysql.ts`.

No production schema or data mutation is part of this project.

## Current Run

- SQL Server: connected using the local legacy-reference configuration; 22 approved candidate tables/views produced metadata.
- MySQL: server reached, authentication rejected for the configured local credential. No schema query was completed.
- Production deployment should use a dedicated reporting account with `SELECT`-only permissions, separate from legacy application credentials.
- The local `.env` is ignored by Git and credentials are intentionally absent from this document.
