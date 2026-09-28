# Business Link Validation

Read-only bounded validation. No production formula or database mutation is performed.

## Sales 50-Header Validation

- Headers tested: 50
- Customer matches: 50
- Headers with detail: 50
- Distinct bounded detail rows: 101
- Product matches: 101
- Distinct products: 37
- Relationship promotion target: CONFIRMED_BY_DATA only when no contradictory evidence is found.

## Hino Sales-to-Delivery Investigation

- Hino active customer key: MAS_CUSTOMER.CustId=5
- Sales detail rows sampled: 30
- Sales order SLS.09.2026.0001 / PO 1516/0218/SPO-MDT/IX/2026 / part BRACKET, FR S/ABS, UPR (E0220) | 48512-E0220: delivery candidates 0
- Sales order SLS.09.2026.0001 / PO 1516/0218/SPO-MDT/IX/2026 / part BRACKET FR S ABSORBER EWO10 -R | 48514-EWO10: delivery candidates 0
- Sales order SLS.09.2026.0001 / PO 1516/0218/SPO-MDT/IX/2026 / part BRACKET FR S ABSORBER EWO20-L | 48514-EWO20: delivery candidates 0
- Sales order SLS.09.2026.0001 / PO 1516/0218/SPO-MDT/IX/2026 / part COLLAR TRUNION EWO10 | S4957-EWO10: delivery candidates 0
- Sales order SLS.09.2026.0001 / PO 1545/0218/SPO-MDT/IX/2026 / part BRACKET, EXHAUST PIPE (BUMM) | 17455-EW230 (BUMM): delivery candidates 1
- Sales order SLS.09.2026.0001 / PO 1606/0218/SPO-MDT/IX/2026 / part CLAMP,TRUNION | S4953-EWO10: delivery candidates 0
- Sales order SLS.09.2026.0001 / PO 0218/MDT/IX/2026 / part BRACKET, EXHAUST PIPE (BUMM) | 17455-EW230 (BUMM): delivery candidates 5
- Sales order SLS.09.2026.0001 / PO 0218/MDT/IX/2026 / part COLLAR TRUNION EWO10 | S4957-EWO10: delivery candidates 5
- Sales order SLS.09.2026.0001 / PO 0218/MDT/IX/2026 / part HOOK, RR EW020 | 51965-EW020: delivery candidates 5
- Sales order SLS.09.2026.0001 / PO 0218/MDT/IX/2026 / part BRACKET FR S ABSORBER EWO20-L | 48514-EWO20: delivery candidates 5
- Hino Sales detail lines tested: 3321
- Hino lines with exact PO + ProductID delivery candidate: 3113
- Hino lines with PO delivery candidate: 3159
- Hino lines with ProductID delivery candidate: 3320
- Exact delivery match requires customer + PO or verified Sales reference + part consistency; date proximity alone is not accepted.

## Delivery Semantics Metadata

- Header columns: Id (int), Nomor (varchar), Dari (varchar), Tanggal (date), CustomerID (int), Jam (varchar), Shift (varchar), Kendaraan (varchar), Nama_Supir (varchar), NIP (varchar), status (varchar), inp_by (varchar), inp_date (datetime2), SalesType (varchar), DeliveryPlace (text), Approve_by (varchar), Approve_date (datetime2), Okb (varchar), StsPO (int), StsDNS (int), TerimaDate (datetime), Keterangan (text), kodeDelivery (int), PONo (varchar), Dn (varchar), StatusAR (int), ApproveDateAR (datetime), ApproveARBy (varchar), Reason (varchar), RejectBy (varchar), RejectDate (datetime)
- Detail columns: Id (int), HedId (int), SalesNomor (varchar), NoPO (varchar), ProductID (varchar), Qty (int), Sts (int), IdDetailPO (int), NoDNS (varchar), KodeProduksi (varchar), Dn (varchar), Lokasi (varchar), StdPallet (int), QtyCheck (int), TglCheckSecurity (datetime), lot (varchar)
- Confirmed structure: `SLS_DELIVERYORDER_HED_NEW.Id -> SLS_DELIVERYORDER_NEW.HedId`.
- Delivery business number/date candidates: header `Nomor`, `Tanggal`; `PONo` is customer PO candidate; detail `SalesNomor` is an unconfirmed Sales reference.

## Inventory

- Source: dbo.SumMatStock (VIEW)
- Columns: OwnerId (char), Materialid (char), MaterialName (varchar), Quantity (numeric), UoM (char), Stockid (char)
- View definition available: yes
- Quantity semantics: UNKNOWN until view/legacy/transaction evidence identifies whether it is on-hand, physical, available, or summary balance.
- Dimensions must remain grouped by OwnerId, Stockid, Materialid, and UoM.

- Definition summary: CREATE VIEW dbo.SumMatStock AS SELECT wmv.OwnerId, wmv.Materialid, cat.MaterialName, wmv.Ending AS Quantity, cat.UoM, cat.Stockid FROM dbo.WMSV_STOEndSumOwner AS wmv INNER JOIN dbo.PURC_MATCATALOG AS cat ON wmv.Materialid = cat.Materialid WHERE (cat.InactiveMark = '1') AND (LEFT(cat.Materialid, 1) <> 'J') 

## Sales-to-Material Bridge

