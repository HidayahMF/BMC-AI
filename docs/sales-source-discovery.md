# Sales Source Discovery

Read-only SQL Server metadata and bounded samples. No credentials or full transaction dumps are written.

## Candidate Objects

| Object | Type | Approx rows | Latest observed date | Flags | Score |
|---|---|---:|---|---|---:|
| dbo.PODetail | TABLE | 271738 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.FINV_MONITOR_LISTDELIVERY | VIEW | 119197 | Tanggal: Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time); TerimaDate: Tue Sep 29 2026 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, VIEW | 5 |
| dbo.PURCV_POSTS | VIEW | 68743 | PODate: Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time); ETADate: Mon Nov 30 2026 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, VIEW | 5 |
| dbo.SLS_DELIVERYORDER_NEW | TABLE | 32654 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.FINV_AR_SALES | VIEW | 30495 | invoice_date: Wed Sep 23 2026 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, VIEW | 5 |
| dbo.vw_sls_order | VIEW | 28766 | Invoice_date: Wed Sep 23 2026 07:00:00 GMT+0700 (Western Indonesia Time); Due_date: Thu Nov 05 2026 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, VIEW | 5 |
| dbo.SLS_SALESORDER_NEW | TABLE | 28594 | PODelFrom: Tue Jan 26 2027 07:00:00 GMT+0700 (Western Indonesia Time); PODelTo: Mon Apr 19 2027 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.vw_sls_order1 | VIEW | 27793 | Invoice_date: Wed Sep 23 2026 07:00:00 GMT+0700 (Western Indonesia Time); Due_date: Thu Nov 05 2026 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, VIEW | 5 |
| dbo.POV | TABLE | 18779 | Date: Thu Nov 28 2019 20:37:41 GMT+0700 (Western Indonesia Time); CreateDate: Thu Nov 28 2019 20:37:41 GMT+0700 (Western Indonesia Time); ApproveDate: Tue Feb 04 2014 23:23:37 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.PURCV_UNION_HIST_PO | VIEW | 14712 | PODate: Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, VIEW | 5 |
| dbo.SLS_DELIVERYORDER_HED_NEW | TABLE | 13693 | Tanggal: Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time); inp_date: Mon Sep 28 2026 21:51:18 GMT+0700 (Western Indonesia Time); Approve_date: Mon Sep 28 2026 21:51:18 GMT+0700 (Western Indonesia Time); TerimaDate: Tue Sep 29 2026 07:00:00 GMT+0700 (Western Indonesia Time); ApproveDateAR: Mon Sep 28 2026 20:16:10 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.PO_JOIN_ACCESS | VIEW | 12838 | PRReceivedDate: Mon Sep 28 2026 21:02:24 GMT+0700 (Western Indonesia Time); BidDate: Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time); PODate: Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, VIEW | 5 |
| dbo.PURC_PURCHASE_ORDER | TABLE | 12818 | HoldDate: Mon Jan 01 1900 07:07:12 GMT+0707 (Western Indonesia Time); CancelDate: Mon Jan 01 1900 07:07:12 GMT+0707 (Western Indonesia Time); Senddate: Mon Jan 01 1900 07:07:12 GMT+0707 (Western Indonesia Time); inp_date: Mon Sep 28 2026 21:04:13 GMT+0700 (Western Indonesia Time); upd_date: Mon Jan 01 1900 07:07:12 GMT+0707 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.PURCV_HARGAPO | VIEW | 12818 | none | HAS_ROWS, NO_DATE_DATA, VIEW | 3 |
| dbo.WMS_PO_MATERIAL | VIEW | 12794 | LAST_DATE_MRS: Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, VIEW | 5 |
| dbo.PURCV_PO_BARANG | VIEW | 11774 | BidDate: Mon Jun 29 2026 07:00:00 GMT+0700 (Western Indonesia Time); TGL_PO: Mon Aug 03 2026 07:00:00 GMT+0700 (Western Indonesia Time); POKIRIM: Mon Jun 29 2026 07:00:00 GMT+0700 (Western Indonesia Time); ETADate: Mon Nov 30 2026 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, VIEW | 5 |
| dbo.SLS_DELIVERYORDER | TABLE | 10153 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.SLS_SALESORDER_HED_NEW_BACKUP_ORPHAN | TABLE | 9758 | PODate: Wed Nov 26 2025 07:00:00 GMT+0700 (Western Indonesia Time); inp_date: Wed Nov 26 2025 09:31:35 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE, NAME_PENALTY | 3 |
| dbo.PURCV_HIST_LASTPO | VIEW | 8695 | Date: Mon Jun 29 2026 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, VIEW | 5 |
| dbo.SLS_SALESORDER_HED_NEW | TABLE | 8092 | PODate: Wed Sep 30 2026 07:00:00 GMT+0700 (Western Indonesia Time); inp_date: Mon Sep 28 2026 16:46:19 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.PURCV_PO_MAT | VIEW | 6861 | duedate: Tue Oct 06 2026 07:00:00 GMT+0700 (Western Indonesia Time); PODate: Mon Jun 29 2026 07:00:00 GMT+0700 (Western Indonesia Time); TANGGAL: Fri Sep 25 2026 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, VIEW | 5 |
| dbo.SLS_DELIVERYORDER_HED | TABLE | 5839 | Tanggal: Mon Jun 26 2023 07:00:00 GMT+0700 (Western Indonesia Time); inp_date: Mon Jun 26 2023 07:00:00 GMT+0700 (Western Indonesia Time); approval_date: Mon Jun 26 2023 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.PURC_PO_JENIS | TABLE | 5042 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.PURC_PURCH_ORDER_HED | TABLE | 4700 | PODate: Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time); ETADate: Mon Nov 30 2026 07:00:00 GMT+0700 (Western Indonesia Time); UpdDate: Mon Jun 29 2026 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.BDVV_ListDtlTdTrmPO | VIEW | 3665 | none | HAS_ROWS, NO_DATE_DATA, VIEW | 3 |
| dbo.FIN_PEMBV_PO_ADVANCE | VIEW | 2278 | none | HAS_ROWS, NO_DATE_DATA, VIEW | 3 |
| dbo.PURC_PRICE_PO_ACCES | TABLE | 1879 | Date: Fri Jul 16 2021 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.Product Main Data | TABLE | 1671 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.SLS_SALESORDER_HED_NEW_BACKUP2 | TABLE | 1379 | PODate: Fri Nov 28 2025 07:00:00 GMT+0700 (Western Indonesia Time); inp_date: Fri Nov 28 2025 09:35:39 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE, NAME_PENALTY | 3 |
| dbo.SLS_SALESORDER_HED_NEW2 | TABLE | 1097 | PODate: Fri Nov 28 2025 07:00:00 GMT+0700 (Western Indonesia Time); inp_date: Fri Nov 28 2025 08:48:39 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.SLS_SALESORDER_HED_NEW_BACKUP | TABLE | 1090 | PODate: Thu Nov 27 2025 07:00:00 GMT+0700 (Western Indonesia Time); inp_date: Thu Nov 27 2025 09:30:23 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE, NAME_PENALTY | 3 |
| dbo.PURC_PURCHASE_ORDER_HISTORY | TABLE | 1004 | HoldDate: Mon Jan 01 1900 07:07:12 GMT+0707 (Western Indonesia Time); CancelDate: Mon Jan 01 1900 07:07:12 GMT+0707 (Western Indonesia Time); Senddate: Mon Jan 01 1900 07:07:12 GMT+0707 (Western Indonesia Time); inp_date: Mon Sep 28 2026 21:40:05 GMT+0700 (Western Indonesia Time); upd_date: Mon Jan 01 1900 07:07:12 GMT+0707 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.MAS_KATALOG_SALES | TABLE | 672 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.tbl_access_menu_sales | TABLE | 607 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.BDVV_GroupedListTdTrmPO | VIEW | 539 | none | HAS_ROWS, NO_DATE_DATA, VIEW | 3 |
| dbo.BDVV_ListTdTrmPO | VIEW | 539 | none | HAS_ROWS, NO_DATE_DATA, VIEW | 3 |
| dbo.SLS_CUSTOMER | TABLE | 332 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.hris_skk_JawabanTemporary | TABLE | 265 | none | HAS_ROWS, NO_DATE_DATA, TABLE, NAME_PENALTY | 1 |
| dbo.PPC_TonProductTonFinish | TABLE | 259 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.CR_idea_potential_monthly | TABLE | 164 | updated_at: Fri Sep 25 2026 08:04:30 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.WMS_MAPPING_PART_DELIVERY_PRD | TABLE | 92 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.tbl_menu_sales | TABLE | 88 | create_date: Mon Jan 01 1900 07:07:12 GMT+0707 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.DELIVERY_TUJUAN | TABLE | 66 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.FINV_PO_DP | VIEW | 56 | none | HAS_ROWS, NO_DATE_DATA, VIEW | 3 |
| dbo.POSTING_BA | TABLE | 46 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.p2k3_nearmiss_report | TABLE | 40 | tanggal_laporan: Tue Sep 01 2026 07:00:00 GMT+0700 (Western Indonesia Time); tanggal_kejadian: Tue Sep 01 2026 07:00:00 GMT+0700 (Western Indonesia Time); inp_date: Tue Sep 01 2026 16:58:47 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.KELOMPOK_BRG | TABLE | 36 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.forecast | TABLE | 30 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.SLS_SALESORDER_SO | TABLE | 15 | PODelFrom: Wed Oct 01 2025 07:00:00 GMT+0700 (Western Indonesia Time); PODelTo: Fri Oct 31 2025 07:00:00 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.MAS_KODE_DELIVERY | TABLE | 7 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.DeliveryClaimRjk | TABLE | 5 | tanggal: Mon Jul 06 2026 07:00:00 GMT+0700 (Western Indonesia Time); inpDate: Mon Jul 06 2026 18:00:04 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.SLS_SALES_JENIS_HARGA | TABLE | 5 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.SLS_SALESORDER_HED_SO | TABLE | 5 | PODate: Tue Sep 30 2025 07:00:00 GMT+0700 (Western Indonesia Time); inp_date: Tue Sep 30 2025 16:12:46 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.EmployeeContractImportStaging | TABLE | 4 | CreatedAt: Sat Sep 19 2026 22:52:27 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.hris_poling_jawaban | TABLE | 4 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.pfa_delivery | TABLE | 4 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.WBS_JENIS_PELAPORAN | TABLE | 4 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.PURCH_SALES | TABLE | 2 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.hris_poling | TABLE | 1 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.hris_poling_pertanyaan | TABLE | 1 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.MAS_KATALOG_SALES_DETAIL | TABLE | 1 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| dbo.parameter_tunjangan_transport | TABLE | 1 | created_at: Tue Jul 21 2026 22:16:02 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.PROJ_REPORT | TABLE | 1 | none | HAS_ROWS, NO_DATE_DATA, TABLE | 2 |
| vms.SecurityTravelCheckpoints | TABLE | 1 | DepartureDate: Thu Sep 24 2026 07:00:00 GMT+0700 (Western Indonesia Time); CreatedAt: Thu Sep 24 2026 11:27:32 GMT+0700 (Western Indonesia Time) | HAS_ROWS, HAS_DATE_DATA, TABLE | 4 |
| dbo.FINV_SLS_DELIVERY | VIEW | 0 | none | EMPTY, NO_DATE_DATA, VIEW | 1 |
| dbo.FINV_SLS_DELIVERY_NONSALES | VIEW | 0 | none | EMPTY, NO_DATE_DATA, VIEW | 1 |
| dbo.FNAT_DISPOSAL | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.FNAT_KELOMPOKPAJAK | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.FNAT_REFDISPOSAL | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.LedgerSalesPerPeriodPerHeadAcc | VIEW | 0 | none | EMPTY, NO_DATE_DATA, VIEW | 1 |
| dbo.MAS_JENIS_KATALOG_SALES | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.MAS_KATALOG_SALES_DETAIL_OLD | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE, NAME_PENALTY | -1 |
| dbo.MAS_KATALOG_SALES_OLD | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE, NAME_PENALTY | -1 |
| dbo.PROJ_PROJECTPRODUCT | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.PURC_PO_ACCESS | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_APPROVAL_USER | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_DELIVERYNONSALES | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_DELIVERYNONSALES_HED | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_DO_ACCES | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_NG_SUBCONT | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_NG_SUBCONT_HED | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_PO_ACCES | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_PRODUCT | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_RETRUNDELIVERYORDER | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_RETRUNDELIVERYORDER_HED | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_RETURNDELIVERYORDER | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_RETURNDELIVERYORDER_HED | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_SALESORDER | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_SALESORDER_HED | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_SALESORDER_NEW_TEMP | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE, NAME_PENALTY | -1 |
| dbo.SLS_SALESORDERFC | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLS_SALESORDERFC_HED | TABLE | 0 | none | EMPTY, NO_DATE_DATA, TABLE | 0 |
| dbo.SLSV_PO_DO_DELIVERY | VIEW | 0 | none | EMPTY, NO_DATE_DATA, VIEW | 1 |

