# Inventory Data Lineage

## Source

- Public source: `dbo.SumMatStock`
- Object type: **VIEW**
- Definition source: `dbo.WMSV_STOEndSumOwner` joined to `dbo.PURC_MATCATALOG`
- Formula exposed by view: `WMSV_STOEndSumOwner.Ending AS Quantity`

## Fields

- `OwnerId`: dimension, semantics not fully verified
- `Materialid`: material key, **CONFIRMED** for catalog-to-stock relationship
- `MaterialName`: catalog name
- `Quantity`: stored view output from `Ending`; source chain confirms this is an ending balance aggregation, not an available-stock calculation. Safe UI label: **Ending Stock / Saldo Stok**. Exact physical/on-hand business label remains **UNKNOWN**.
- `UoM`: unit field, source exists
- `Stockid`: stock/storage dimension, exact warehouse/location meaning **UNKNOWN**

`WMSV_STOEndSumOwner` computes `SUM(E) AS Ending` from `WMSV_STOEndTotal`, grouped by `OwnerId` and `Materialid`. The repository returns positions grouped by material, owner, stock, and UOM. It does not label the value `availableStock`, and it does not aggregate across dimensions.

## FG Transaction Cross-check

`Transaksi_Stok_Fg` is not substituted for `SumMatStock`. Its `Qty` values are transaction movements and must be classified by `JenisTransaksi` before any stock or production aggregation. Current evidence does not prove that `D` contributes directly to the `SumMatStock` ending-balance chain.
