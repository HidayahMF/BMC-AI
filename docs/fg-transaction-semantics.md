# FG Transaction Semantics

Read-only validation anchored to real Hino Sales ProductID values. Transaction/document values are summarized.

## JenisTransaksi

| Type | Rows | Earliest | Latest | Exploratory Qty Sum | Positive | Negative |
|---|---:|---|---|---:|---:|---:|
| K | 35076 | Wed Mar 04 2026 07:00:00 GMT+0700 (Western Indonesia Time) | Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time) | 2401378 | 23719 | 0 |
| D | 5 | Fri Apr 24 2026 07:00:00 GMT+0700 (Western Indonesia Time) | Fri Apr 24 2026 07:00:00 GMT+0700 (Western Indonesia Time) | 30 | 5 | 0 |

No business label is assigned from the value name alone.

## Bounded Samples per JenisTransaksi

- D: ProductID=1115, Qty=6, date=Fri Apr 24 2026 07:00:00 GMT+0700 (Western Indonesia Time), unit=PCS, line=MP L, ref=3... (1 chars), warehouse=3, location=null
- D: ProductID=1115, Qty=6, date=Fri Apr 24 2026 07:00:00 GMT+0700 (Western Indonesia Time), unit=PCS, line=MP L, ref=1... (1 chars), warehouse=3, location=null
- D: ProductID=1115, Qty=6, date=Fri Apr 24 2026 07:00:00 GMT+0700 (Western Indonesia Time), unit=PCS, line=MP L, ref=2... (1 chars), warehouse=3, location=null
- D: ProductID=1115, Qty=6, date=Fri Apr 24 2026 07:00:00 GMT+0700 (Western Indonesia Time), unit=PCS, line=MP L, ref=2... (1 chars), warehouse=3, location=null
- D: ProductID=1115, Qty=6, date=Fri Apr 24 2026 07:00:00 GMT+0700 (Western Indonesia Time), unit=PCS, line=MP L, ref=2... (1 chars), warehouse=3, location=null
- K: ProductID=1137, Qty=24, date=Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time), unit=PCS, line=null, ref=G126... (9 chars), warehouse=3, location=null
- K: ProductID=769, Qty=0, date=Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time), unit=PCS, line=null, ref=G126... (9 chars), warehouse=3, location=null
- K: ProductID=1137, Qty=0, date=Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time), unit=PCS, line=null, ref=G126... (9 chars), warehouse=3, location=null
- K: ProductID=769, Qty=24, date=Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time), unit=PCS, line=null, ref=G126... (9 chars), warehouse=3, location=null
- K: ProductID=1137, Qty=48, date=Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time), unit=PCS, line=null, ref=G126... (9 chars), warehouse=3, location=null

## Transaction Dimensions

- JenisTransaksi: K (35076 rows)
- JenisTransaksi: D (5 rows)
- LineProduksi: NULL (35076 rows)
- LineProduksi: MP L (5 rows)
- Warehouse: 3 (35081 rows)

## Database Writers/References

- Referencing modules: 0
- Text/module references (including dynamic SQL candidates): 0
- No procedure was executed; definitions were metadata-only.

## JenisTransaksi Master Probe

- Matching BPI_JENISTRANS rows: 0
- No matching master definition found in BPI_JENISTRANS.

## RefNo Pattern Summary

| Type | Prefix | Max length | Rows |
|---|---|---:|---:|
| K | AP10 | 10 | 851 |
| K | AP11 | 10 | 771 |
| K | AP12 | 10 | 473 |
| K | AO10 | 10 | 253 |
| K | AO11 | 10 | 182 |
| K | A112 | 9 | 172 |
| K | A109 | 9 | 155 |
| K | AP25 | 9 | 155 |
| K | A100 | 9 | 146 |
| K | I106 | 9 | 145 |
| K | AP75 | 9 | 139 |
| K | AQ10 | 10 | 135 |
| K | A102 | 9 | 134 |
| K | AP57 | 9 | 134 |
| K | AP53 | 9 | 132 |
| K | AP73 | 9 | 131 |
| K | A425 | 8 | 128 |
| K | A308 | 8 | 126 |
| K | AP49 | 9 | 124 |
| K | A623 | 8 | 120 |
| K | AP76 | 9 | 118 |
| K | AO53 | 9 | 118 |
| K | A298 | 8 | 118 |
| K | AO12 | 10 | 114 |
| K | A116 | 9 | 113 |
| K | AP78 | 9 | 113 |
| K | AP43 | 9 | 112 |
| K | AP80 | 9 | 112 |
| K | A896 | 8 | 111 |
| K | A682 | 8 | 110 |

RefNo values are intentionally summarized; full document values are not persisted.

## Warehouse / Location / Line

| Type | Warehouse | Location | Line | Rows | Qty sum |
|---|---|---|---|---:|---:|
| K | 3 | NULL | NULL | 35076 | 2401378 |
| D | 3 | NULL | MP L | 5 | 30 |

## Hino Product Traces

- ProductID 1008: 1 bounded rows
  - Thu Jul 09 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=5 | unit=PCS | line=null | ref=Y817... (8 chars) | warehouse=3 | location=null
- ProductID 1009: 1 bounded rows
  - Wed Jun 17 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=10 | unit=PCS | line=null | ref=Y701... (8 chars) | warehouse=3 | location=null