## Strongest Candidates

### dbo.FINV_MONITOR_LISTDELIVERY

- Type: VIEW
- Rows: 119197
- Flags: HAS_ROWS, HAS_DATE_DATA, VIEW
- Dependencies: dbo.FIN_INVOICE, dbo.FIN_INVOICE_HED, dbo.MAS_CURRENCY, dbo.MAS_CUSTOMER, dbo.MAS_KATALOG_SALES, dbo.MAS_KENDARAAN, dbo.MAS_PART_NUMBER, dbo.SLS_DELIVERYORDER_HED_NEW, dbo.SLS_DELIVERYORDER_NEW, dbo.SLS_SALESORDER_HED_NEW, dbo.SLS_SALESORDER_NEW
- Date coverage: Tanggal=Tue Nov 04 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time), TerimaDate=Wed Jun 21 1905 07:07:12 GMT+0707 (Western Indonesia Time)..Tue Sep 29 2026 07:00:00 GMT+0700 (Western Indonesia Time)
- Domain columns: SalesType (varchar), CustId (int), CustomerName (nvarchar), Tanggal (date), TerimaDate (datetime), NoPO (varchar), ProductID (varchar), Part_Description (varchar), Part_Number (nvarchar), Qty (int)
- Sample: bounded TOP (5), values intentionally omitted from documentation

