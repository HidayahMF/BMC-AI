# Relationship Map

Status is conservative: a table name or matching-looking identifier is not confirmation.

| Relationship | Status | Evidence / next step |
|---|---|---|
| `MAS_CUSTOMER.CustId` to `SLS_SALESORDER_HED_NEW.CustomerID` | CONFIRMED_BY_DATA | 50/50 latest bounded headers matched `MAS_CUSTOMER`; Hino `CustId=5` has real September 2026 transactions. Evidence is database data, not legacy code. |
| `SLS_SALESORDER_HED_NEW.Id` to `SLS_SALESORDER_NEW.IDheader` | CONFIRMED_BY_DATA | 50/50 latest bounded headers had detail rows; detail FK is varchar representation of header Id. |
| `SLS_SALESORDER_NEW.ProductID` to `MAS_KATALOG_SALES.Id` | CONFIRMED_BY_DATA | 101/101 bounded detail rows matched product master Id across the 50-header sample. |
| `SLS_CUSTOMER.CustomerID` to empty legacy Sales headers | INACTIVE | `SLS_SALESORDER_HED`, `SLS_SALESORDER`, and `SLS_PRODUCT` all contain 0 rows in the connected database. |
| `SLS_DELIVERYORDER_HED_NEW.Id` to `SLS_DELIVERYORDER_NEW.HedId` | CONFIRMED_BY_DATA | 20/20 latest delivery headers had detail rows; this is Delivery Header -> Delivery Detail, not Sales Header -> Delivery Detail. |
| Sales lines to delivery by `CustomerID + PO + ProductID` | PROBABLE | Hino: 3,113/3,321 Sales detail lines (93.7%) have a delivery candidate. 208 exceptions remain; `SalesNomor` direct match is not reliable. |
| `MAS_CUSTOMER.CustId` to delivery/customer `CustomerID` | CONFIRMED | `application/controllers/eprocurement.php:5754` joins `b.CustId=a.CustomerID` to `bmc.dbo.MAS_CUSTOMER`. |
| `PURC_MATCATALOG.Materialid` to inventory `Materialid` | CONFIRMED | `application/models/M_online_pr.php:71-83` joins material catalog to `SumMatStock` using `MaterialId`. |
| `SumMatStock` inventory quantity semantics | UNKNOWN | Catalog exposes `Quantity`, `UoM`, `Stockid`, and `OwnerId`; whether `Quantity` means on-hand, available, allocated, or another balance was not proven from a real sample/legacy usage in this run. |
| Product to material | UNKNOWN | No verified direct product-to-material relationship found. |
| Production planning to actual | BLOCKED | Source and business mapping not validated |