- MAS_KATALOG_SALES columns: Id, Nomor, MODEL, JENIS, INACTIVE_MARK, MATERIALIDHED
- Material master candidates: MAS_MATERIAL: Kode, Description; PURC_MATCATALOG: Compcode, Materialid, MaterialJasa, MaterialType, MaterialGroup, MaterialSubGroup, UoM, Stockid, MaterialName, Specification, Brand, TypeModel, Leadtimedays, ROP, MinimalStock, MaximalStock, OrderLevel, DailyConsumtion, SafetyStock, ROQ, StockType, Remark, Executor, Photo, Movement, InactiveMark, inp_date, inp_by, upd_date, upd_by, MatIdOld, AccountCode, AccountGroup, Toleransi, Status, idRak, stdPallet, fifo_rm, kelompok, peminta
- Non-empty MATERIALIDHED samples: 0
- Direct MATERIALIDHED -> PURC_MATCATALOG.Materialid matches in bounded sample: 0
- Status: PROBABLE only until key format and business meaning are validated.

## Sales Part to Production/Material Bridge

- Sampled Sales parts: 50
- Exact casting1.PART_NUMBER matches: 0
- WMS mapping ProductId matches: 8
- WMS mapping material-field matches: 0
- PRDetail ProductID matches: 581
- PRDetail MaterialID matches: 0
- These are bridge candidates only; no production formula is enabled.

## Production-Like Objects

- casting1 (TABLE): 2205 rows; domain columns: PART_NUMBER, KODE_PARTNAME, KODE_CUST, lastUpdate
- hris_StrategicPlan (TABLE): 0 rows; domain columns: InputDate, Title_Plan, Desc_Plan, Title_Actual, Desc_Actual, StartDate, EndDate
- p2k3_nearmiss_finish (TABLE): 6 rows; domain columns: report_id, tanggal_selesai, updated_at
- PLAN_BULANAN (TABLE): 0 rows; domain columns: part_number, QTY_PLAN, tanggal_inp, kode_cust
- PPC_StockTake (TABLE): 0 rows; domain columns: STODate, STOLocationID, CreatedDate
- PPC_StockTake_Detail (TABLE): 0 rows; domain columns: STOProductID, STOQty
- PPC_TonProductTonFinish (TABLE): 259 rows; domain columns: PrevDate
- PRD_LINE (TABLE): 108 rows; domain columns: kode_cust
- PRDetail (TABLE): 194291 rows; domain columns: MaterialID, Material Description, NRUnit, PRQty, ProductID, MaterialIDP4
- PRODUKSI_CORE (TABLE): 0 rows; domain columns: BTNo
- PRODUKSI_FURNACE (TABLE): 7 rows; domain columns: none
- PRODUKSI_GROUP (TABLE): 6 rows; domain columns: none
- Produksi_Keputusan (TABLE): 6 rows; domain columns: none
- PRODUKSI_LOKASI (TABLE): 9 rows; domain columns: none
- PRODUKSI_MESIN (TABLE): 7 rows; domain columns: none
- PRODUKSI_MOULDING (TABLE): 0 rows; domain columns: Id_ProduksiMoulding, ProductId_BT, Produksi_MouldCamber, Mould_QtyPlan, Mould_QtyAct, CreatedDate, ModifDate, UpdateBy
- PRODUKSI_PLANING (TABLE): 0 rows; domain columns: IDPlaningProduksi, BTNo
- PRODUKSI_SHOOTBLAST (TABLE): 0 rows; domain columns: ProductId_BT, Shootblast_QtyAct, CreatedDate, ModifDate, UpdateBy
- PRODUKSI_SHOOTBLASTGROUP (TABLE): 11 rows; domain columns: none
- PRODUKSI_SHOOTBLASTMESIN (TABLE): 12 rows; domain columns: none
- PRODUKSI_TRIMING (TABLE): 0 rows; domain columns: ProductId_BT, Mould_QtyAct, Triming_QtyAct, CreatedDate, ModifDate, UpdateBy
- PRODUKSI_USER (TABLE): 32 rows; domain columns: CreatedDate
- PRODUKSI_USER_MAS_ROLE (TABLE): 3 rows; domain columns: none
- PRODUKSI_USER_ROLE (TABLE): 15 rows; domain columns: none
- PRODUKSI_USERMENU_DETIL (TABLE): 5 rows; domain columns: none
- PRODUKSI_USERMENU_HEAD (TABLE): 6 rows; domain columns: none
- WMS_CASTING (TABLE): 430 rows; domain columns: none
- WMS_LOKASI_CASTING (TABLE): 219 rows; domain columns: none
- WMS_MAPPING_PART_DELIVERY_PRD (TABLE): 92 rows; domain columns: ProductId, CUST, MaterialIdRaw, MaterialIdSub
- WMS_MatStockCasting (TABLE): 553 rows; domain columns: Ownerid, Materialid, Warehouse, Location, LastMonDate, LastBeginQty, LastReceiveQty, LastIssueQty, LastReturnQty, LastAdjustQty, LastMutationQty, LastRealocQty, LastWriteOffQty, LastMonQty

## Conclusion

- Sales Customer -> Header -> Detail -> Product: CONFIRMED_BY_DATA for the active source based on 50 headers, 101 detail rows, and 101 product matches.
- Sales -> Delivery: not confirmed without business-key match evidence.
- Inventory quantity: UNKNOWN.
- Production actual source and bridge: BLOCKED pending exact identifier match and semantic validation; populated-object discovery alone is insufficient.