### dbo.PURCV_POSTS

- Type: VIEW
- Rows: 68743
- Flags: HAS_ROWS, HAS_DATE_DATA, VIEW
- Dependencies: dbo.MAS_CURRENCY, dbo.MAS_VENDOR, dbo.PURC_BIDPR, dbo.PURC_MATCATALOG, dbo.PURC_PURCH_ORDER_HED, dbo.PURC_PURCHASE_ORDER, dbo.PURC_USER, dbo.WMS_PO_MATERIAL
- Date coverage: PODate=Sat Apr 05 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time), ETADate=Sat Apr 05 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Mon Nov 30 2026 07:00:00 GMT+0700 (Western Indonesia Time)
- Domain columns: PONo (char), PODate (datetime), ETADate (datetime), MaterialId (char), MaterialName (varchar), POQTY (numeric), POStatus (varchar), Status (varchar)
- Sample: bounded TOP (5), values intentionally omitted from documentation

### dbo.FINV_AR_SALES

- Type: VIEW
- Rows: 30495
- Flags: HAS_ROWS, HAS_DATE_DATA, VIEW
- Dependencies: dbo.AR_AccountCustomer, dbo.FIN_INVOICE_HED, dbo.vw_sls_order1
- Date coverage: invoice_date=Wed Nov 05 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Wed Sep 23 2026 07:00:00 GMT+0700 (Western Indonesia Time)
- Domain columns: invoice_date (date), po_no (nvarchar), IS_POSTING (int), productDescription (nvarchar)
- Sample: bounded TOP (5), values intentionally omitted from documentation