- ProductID 1010: 7 bounded rows
  - Tue Mar 10 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=3 | unit=PCS | line=null | ref=Y275... (8 chars) | warehouse=3 | location=null
  - Wed Apr 15 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=3 | unit=PCS | line=null | ref=Y407... (8 chars) | warehouse=3 | location=null
  - Sat May 09 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=5 | unit=PCS | line=null | ref=Y515... (8 chars) | warehouse=3 | location=null
  - Wed Jun 17 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=10 | unit=PCS | line=null | ref=Y701... (8 chars) | warehouse=3 | location=null
  - Thu Jul 09 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=10 | unit=PCS | line=null | ref=Y817... (8 chars) | warehouse=3 | location=null
  - Fri Aug 14 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=5 | unit=PCS | line=null | ref=Y102... (9 chars) | warehouse=3 | location=null
  - Mon Sep 14 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=3 | unit=PCS | line=null | ref=Y117... (9 chars) | warehouse=3 | location=null
- ProductID 1011: 5 bounded rows
  - Tue Mar 10 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=5 | unit=PCS | line=null | ref=Y275... (8 chars) | warehouse=3 | location=null
  - Wed Apr 15 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=2 | unit=PCS | line=null | ref=Y407... (8 chars) | warehouse=3 | location=null
  - Sat May 09 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=2 | unit=PCS | line=null | ref=Y515... (8 chars) | warehouse=3 | location=null
  - Wed Jun 17 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=3 | unit=PCS | line=null | ref=Y701... (8 chars) | warehouse=3 | location=null
  - Thu Jul 09 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=3 | unit=PCS | line=null | ref=Y817... (8 chars) | warehouse=3 | location=null
- ProductID 1012: 7 bounded rows
  - Tue Mar 10 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=4 | unit=PCS | line=null | ref=Y275... (8 chars) | warehouse=3 | location=null
  - Wed Apr 15 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=2 | unit=PCS | line=null | ref=Y407... (8 chars) | warehouse=3 | location=null
  - Sat May 09 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=2 | unit=PCS | line=null | ref=Y515... (8 chars) | warehouse=3 | location=null
  - Wed Jun 17 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=5 | unit=PCS | line=null | ref=Y701... (8 chars) | warehouse=3 | location=null
  - Thu Jul 09 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=2 | unit=PCS | line=null | ref=Y817... (8 chars) | warehouse=3 | location=null
  - Fri Aug 14 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=2 | unit=PCS | line=null | ref=Y102... (9 chars) | warehouse=3 | location=null
  - Mon Sep 14 2026 07:00:00 GMT+0700 (Western Indonesia Time) | K | qty=2 | unit=PCS | line=null | ref=Y117... (9 chars) | warehouse=3 | location=null

## Sales Qty vs Delivery Qty

- Sales lines tested: 50
- Exact cumulative equal: 1
- Delivery lower than Sales: 0
- Delivery higher than Sales: 31
- No delivery candidate: 18
- Ambiguous delivery candidate: 0
- This is evidence only; no delivered/remaining formula is enabled.

## Classification Status

- Production receipt transaction type: NOT CONFIRMED.
- `Transaksi_Stok_Fg` remains a stock/FG transaction candidate until `JenisTransaksi` and writer semantics prove production completion.
- Safe label at this stage: FG transaction / stock movement, not Good Production Quantity.
- Production capability level: 0 pending confirmed actual output event.

## Evidence Decision

| JenisTransaksi | Internal classification | Direction | Confidence | Evidence |
|---|---|---|---|---|
| `D` | Incoming FG transaction candidate; not confirmed production receipt | likely FG_IN, but not promoted | PROBABLE | 5 rows, 30 PCS total, positive Qty, `MP L`, warehouse 3, bounded description `Masuk dari LineMP L` |
| `K` | Outgoing stock/event candidate | likely FG_OUT, but destination not confirmed | PROBABLE | 35,076 rows, no production line, bounded description `Keluar ke`, warehouse 3; Qty includes zero and no negatives |

`BPI_JENISTRANS` has no matching `D` or `K` master rows. No SQL module has an explicit or text reference to `Transaksi_Stok_Fg`, so the writer and source event are not discoverable from current database metadata. The bounded `RefNo` prefixes are operational-looking codes (for example summarized `A*`, `AP*`, `AO*`, `I*`, `G*`, `Y*` patterns), not proven Sales PO, delivery, planning, or production-order references.

## Cross-checks and Limitations

- All observed rows use warehouse `3` and null `Location`; this is consistent with a single stock area but does not prove that warehouse 3 is Finished Goods.
- Hino ProductID traces show repeated `K` movements over dates, while the five `D` rows are concentrated on one ProductID/date. This supports movement semantics but does not prove a production-completion event.
- Reject/good separation is not confirmed. Candidate reject sources include `ClaimRjk`, `DeliveryClaimRjk`, `ReplacementReject_*`, and `WMS_MatStockReject`, but no reliable ProductID-to-reject transaction bridge was established.
- `WMS_MAPPING_PART_DELIVERY_PRD` has ProductID and material/process-looking fields, but its text/numeric semantics and ProductID-to-`PURC_MATCATALOG.Materialid` bridge remain unconfirmed.
- `D` does not yet contribute to a proven `SumMatStock` ending-balance dependency.

## Production Receipt Result

- Found as a confirmed source: **NO**.
- Safe current label: FG transaction / probable FG receipt candidate.
- ActualProductionQty: **not defined**.
- Good Production Quantity: **not defined**.
- `get_production_output`: **not implemented** because the transaction type is not confirmed.
- Order-level production link: **not found**. Production intelligence, if later confirmed, is currently limited to product-level or product/date/line questions; it cannot be allocated to a Sales Order from this evidence.
