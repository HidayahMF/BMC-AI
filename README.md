# BMC AI

Separate read-only business and factory intelligence application for BMC.

The legacy CodeIgniter application is reference-only. This project does not modify the legacy application or production databases, and it does not expose arbitrary SQL execution.

## Requirements

- Node.js 20+
- Read-only credentials for SQL Server and MySQL in `.env`

## Run

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`
- Health: `GET /health`
- Readiness: `GET /readyz`

Database connections are lazy. The application can start if one or both databases are unavailable; `/readyz` reports their state without exposing credentials.