### dbo.vw_sls_order

- Type: VIEW
- Rows: 28766
- Flags: HAS_ROWS, HAS_DATE_DATA, VIEW
- Dependencies: dbo.AR_AccountCustomer, dbo.FIN_INVOICE, dbo.FIN_INVOICE_HED, dbo.MAS_CUSTOMER, dbo.MAS_KATALOG_SALES, dbo.MAS_PART_NUMBER
- Date coverage: Invoice_date=Wed Nov 05 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Wed Sep 23 2026 07:00:00 GMT+0700 (Western Indonesia Time), Due_date=Fri Dec 05 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Thu Nov 05 2026 07:00:00 GMT+0700 (Western Indonesia Time)
- Domain columns: CustomerId (int), Invoice_date (date), Due_date (date), CustID (nvarchar), CustomerName (nvarchar), po_no (nvarchar), IS_POSTING (int), Part_Description (varchar), productDescription (varchar), Qty (decimal), AccCodeSales (nvarchar)
- Sample: bounded TOP (5), values intentionally omitted from documentation

### dbo.vw_sls_order1

- Type: VIEW
- Rows: 27793
- Flags: HAS_ROWS, HAS_DATE_DATA, VIEW
- Dependencies: dbo.AR_AccountCustomer, dbo.FIN_INVOICE, dbo.FIN_INVOICE_HED, dbo.MAS_CUSTOMER, dbo.MAS_KATALOG_SALES, dbo.MAS_PART_NUMBER
- Date coverage: Invoice_date=Wed Nov 05 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Wed Sep 23 2026 07:00:00 GMT+0700 (Western Indonesia Time), Due_date=Fri Dec 05 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Thu Nov 05 2026 07:00:00 GMT+0700 (Western Indonesia Time)
- Domain columns: CustomerId (int), Invoice_date (date), Due_date (date), CustID (nvarchar), CustomerName (nvarchar), po_no (nvarchar), IS_POSTING (int), Part_Description (varchar), productDescription (varchar), Qty (decimal), AccCodeSales (nvarchar)
- Sample: bounded TOP (5), values intentionally omitted from documentation

