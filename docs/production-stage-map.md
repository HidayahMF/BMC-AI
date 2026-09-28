# Production Stage Map

No production stage is promoted to a confirmed business flow yet.

| Stage | Source object | Business purpose | Input identifier | Output identifier | Quantity field | Date field | Confidence |
|---|---|---|---|---|---|---|---|
| Sales reference | `SLS_SALESORDER_NEW` | Confirmed Sales detail | `ProductID`, `PartNumber` | Sales line | `Qty` | `PODelFrom`/header `PODate` | CONFIRMED_BY_DATA for Sales relationship; quantity semantics PROBABLE |
| Delivery | `SLS_DELIVERYORDER_NEW` | Confirmed Delivery detail structure | `ProductID`, PO fields | Delivery line | `Qty` | Header `Tanggal` | CONFIRMED_BY_DATA for header/detail; Sales linkage PROBABLE |
| Finished-goods transaction candidate | `Transaksi_Stok_Fg` | Stock/transaction object with ProductID and Qty | `ProductId` | Finished-goods stock transaction | `Qty` | `Tanggal`/`CreatedDate` | PROBABLE CANDIDATE, not production actual |
| Casting master/balance candidate | `casting1` | Part/casting master and balances | `PART_NUMBER`, `KODE_CST` | Casting/stock attributes | `saldo_*` fields | `lastUpdate` | UNKNOWN business purpose |
| Production tonnage summary candidate | `PPC_TonProductTonFinish` | Periodic ton/finished summary candidate | no Sales ProductID bridge found | period summary | `TonFinished*` | `From`, `To`, `PrevDate` | UNKNOWN |
| Production mapping candidate | `WMS_MAPPING_PART_DELIVERY_PRD` | Delivery/production mapping candidate | `ProductId` | mapping/material/process fields | `RateDelivery`, `StokAwal`, `StokAkhir` | period fields | PROBABLE bridge candidate |

## Current Conclusion

- Furnace/Core/Moulding/Trimming/Shootblast flow is not confirmed from identifier continuity.
- `Transaksi_Stok_Fg` must not be called actual production output without transaction-type and business-purpose validation.
- Current capability level: **LEVEL 0**. `JenisTransaksi=D` is a PROBABLE FG receipt candidate, but actual production and Good/Reject semantics are not confirmed.
- No production progress, remaining, achievement, or ETA formula is implemented.
