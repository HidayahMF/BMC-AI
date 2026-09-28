# Production Data Lineage

Dynamic read-only discovery of production-like tables/views. No production metric or formula is enabled.

## Objects

| Object | Type | Rows | Domain columns |
|---|---|---:|---|
| dbo.FINV_MONITOR_LISTINVOICE | VIEW | 600077 | IS_POSTING (int), CustomerName (nvarchar), Invoice_date (date), Received_date (date), CustomerId (int), Due_date (date), PONo (varchar), BTNo (varchar), ProductDescription (nvarchar), Qty (decimal) |
| dbo.WMS_QTY_TRANSAKSI | VIEW | 440174 | TANGGAL (datetime), DepartID (char), NamaDepartemen (char), MaterialName (varchar), UoM (char) |
| dbo.PODetail | TABLE | 271738 | PODetailID (int), PONo (nvarchar), POQty (float), Unit Price (money), Unit Price-old (money), POId (int), POType (nvarchar) |
| dbo.inc_rm | TABLE | 241885 | no_po (varchar), qty_po (int), qty_awal (int), qty_dtg (int), qty_sply (int), qty_akhir (int), qty_rtr (int) |
| dbo.TRANS1 | TABLE | 230373 | TANGGAL (datetime), ORDERS (nchar), TGL_UPDATE (datetime), UPDATE_BY (char), BATCH_DATE (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime), leaderApprovedDate (datetime) |
| dbo.belicst | TABLE | 211286 | NO_PO (varchar), QTY_AWAL (int), QTY_BL (float), qty_sply (int), QTY_AKHIR (int), POSTING_CST (tinyint), NoPOL (varchar), QTY_KIRIM (int) |
| dbo.DTRANS_CLOSING | TABLE | 207073 | voucher_date (datetime), po_no (nvarchar) |
| dbo.WMSV_MIS | VIEW | 205856 | TANGGAL (datetime) |
| dbo.PRDetail | TABLE | 194291 | MaterialID (int), Material Description (nvarchar), NRUnit (nvarchar), PRQty (int), ProductID (int), MaterialIDP4 (nvarchar) |
| dbo.DTRANS_BA_R1 | TABLE | 191201 | voucher_date (datetime), po_no (nvarchar) |
| dbo.belicst2 | TABLE | 190548 | NO_PO (varchar), QTY_AWAL (float), QTY_BL (real), qty_sply (int), QTY_AKHIR (float), POSTING_CST (tinyint), NoPOL (varchar), QTY_KIRIM (int) |
| dbo.MATERIAL_PESAN | TABLE | 190476 | TANGGAL (datetime), IDMATERIAL (char), QTY (decimal), UNIT (char), CUSTOMER (char) |
| dbo.belicst4 | TABLE | 190021 | NO_PO (varchar), QTY_AWAL (int), QTY_BL (float), qty_sply (int), QTY_AKHIR (int), POSTING_CST (tinyint), NoPOL (varchar), QTY_KIRIM (int) |
| dbo.inc_rm_backup2 | TABLE | 185084 | no_po (varchar), qty_po (int), qty_awal (int), qty_dtg (int), qty_sply (int), qty_akhir (int), qty_rtr (int) |
| dbo.inc_rm_backup | TABLE | 184106 | no_po (varchar), qty_po (int), qty_awal (int), qty_dtg (int), qty_sply (int), qty_akhir (int), qty_rtr (int) |
| dbo.SupplyFng | TABLE | 175288 | QTY_FNG (float), POSTING_FNG (tinyint), qty_isi_palet (float) |
| dbo.trial_ba_detail | VIEW | 156638 | Date (datetime) |
| dbo.WMSV_SCUnion | VIEW | 150928 | TANGGAL (datetime) |
| dbo.WMSV_SC3 | VIEW | 126458 | TANGGAL (datetime) |
| dbo.FINV_MONITOR_LISTDELIVERY | VIEW | 119199 | CustId (int), CustomerName (nvarchar), Tanggal (date), TerimaDate (datetime), NoPO (varchar), ProductID (varchar), Part_Description (varchar), Part_Number (nvarchar), UnitPrice (numeric), Qty (int) |
| dbo.dataDetailCheckSheet | TABLE | 115464 | date (datetime) |
| dbo.belicst3 | TABLE | 106718 | NO_PO (nvarchar), QTY_AWAL (float), QTY_BL (float), qty_sply (int), QTY_AKHIR (float), POSTING_CST (tinyint), NoPOL (nvarchar), QTY_KIRIM (int) |
| dbo.WMS_AMOUNT_TRANSAKSI | VIEW | 102867 | TANGGAL (datetime), MaterialId (char), MaterialGroup (char), MaterialName (varchar), UoM (char), DepartID (char), NamaDepartemen (char), UnitPrice (decimal) |
| dbo.Transaksi_Stok | TABLE | 96645 | Tanggal (date), MaterialId (varchar), Qty (decimal), Satuan (varchar), CreatedDate (datetime), IS_POSTING (int), qty_rmc (int), qty_rcs (int) |
| dbo.PURCV_RFBID | VIEW | 94526 | BidDate (datetime), MaterialId (char), Quantity (numeric), UoM (char), UnitPrice (numeric) |
| dbo.PURCV_POSTS | VIEW | 68743 | PONo (char), PODate (datetime), ETADate (datetime), MaterialId (char), MaterialName (varchar), UoM (char), UnitPrice (numeric), POQTY (numeric), POStatus (varchar) |
| dbo.selisih_inventory | VIEW | 58700 | DepartID (char), NamaDepartemen (char), MaterialId (char), MaterialName (varchar), STATUSQTY (numeric) |
| dbo.HTRANS_BA_R1 | TABLE | 50529 | voucher_date (datetime), User_posting (varchar), Date_posting (datetime) |
| dbo.PR | TABLE | 50508 | PRDate (date), PRforCustTypeId (int), Appdate (date) |
| dbo.ACCV_JurnalPembelian | VIEW | 48940 | Posisi (int), PO (varchar), MaterialId (char), IS_POSTING (int) |
| dbo.ClaimRjk | TABLE | 47011 | POSTING_CST (varchar), KODE_CUST (varchar), QTY_SBLAST (float), QTY_GYG (int), QTY_MCH (int), QTY_trial (int), qty_retur (int), NO_PO (varchar) |
| dbo.DTRANS_BA_R1_B | TABLE | 43929 | voucher_date (datetime), po_no (nvarchar) |
| dbo.PURCH_MRP | TABLE | 37917 | DepartId (varchar), MRPDate (varchar), MaterialId (nchar), Qty (numeric), UoM (char), Status_Date (datetime), Inp_date (datetime), Approval_Date (datetime), ApprovalMgr_Date (datetime), ApprovalGhFa_Date (datetime), ApprovalIc_Date (datetime), ApprovalProc_Date (datetime), ApprovalDirektur_Date (datetime), ApprovalCfo_Date (datetime), ApprovalPresdir_Date (datetime), MRPDateAkhir (varchar), Upd_date (datetime), Approval_ghDate (datetime), Approval_dhDate (datetime), Approval_shDate (datetime) |
| dbo.PURCV_BP_PR | VIEW | 35663 | MaterialId (nvarchar), MaterialName (varchar), UoM (char), QTYBP (numeric), DepartId (varchar), MonthDate (varchar), PRReceivedDate (datetime), QtyPr (numeric) |
| dbo.PURCV_TRANS_UNION | VIEW | 35265 | TANGGAL (datetime) |
| dbo.Transaksi_Stok_Fg | TABLE | 35060 | Tanggal (date), ProductId (varchar), Qty (decimal), Satuan (varchar), CreatedDate (datetime) |
| dbo.WMSV_StoGdLkOwKt | VIEW | 34979 | Materialid (char), BeginQty (numeric) |
| dbo.WMSV_SGLOK_SUM | VIEW | 33850 | Materialid (char) |
| dbo.FIN_INVOICE | TABLE | 32768 | ProductId (int), Qty (decimal), PONo (varchar), TanggalTerima (date), Satuan (varchar) |
| dbo.FINV_DETAIL_DO | VIEW | 32656 | Part_Description (varchar), Part_Number (nvarchar), Qty (int) |
| dbo.SLS_DELIVERYORDER_NEW | TABLE | 32656 | NoPO (varchar), ProductID (varchar), Qty (int), IdDetailPO (int), QtyCheck (int) |
| dbo.WMSV_RAW_UNION | VIEW | 30573 | Materialid (varchar), LastMonDate (datetime) |
| dbo.FINV_AR_SALES | VIEW | 30495 | invoice_date (date), po_no (nvarchar), IS_POSTING (int), btno (varchar), productDescription (nvarchar) |
| dbo.FINV_APBILL2 | VIEW | 28866 | tanggal (date), IS_POSTING (int) |
| dbo.vw_sls_order | VIEW | 28766 | CustomerId (int), Invoice_date (date), Due_date (date), CustID (nvarchar), CustomerName (nvarchar), po_no (nvarchar), IS_POSTING (int), btno (varchar), Part_Description (varchar), productDescription (varchar), Qty (decimal) |
| dbo.SLS_SALESORDER_NEW | TABLE | 28594 | ProductID (varchar), Qty (int), UnitPrice (decimal), PartNumber (varchar), PODelFrom (date), PODelTo (date) |
| dbo.SumMatStock2 | VIEW | 28522 | Materialid (char), MaterialName (varchar), Quantity (numeric), UoM (char) |
| dbo.acc_movement_stock | TABLE | 28320 | saldo_awal_qty (decimal), beli_qty (decimal), pakai_qty (decimal), retur_qty (decimal), adj_qty (decimal), saldo_akhir_qty (decimal), date_by (datetime) |
| dbo.WMS_MatStockBMC | TABLE | 27995 | Materialid (varchar), LastMonDate (datetime), LastBeginQty (numeric), LastReceiveQty (numeric), LastIssueQty (numeric), LastReturnQty (numeric), LastAdjustQty (numeric), LastMutationQty (numeric), LastRealocQty (numeric), LastWriteOffQty (numeric), LastSubconQty (numeric), LastMonQty (numeric), kelompok (int) |
| dbo.vw_sls_order1 | VIEW | 27793 | CustomerId (int), Invoice_date (date), Due_date (date), CustID (nvarchar), CustomerName (nvarchar), po_no (nvarchar), IS_POSTING (int), btno (varchar), Part_Description (varchar), productDescription (varchar), Qty (decimal) |
| dbo.PURCV_DETRECEIVE | VIEW | 24683 | PONo (char), TANGGAL (datetime), MaterialName (varchar), Materialid (char), duedate (datetime) |
| dbo.PURC_MATCATALOG | TABLE | 24550 | Materialid (char), MaterialJasa (char), MaterialType (char), MaterialGroup (char), MaterialSubGroup (char), UoM (char), MaterialName (varchar), OrderLevel (numeric), inp_date (datetime), upd_date (datetime), kelompok (int) |
| dbo.vw_trans1_Debet_gabungan | VIEW | 24496 | UoM (char), TANGGAL (datetime), Quantity (numeric), unitprice (numeric) |
| dbo.ACCV_MRSAtPeriod | VIEW | 24472 | IS_POSTING (int) |
| dbo.ACCV_JurnBeliDebet | VIEW | 24470 | PO (char) |
| dbo.ACCV_JurnBeliKredit | VIEW | 24470 | PO (char) |
| dbo.ACCV_MRSAPSrcJurnal | VIEW | 24470 | IS_POSTING (int) |
| dbo.PURC_RFQMATERIAL | TABLE | 23312 | MaterialId (char), Qty (numeric) |
| dbo.WMSV_MRS | VIEW | 23293 | TANGGAL (datetime), MaterialName (varchar), UoM (char), NamaDepartemen (char) |
| dbo.PreRawAttendance | TABLE | 22086 | eventDate (varchar), tr_date (datetime) |
| dbo.DCARBURIZIG | TABLE | 21618 | POSTING_CST (bit), QTY (float), NO_PO (varchar) |
| dbo.WMS_FIFO_RM | TABLE | 21068 | po (varchar), qty (int), QtySply (int) |
| dbo.WMS_MatStock | TABLE | 20469 | Materialid (char), LastMonDate (smalldatetime), LastBeginQty (decimal), LastReceiveQty (decimal), LastIssueQty (decimal), LastReturnQty (decimal), LastAdjustQty (decimal), LastMutationQty (decimal), LastRealocQty (decimal), LastWriteOffQty (decimal), LastMonQty (decimal) |
| dbo.WMSV_StockMaterial | VIEW | 20406 | Materialid (char), MaterialName (varchar), BeginQty (numeric), UoM (char) |
| dbo.WMS_MatStockLawas | TABLE | 20373 | Materialid (char), LastMonDate (smalldatetime), LastBeginQty (decimal), LastReceiveQty (decimal), LastIssueQty (decimal), LastReturnQty (decimal), LastAdjustQty (decimal), LastMutationQty (decimal), LastRealocQty (decimal), LastWriteOffQty (decimal), LastMonQty (decimal) |
| dbo.StockPerLocation | VIEW | 20091 | Materialid (char), MaterialName (varchar), BeginQty (decimal), UoM (char) |
| dbo.WMS_INCOMING_BRAKEASSY_MAT | TABLE | 19750 | PART_NUMBER (varchar), MATERIAL_ID (varchar), QTY_MSK (decimal), QTY_VERIFIED (decimal), UPDATE_AT (datetime), UPDATE_BY (varchar), VERIFDATE (datetime) |
| dbo.FINV_APBILL | VIEW | 18952 | tanggal (date), IS_POSTING (int), materialName (nvarchar), UoM (varchar), NoPO (varchar), TanggalFakturPajak (date) |
| dbo.POV | TABLE | 18779 | POId (int), PONo (nvarchar), Date (datetime), POTypeId (tinyint), CreateDate (datetime), ApproveDate (datetime) |
| dbo.ACCV_MRSAtPeriod2 | VIEW | 18765 | IS_POSTING (int) |
| dbo.PURC_BIDCOMPARE | TABLE | 18321 | MaterialId (char), Quantity (numeric), UoM (char), UnitPrice (numeric), UoMTime (char) |
| dbo.PURCV_BID_COMPARE | VIEW | 18321 | MaterialId (char), Quantity (numeric), UoM (char), UoMTime (char), UnitPrice_undisc (numeric), UnitPrice (numeric) |
| dbo.WMSV_SC2 | VIEW | 17905 | TANGGAL (datetime) |
| dbo.dataHeaderCheckSheet | TABLE | 17156 | part_number (text) |
| dbo.PURC_QUOTATION | TABLE | 16327 | MaterialId (char), Quantity (numeric), UoM (char), UnitPrice (numeric), UoMTime (char), inp_date (datetime), upd_date (datetime) |
| dbo.PURC_PURCHREQUEST_TEMP | TABLE | 15631 | MaterialId (nchar), MaterialName (varchar), Qty (numeric), UoM (char), Purpose (varchar), DepartAloc (char), Approval_Date (nchar), AppDate (datetime), CDate (datetime), Purpose_Date (datetime), Approval_ghdate (nchar), Approval_Dhdate (nchar), Approval_Icdate (nchar), Approval_ProcDate (datetime) |
| dbo.BPI_MR | TABLE | 15542 | TGL_PO (datetime), SATUAN (char), QTY (numeric), ORDERS (char), PO_INDUK (char) |
| dbo.PURCV_UNION_HIST_PO | VIEW | 14712 | PONo (varchar), PODate (datetime), MaterialId (varchar), MaterialName (varchar), Quantity (varchar), UoM (varchar) |
| dbo.MATERIAL_NAME | TABLE | 14410 | MaterialID (int), Material Name (nvarchar), Material Group (nvarchar), Unit (nvarchar) |
| dbo.SLS_DELIVERYORDER_HED_NEW | TABLE | 13695 | Tanggal (date), CustomerID (int), inp_date (datetime2), Approve_date (datetime2), StsPO (int), TerimaDate (datetime), PONo (varchar), ApproveDateAR (datetime), RejectDate (datetime) |
| dbo.PURC_PURCHASE_REQUEST | TABLE | 13256 | MaterialId (char), ImportLocal (char), Purpose (varchar), Qty (numeric), UoM (char), EstUnitPrice (numeric), ExpDeliveryDate (datetime), HoldDate (datetime), CancelDate (datetime), PRReceivedDate (datetime), inp_date (datetime), upd_date (datetime) |
| dbo.PURCV_DETIL | VIEW | 13101 | PRDate (datetime), MaterialName (varchar), MaterialId (char), ImportLocal (char), Purpose (varchar), Qty (numeric), UoM (char), EstUnitPrice (numeric), ExpDeliveryDate (datetime), CancelDate (datetime), PRReceivedDate (datetime), NamaDepartemen (char) |
| dbo.WMSV_STO0110 | VIEW | 12990 | Materialid (varchar), BeginQty (numeric) |
| dbo.PO_JOIN_ACCESS | VIEW | 12838 | PRReceivedDate (datetime), BidDate (datetime), PONo (nvarchar), PODate (datetime), MaterialId (nvarchar), MaterialName (nvarchar), PoQty (float) |
| dbo.PURCV_VENDOR_SUPPLIES | VIEW | 12833 | MaterialId (char) |
| dbo.PURC_PURCHASE_ORDER | TABLE | 12818 | PONo (char), MaterialId (char), Quantity (numeric), UoM (char), UnitPrice (numeric), HoldDate (datetime), CancelDate (datetime), PO_Delivery_Actual_Qty (numeric), PO_Delivery_Status (int), PO_Delivery_Note (nvarchar), Senddate (datetime), inp_date (datetime), upd_date (datetime) |
| dbo.PURCV_HARGAPO | VIEW | 12818 | PONo (char), MaterialId (char), AmountPO (numeric), Quantity (numeric), TOTALPO (numeric) |
| dbo.WMS_PO_MATERIAL | VIEW | 12794 | PONo (char), TOTAL_QTY (numeric), MaterialId (char), LAST_DATE_MRS (datetime) |
| dbo.PURC_BIDPR | TABLE | 12789 | MaterialId (char), Quantity (numeric), UoM (char), PO_Status (int) |
| dbo.PURCV_DASH_ACT | VIEW | 11774 | ImportLocal (numeric), BidDate (datetime), AppDate (nvarchar), TGL_PO (datetime), POKIRIM (datetime), SATUAN (char), QTY (numeric) |
| dbo.PURCV_PO_BARANG | VIEW | 11774 | BidDate (datetime), AppDate (nvarchar), TGL_PO (datetime), POKIRIM (datetime), ETADate (datetime), SATUAN (char), QTY (numeric) |
| dbo.WMSV_MRS_0821Up | VIEW | 11270 | TANGGAL (datetime) |
| dbo.mst_pallet_standard_history | TABLE | 10369 | MaterialId (varchar), StandardQty (int), SnapshotDate (date), ApprovedDate (datetime), CreatedDate (datetime), ModifiedDate (datetime) |
| dbo.SLS_DELIVERYORDER | TABLE | 10153 | NoPO (varchar), ProductID (varchar), Qty (int) |
| dbo.FINV_GETSelisihInventory | VIEW | 9786 | DepartID (char), NamaDepartemen (char), MaterialId (char), MaterialName (varchar), STATUSQTY (numeric), Qty (numeric) |
| dbo.SLS_SALESORDER_HED_NEW_BACKUP_ORPHAN | TABLE | 9758 | PONo (varchar), PODate (date), CustomerID (int), inp_date (datetime2), approval_date (datetime), StsPono (int), approvalppic_date (datetime) |
| dbo.hris_Leave_Prop_Detail | TABLE | 9295 | ProposeDate (datetime), ActualDate (datetime), UpdDate (datetime) |
| dbo.PURCV_HIST_LASTPO | VIEW | 8695 | POId (int), PONo (varchar), Date (datetime), MaterialId (int), MaterialName (varchar), UnitPrice (varchar), Unit (varchar), POQty (varchar) |
| dbo.acc_movement_stock-a | TABLE | 8499 | saldo_awal_qty (decimal), beli_qty (decimal), pakai_qty (decimal), retur_qty (decimal), adj_qty (decimal), saldo_akhir_qty (decimal), date_by (datetime) |
| dbo.PURC_RFQUOTAION | TABLE | 8410 | RFQDate (datetime), DueDate (datetime) |
| dbo.SLS_SALESORDER_HED_NEW | TABLE | 8092 | PONo (varchar), PODate (date), CustomerID (int), inp_date (datetime2), approval_date (datetime), StsPono (int), approvalppic_date (datetime) |
| dbo.MAS_MAPPINGMATERIAL | TABLE | 7858 | DepartId (varchar), MaterialId (varchar) |
| dbo.DTRANS_BA_R1_1 | TABLE | 7598 | voucher_date (datetime), po_no (nvarchar) |
| dbo.hris_Leave_Prop | TABLE | 7277 | InpDate (datetime) |
| dbo.PURC_QUOTATIONHED | TABLE | 7050 | QuotationDate (datetime), UoMTime (char), ValidUntilDate (datetime) |
| dbo.PURCV_PO_MAT | VIEW | 6861 | Point (int), duedate (datetime), PO_Delivery_Note (nvarchar), PONo (char), PODate (datetime), TANGGAL (datetime), UoMTime (char), Materialid (char), MaterialName (varchar), Quantity (numeric), UoM (char) |
| dbo.FINV_INVOICE_PRICE_CUST | VIEW | 6335 | Invoice_date (date), CustomerName (nvarchar), Part_Description (varchar), QTY (decimal) |
| dbo.WMSV_STO0110Sum | VIEW | 5889 | Materialid (varchar) |
| dbo.WMSV_STOEndSumOwner | VIEW | 5889 | Materialid (char) |
| dbo.WMSV_STOEndTotal | VIEW | 5889 | Materialid (char) |
| dbo.WMSV_STOEndingInfo | VIEW | 5885 | Materialid (char), NamaDepartemen (char), UoM (char), MaterialName (varchar) |
| dbo.SLS_DELIVERYORDER_HED | TABLE | 5839 | Tanggal (date), CustomerID (int), inp_date (datetime), approval_date (datetime), StsPO (char) |
| dbo.hris_Approval | TABLE | 5746 | UpdDate (datetime) |
| dbo.FINV_LBH | VIEW | 5563 | Tanggal (date) |
| dbo.SumMatStock | VIEW | 5544 | Materialid (char), MaterialName (varchar), Quantity (numeric), UoM (char) |
| dbo.WMSV_STO0110_INFO | VIEW | 5544 | NamaDepartemen (char), UoM (char), MaterialName (varchar), Materialid (char), BeginQty (decimal) |
| dbo.FINV_VATIn | VIEW | 5427 | Tanggal (date) |
| dbo.FIN_PEMBAYARAN | TABLE | 5419 | NoPO (varchar), Tanggal (date), Update_by (varchar), Update_date (datetime) |
| dbo.FINV_PAYMENT_DETAIL_UNION | VIEW | 5414 | NoPO (varchar), NamaDepartemen (varchar) |
| dbo.e_skk_answer | TABLE | 5407 | date (datetime2) |
| dbo.FINV_LISTAPPROVE_TT | VIEW | 5231 | IsVendorPO (int), Tanggal (date), DepartId (varchar), IS_POSTING (int) |
| dbo.FIN_TANDATERIMA_DOC | TABLE | 5230 | Tanggal (date), IsVendorPO (int), DueDate (date), ApproveDate (datetime), IS_POSTING (int), USer_posting (varchar), Date_posting (datetime), DepartId (varchar) |
| dbo.FIN_TANDATERIMA_HED | TABLE | 5225 | TanggalFakturPajak (date), NoPO (varchar), POSPK (varchar), inp_date (datetime), ReleaseDate (datetime), IS_POSTING (int), USer_posting (varchar), Date_posting (datetime) |
| dbo.FINV_FAKTUR_LIST | VIEW | 5221 | NomorTandaTerima (varchar), NoPO (varchar) |
| dbo.PURC_PO_JENIS | TABLE | 5042 | PONo (varchar) |
| dbo.FIN_PEMBAYARAN_BDV | TABLE | 5004 | NoPO (varchar), Tanggal (date), Update_by (varchar), Update_date (datetime) |
| dbo.FINV_BDV_PAYMENT_OPEN | VIEW | 4946 | NoPO (varchar), Tanggal (date), TandaTerimaPPN (int), TandaTerimaPPH (int), NamaDepartemen (char), IDDepartemen (varchar), NomorTandaTerima (nvarchar) |
| dbo.FINV_BDV_PAYMENT_OPEN2 | VIEW | 4946 | NoPO (varchar), Tanggal (date), TandaTerimaPPN (int), TandaTerimaPPH (int), NamaDepartemen (char), IDDepartemen (varchar), NomorTandaTerima (nvarchar) |
| dbo.FINV_BDV_PAYMENT_OPEN4 | VIEW | 4946 | NoPO (varchar), Tanggal (date), TandaTerimaPPN (int), TandaTerimaPPH (int), NamaDepartemen (char), IDDepartemen (varchar), NomorTandaTerima (nvarchar) |
| dbo.FIN_PEMBAYARAN_BDV_HED | TABLE | 4937 | inp_date (datetime) |
| dbo.AP_FAKTUR | VIEW | 4911 | Tanggal (date), DueDate (date) |
| dbo.PURCV_OUT_MR | VIEW | 4860 | MaterialId (char), MaterialName (varchar), MaterialType (char), MaterialGroup (char), MaterialSubGroup (char) |
| dbo.Operator_Melting | TABLE | 4790 | Id_ProduksiMesin (varchar), ProductId_BT (varchar), Tanggal (datetime), CreatedDate (datetime), UpdateBy (varchar), UpdateDate (datetime) |
| dbo.PURC_PURCH_ORDER_HED | TABLE | 4700 | PONo (char), ImportLocal (numeric), PODate (datetime), ETADate (datetime), UoMTime (char), PoStatus (int), PO_Delivery_Status (nchar), UpdDate (datetime) |
| dbo.PURC_BIDCOMPAREHED | TABLE | 4681 | BidDate (datetime), AppDate (nvarchar), DocSupport (nvarchar) |
| dbo.PURCV_BANK_PRICE | VIEW | 4590 | MaterialId (char), MaterialName (varchar) |
| dbo.WMS_MatStock2026 | TABLE | 4536 | Materialid (char), LastMonDate (smalldatetime), LastBeginQty (decimal), LastReceiveQty (decimal), LastIssueQty (decimal), LastReturnQty (decimal), LastAdjustQty (decimal), LastMutationQty (decimal), LastRealocQty (decimal), LastWriteOffQty (decimal), LastMonQty (decimal) |
| dbo.APAGING_PEMB_D01_ListPemb | VIEW | 4512 | Tanggal (date), IS_POSTING (int) |
| dbo.APAGING_PEMB_D02_D01_SumBayar | VIEW | 4500 | Posted (int) |
| dbo.PURCV_HEAD | VIEW | 4290 | PRDate (datetime), NamaDepartemen (char), PRReceivedDate (datetime) |
| dbo.WMS_MatStockBAP | TABLE | 4261 | Materialid (varchar), LastMonDate (datetime), LastBeginQty (numeric), LastReceiveQty (numeric), LastIssueQty (numeric), LastReturnQty (numeric), LastAdjustQty (numeric), LastMutationQty (numeric), LastRealocQty (numeric), LastWriteOffQty (numeric), LastSubconQty (numeric), LastMonQty (numeric) |
| dbo.WMSV_SC1 | VIEW | 4261 | Materialid (varchar), LastMonDate (datetime), LastMonQty (numeric) |
| dbo.PROJ_WorkDay | TABLE | 4108 | ProjDate (datetime) |
| dbo.WMSV_SC7 | VIEW | 4076 | Tanggal (date) |
| dbo.PURC_PURCHREQUEST_HED | TABLE | 4072 | PRDate (datetime), DepartAloc (char) |
| dbo.BDVV_ListDtlTdTrmPO | VIEW | 3665 | IsVendorPO (int), NoPO (varchar) |
| dbo.ACC_MapDivCatAccountBiaya | TABLE | 3629 | MaterialId (nvarchar), Update_Date (datetime), UpdateBy (varchar) |
| dbo.TABEL_BANTU2 | TABLE | 3571 | MaterialId (varchar) |
| dbo.FIN_PEMBAYARAN_HED | TABLE | 3132 | Tanggal (date), inp_date (datetime), ApproveDate (datetime), DateClose (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime) |
| dbo.FINV_PAYMENT | VIEW | 3130 | Tanggal (date) |
| dbo.vw_hris_Leave_Transaction | VIEW | 2994 | InpDate (date), DateProp (nvarchar) |
| dbo.PURCH_MRP_TOTAL_GROUPNAME | TABLE | 2929 | DepartID (varchar) |
| dbo.asset_2018 | TABLE | 2852 | Nama_actual (varchar), NO_PO (varchar), tgl_disposal (varchar), alasan_disposal (varchar), tgl_update (varchar) |
| dbo.AP_LIST_FAKTUR | VIEW | 2836 | NoPO (varchar), Tanggal (date), DueDate (date) |
| dbo.ACC_MapDivCatAccountBiaya__ | TABLE | 2670 | MaterialId (nvarchar), Update_Date (datetime), UpdateBy (varchar) |
| dbo.FIN_PEMBAYARAN_BDV_DOC | TABLE | 2527 | Tanggal (date), inp_date (datetime), checked_date (datetime), reviewed_date (datetime), approved_date (datetime) |
| dbo.FIN_PEMBV_PO_ADVANCE | VIEW | 2278 | NoPO (char), AmountPO (numeric) |
| dbo.casting1 | TABLE | 2205 | PART_NUMBER (varchar), KODE_PARTNAME (varchar), KODE_CUST (varchar), lastUpdate (varchar) |
| dbo.FINV_INVOICELIST | VIEW | 2107 | CustId (int), PO_No (varchar) |
| dbo.WMS_StockAwalG | TABLE | 1948 | Material Name (nvarchar), Unit (nvarchar), PrevStockQty (float), Rec Qty (float), Issue Qty (float), CurrStockQty (float) |
| dbo.PURC_PRICE_PO_ACCES | TABLE | 1879 | POId (int), PONo (varchar), Date (date), MaterialId (int), MaterialName (varchar), UnitPrice (varchar), unit (varchar), poqty (varchar) |
| dbo.PURC_HISTORY_BID | TABLE | 1844 | MaterialId (char) |
| dbo.MAS_KATALOG_HARGA | TABLE | 1826 | CustId (nvarchar) |
| dbo.WMS_BRAKEASSY_INCOMING_MMO_DETAIL | TABLE | 1818 | PART_NUMBER (varchar), QTY (int), PART_NUMBER_INDUK (varchar), QTY_ALLOCATION (varchar) |
| dbo.hris_EmployeeTraining | TABLE | 1749 | StartDate (datetime), EndDate (datetime) |
| dbo.WMSV_STO_RAWMAT | VIEW | 1710 | Materialid (varchar), BeginQty (decimal) |
| dbo.Product Main Data | TABLE | 1671 | Product ID (int), Product Description (nvarchar), Product No (nvarchar), Machined Weight (real), Machined Weightold (real) |
| dbo.PURC_BIDCOMPARE_HISTORY | TABLE | 1654 | MaterialId (char), Quantity (numeric), UoM (char), UnitPrice (numeric), UoMTime (char) |
| dbo.hris_Leave_Day | TABLE | 1598 | CalcDate (datetime), InpDate (datetime), UpdDate (datetime) |
| dbo.HTRANS_BA_R1_1 | TABLE | 1585 | voucher_date (datetime), User_posting (varchar), Date_posting (datetime) |
| dbo.FINV_FAKTUR_RP | VIEW | 1516 | NomorTandaTerima (varchar) |
| dbo.hris_EmployeeCareerPath | TABLE | 1425 | StartDate (datetime), EndDate (datetime), InputDate (datetime) |
| dbo.FIN_INVOICE_HED | TABLE | 1420 | Invoice_date (date), CustomerId (int), Payable_date (date), Received_date (date), Ack_date (date), Due_date (date), PO_No (nvarchar), PortForm (nvarchar), inp_date (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime), CustId (int), IS_POSTINGREV (int), ApproveDate (datetime) |
| dbo.SLS_SALESORDER_HED_NEW_BACKUP2 | TABLE | 1379 | PONo (varchar), PODate (date), CustomerID (int), inp_date (datetime2), approval_date (datetime), StsPono (int), approvalppic_date (datetime) |
| dbo.bpionline_Absensi | TABLE | 1371 | DATETIME (datetime) |
| dbo.WMS_ADJUSTMENT | TABLE | 1325 | Materialid (char), AdjQuantity (numeric), Inp_Date (datetime), Upd_Date (datetime) |
| dbo.WMSV_ADJST | VIEW | 1325 | RefDate (datetime), Materialid (char), AdjQuantity (numeric) |
| dbo.FINV_PENERIMAANBANK | VIEW | 1324 | tanggal (date), IS_POSTING (int) |
| dbo.FINV_PENERIMAANBANK_ | VIEW | 1324 | tanggal (date), IS_POSTING (int) |
| dbo.WMSV_SC4 | VIEW | 1313 | Materialid (char), RefDate (datetime), AdjQuantity (numeric) |
| dbo.PURC_MATERIALSUBGROUP | TABLE | 1312 | MaterialJasa (char), MaterialType (char), MaterialGroup (char), MaterialSubGroup (char), inp_date (datetime), upd_date (datetime) |
| dbo.vw_bpionline_Absensi | VIEW | 1302 | TANGGAL (datetime) |
| dbo.vw_bpionline_Absensi_Area | VIEW | 1302 | TANGGAL (date) |
| dbo.FINV_VATOut | VIEW | 1286 | Invoice_date (date), po_no (nvarchar), IS_POSTING (int), CustomerName (nvarchar) |
| dbo.WMSV_SC6 | VIEW | 1251 | TANGGAL (datetime) |
| dbo.FIN_PEMBAYARAN_LANGSUNG_HED | TABLE | 1233 | Tanggal (date), DepartID (varchar), inp_date (datetime), DueDate (date) |
| dbo.FINV_GETNOINVOICE | VIEW | 1162 | CustId (int) |
| dbo.WMSV_MIS_okt | VIEW | 1108 | DepartID (char), NamaDepartemen (char), MaterialName (varchar), UoM (char) |
| dbo.SLS_SALESORDER_HED_NEW2 | TABLE | 1097 | PONo (varchar), PODate (date), CustomerID (int), inp_date (datetime2), approval_date (datetime), StsPono (int), approvalppic_date (datetime) |
| dbo.hris_FamGathFamily | TABLE | 1093 | BirthDate (varchar) |
| dbo.SLS_SALESORDER_HED_NEW_BACKUP | TABLE | 1090 | PONo (varchar), PODate (date), CustomerID (int), inp_date (datetime2), approval_date (datetime), StsPono (int), approvalppic_date (datetime) |
| dbo.hris_FamGathAbsent | TABLE | 1061 | BirthDate (date) |
| dbo.FINV_INVOICE_STATUS | VIEW | 1036 | DueDate (date), CustId (int), CustomerName (nvarchar) |
| dbo.PURC_PURCHASE_ORDER_HISTORY | TABLE | 1004 | PONo (char), MaterialId (char), Quantity (numeric), UoM (char), UnitPrice (numeric), HoldDate (datetime), CancelDate (datetime), PO_Delivery_Actual_Qty (numeric), PO_Delivery_Status (int), PO_Delivery_Note (nvarchar), Senddate (datetime), inp_date (datetime), upd_date (datetime) |
| dbo.PURC_BIDPR_HISTORY | TABLE | 977 | MaterialId (char), Quantity (numeric), UoM (char), PO_Status (int) |
| dbo.WMSV_SC8 | VIEW | 872 | Tanggal (date) |
| dbo.FIN_MEMORIAL_JURNAL_HED | TABLE | 865 | Tanggal (date), inp_date (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime) |
| dbo.FINV_PENERIMAAN_BANK | VIEW | 805 | Invoice_date (date), Due_date (date), CustomerName (nvarchar) |
| dbo.WMS_MatStockReject | TABLE | 750 | Materialid (char), LastMonDate (smalldatetime), LastBeginQty (decimal), LastReceiveQty (decimal), LastIssueQty (decimal), LastReturnQty (decimal), LastAdjustQty (decimal), LastMutationQty (decimal), LastRealocQty (decimal), LastWriteOffQty (decimal), LastMonQty (decimal) |
| dbo.PURCH_MRP_NOTE | TABLE | 736 | DepartID (varchar) |
| dbo.PURCH_BUDGET_GROUP | TABLE | 728 | departId (varchar) |
| dbo.WMS_ADJUSTMENTHED | TABLE | 718 | RefDate (datetime), CloseDate (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime) |
| dbo.FINV_GET_PEMB_CASH | VIEW | 714 | NoPO (varchar), tanggal (date), VendorPO (varchar), VendorNonPO (varchar) |
| dbo.MAS_PART_NUMBER | TABLE | 673 | Part_Number (nvarchar), Part_Description (varchar), Part_Number_Code (varchar) |
| dbo.MAS_KATALOG_SALES | TABLE | 672 | MATERIALIDHED (varchar) |
| dbo.WMSV_STO_RAW_SUM | VIEW | 668 | Materialid (varchar) |
| dbo.WMSV_STO_RAW_INFO | VIEW | 659 | UoM (char), MaterialName (varchar), Materialid (varchar) |
| dbo.Assessments_lastbackup | TABLE | 624 | assessment_date (datetime) |
| dbo.vw_bpionline_Absensi_Year | VIEW | 616 | DEPARTEMEN (char), Depok (int), Planet_Lain (int) |
| dbo.Assessments | TABLE | 598 | assessment_date (datetime) |
| dbo.FIN_PEMBAYARAN_PTC | TABLE | 584 | NoPO (varchar) |
| dbo.FIN_PEMBAYARAN_PTC_HED | TABLE | 583 | inp_date (datetime), DepartID (varchar), Tanggal (date) |
| dbo.FINV_PEM_CASH | VIEW | 568 | Tanggal (date), inp_date (datetime), ApproveDate (datetime), DateClose (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime) |
| dbo.PCV_CashOut | VIEW | 567 | IS_POSTING (int) |
| dbo.CR_users | VIEW | 564 | department_id (varchar) |
| dbo.hris_Employee | TABLE | 564 | DepartID (char), BirthDate (datetime), WorkingDate (datetime), FirstWorkingDate (datetime), PostalCode (varchar), InactiveDate (datetime), ResignDate (datetime), HireDate (datetime), ConstaDate (datetime) |
| dbo.HRISV_EMP_EKS | VIEW | 564 | DepartID (char), BirthDate (datetime), WorkingDate (datetime), FirstWorkingDate (datetime), PostalCode (varchar), InactiveDate (datetime), ResignDate (datetime), HireDate (datetime), ConstaDate (datetime) |
| dbo.WMS_MatStockCasting | TABLE | 553 | Materialid (char), LastMonDate (smalldatetime), LastBeginQty (decimal), LastReceiveQty (decimal), LastIssueQty (decimal), LastReturnQty (decimal), LastAdjustQty (decimal), LastMutationQty (decimal), LastRealocQty (decimal), LastWriteOffQty (decimal), LastMonQty (decimal) |
| dbo.FINV_IN_OUT_CASH | VIEW | 551 | NamaDepartemen (char), tanggal (date), inp_date (datetime), IS_POSTING (int) |
| dbo.BDVV_ListTdTrmPO | VIEW | 539 | IsVendorPO (int) |
| dbo.vw_bpionline_Employees | VIEW | 539 | DepartID (char) |
| dbo.CR_user_credentials | TABLE | 516 | updated_at (datetime) |
| dbo.WMS_BOM | TABLE | 479 | Part_Number (varchar), Part_Description (varchar), ProductId (varchar), Qty (int) |
| dbo.MAS_KATALOG_BT | TABLE | 477 | Btno (nvarchar), PART_NAME (nvarchar), PART_NO (nvarchar), MATERIAL (nvarchar), PLANT (nvarchar), CAVITY_MOULD (nvarchar), YIELD_PRODUCT (nvarchar), BMould (nvarchar), Volume_Ladle_Pouring (nvarchar), Mold_Ladle (nvarchar), Weight_Mold (nvarchar), Mould_Batch (nvarchar) |
| dbo.EmployeeContracts | TABLE | 461 | ContractStartDate (date), ContractEndDate (date), UpdatedByNIP (varchar), UpdatedAt (datetime2), DepartmentSnapshot (nvarchar) |
| dbo.MAS_VENDOR | TABLE | 445 | inp_date (datetime), upd_date (datetime), CustId (varchar) |
| dbo.PURV_VENDOR_VERIFIED | VIEW | 445 | inp_date (datetime), upd_date (datetime) |
| dbo.AP_SaldoAPDes2021 | TABLE | 444 | TdTrmDate (datetime), DueDate (datetime) |
| dbo.FINV_DEBT21 | VIEW | 444 | TdTrmDate (datetime), DueDate (datetime) |
| dbo.FINV_FAKTUR_LIST_DEBT | VIEW | 444 | DueDate (datetime) |
| dbo.AP_LIST_FAKTUR_DEBT_OLD | VIEW | 442 | Tanggal (datetime), DueDate (datetime), statusPosting (varchar) |
| dbo.PROJ_DAILY_DET | TABLE | 434 | SolDate (datetime), SupportingFile (nvarchar) |
| dbo.WMS_CASTING | TABLE | 430 | none |
| dbo.FINV_ADV_DETAIL | VIEW | 423 | NoPO (varchar), AmountPO (decimal), TOTALPO (numeric), Tanggal (date), NamaDepartemen (char) |
| dbo.PURC_PR_RETURN | TABLE | 420 | tgl_update (date) |
| dbo.WMSV_STO0110_INFO_RM | VIEW | 420 | MaterialId (varchar) |
| dbo.hris_Jobtitle | TABLE | 388 | Orders (varchar) |
| dbo.WMS_BRAKEASSY_INCOMING_MMO | TABLE | 351 | NO_POLISI (varchar), UPDATED_AT (datetime), UPDATED_BY (varchar) |
| dbo.AR_SALDO_30_11_2025 | TABLE | 349 | Duedate (date), CustId (varchar) |
| dbo.masterCheckSheet | TABLE | 341 | part_number (text) |
| dbo.SLS_CUSTOMER | TABLE | 332 | CustomerID (int), CustomerName (nvarchar) |
| dbo.FIN_REQUEST_PEMB_HED | TABLE | 325 | DepartID (varchar), Tanggal (date), DueDate (date), inp_date (datetime), TanggalFakturPajak (date) |
| dbo.FIN_PEMBAYARAN_ADV | TABLE | 315 | NoPO (varchar) |
| dbo.FIN_PEMBAYARAN_ADV_HED | TABLE | 315 | inp_date (datetime), DepartID (varchar), Tanggal (date), approved_date (datetime) |
| dbo.FINV_FinPembAdv | VIEW | 315 | NoPO (varchar) |
| dbo.ACC_MapDivJasaAccountBiaya | TABLE | 299 | MaterialId (nvarchar), Create_Date (datetime), Update_Date (datetime), UpdateBy (varchar) |
| dbo.PURC_PR_CANCEL | TABLE | 298 | MaterialId (varchar) |
| dbo.FIN_PENERIMAAN_HED | TABLE | 295 | Tanggal (date), inp_date (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime), Update_by (varchar), Update_date (datetime), CustId (varchar), DepartId (varchar) |
| dbo.FINV_PENERIMAAN_BANK_HEAD | VIEW | 295 | Tanggal (date), IS_POSTING (int), CustomerName (nvarchar) |
| dbo.FINV_PENERIMAAN_BANK_HEAD_ | VIEW | 295 | Tanggal (date), IS_POSTING (int), CustomerName (nvarchar) |
| dbo.CR_idea_monthly | TABLE | 293 | potential_cr (decimal), actual_cost (decimal), updated_by (int), updated_at (datetime) |
| dbo.FINV_PAID_ADV | VIEW | 289 | Tanggal (date), NoPO (varchar) |
| dbo.FINV_PAID_STL | VIEW | 289 | NoPO (varchar) |
| dbo.PURC_MATERIALGROUP | TABLE | 278 | MaterialJasa (char), MaterialType (char), MaterialGroup (char), inp_date (datetime), upd_date (datetime) |
| dbo.hris_skk_JawabanTemporary | TABLE | 265 | LastUpdated (datetime) |
| dbo.PPC_TonProductTonFinish | TABLE | 259 | PrevDate (datetime) |
| dbo.MESIN | TABLE | 246 | DATE_MCH (date) |
| dbo.WMS_MatStock2 | TABLE | 239 | Materialid (char), LastMonDate (smalldatetime), LastBeginQty (decimal), LastReceiveQty (decimal), LastIssueQty (decimal), LastReturnQty (decimal), LastAdjustQty (decimal), LastMutationQty (decimal), LastRealocQty (decimal), LastWriteOffQty (decimal), LastMonQty (decimal) |
| dbo.FIN_PEMBAYARAN_STL_HED | TABLE | 222 | DepartID (varchar), Tanggal (date), inp_date (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime), ApproveDate (datetime) |
| dbo.WMS_LOKASI_CASTING | TABLE | 219 | none |
| dbo.FIN_PEMBAYARAN_STL | TABLE | 215 | NoPO (varchar), AmountPO (numeric), update_by (varchar), update_date (datetime), FakturPajakDate (date) |
| dbo.FINV_LIST_ADV_STL | VIEW | 215 | Tanggal (date) |
| dbo.jurnal_stl2 | VIEW | 215 | Tanggal (date), NoPO (varchar), IS_POSTING (int) |
| dbo.FINV_ADV_STL | VIEW | 211 | IS_POSTING (int), Tanggal (date) |
| dbo.MAS_Holiday | TABLE | 200 | HolidayDate (datetime) |
| dbo.e_skk_biodataKaryawan | TABLE | 198 | DepartID (varchar) |
| dbo.e_skk_logAgreement | TABLE | 193 | date (datetime) |
| dbo.jurnal_stl | VIEW | 165 | Tanggal (date), NoPO (varchar), IS_POSTING (int) |
| dbo.CR_idea_potential_monthly | TABLE | 164 | potential_amount (decimal), updated_by (int), updated_at (datetime) |
| dbo.hris_Permit_Days | TABLE | 146 | ProposeStartDate (date), ProposeEndDate (date), ProposeStartTime (time), ProposeEndTime (time), ActualStartDate (date), ActualStartTime (time), ActualEndTime (time), InpDate (datetime), UpdDate (datetime) |
| dbo.vw_hris_Permit_Transaction | VIEW | 144 | ProposeStartDate (date), ProposeEndDate (date), ProposeStartTime (time), ProposeEndTime (time), InpDate (datetime), DocSupport (varchar) |
| dbo.MASCOSTCENTER | TABLE | 138 | DepartID (char), NamaDepartemen (char), TipeDepartemen (varchar), LevelDepartemen (char), DepartemenInduk (char), InpOleh (char) |
| dbo.PROJ_DAILY | TABLE | 123 | ProbDate (datetime), Unplan (int), CloseDate (datetime) |
| dbo.WMSV_SC5 | VIEW | 120 | Materialid (varchar), RefDate (datetime), Quantity (numeric) |
| dbo.PRD_LINE | TABLE | 108 | kode_cust (varchar) |
| dbo.hris_skk_Jawaban | TABLE | 106 | TanggalSubmit (datetime) |
| dbo.FINV_AGING_ADV_STL | VIEW | 105 | IS_POSTING (int), Tanggal (date) |
| dbo.Assessments_backup | TABLE | 104 | assessment_date (datetime) |
| dbo.holidays | TABLE | 104 | holiday_date (date) |
| dbo.inventory_barang | TABLE | 99 | qty (int), tanggal_pr (date), tanggal_terima (date), tanggal_diserahkan (date), updated_at (datetime), material_id (nchar) |
| dbo.PROJ_TASKBASE | TABLE | 96 | StartDate (datetime), EndDate (datetime), BaseDate (datetime) |
| dbo.WMS_BRAKEASSY_STOCK_MOVEMENT | TABLE | 96 | MATERIAL_ID (varchar), MATERIAL_NAME (varchar), QTY (float), TRANSACTION_DATE (datetime), CREATED_DATE (datetime), UNBOXING_DATE (datetime) |
| dbo.inventory_penerimaan | TABLE | 94 | tanggal_diterima (date), qty_diterima (int), updated_at (datetime) |
| dbo.PrinterChecks | TABLE | 93 | CheckDate (date) |
| dbo.APAGINGV_01TDTRM | VIEW | 92 | Tanggal (date), QTY (numeric) |
| dbo.FIN_TERIMACASH_HED | TABLE | 92 | DepartID (varchar), Tanggal (date), inp_date (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime) |
| dbo.WMS_MAPPING_PART_DELIVERY_PRD | TABLE | 92 | ProductId (varchar), CUST (varchar), MaterialIdRaw (varchar), MaterialIdSub (varchar) |
| dbo.tbl_menu_sales | TABLE | 88 | create_date (datetime2), update_date (datetime2), update_by (varchar) |
| dbo.USER_UNIT_MEASUREMENT | TABLE | 86 | unit_code (varchar) |
| dbo.WMSV_LOCATION_STOCK | VIEW | 85 | Materialid (char), BeginQty (decimal) |
| dbo.MAS_GROUPINGMATERIAL | TABLE | 82 | DepartId (varchar) |
| dbo.USER_REASON | TABLE | 82 | inp_date (datetime), upd_date (datetime) |
| dbo.PROJ_TASK | TABLE | 79 | StartDate (datetime), CompletionDate (datetime), SupportingFile (nvarchar) |
| dbo.BANTU | TABLE | 68 | MaterialId (varchar) |
| dbo.DELIVERY_TUJUAN | TABLE | 66 | custId (int) |
| dbo.hris_EmployeeTemp | TABLE | 60 | PostalCode (varchar), InpDate (datetime) |
| dbo.sourcing | TABLE | 60 | KodeCust (varchar) |
| dbo.Backup_PrinterChecks | TABLE | 59 | CheckDate (date) |
| dbo.FINV_PO_DP | VIEW | 56 | NoPO (char), AmountPO (numeric) |
| dbo.PURC_USER_PRONLINE | TABLE | 52 | CreatedDate (datetime), ModifiedDate (datetime) |
| dbo.LetterNumbers | TABLE | 51 | DepartmentName (nvarchar), LetterDate (date) |
| dbo.PrinterCounterHistory | TABLE | 49 | RecordedDate (date) |
| dbo.WMS_BRAKEASSY_STOCKAWAL | TABLE | 49 | MATERIAL_ID (varchar), MATERIAL_NAME (varchar), QTY_AWAL (float), CREATED_DATE (datetime), UPDATED_BY (varchar), UPDATED_DATE (datetime) |
| dbo.TanggalCash | TABLE | 48 | Tanggal (varchar), PrevTanggal (varchar), Prev2Tanggal (varchar), Prev3Tanggal (varchar) |
| dbo.Administrator | TABLE | 45 | CreatedDate (datetime), ModifiedDate (datetime) |
| dbo.CR_ideas | TABLE | 44 | department_id (varchar), updated_at (datetime), potential_cr (decimal) |
| dbo.APAGINGV_02SUMByNoFAKT | VIEW | 43 | Tanggal (date) |
| dbo.APAGINGV_03SelectedNominal | VIEW | 43 | Tanggal (date) |
| dbo.APAGINGV_04TotalHutang | VIEW | 43 | Tanggal (date) |
| dbo.hris_Travel_Approval | TABLE | 42 | UpdDate (datetime) |
| dbo.WMS_MappingPartSubcont | TABLE | 42 | MaterialIdRaw (varchar), MaterialIdFinish (varchar) |
| dbo.hris_Notification | TABLE | 41 | InpDate (datetime) |
| dbo.WMS_BRAKEASSY_MAPPING | TABLE | 41 | PART_NUMBER (varchar), PART_NUMBER_ERIS (varchar) |
| dbo.WMS_USER | TABLE | 41 | CreatedDate (datetime), ModifiedDate (datetime) |
| dbo.p2k3_nearmiss_report | TABLE | 40 | nomor_laporan (nvarchar), tanggal_laporan (date), tanggal_kejadian (date), department_id (varchar), inp_date (datetime) |
| dbo.Printers | TABLE | 40 | FirstPrintDate (date), LastCheckDate (datetime) |
| dbo.WMSV_SLOWSTOCK | VIEW | 40 | Materialid (char), BeginQty (decimal) |
| dbo.MAS_CUSTOMER | TABLE | 39 | CustId (int), CustomerName (nvarchar), IdOldCust (nvarchar), DateAppIC (datetime), DateAppFN (datetime), IdOldCustI (varchar), IdOldCustII (varchar), ProductionPrimary (varchar), ProductionSecondary (varchar), ProductionCapacity (varchar), PurchasingExport (varchar) |
| dbo.IT_DEVICE_MONITORING | TABLE | 37 | PosX (char), PosY (char), Port_Width (char), Port_Height (char) |
| dbo.IT_VW_MONITORING | VIEW | 37 | PosX (char), PosY (char), Port_Width (char), Port_Height (char) |
| dbo.IT_DEVICE_MON_LINK | TABLE | 36 | From_Spot (char), To_Spot (char) |
| dbo.AR_AccountCustomer | TABLE | 35 | CustID (nvarchar), CustomerName (nvarchar) |
| dbo.WMSV_SLOWSTOCKSUM | VIEW | 35 | Materialid (char) |
| dbo.PRODUKSI_USER | TABLE | 32 | CreatedDate (datetime), Id_Mesin (varchar) |
| dbo.WMSV_SLOWSTOCK_INFO | VIEW | 32 | NamaDepartemen (char), UoM (char), MaterialName (varchar), Materialid (char), BeginQty (decimal) |
| dbo.tbl_menu | TABLE | 31 | create_date (datetime2), update_date (datetime2), update_by (varchar) |
| dbo.forecast | TABLE | 30 | PART_NO (varchar), PART_NAME (varchar), QTY (int), QTY_PLAN (int), KODE_CUST (varchar) |
| dbo.WMSV_SLOW2YEARS | VIEW | 30 | BeginQty (int) |
| dbo.hris_EmployeeEducation | TABLE | 26 | StartDate (datetime), EndDate (datetime) |
| dbo.device_tokens | TABLE | 24 | InpDate (datetime) |
| dbo.Task | TABLE | 24 | startDate (datetime2), endDate (datetime2), actualStartDate (datetime2), actualEndDate (datetime2), sortOrder (int), updatedAt (datetime2) |
| dbo.bpionline_Task | TABLE | 23 | DueDate (datetime), UpdatedAt (datetime) |
| dbo.PURCH_MRP_OVERTIME | TABLE | 23 | tanggal_input (datetime), created_date (datetime), app1_date (datetime), app2_date (datetime), app3_date (datetime) |
| dbo.IT_SYSTEM_REQUEST | TABLE | 22 | departemen_peminta (varchar), kebutuhan_data_output (varchar), tanggal_permintaan (datetime), tanggal_diproses (datetime), tanggal_selesai (datetime) |
| dbo.PROJ_JOB | TABLE | 22 | Responsible (char), SupportingFile (varchar), Closingdate (datetime) |
| dbo.PURCV_DASH_VEND | VIEW | 21 | NamaDepartemen (char) |
| dbo.hris_Permit_SubGroup | TABLE | 20 | DocSupport (char) |
| dbo.pfa_safetyApd | TABLE | 20 | Qty_APD (int), Output_Per_Hour (decimal) |
| dbo.vw_hris_Permit_Type | VIEW | 20 | DocSupport (char) |
| dbo.AR_AccountDept | TABLE | 19 | DepartId (nvarchar) |
| dbo.pfa_cutting | TABLE | 19 | Qty_Sudut (int), Qty_Insert (int) |
| dbo.AP_AccountDeptBill | TABLE | 18 | DepartId (nvarchar) |
| dbo.MAS_ALAMAT_CUSTOMER | TABLE | 18 | CustId (int) |
| dbo.PURC_MATERIALTYPE | TABLE | 18 | MaterialJasa (char), MaterialType (char), inp_date (datetime), upd_date (datetime) |
| dbo.hris_EmployeeFamily | TABLE | 16 | BirthDate (datetime) |
| dbo.MAS_CUSTOMER_OLD | TABLE | 16 | CustId (int), CustomerName (nvarchar), DateAppIC (datetime), DateAppFN (datetime), IdOldCustI (varchar), IdOldCustII (varchar), ProductionPrimary (varchar), ProductionSecondary (varchar), ProductionCapacity (varchar), PurchasingExport (varchar), IdOldCust (nvarchar) |
| dbo.pfa_lubricant | TABLE | 16 | Qty_Liter (decimal), Consumable_Mesin (varchar), Output_Per_Hour (decimal) |
| dbo.PURCH_BULK | TABLE | 16 | PONo (char), PoStatus (int), Del_Date (datetime) |
| dbo.PRODUKSI_USER_ROLE | TABLE | 15 | Id_Mesin (int) |
| dbo.serah_terima | TABLE | 15 | departemen (nvarchar), tanggal_serah (date), updated_at (datetime) |
| dbo.SLS_SALESORDER_SO | TABLE | 15 | ProductID (varchar), Qty (int), UnitPrice (decimal), PartNumber (varchar), PODelFrom (date), PODelTo (date) |
| dbo.hris_Travel | TABLE | 14 | StartDate (date), EndDate (date), InpDate (datetime) |
| dbo.NearmissDetailsJenis | TABLE | 14 | ReportId (int) |
| dbo.SRT_Menu | TABLE | 13 | updated_at (datetime) |
| dbo.wms_closing | TABLE | 13 | date_by (datetime), user_update (varchar), date_update (datetime) |
| dbo.pfa_master_tsr | TABLE | 12 | component_name (varchar), component_type (varchar), sort_order (int), created_date (datetime), updated_date (datetime), updated_by (varchar) |
| dbo.PRODUKSI_SHOOTBLASTMESIN | TABLE | 12 | Id_ShootblastMesin (int), Shootblast_Nama_Mesin (char), Shootblas_UraianMesin (char), Id_Produksi_Mesin (int) |
| dbo.WBS_TRANS | TABLE | 12 | Tanggal (date), NamaPelapor (varchar), NIKPelapor (varchar), TanggalKejadian (date), JabatanPelapor (nvarchar), create_date (datetime) |
| dbo.WMS_RETURN | TABLE | 12 | Materialid (char), DepartAloc (char), Quantity (numeric), Inp_Date (datetime), Upd_Date (datetime) |
| dbo.WMS_RETURNHED | TABLE | 12 | RefDate (datetime), Department (char), CloseDate (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime) |
| dbo.WMSV_RETURN | VIEW | 12 | RefDate (datetime), Materialid (char), MaterialName (varchar), Quantity (numeric), UoM (char), NamaDepartemen (char) |
| dbo.pfa_electric | TABLE | 11 | Power_KW (decimal) |
| dbo.PRODUKSI_SHOOTBLASTGROUP | TABLE | 11 | none |
| dbo.PURC_USER | TABLE | 10 | CreatedDate (datetime), ModifiedDate (datetime) |
| dbo.LabourCostDetail | TABLE | 9 | Komponen (varchar) |
| dbo.p2k3_nearmiss_followup | TABLE | 9 | report_id (int), due_date (date), updated_at (datetime) |
| dbo.PRODUKSI_LOKASI | TABLE | 9 | none |
| dbo.PROJ_PROJECT | TABLE | 9 | OwnerDepart (char), StartDate (datetime), Closingdate (datetime), SupportingFile (varchar) |
| dbo.User | TABLE | 9 | updatedAt (datetime2) |
| dbo.acc_closing | TABLE | 8 | date_by (datetime), user_update (varchar), date_update (datetime) |
| dbo.ContractEmployeeAccess | TABLE | 8 | UpdatedAt (datetime2) |
| dbo.EmployeeAccess | TABLE | 8 | UpdatedAt (datetime2) |
| dbo.MAS_CURRENCY | TABLE | 8 | inp_date (datetime), upd_date (datetime), purc_date (datetime) |
| dbo.pfa_labour | TABLE | 8 | Manpower (int) |
| dbo.pfa_safetyOverhead | TABLE | 8 | Qty_APD (int), Output_Per_Hour (decimal), Supporting (decimal) |
| dbo.PURCH_MRP_OVERTIMEHEAD | TABLE | 8 | PLANBUDGET (decimal) |
| dbo.ReplacementReject_Det | TABLE | 8 | MaterialId (varchar), qty_reject (int), qty_replace (int) |
| dbo.training_answer_pg | TABLE | 8 | legacy_point (decimal) |
| dbo.training_qr_access | TABLE | 8 | purpose (varchar) |
| dbo.EF_FOLDERS | TABLE | 7 | DEPARTMENT_ID (varchar) |
| dbo.PRODUKSI_FURNACE | TABLE | 7 | Id_ProduksiMesin (int) |
| dbo.PRODUKSI_MESIN | TABLE | 7 | Id_ProduksiMesin (int), Produksi_Nama_Mesin (char), Produksi_UraianMesin (char) |
| dbo.Tasks | TABLE | 7 | plan_start (date), plan_due (date), actual_start (date), actual_due (date) |
| dbo.activity_log | TABLE | 6 | CreatedDate (datetime) |
| dbo.message_jobs | TABLE | 6 | idempotency_key (nvarchar) |
| dbo.p2k3_nearmiss_finish | TABLE | 6 | report_id (int), tanggal_selesai (date), updated_at (datetime) |
| dbo.PRODUKSI_GROUP | TABLE | 6 | none |
| dbo.Produksi_Keputusan | TABLE | 6 | none |
| dbo.PRODUKSI_USERMENU_HEAD | TABLE | 6 | none |
| dbo.PURCH_MRP_MONTHLY | TABLE | 6 | DepartID (varchar) |
| dbo.SM_LetterLogs | TABLE | 6 | from_department (nvarchar), to_department (nvarchar), from_department_id (nvarchar), to_department_id (nvarchar) |
| dbo.SM_Letters | TABLE | 6 | department_id (nvarchar), departid (nvarchar), department_name (nvarchar) |
| dbo.vw_kotak_saran | VIEW | 6 | TANGGAL (datetime) |
| dbo.bpionline_Task_Sub | TABLE | 5 | UpdatedAt (datetime), UpdatedBy (varchar) |
| dbo.DeliveryClaimRjk | TABLE | 5 | tanggal (date), MaterialId (varchar), inpDate (datetime) |
| dbo.EF_FILES | TABLE | 5 | TANGGAL_PENYIMPANAN (date), DEPART_ID (text) |
| dbo.hris_Division | TABLE | 5 | Div_orders (char) |
| dbo.hris_employee_adjustment | TABLE | 5 | id_departemen (varchar) |
| dbo.PRODUKSI_USERMENU_DETIL | TABLE | 5 | none |
| dbo.SLS_SALES_JENIS_HARGA | TABLE | 5 | customer (int) |
| dbo.SLS_SALESORDER_HED_SO | TABLE | 5 | PONo (varchar), PODate (date), CustomerID (int), inp_date (datetime2), approval_date (datetime), StsPono (int), approvalppic_date (datetime) |
| dbo.training_test_set | TABLE | 5 | test_date (date) |
| dbo.WMS_KDQR_TO_QC | TABLE | 5 | PartNumber (varchar), MaterialId (varchar), ChildPart (varchar), Qty (int), ClaimDate (date), inpDate (datetime), qcDate (datetime) |
| dbo.bpionline_Task_Sub_Progress | TABLE | 4 | UpdatedAt (datetime) |
| dbo.EmployeeContractImportStaging | TABLE | 4 | Department (nvarchar), StartDateText (varchar), EndDateText (varchar) |
| dbo.inventory_barang_backup_20260716 | TABLE | 4 | qty (int), tanggal_pr (date), tanggal_terima (date), tanggal_diserahkan (date), updated_at (datetime) |
| dbo.MAS_BOM_BMC | TABLE | 4 | qty (decimal), satuan (nvarchar) |
| dbo.MAS_COMPANY | TABLE | 4 | inp_date (datetime), upd_date (datetime) |
| dbo.pfa_delivery | TABLE | 4 | Qty_per_Pallet (int) |
| dbo.pfa_depresiasi | TABLE | 4 | Output_Per_Hour (decimal) |
| dbo.pfa_header | TABLE | 4 | document_date (date), customer (varchar), part_number (varchar), output_per_hour (decimal), created_date (datetime), checklist_date (date), approval_acc_date (date), approval_eng_date (date), approval_dir_date (date), approval_presdir_date (date), rejected_date (datetime), approval_qe_date (date), approval_op_date (date), approval_fah_date (date) |
| dbo.pfa_jig | TABLE | 4 | Qty_Jig (int) |
| dbo.pfa_jigInspection | TABLE | 4 | Qty_Jig (int) |
| dbo.pfa_packaging | TABLE | 4 | Qty_Per_Pallet (int) |
| dbo.PROJ_USER | TABLE | 4 | CreatedDate (datetime), ModifiedDate (datetime) |
| dbo.SubProjects | TABLE | 4 | plan_start (date), plan_due (date), actual_start (date), actual_due (date) |
| dbo.training_test_session | TABLE | 4 | participant_nip (nvarchar) |
| dbo.WMSV_TotStockListHarian | VIEW | 4 | MaterialName (varchar), UoM (char) |
| dbo.Workspace | TABLE | 4 | updatedAt (datetime2) |
| dbo.cek_jurnal | VIEW | 3 | voucher_date (datetime) |
| dbo.cl_user_group | TABLE | 3 | create_date (datetime2) |
| dbo.hris_DeptCode | TABLE | 3 | Id_ProdDepartment (int) |
| dbo.MRP | TABLE | 3 | DepartID (nchar), MRPDate (varchar), MaterialId (nchar), Qty1 (nchar), Qty2 (nchar), Qty3 (nchar), Qty4 (nchar), Qty5 (nchar), Qty (nchar), QtyPR (nchar), UoM (char), Status_Date (datetime), Inp_Date (datetime), Approval_Date (datetime), ApprovalGh_Date (datetime), ApprovalDh_Date (datetime), ApprovalIc_Date (datetime), ApprovalProc_Date (datetime), ApprovalFin_Date (datetime), ApprovalDirektur_Date (datetime), ApprovalPresDir_Date (datetime) |
| dbo.MRP_TMP | TABLE | 3 | DepartID (nchar), MRPDate (varchar), MaterialId (nchar), Qty1 (nchar), Qty2 (nchar), Qty3 (nchar), Qty4 (nchar), Qty5 (nchar), Qty (nchar), QtyPR (nchar), UoM (char), Status_Date (datetime), Inp_Date (datetime), Approval_Date (datetime), ApprovalGh_Date (datetime), ApprovalDh_Date (datetime), ApprovalIc_Date (datetime), ApprovalProc_Date (datetime), ApprovalFin_Date (datetime), ApprovalDirektur_Date (datetime), ApprovalPresDir_Date (datetime) |
| dbo.parameter_cycle_time | TABLE | 3 | output_qty (decimal) |
| dbo.PrinterMaintenanceHistory | TABLE | 3 | MaintenanceDate (datetime) |
| dbo.PRODUKSI_USER_MAS_ROLE | TABLE | 3 | none |
| dbo.Project | TABLE | 3 | startDate (datetime2), endDate (datetime2), updatedAt (datetime2) |
| dbo.PURC_APPROVAL | TABLE | 3 | Pass_Date (datetime), OTP_DATE (datetime) |
| dbo.PURC_CART | TABLE | 3 | MaterialId (char), inp_date (datetime) |
| dbo.PURCH_REQ_INCLUDE_BUDGET | TABLE | 3 | DepartId (varchar), MaterialId (varchar), Qty (varchar), DepartPurpose (varchar), QtyAcc (varchar) |
| dbo.ReplacementReject_Hed | TABLE | 3 | tanggal_replacement (date), createdDate (datetime) |
| dbo.SRT_USER | TABLE | 3 | updated_at (datetime), updated_by (varchar) |
| dbo.SRT_USERGROUP | TABLE | 3 | updated_at (datetime), updated_by (varchar) |
| dbo.training_peserta_acara | TABLE | 3 | participant_nip (nvarchar), participant_name (nvarchar), department_code (nvarchar), department_name (nvarchar), updated_at (datetime2) |
| dbo.hris_Category | TABLE | 2 | Ca_orders (char) |
| dbo.MAS_BOM | TABLE | 2 | MATERIALID (varchar), PART_NUMBER (varchar), SATUAN (varchar) |
| dbo.MAS_GD_COA | TABLE | 2 | dt_inp_date (datetime), dt_upd_date (datetime) |
| dbo.MAS_LEVEL_COA | TABLE | 2 | dt_inp_date (datetime), dt_upd_date (datetime) |
| dbo.PC_SaldoAwal | TABLE | 2 | Tanggal (nvarchar) |
| dbo.pfa_lubricant_master | TABLE | 2 | Consumable_Mesin (varchar), created_date (datetime) |
| dbo.PROJ_MOM | TABLE | 2 | Responsibility (nvarchar) |
| dbo.Projects | TABLE | 2 | plan_start (date), plan_due (date), actual_start (date), actual_due (date) |
| dbo.PURC_REG_MATCATALOG_DETAIL | TABLE | 2 | MaterialName (varchar), Uom (varchar), AccountMaterial (varchar), MaterialId (varchar), TypeMaterial (varchar), TypeMaterialUser (varchar) |
| dbo.SM_LettersSeq | TABLE | 2 | seq_date (date) |
| dbo.training_acara | TABLE | 2 | materi_pokok (nvarchar), updated_by_nip (nvarchar), updated_at (datetime2) |
| dbo.training_acara_trainer | TABLE | 2 | department_code (nvarchar), position_name (nvarchar) |
| dbo.training_question_pg | TABLE | 2 | point (decimal) |
| dbo.training_ruang_acara | TABLE | 2 | updated_at (datetime2) |
| dbo.training_user_credential | TABLE | 2 | updated_at (datetime2) |
| dbo.calculation_labour_cost | TABLE | 1 | updated_at (datetime) |
| dbo.calculation_labour_final | TABLE | 1 | output_qty (decimal), updated_at (datetime) |
| dbo.calculation_upah_bulanan | TABLE | 1 | tunjangan_transport (decimal), updated_at (datetime) |
| dbo.hris_events | TABLE | 1 | StarDate (date), endDate (datetime), ExpirePopUP (date), Inp_Date (datetime) |
| dbo.hris_skk_Periode | TABLE | 1 | TanggalMulai (date), TanggalSelesai (date) |
| dbo.LabourCost | TABLE | 1 | OutputQty (int) |
| dbo.MaintenanceBoxSettings | TABLE | 1 | LastReplacementDate (datetime), IntervalUnit (nvarchar), UpdatedAt (datetime) |
| dbo.MAS_KATALOG_SALES_DETAIL | TABLE | 1 | PART_NUMBER (varchar), SATUAN (nchar) |
| dbo.MAS_KENDARAAN | TABLE | 1 | Nomor_Polisi (nvarchar) |
| dbo.parameter_tunjangan_transport | TABLE | 1 | tunjangan_transport (decimal) |
| dbo.period | TABLE | 1 | start_date (date), end_date (date), updated_at (datetime) |
| dbo.periode_ba | TABLE | 1 | tanggal1 (date), tanggal2 (date) |
| dbo.periode_ba_d | TABLE | 1 | tanggal1 (date), tanggal2 (date) |
| dbo.periode_ba_konsol | TABLE | 1 | tanggal1 (date), tanggal2 (date) |
| dbo.pfa_jumlah_line | TABLE | 1 | created_date (datetime) |
| dbo.PROJ_MEETING | TABLE | 1 | OwnerDepart (int) |
| dbo.PROJ_REPORT | TABLE | 1 | OwnerDepart (int) |
| dbo.PURC_MATERIALJASA | TABLE | 1 | MaterialJasa (char), inp_date (datetime), upd_date (datetime) |
| dbo.PURC_REG_MATCATALOG_HED | TABLE | 1 | Tanggal (date), DepartID (varchar), JenisMaterial (varchar), Inp_date (datetime) |
| dbo.PURC_SPDPR | TABLE | 1 | MaterialId (varchar), Qty (int), Satuan (varchar) |
| dbo.scheduled_messages | TABLE | 1 | updated_at (datetime) |
| dbo.sima_config | TABLE | 1 | updated_at (datetime) |
| dbo.simc_config | TABLE | 1 | updated_at (datetime) |
| dbo.VISIT_VISITORHEADNEW | TABLE | 1 | is_transportasi (int), is_party (int), created_date (datetime), modified_date (datetime) |
| dbo.vw_bpionline_Absensi_Today | VIEW | 1 | DATETIME (datetime) |
| dbo.vw_labour_cost_final_detail | VIEW | 1 | output_qty (decimal) |
| dbo.vw_labour_cost_summary | VIEW | 1 | tunjangan_transport (decimal) |
| dbo.ACC_JurnalVoucherGaji | TABLE | 0 | Is_posting (int), User_posting (varchar), Date_posting (datetime) |
| dbo.acc_source03rtn | TABLE | 0 | tanggal (datetime), MaterialName (nvarchar), DepartAloc (float), namadepartemen (nvarchar) |
| dbo.ACC_SourceJ04 | TABLE | 0 | tanggal (datetime), MaterialType (nvarchar), MaterialName (nvarchar), NamaDepartemenBaru (nvarchar), NamaDepartemenLama (nvarchar) |
| dbo.acc_sourcejurnaladjustment | TABLE | 0 | RefDate (datetime), AdjQuantity (float) |
| dbo.ACCV_TandaTerimaJasa | VIEW | 0 | Tanggal (date), IsVendorPO (int) |
| dbo.AP_UNBILL_31_12_25 | TABLE | 0 | POno (varchar), Tanggal (date) |
| dbo.APAGING_TDTRM_C01_ListAP_DocHed | VIEW | 0 | Tanggal (date), DueDate (date) |
| dbo.APAGING_TDTRM_C05_C01_C04CompileTotHutang | VIEW | 0 | Tanggal (date) |
| dbo.APAGING_TDTRM_C06_C05_TotalHutang | VIEW | 0 | Tanggal (date) |
| dbo.APV_ListAP | VIEW | 0 | Tanggal (date), DueDate (date), IS_POSTING (int), USer_posting (varchar), VendorNonPO (varchar), VendorPO (varchar) |
| dbo.APV_TandaTerima | VIEW | 0 | Tanggal (datetime) |
| dbo.ARAGING_VAT | VIEW | 0 | Tanggal (date), CustomerName (nvarchar), PO_No (nvarchar), btno (nvarchar), ProductDescription (nvarchar) |
| dbo.BDVV_ListDtlTdTrm | VIEW | 0 | IsVendorPO (int), NoPO (varchar) |
| dbo.BDVV_ListTdTrm | VIEW | 0 | IsVendorPO (int) |
| dbo.bill_of_material | TABLE | 0 | kodeproduct (varchar), partnumberCustomer (varchar), product (varchar), partnumber (varchar), catalog_material_bmc (varchar) |
| dbo.BPI_MR_BLANK | TABLE | 0 | TGL_PO (datetime), SATUAN (char), QTY (numeric), ORDERS (char), PO_INDUK (char) |
| dbo.ClaimRjkTmp | TABLE | 0 | tanggal (date), MaterialId (varchar), inpDate (datetime) |
| dbo.CR_department_targets | TABLE | 0 | department_id (varchar), updated_by (int), updated_at (datetime) |
| dbo.DIVISION | TABLE | 0 | DivOrder (nchar) |
| dbo.e_skk_answer_tmp | TABLE | 0 | date (datetime2) |
| dbo.FIN_ADJUSTMENT_INVENTORY_ACC | TABLE | 0 | DepartID (varchar), MaterialId (varchar), Qty (numeric) |
| dbo.FIN_ADJUSTMENT_INVENTORY_ACC_HED | TABLE | 0 | Tanggal (date), input_date (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime) |
| dbo.FIN_INVOICE_HED_OLD | TABLE | 0 | Invoice_date (date), CustomerId (int), Payable_date (date), Received_date (date), Ack_date (date), Due_date (date), PO_No (nvarchar), PortForm (nvarchar), inp_date (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime) |
| dbo.FIN_INVOICE_OLD | TABLE | 0 | ProductId (int), Qty (int), PONo (varchar), TanggalTerima (date) |
| dbo.FIN_INVOICE_TMP | TABLE | 0 | ProductId (int), Qty (decimal), PONo (varchar), TanggalTerima (date), Satuan (varchar) |
| dbo.FIN_PEMBAYARAN_DEBT | TABLE | 0 | TanggalFaktur (date), duedate (date) |
| dbo.FIN_PERALIHAN | TABLE | 0 | NoTandaterima (varchar), NoPO (varchar) |
| dbo.FIN_PERALIHAN_HED | TABLE | 0 | Tanggal (date), CustId (int), inp_date (datetime), IS_POSTING (int), USer_posting (varchar), Date_posting (datetime) |
| dbo.FIN_RETUR_PENJUALAN | TABLE | 0 | PONo (varchar), ProductId (int), Qty (int), ProductDescription (varchar), IS_POSTING (int), User_posting (varchar), Date_posting (datetime), Tanggal (date) |
| dbo.FIN_RETUR_PENJUALAN_HED | TABLE | 0 | CustId (int), Tanggal (date), inp_date (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime) |
| dbo.FIN_SALDO_PETTYCASH | TABLE | 0 | inp_date (datetime) |
| dbo.FIN_SUMMARY_PAYMENT | TABLE | 0 | CreateDate (datetime) |
| dbo.FINV_ALIRANDATA | VIEW | 0 | Tanggal (datetime) |
| dbo.FINV_BDVListCheck | VIEW | 0 | Tanggal (date), NoPO (varchar) |
| dbo.FINV_INV_ACC | VIEW | 0 | CustId (int), PO_No (varchar) |
| dbo.FINV_RETURPENJUALAN | VIEW | 0 | Tanggal (date), Qty (int), IS_POSTING (int), CustomerName (nvarchar) |
| dbo.FINV_SLS_DELIVERY | VIEW | 0 | CustId (int), CustomerName (nvarchar), Tanggal (date), NoPO (varchar), Model_Part (varchar), Part_Description (nvarchar), Part_Number (nvarchar), Qty (int) |
| dbo.FINV_SLS_DELIVERY_NONSALES | VIEW | 0 | CustId (int), CustomerName (nvarchar), Tanggal (date), Model_Part (varchar), Part_Description (nvarchar), Part_Number (nvarchar), Qty (int) |
| dbo.FNAT_AKTIVATETAP | TABLE | 0 | IDDepartemen (char), NoPoKontrak (char), KapasitasOutput (numeric), BiayaDisposal (numeric), AkumulasiDisposal (numeric), TglDidispos (datetime), InpOleh (char) |
| dbo.FNAT_DISPOSAL | TABLE | 0 | AlasanDispos (varchar), MetodeDispos (char), InpDate (datetime), UpdDate (datetime) |
| dbo.FNAT_GROUP | TABLE | 0 | Satuan (char), KelompokPajak (char), InpOleh (nchar) |
| dbo.FNAT_JAMUNITPROD | TABLE | 0 | IdDepartemen (char), UnitProduk (numeric) |
| dbo.FNAT_KEBIJAKSANAAN | TABLE | 0 | NilaiMaterialitas (numeric) |
| dbo.FNAT_KELOMPOKPAJAK | TABLE | 0 | Kelompok_Pajak (char), NamaKelompok (varchar) |
| dbo.FNAT_MASLOCATION | TABLE | 0 | InpOleh (char) |
| dbo.FNAT_MASTERAKTIVATETAP | TABLE | 0 | InpOleh (char) |
| dbo.FNAT_PERBAIKAN | TABLE | 0 | InpOleh (char) |
| dbo.FNAT_PROJECTEXPENSES | TABLE | 0 | FormDate (datetime), IDDepartemen (char), Responsible (nchar), SPK-WO-PONo (nchar), MaterialID (int), Quantity (numeric), Uom (char), ClosingDate (datetime), InpDate (datetime), UpdDate (datetime) |
| dbo.FNAT_REFDISPOSAL | TABLE | 0 | MetodeDisposal (char) |
| dbo.FNAT_RELOKASIAKTIVATETAP | TABLE | 0 | DariDepartemen (char), KeDepartemen (char), InpOleh (char) |
| dbo.habsen | TABLE | 0 | tr_date (datetime) |
| dbo.HR_CL_DOK | TABLE | 0 | Start_Date (date), Expire_Date (date), Inp_Date (datetime2) |
| dbo.hris_Disciplinary | TABLE | 0 | IncidentDate (datetime), WarningfStartDate (datetime), WarningEndDate (datetime), EmployeeSignDate (datetime), SubmitedDate (datetime), witnessed_date (datetime), HRManagerDate (datetime) |
| dbo.hris_EmployeeEks | TABLE | 0 | DepartID (char), BirthDate (datetime), WorkingDate (datetime), FirstWorkingDate (datetime), PostalCode (varchar), InactiveDate (datetime), ResignDate (datetime), HireDate (datetime), ConstaDate (datetime) |
| dbo.hris_EmployeeExperience | TABLE | 0 | StartDate (datetime), EndDate (datetime) |
| dbo.hris_EmployeeLaborS | TABLE | 0 | DepartID (char), BirthDate (datetime), WorkingDate (datetime), FirstWorkingDate (datetime), PostalCode (varchar), InactiveDate (datetime) |
| dbo.hris_Leave_Add_Day | TABLE | 0 | CreatedDate (datetime) |
| dbo.hris_StrategicPlan | TABLE | 0 | InputDate (datetime), Title_Plan (varchar), Desc_Plan (varchar), Title_Actual (varchar), Desc_Actual (varchar), StartDate (date), EndDate (date) |
| dbo.inventory_penerimaan_backup_20260716 | TABLE | 0 | tanggal_diterima (date), qty_diterima (int), updated_at (datetime) |
| dbo.inventory_serah_terima | TABLE | 0 | qty_diserahkan (int), tanggal_serah (date) |
| dbo.LedgerAPUnbillPerPeriodPerAccount | VIEW | 0 | voucher_date (datetime) |
| dbo.LedgerSalesPerPeriodPerHeadAcc | VIEW | 0 | voucher_date (datetime) |
| dbo.MAS_CATALOG_PART | TABLE | 0 | Category_Parts (nvarchar) |
| dbo.MAS_COSTCENTER | TABLE | 0 | NamaDepartemen (char), TipeDepartemen (char), DepartemenInduk (char), InpOleh (char) |
| dbo.MAS_KATALOG_SALES_DETAIL_OLD | TABLE | 0 | PART_NUMBER (varchar), SATUAN (nchar) |
| dbo.MAS_PART_NUMBER_OLD | TABLE | 0 | Part_Number (nvarchar), Model_Part (varchar), Part_Description (nvarchar), Part_Number_Code (nvarchar) |
| dbo.MAS_RECEIVE_PLACE | TABLE | 0 | custId (varchar) |
| dbo.MASGUD | TABLE | 0 | OQTY (numeric), ADJQTY (numeric), IDMATERIAL (char), UOM (char), LEVELORDER (numeric), MESIN (char), MATERIAL_TYPE (char), LEVELORDER_LAMA (numeric), IDMATERIAL_LAMA (char) |
| dbo.PCV_CashIn | VIEW | 0 | IS_POSTING (int) |
| dbo.pengambilan_makanan | TABLE | 0 | tanggal_pengambilan (date), updated_at (datetime) |
| dbo.PLAN_BULANAN | TABLE | 0 | part_number (varchar), QTY_PLAN (int), tanggal_inp (date), kode_cust (varchar) |
| dbo.PPC_StockTake | TABLE | 0 | STODate (datetime), CreatedDate (datetime) |
| dbo.PPC_StockTake_Detail | TABLE | 0 | STOProductID (int), STOQty (int) |
| dbo.PRODUKSI_CORE | TABLE | 0 | BTNo (char) |
| dbo.PRODUKSI_MOULDING | TABLE | 0 | Id_ProduksiMoulding (int), ProductId_BT (char), Id_ProduksiMesin (int), Produksi_MouldCamber (int), Mould_QtyPlan (int), Mould_QtyAct (int), CreatedDate (datetime), ModifDate (datetime), UpdateBy (int) |
| dbo.PRODUKSI_PLANING | TABLE | 0 | IDPlaningProduksi (nchar), BTNo (nchar) |
| dbo.PRODUKSI_SHOOTBLAST | TABLE | 0 | ProductId_BT (char), Id_ShootblasMesin (int), Shootblast_QtyAct (int), CreatedDate (datetime), ModifDate (datetime), UpdateBy (int) |
| dbo.PRODUKSI_TRIMING | TABLE | 0 | ProductId_BT (char), Id_ProduksiMesin (int), Mould_QtyAct (int), Triming_QtyAct (int), CreatedDate (datetime), ModifDate (datetime), UpdateBy (int) |
| dbo.PROJ_PROJECTIFA | TABLE | 0 | SupportingFile (varchar) |
| dbo.PROJ_PROJECTPRODUCT | TABLE | 0 | SupportingFile (varchar), PlantId (char) |
| dbo.PROJ_WO | TABLE | 0 | WODate (datetime), OpenDate (datetime), CloseDate (datetime) |
| dbo.PURC_APPROVE_LOG | TABLE | 0 | CreatedDate (datetime) |
| dbo.PURC_MATCATALOG_TEMP | TABLE | 0 | Materialid (char), MaterialType (char), MaterialGroup (char), MaterialSubGroup (char), UoM (char), MaterialName (varchar), inp_date (datetime), upd_date (datetime) |
| dbo.PURC_MATCATALOGSUBCON | TABLE | 0 | MaterialId (varchar) |
| dbo.PURC_MEASUREMENT_CONVERSION | TABLE | 0 | MainUnit (char), UnitConver (char), QtyCovers (numeric) |
| dbo.PURC_PO_ACCESS | TABLE | 0 | PRReceivedDate (nvarchar), BidDate (datetime), PONo (nvarchar), PODate (nvarchar), MaterialID (nvarchar), MaterialName (nvarchar), UnitPrice (numeric), POQty (float) |
| dbo.PURC_SPDPR_HEAD | TABLE | 0 | DepartID (varchar), Tanggal (date), Inp_date (datetime2), TipeMaterial (char) |
| dbo.PURC_VENDOR_SUPPLIES | TABLE | 0 | MaterialId (char) |
| dbo.PURCH_MRP_YEAR | TABLE | 0 | DepartID (varchar) |
| dbo.PURCV_BID_COMP | VIEW | 0 | MaterialId (char), Quantity (numeric), UoM (char), UoMTime (char), UnitPrice_undisc (numeric), unitprice (numeric) |
| dbo.PURCV_DASH_AVG | VIEW | 0 | ImportLocal (numeric), BidDate (datetime), POKIRIM (datetime) |
| dbo.PURCV_DASH_GRR | VIEW | 0 | BidDate (datetime), AppDate (nvarchar), TGL_PO (datetime), POKIRIM (datetime), SATUAN (char), QTY (numeric), TANGGAL (datetime) |
| dbo.PURCV_GRR | VIEW | 0 | MaterialId (char), MaterialName (varchar), Qty (numeric), UoM (char), PONo (char), PODate (datetime), UoMTime (char) |
| dbo.PURCV_GRR_ATK | VIEW | 0 | MaterialId (char), MaterialName (varchar), Qty (numeric), UoM (char), PONo (char), PODate (datetime), UoMTime (char) |
| dbo.QC_KALIBRASI_HEADER | TABLE | 0 | depart_id (int) |
| dbo.realokasi | VIEW | 0 | Materialid (char), Quantity (numeric) |
| dbo.SLS_DELIVERYNONSALES | TABLE | 0 | ProductID (varchar), Qty (int), UnitPrice (decimal), Qty2 (int) |
| dbo.SLS_DELIVERYNONSALES_HED | TABLE | 0 | Tanggal (date), CustomerID (int), inp_date (datetime2), TypeCustid (varchar) |
| dbo.SLS_DO_ACCES | TABLE | 0 | PODate (date), DODate (date), PODelFrom (date), PODelTo (date), Btno (varchar), ProductNumber (varchar), CustomerId (int), PONo (varchar), DOQty (int), TerimaDate (datetime) |
| dbo.SLS_NG_SUBCONT | TABLE | 0 | ProductID (varchar), Qty (int) |
| dbo.SLS_NG_SUBCONT_HED | TABLE | 0 | Tanggal (date), CustomerID (int), inp_dates (datetime2) |
| dbo.SLS_PO_ACCES | TABLE | 0 | PODate (date), PODelFrom (date), PODelTo (date), ProductNumber (varchar), PartName (varchar), CustomerId (int), PONo (varchar), POQty (decimal), UnitPrice (decimal), WeightPO (decimal) |
| dbo.SLS_PRODUCT | TABLE | 0 | ProductDescription (nvarchar), ProductNo (nvarchar), BTNo (nvarchar), MachinedWeight (decimal) |
| dbo.SLS_RETRUNDELIVERYORDER | TABLE | 0 | ProductID (varchar), Qty (int), QtyA (int), QtyB (int) |
| dbo.SLS_RETRUNDELIVERYORDER_HED | TABLE | 0 | Tanggal (date), CustomerID (int), inp_dates (datetime2), TypeCustid (varchar) |
| dbo.SLS_RETURNDELIVERYORDER | TABLE | 0 | ProductID (varchar), Qty (int) |
| dbo.SLS_RETURNDELIVERYORDER_HED | TABLE | 0 | Tanggal (date), CustomerID (int), inp_dates (datetime2) |
| dbo.SLS_SALESORDER | TABLE | 0 | ProductID (int), Qty (decimal), UnitPrice (decimal), POUnitPrice1 (decimal), PODelFrom (date), PODelTo (date) |
| dbo.SLS_SALESORDER_HED | TABLE | 0 | PONo (nvarchar), PODate (date), CustomerID (int), PODelFrom (date), PODelTo (date), approval_date (datetime), inp_date (datetime), StsPono (char) |
| dbo.SLS_SALESORDER_NEW_TEMP | TABLE | 0 | ProductID (varchar), Qty (int), UnitPrice (decimal), PartNumber (varchar), PODelFrom (date), PODelTo (date) |
| dbo.SLS_SALESORDERFC | TABLE | 0 | ProductID (varchar), Qty (int), PartNumber (varchar), UnitPrice (decimal) |
| dbo.SLS_SALESORDERFC_HED | TABLE | 0 | Date (date), CustomerID (int), PONo (varchar), StsPono (int), inp_date (datetime2), approval_date (datetime) |
| dbo.SLSV_PO_DO_DELIVERY | VIEW | 0 | CustId (int), CustomerName (nvarchar), PODate (date), PONo (nvarchar), DODate (date), NoPO (varchar), Part_Description (nvarchar), Model_Part (varchar), Part_Number (nvarchar), UnitPrice (decimal), Qty (int) |
| dbo.source_jurnal_04_inv | VIEW | 0 | MaterialType (nvarchar) |
| dbo.SumMatStock1 | VIEW | 0 | Materialid (char), MaterialName (varchar), Quantity (numeric), UoM (char) |
| dbo.SumOwnMatStock | VIEW | 0 | Materialid (char), LastBeginQty (decimal), LastReceiveQty (decimal), LastIssueQty (decimal), LastReturnQty (decimal), LastAdjustQty (decimal), LastMutationQty (decimal), LastRealocQty (decimal), LastWriteOffQty (decimal), LastMonQty (decimal) |
| dbo.TB_Bantu | TABLE | 0 | MaterialId (varchar) |
| dbo.training_absensi | TABLE | 0 | participant_nip (nvarchar) |
| dbo.training_certificate | TABLE | 0 | participant_nip (nvarchar) |
| dbo.training_feedback | TABLE | 0 | participant_nip (nvarchar) |
| dbo.training_legacy_history | TABLE | 0 | participant_nip (nvarchar), history_date (date) |
| dbo.training_notification_outbox | TABLE | 0 | idempotency_key (nvarchar) |
| dbo.training_question_essay | TABLE | 0 | max_point (decimal) |
| dbo.TRANS1_ACCESS | TABLE | 0 | TANGGAL (datetime), ORDERS (nvarchar), TGL_UPDATE (datetime), UPDATE_BY (nvarchar), BATCH_DATE (datetime), IS_POSTING (int), User_posting (nvarchar), Date_posting (datetime) |
| dbo.Transaksi_Stok_Brake_Assy | TABLE | 0 | Tanggal (date), MaterialId (varchar), Qty (decimal), Satuan (varchar), CreatedDate (datetime), IS_POSTING (int) |
| dbo.VISIT_KONSULTAN | TABLE | 0 | Tanggal (datetime), TanggalMulai (datetime), NopolKendaraan (char) |
| dbo.VISIT_MEETINGAGENDA | TABLE | 0 | Tanggal (datetime), CreatedDate (datetime) |
| dbo.VISIT_PKL | TABLE | 0 | TugasPokok (varchar), JudulLaporan (varchar) |
| dbo.VISIT_REGISTERPKL | TABLE | 0 | Tanggal (datetime), RekomDepartemen (char), CreatedDate (datetime) |
| dbo.VISIT_REGISTERVISITOR | TABLE | 0 | Tanggal (datetime), TanggalKunjungan (datetime) |
| dbo.VISIT_VISITOR | TABLE | 0 | Tanggal (datetime), NOPOL (char) |
| dbo.vw_acc_ba_konsol | VIEW | 0 | noaccUnit (varchar), indukUnit (nvarchar) |
| dbo.vw_acc_ba_unit | VIEW | 0 | noaccUnit (varchar), IS_POSTING (int) |
| dbo.vw_ar_ba_r1 | VIEW | 0 | CUSTOMER (char) |
| dbo.vw_hris_Leave_Transfer | VIEW | 0 | InpDate (date) |
| dbo.vw_log_absensi | VIEW | 0 | DATETIME (datetime) |
| dbo.vw_wmssumstok | VIEW | 0 | Materialid (char), MaterialName (varchar), Quantity (numeric), UoM (char) |
| dbo.WMS_ADJUSTMENT_ACC | TABLE | 0 | Materialid (nvarchar), AdjQuantity (decimal), Inp_Date (datetime), Upd_Date (datetime) |
| dbo.WMS_ADJUSTMENTHED_ACC | TABLE | 0 | RefDate (datetime), CloseDate (datetime), IS_POSTING (int), User_posting (varchar), Date_posting (datetime) |
| dbo.WMS_APPROV_RESERVASI | TABLE | 0 | DATE_APPROVED (datetime), DATE_CREATE (datetime) |
| dbo.WMS_DRR | TABLE | 0 | TANGGAL (datetime) |
| dbo.WMS_EQUIPMENT | TABLE | 0 | updated_at (datetime) |
| dbo.WMS_INCOMING_BRAKEASSY_DETAIL | TABLE | 0 | PART_NUMBER (varchar), MATERIAL_ID (varchar), QTY_CASE (int), QTY_MATERIAL (decimal), QTY_PER_CASE (decimal) |
| dbo.WMS_MATERIALPESAN_HISTORY | TABLE | 0 | MATERIALPESAN_ID (varchar), MATERIALID (varchar), QTY (varchar), Inp_Date (datetime) |
| dbo.WMS_MatStockBA | TABLE | 0 | Materialid (char), LastMonDate (smalldatetime), LastMonQty (numeric), LastBeginQty (numeric), LastReceiveQty (numeric), LastIssueQty (numeric) |
| dbo.WMS_MUTATION | TABLE | 0 | Materialid (char), Quantity (numeric), Inp_Date (datetime), Upd_Date (datetime) |
| dbo.WMS_MUTATIONHED | TABLE | 0 | RefDate (datetime), CloseDate (datetime) |
| dbo.WMS_OP | TABLE | 0 | MESIN (char) |
| dbo.WMS_REALOCATION | TABLE | 0 | Materialid (char), Quantity (numeric), Inp_Date (datetime), Upd_Date (datetime) |
| dbo.WMS_REALOCATIONHED | TABLE | 0 | RefDate (datetime), CloseDate (datetime) |
| dbo.WMS_WRITEOFF | TABLE | 0 | Materialid (char), Quantity (numeric), Inp_Date (datetime), Upd_Date (datetime) |
| dbo.WMS_WRITEOFFHED | TABLE | 0 | RefDate (datetime), CloseDate (datetime) |
| dbo.WMSV_StockPerLocation | VIEW | 0 | Materialid (char), MaterialName (varchar), BeginQty (numeric), UoM (char) |
| dbo.WMSV_STOPERIODE | VIEW | 0 | Materialid (char), BeginQty (numeric) |