### dbo.PURCV_UNION_HIST_PO

- Type: VIEW
- Rows: 14712
- Flags: HAS_ROWS, HAS_DATE_DATA, VIEW
- Dependencies: dbo.MAS_CURRENCY, dbo.MAS_VENDOR, dbo.PURC_MATCATALOG, dbo.PURC_PRICE_PO_ACCES, dbo.PURC_PURCH_ORDER_HED, dbo.PURC_PURCHASE_ORDER
- Date coverage: PODate=Mon Jan 04 2021 07:00:00 GMT+0700 (Western Indonesia Time)..Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time)
- Domain columns: PONo (varchar), PODate (datetime), MaterialId (varchar), MaterialName (varchar), Quantity (varchar)
- Sample: bounded TOP (5), values intentionally omitted from documentation

### dbo.PO_JOIN_ACCESS

- Type: VIEW
- Rows: 12838
- Flags: HAS_ROWS, HAS_DATE_DATA, VIEW
- Dependencies: dbo.MAS_CURRENCY, dbo.MAS_VENDOR, dbo.PURC_BIDCOMPAREHED, dbo.PURC_BIDPR, dbo.PURC_MATCATALOG, dbo.PURC_PO_ACCESS, dbo.PURC_PURCH_ORDER_HED, dbo.PURC_PURCHASE_ORDER, dbo.PURC_PURCHASE_REQUEST
- Date coverage: PRReceivedDate=Tue Apr 01 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Mon Sep 28 2026 21:02:24 GMT+0700 (Western Indonesia Time), BidDate=Sun Jan 13 2019 07:00:00 GMT+0700 (Western Indonesia Time)..Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time), PODate=Sat Apr 05 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time)
- Domain columns: PRReceivedDate (datetime), BidDate (datetime), PONo (nvarchar), PODate (datetime), MaterialId (nvarchar), MaterialName (nvarchar), PoQty (float)
- Sample: bounded TOP (5), values intentionally omitted from documentation

