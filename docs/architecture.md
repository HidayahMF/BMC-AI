# BMC AI Architecture

The legacy CodeIgniter application is a read-only reference for existing queries, relationships, and business logic. BMC AI never writes to the ERP databases.

```text
React Frontend -> Fastify API -> Services -> Approved Tools -> Repositories
                                                   |              |
                                           SQL Server / MySQL (SELECT only)
```

The backend is stateless by default. SQL Server and MySQL use lifecycle-managed pools, while Redis and BullMQ are reserved for shared cache and future background work. AI providers are abstracted behind `AIProvider`; the agent receives approved tool results, not credentials or SQL access.