## Populated Candidates

- dbo.FINV_MONITOR_LISTINVOICE: 600077 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.WMS_QTY_TRANSAKSI: 440174 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.PODetail: 271738 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.inc_rm: 241885 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.TRANS1: 230373 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.belicst: 211286 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.DTRANS_CLOSING: 207073 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.WMSV_MIS: 205856 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.PRDetail: 194291 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.DTRANS_BA_R1: 191201 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.belicst2: 190548 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.MATERIAL_PESAN: 190476 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.belicst4: 190021 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.inc_rm_backup2: 185084 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.inc_rm_backup: 184106 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.SupplyFng: 175288 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.trial_ba_detail: 156638 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.WMSV_SCUnion: 150928 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.WMSV_SC3: 126458 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.FINV_MONITOR_LISTDELIVERY: 119199 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.dataDetailCheckSheet: 115464 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.belicst3: 106718 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.WMS_AMOUNT_TRANSAKSI: 102867 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.Transaksi_Stok: 96645 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.PURCV_RFBID: 94526 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.PURCV_POSTS: 68743 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.selisih_inventory: 58700 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.HTRANS_BA_R1: 50529 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.PR: 50508 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.
- dbo.ACCV_JurnalPembelian: 48940 rows; status PROBABLE_CANDIDATE until exact Sales part/material bridge is validated.

## Conclusion

- Production actual source: not confirmed.
- Sales Part -> Production bridge: candidate validation is documented separately in business-link-validation.md.
- No achievement, remaining, reject, downtime, or ETA formula is implemented.