### dbo.WMS_PO_MATERIAL

- Type: VIEW
- Rows: 12794
- Flags: HAS_ROWS, HAS_DATE_DATA, VIEW
- Dependencies: dbo.PURC_BIDPR, dbo.PURC_PURCH_ORDER_HED, dbo.TRANS1
- Date coverage: LAST_DATE_MRS=Tue Jun 17 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Mon Sep 28 2026 07:00:00 GMT+0700 (Western Indonesia Time)
- Domain columns: PONo (char), TOTAL_QTY (numeric), MaterialId (char), LAST_DATE_MRS (datetime), STATUS (varchar)
- Sample: bounded TOP (5), values intentionally omitted from documentation

### dbo.PURCV_PO_BARANG

- Type: VIEW
- Rows: 11774
- Flags: HAS_ROWS, HAS_DATE_DATA, VIEW
- Dependencies: dbo.BPI_MR, dbo.MAS_VENDOR, dbo.PURC_BIDCOMPAREHED, dbo.PURC_BIDPR, dbo.PURC_PURCH_ORDER_HED, dbo.PURC_PURCHASE_ORDER, dbo.PURC_USER
- Date coverage: BidDate=Sun Jan 13 2019 07:00:00 GMT+0700 (Western Indonesia Time)..Mon Jun 29 2026 07:00:00 GMT+0700 (Western Indonesia Time), TGL_PO=Mon Jan 01 1900 07:07:12 GMT+0707 (Western Indonesia Time)..Mon Aug 03 2026 07:00:00 GMT+0700 (Western Indonesia Time), POKIRIM=Sat Apr 05 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Mon Jun 29 2026 07:00:00 GMT+0700 (Western Indonesia Time), ETADate=Sat Apr 05 2025 07:00:00 GMT+0700 (Western Indonesia Time)..Mon Nov 30 2026 07:00:00 GMT+0700 (Western Indonesia Time)
- Domain columns: BidDate (datetime), AppDate (nvarchar), TGL_PO (datetime), POKIRIM (datetime), ETADate (datetime), QTY (numeric)
- Sample: bounded TOP (5), values intentionally omitted from documentation

### dbo.PURCV_HIST_LASTPO

- Type: VIEW
- Rows: 8695
- Flags: HAS_ROWS, HAS_DATE_DATA, VIEW
- Dependencies: dbo.MAS_CURRENCY, dbo.MAS_VENDOR, dbo.PURC_MATCATALOG, dbo.PURC_PRICE_PO_ACCES, dbo.PURC_PURCH_ORDER_HED, dbo.PURC_PURCHASE_ORDER
- Date coverage: Date=Mon Jan 04 2021 07:00:00 GMT+0700 (Western Indonesia Time)..Mon Jun 29 2026 07:00:00 GMT+0700 (Western Indonesia Time)
- Domain columns: POId (int), PONo (varchar), Date (datetime), MaterialId (int), MaterialName (varchar), POQty (varchar)
- Sample: bounded TOP (5), values intentionally omitted from documentation

## SLSV_PO_DO_DELIVERY

- Rows: 0
- Definition available: yes
- Dependencies: dbo.MAS_CUSTOMER, dbo.MAS_KATALOG_BT, dbo.MAS_KATALOG_SALES, dbo.MAS_PART_NUMBER, dbo.SLS_DELIVERYORDER, dbo.SLS_DELIVERYORDER_HED, dbo.SLS_DO_ACCES, dbo.SLS_PO_ACCES, dbo.SLS_SALESORDER, dbo.SLS_SALESORDER_HED
- Semantic interpretation remains UNKNOWN until source definition and real sample are validated.

## Selection Status

- No source is promoted automatically by this discovery script.
- A source is CONFIRMED only after data recency, dependency/legacy evidence, customer linkage, product/part linkage, and bounded real transaction validation agree.
- Existing empty `SLS_SALESORDER_HED`, `SLS_SALESORDER`, and `SLS_PRODUCT` remain INACTIVE/EMPTY candidates.