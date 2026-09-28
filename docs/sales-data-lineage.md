# Sales Data Lineage

Read-only historical validation against SQL Server BMC. Sensitive transaction fields are summarized, not dumped.

## Active Source Update

- Previous sources `dbo.SLS_SALESORDER_HED`, `dbo.SLS_SALESORDER`, and `dbo.SLS_PRODUCT`: **INACTIVE/EMPTY**, each has 0 rows.
- Current strongest active candidate: `dbo.SLS_SALESORDER_HED_NEW` + `dbo.SLS_SALESORDER_NEW`.
- Customer source for this active candidate: `dbo.MAS_CUSTOMER.CustId`.
- Historical Hino evidence is on `MAS_CUSTOMER.CustId=5` (`PT. HINO MOTORS MANUFACTURING INDONESIA`). The six legacy `SLS_CUSTOMER` IDs are not treated as equivalent customer records because no cross-master mapping was proven.
- Product/part representation: detail `ProductID` and `PartNumber`; `dbo.MAS_KATALOG_SALES.Id` is a product-master candidate but its master semantics still require confirmation.
- The active candidate has real rows and current-period dates. The three Sales relationships are **CONFIRMED_BY_DATA**; legacy usage is still not required for that label and has not been found.

## Data-Confirmed Relationships

- `MAS_CUSTOMER.CustId -> SLS_SALESORDER_HED_NEW.CustomerID`: **CONFIRMED_BY_DATA**, 50/50 latest headers.
- `SLS_SALESORDER_HED_NEW.Id -> SLS_SALESORDER_NEW.IDheader`: **CONFIRMED_BY_DATA**, 50/50 latest headers have detail.
- `SLS_SALESORDER_NEW.ProductID -> MAS_KATALOG_SALES.Id`: **CONFIRMED_BY_DATA**, 101/101 bounded detail rows.
- This promotion is based on real SQL Server data only. It is not `CONFIRMED_BY_LEGACY`.
## Table Counts

- SLS_SALESORDER_HED: 0
- SLS_SALESORDER: 0
- SLS_PRODUCT: 0


## Candidate Fields

- Header date candidates: PODate (date), PODelFrom (date), PODelTo (date), TglBerlaku (date), approval_date (datetime), inp_date (datetime)
- Header business/status candidates: Nomor (varchar), PONo (nvarchar), SKPNo (nvarchar), PODate (date), CustomerID (int), TermOfDeliveryId (varchar), DeliveryPlace (char), PODelFrom (date), PODelTo (date), Note (nvarchar), status (int), StsPono (char), NoForecast (varchar)
- Detail quantity/unit candidates: ProductID (int), Qty (decimal), UnitPrice (decimal), POUnitPrice1 (decimal), PODelFrom (date), PODelTo (date), DeliveryPlace (varchar)
- Product identifiers: ProductDescription (nvarchar), ProductNo (nvarchar), BTNo (nvarchar), Status (int)

## Date Samples

- PODate (date): no non-null sample
- PODelFrom (date): no non-null sample
- PODelTo (date): no non-null sample
- TglBerlaku (date): no non-null sample
- approval_date (datetime): no non-null sample
- inp_date (datetime): no non-null sample

## Historical Hino Header Summary

| CustomerID | Headers | First candidate PODate | Last candidate PODate |
|---:|---:|---|---|

## Latest Header Samples (all customers)

| Header ID | Nomor | PONo | PODate | CustomerID | Detail rows | Product matches |
|---:|---|---|---|---:|---:|---:|

## Integrity Validation

- Headers tested: 0 (bounded sample: max 20 latest headers across all customers)
- Headers with matching customer: 0
- Headers with at least one detail: 0
- Detail rows with matching product: 0 of 0
- Full-database orphan detail/product scans: not executed in this bounded validation.

## Indexes

- SLS_PRODUCT.PK_SLS_PRODUCT: Id (unique)
- SLS_SALESORDER.PK_SLS_SALESORDER: ID (unique)
- SLS_SALESORDER_HED.PK_SLS_SALESORDER_HED: Id (unique)

## Status

- Legacy empty-source relationships remain INACTIVE and are not used by the current repository.
- Active CustomerID -> Sales Header CustomerID: CONFIRMED_BY_DATA from 50/50 bounded active-source headers.
- Active Sales Header Id -> Sales Detail IDheader: CONFIRMED_BY_DATA from 50/50 bounded active-source headers with detail.
- Active Sales Detail ProductID -> MAS_KATALOG_SALES.Id: CONFIRMED_BY_DATA from 101/101 bounded active-source details.
- PODate as active order-date field: PROBABLE_ACTIVE; real current-period data supports it, but no legacy reporting query was found.
- Business order number: PROBABLE_ACTIVE for active-source `Nomor`; `PONo` remains the customer/reference PO candidate.
- Quantity semantics: PROBABLE field candidate `SLS_SALESORDER_NEW.Qty`, but ordered-vs-scheduled semantics and UOM remain UNKNOWN. Active-source status semantics also remain UNKNOWN.

## Historical Validation Blocker

Historical note: the old source tables `SLS_SALESORDER_HED`, `SLS_SALESORDER`, and `SLS_PRODUCT` are empty and all six legacy Hino IDs returned zero rows there. Current repository validation uses the populated `_NEW` source documented above. The legacy CodeIgniter source containing active sales queries was not present under the searched development paths and was not inferred from unrelated projects.
