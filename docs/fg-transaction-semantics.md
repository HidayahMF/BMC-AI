# FG Transaction Semantics

## Source

- Object: `dbo.Transaksi_Stok_Fg`
- Rows: 35,065
- Product key: `ProductId`
- Quantity: `Qty`
- Date: `Tanggal`, `CreatedDate`
- Unit: `Satuan`
- Warehouse: `Warehouse`
- Location: `Location`
- Production line: `LineProduksi`
- Reference: `RefNo`
- Event description: `Keterangan`

## JenisTransaksi

| Value | Rows | Date coverage | Qty sign | Evidence-based interpretation | Confidence |
|---|---:|---|---|---|---|
| `D` | 5 | April 2026 | positive only | Incoming movement from `LineMP L`; likely FG receipt candidate | PROBABLE |
| `K` | 35,060 | March-September 2026 | positive only | Description pattern `Keluar ke`; outgoing stock/event candidate | PROBABLE |

The values are not treated as generic database codes without evidence. No master mapping or writer module was found in SQL dependency metadata.

## D Candidate Evidence

All bounded `D` samples showed:

- positive `Qty`
- `Satuan=PCS`
- `LineProduksi=MP L`
- `Warehouse=3`
- description containing `Masuk dari LineMP L`
- ProductID present

This is sufficient to classify `D` as a **PROBABLE FG receipt from a production line**, but not as confirmed Good Production Output.

## K Candidate Evidence

Bounded `K` samples showed:

- positive `Qty`
- `LineProduksi=NULL`
- `Warehouse=3`
- description containing `Keluar ke`

`K` is a **PROBABLE outgoing stock/event movement**. Its destination and relation to Delivery are not confirmed.

## RefNo and Dependencies

- RefNo patterns were inspected in bounded samples.
- No SQL Server procedure/view/trigger dependency referencing `Transaksi_Stok_Fg` was returned.
- RefNo did not directly resolve in the tested new Sales or Delivery reference fields.

## Production Decision

- Production receipt candidate: `JenisTransaksi=D`
- Product key: `ProductId`
- Quantity candidate: `Qty`
- Unit candidate: `Satuan`
- Date candidate: `Tanggal`
- Line candidate: `LineProduksi`
- Status: **PROBABLE**, not `CONFIRMED_BY_DATA`
- Good output quantity: **UNKNOWN**
- Reject separation: **UNKNOWN**

No production progress, remaining, achievement, or ETA formula is implemented.
