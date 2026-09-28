# AI Capabilities

## Supported foundation

- Mock AI provider and approved-tool orchestration boundary
- Health, readiness, request validation, rate limiting, and SSE transport
- Real SQL Server customer search with source metadata
- SQL Server sales order repository uses `MAS_CUSTOMER` + `SLS_SALESORDER_HED_NEW` + `SLS_SALESORDER_NEW`. Customer/header, header/detail, and detail/product relationships are `CONFIRMED_BY_DATA` from the 50-header bounded validation. This is data-confirmed, not legacy-confirmed.
- Session-scoped customer disambiguation and continuation into the original order request

## Partial

- Customer ambiguity resolution requires user selection when a search returns multiple canonical records
- Sales tool schemas include `search_order`, `get_order_details`, `get_customer_orders`, and `get_latest_customer_orders`, and now query the populated source candidate.
- Delivery repository uses populated `_NEW` header/detail objects. Delivery header/detail is `CONFIRMED_BY_DATA`; Sales-to-Delivery business linkage remains `PROBABLE` with Hino exact PO+ProductID candidate coverage of 3,113/3,321 lines (93.7%). Inventory quantity semantics remain UNKNOWN.
- The six Hino source records remain separate; no application-level canonical alias was created because transaction-based equivalence is not proven.

## Blocked

- Production achievement, remaining quantity, reject calculation, effective hours, downtime, and ETA: source tables and formulas are not yet validated
- MySQL-backed capabilities: MySQL authentication is currently unavailable

## Historical Sales Scope

- Supported date inputs are normalized to `dateFrom` and `dateTo` using Asia/Jakarta for current/previous month, year, named month, and explicit month ranges.
- `PODate`, `Nomor`, `PONo`, `Qty`, and `status` remain PROBABLE/UNKNOWN as documented in `sales-data-lineage.md`; no business answer may treat them as confirmed semantics.
- Delivery quantity semantics, UOM, partial delivery, and derived remaining quantity remain BLOCKED pending repeated-delivery and unit validation.
- Production discovery now scans production-like SQL Server objects dynamically; 631 candidates and 477 populated objects were found, but no production actual source or formula is promoted.
- `Transaksi_Stok_Fg.JenisTransaksi=D` is a PROBABLE incoming-from-production-line candidate based on bounded `Keterangan`, `LineProduksi`, positive Qty, and `Satuan`; it is not exposed as Good Production Output.
- Production capability is LEVEL 0: a probable FG receipt event was found, but Product-level output is not yet confirmed. Order allocation, progress, remaining, and ETA are blocked.
- Inventory `SumMatStock.Quantity` is not labeled available stock until its source semantics are proven.
- Inventory UI may safely use `Ending Stock` / `Saldo Stok`; `availableStock` remains blocked.
- Internal confidence metadata is attached to Sales customer/order/quantity/delivery results for developer diagnostics.
- TTL cache abstraction is enabled for customer search and Sales detail only; errors are not cached.
- Bounded mock-provider load harness is available through `npm run load:test`; it bypasses SQL Server and HTTP rate limiting by design.
- Bounded real SQL customer-search load test is available through `npm run load:test:sql <concurrency> <durationMs>`; it is read-only and intentionally light.

## Production Discovery Boundary

- `Transaksi_Stok_Fg` is not exposed as a production tool. `JenisTransaksi=D` is only a PROBABLE FG receipt candidate; `K` is a PROBABLE outgoing stock/event candidate.
- No Good Production Quantity, FG receipt API, order-level production progress, reject rate, or ETA is implemented.
- Current production capability is LEVEL 0 because source writer, production-completion event, reject separation, and order allocation are not confirmed.
