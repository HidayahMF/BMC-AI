# Downstream Semantic Validation

Read-only targeted inspection anchored to real Hino Sales ProductID/PartNumber references.

## dbo.WMSV_STOEndSumOwner

- Rows: 5889
- Columns: OwnerId (char), Materialid (char), Ending (numeric)
- Definition: CREATE VIEW dbo.WMSV_STOEndSumOwner AS SELECT OwnerId, Materialid, SUM(E) AS Ending FROM dbo.WMSV_STOEndTotal GROUP BY OwnerId, Materialid 

## dbo.SumMatStock

- Rows: 5544
- Columns: OwnerId (char), Materialid (char), MaterialName (varchar), Quantity (numeric), UoM (char), Stockid (char)
- Definition: CREATE VIEW dbo.SumMatStock AS SELECT wmv.OwnerId, wmv.Materialid, cat.MaterialName, wmv.Ending AS Quantity, cat.UoM, cat.Stockid FROM dbo.WMSV_STOEndSumOwner AS wmv INNER JOIN dbo.PURC_MATCATALOG AS cat ON wmv.Materialid = cat.Materialid WHERE (cat.InactiveMark = '1') AND (LEFT(cat.Materialid, 1) <> 'J') 

## dbo.WMS_MAPPING_PART_DELIVERY_PRD

- Rows: 92
- Columns: id (int), Line (varchar), Deliver (varchar), Produksi (varchar), Name (varchar), ProductId (varchar), RateDelivery (int), StokAwal (int), periodeBulan (varchar), periodeTahun (varchar), StokAkhir (int), Sumber (varchar), Proses1 (varchar), Proses2 (varchar), Proses3 (varchar), Last (varchar), CUST (varchar), NEED SUBC (varchar), MaterialIdRaw (varchar), MaterialIdSub (varchar)
- Definition: not a view or unavailable

## dbo.Transaksi_Stok_Fg

- Rows: 35063
- Columns: IdTransaksi (bigint), Tanggal (date), JenisTransaksi (varchar), Warehouse (varchar), Location (varchar), OwnerId (varchar), ProductId (varchar), KODE_CST (varchar), No_Prs (varchar), Qty (decimal), Satuan (varchar), LineProduksi (varchar), Keterangan (nvarchar), RefNo (varchar), CreatedBy (varchar), CreatedDate (datetime)
- Definition: not a view or unavailable

## dbo.PPC_TonProductTonFinish

- Rows: 259
- Columns: From (datetime), To (datetime), TonProducedP1 (float), TonProducedP2 (float), TonProducedP3 (float), TonProducedP4 (float), TonProducedP5 (float), TonProduceAM (int), TonFinishedP1 (float), TonFinishedP2 (float), TonFinishedP3 (float), TonFinishedP4 (float), TonFinishedP5 (float), TonFinishedAM (float), PrevDate (datetime)
- Definition: not a view or unavailable

## dbo.WMS_CASTING

- Rows: 430
- Columns: cataloging (varchar), kode_cst (varchar), stdRm (int), fifo (int)
- Definition: not a view or unavailable

## dbo.casting1

- Rows: 2205
- Columns: PART_NUMBER (varchar), KODE_PARTNAME (varchar), KODE_SOURCE (varchar), HARGA_BL (float), HARGA_JL (int), IDPRODUK_SPL (varchar), REFERENSI_CST (nvarchar), AREA_RW (varchar), AREA_WIP (varchar), AREA_FNS (varchar), BERAT_RAW (float), BERAT_FNS (float), NAMA_CST (varchar), SALDO_CST (float), STATUS (int), SOURCING (int), KATAGORY (int), SALDO_AWAL (float), DESIGN_CYLE (float), SALDO_KUMULATIF (float), KODE_CST (varchar), STDPLT_RM (int), STDPLT_FG (int), HARGA_MCH (float), fifo_rm (int), saldo_rm (float), AKTIF (bit), KODE_BMC (varchar), kd_ln (varchar), KODE_CUST (varchar), no_in_FG (float), no_out_FG (float), saldo_fg (float), foto (varchar), sld_wip (float), saldo_rjk (float), saldo_subcond (float), pack (int), saldo_subcont (float), minStokFG (float), minStokRM (float), maxStokFG (float), maxStokRM (float), maxStokWIP (float), stokBookingPrs (int), fotoFG (varchar), lastUpdate (varchar), subcont (int), paint (int), kardus (int), angkut (int), KODE_SP (varchar), pallet (varchar), sldPending (int), sldRmc (int)
- Definition: not a view or unavailable

## dbo.PR

- Rows: 50508
- Columns: PRID (int), PRType (int), PRNo (nvarchar), PRDate (date), SecID (nvarchar), ETA (date), Note (nvarchar), PIC (nvarchar), Toyota (bit), PRMachType (int), MachVendorId (int), PRforCustTypeId (int), Urgent (bit), Appdate (date), Appby (nvarchar), IDLama (int), JenisPR (int)
- Definition: not a view or unavailable

## dbo.PRDetail

- Rows: 194291
- Columns: PRDetailID (int), PRID (int), PRNo (nvarchar), MaterialID (int), Material Description (nvarchar), NRUnit (nvarchar), PRQty (int), Utilisation (nvarchar), Cancel? (bit), PettyCash (bit), Status (bit), ProductID (int), BudgetCode (nvarchar), SSPID (nvarchar), MaterialIDP4 (nvarchar), TglStatus (nvarchar), Status_PR (nvarchar), Note (nvarchar), No (nvarchar), Description (nvarchar), Pemutihan (bit)
- Definition: not a view or unavailable

## WMS Mapping Bounded Sample

- Rows inspected: 20
- Columns: id, Line, Deliver, Produksi, Name, ProductId, RateDelivery, StokAwal, periodeBulan, periodeTahun, StokAkhir, Sumber, Proses1, Proses2, Proses3, Last, CUST, NEED SUBC, MaterialIdRaw, MaterialIdSub
- Values omitted from documentation.

## Finished-Goods Candidate

- Transaksi_Stok_Fg matching Sales ProductID rows: 12836 of 12836
- This is stock/transaction evidence, not yet confirmed production output.
