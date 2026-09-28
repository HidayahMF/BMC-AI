# SQL Server Data Catalog

Candidate tables discovered: 22

## dbo.FNAT_JAMUNITPROD

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| Periode | char | NO | no |
| compcode | char | NO | no |
| IdDepartemen | char | NO | no |
| Jamkerja | numeric | NO | no |
| UnitProduk | numeric | NO | no |
| TglClose | datetime | NO | no |

## dbo.MAS_CUSTOMER

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| CustId | int | NO | yes |
| CustomerName | nvarchar | YES | no |
| Address | text | YES | no |
| KatId | nvarchar | YES | no |
| Email | nvarchar | YES | no |
| No_Telp | nvarchar | YES | no |
| ContactPerson | nvarchar | YES | no |
| No_Hp | nvarchar | YES | no |
| Kirim_A | text | YES | no |
| Kirim_B | text | YES | no |
| Kirim_C | text | YES | no |
| IdOldCust | nvarchar | YES | no |
| CurrCode | char | YES | no |
| Currency | varchar | YES | no |
| TypeTax | varchar | YES | no |
| NPWPName | nvarchar | YES | no |
| NPWP | nvarchar | YES | no |
| PPH | char | YES | no |
| PPN | varchar | YES | no |
| ApproveIC | int | YES | no |
| DateAppIC | datetime | YES | no |
| ApproveFN | int | YES | no |
| DateAppFN | datetime | YES | no |
| TermOfPaymentId | varchar | YES | no |
| TermOfDeliveryId | varchar | YES | no |
| IdOldCustI | varchar | YES | no |
| IdOldCustII | varchar | YES | no |
| NPWPAddresss | text | YES | no |
| JabatanPerson | varchar | YES | no |
| FileNPWP | varchar | YES | no |
| FilePKP | varchar | YES | no |
| FileSKTP | varchar | YES | no |
| FileDomisili | varchar | YES | no |
| AlasanFN | varchar | YES | no |
| AlasanIC | varchar | YES | no |
| Alasan | varchar | YES | no |
| AlamatWeb | varchar | YES | no |
| StatusInvestment | varchar | YES | no |
| ProductionPrimary | varchar | YES | no |
| ProductionSecondary | varchar | YES | no |
| ProductionCapacity | varchar | YES | no |
| ContactPersonPurchasing | varchar | YES | no |
| PhonePurchasing | varchar | YES | no |
| ContactPersonFinance | varchar | YES | no |
| PhoneFinance | varchar | YES | no |
| ContactPersonPPIC | varchar | YES | no |
| PhonePPIC | varchar | YES | no |
| ContactPersonQuality | varchar | YES | no |
| PhoneQuality | varchar | YES | no |
| QECertificate | varchar | YES | no |
| YearCertification | varchar | YES | no |
| CertificationInstitution | varchar | YES | no |
| PurchasingDomestic | varchar | YES | no |
| PurchasingExport | varchar | YES | no |
| ContactPersonReceiving | varchar | YES | no |
| PhoneReceiving | varchar | YES | no |
| initial | varchar | YES | no |
| Bank | varchar | YES | no |
| noRek | varchar | YES | no |
| Cabang | varchar | YES | no |

## dbo.MAS_MATERIAL

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| Kode | nvarchar | YES | no |
| Description | nvarchar | YES | no |

## dbo.MESIN

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| KODE_LN | varchar | YES | no |
| KODE_MCH | varchar | YES | no |
| NAMA_MCH | varchar | YES | no |
| SPEC | varchar | YES | no |
| SN | varchar | YES | no |
| MFG | varchar | YES | no |
| OP | varchar | YES | no |
| KVA | varchar | YES | no |
| C_WATER | varchar | YES | no |
| C_SOLAR | varchar | YES | no |
| GEARBOX | varchar | YES | no |
| HYDRAULIC | varchar | YES | no |
| SLIDE | varchar | YES | no |
| OSCILATING | varchar | YES | no |
| GREASE | varchar | YES | no |
| ANTIRUST | varchar | YES | no |
| SPINDLE | varchar | YES | no |
| CONTROL | varchar | YES | no |
| MAKER | varchar | YES | no |
| DATE_MCH | date | NO | no |

## dbo.PRODUKSI_CORE

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| Id_ProduksiCore | int | YES | no |
| Shift | int | YES | no |
| BTNo | char | YES | no |
| BeratPcs | float | YES | no |
| accept_core | int | YES | no |
| Reject_Core | int | YES | no |

## dbo.PRODUKSI_FURNACE

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| Id_ProduksiFurnace | int | NO | yes |
| Id_ProduksiMesin | int | YES | no |
| Produksi_Furnace | varchar | YES | no |

## dbo.PRODUKSI_MESIN

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| Id_ProduksiMesin | int | NO | no |
| Id_Lokasi | int | YES | no |
| Produksi_Nama_Mesin | char | YES | no |
| Produksi_UraianMesin | char | YES | no |

## dbo.PRODUKSI_PLANING

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| IDPlaningProduksi | nchar | YES | no |
| BTNo | nchar | YES | no |

## dbo.PRODUKSI_TRIMING

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| Id_ProduksiTriming | int | NO | no |
| ProductId_BT | char | YES | no |
| Id_ProduksiMesin | int | YES | no |
| Id_ProduksiGroup | int | YES | no |
| Shift | char | YES | no |
| Batch | int | YES | no |
| Kode_Produksi | nchar | YES | no |
| Mould_QtyAct | int | YES | no |
| Triming_QtyAct | int | YES | no |
| CreatedDate | datetime | YES | no |
| ModifDate | datetime | YES | no |
| CreatedBy | int | YES | no |
| UpdateBy | int | YES | no |

## dbo.PURC_MATCATALOG

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| Compcode | char | NO | yes |
| Materialid | char | NO | yes |
| MaterialJasa | char | YES | no |
| MaterialType | char | NO | no |
| MaterialGroup | char | NO | no |
| MaterialSubGroup | char | NO | no |
| UoM | char | YES | no |
| Stockid | char | YES | no |
| MaterialName | varchar | YES | no |
| Specification | varchar | YES | no |
| Brand | varchar | YES | no |
| TypeModel | char | YES | no |
| Leadtimedays | int | YES | no |
| ROP | numeric | YES | no |
| MinimalStock | numeric | YES | no |
| MaximalStock | numeric | YES | no |
| OrderLevel | numeric | YES | no |
| DailyConsumtion | numeric | YES | no |
| SafetyStock | numeric | YES | no |
| ROQ | numeric | YES | no |
| StockType | char | YES | no |
| Remark | varchar | YES | no |
| Executor | numeric | YES | no |
| Photo | nvarchar | YES | no |
| Movement | char | YES | no |
| InactiveMark | char | YES | no |
| inp_date | datetime | YES | no |
| inp_by | char | YES | no |
| upd_date | datetime | YES | no |
| upd_by | char | YES | no |
| MatIdOld | text | YES | no |
| AccountCode | char | YES | no |
| AccountGroup | char | YES | no |
| Toleransi | char | YES | no |
| Status | char | YES | no |
| idRak | varchar | YES | no |
| stdPallet | int | YES | no |
| fifo_rm | int | YES | no |
| kelompok | int | YES | no |
| peminta | varchar | YES | no |

## dbo.SLS_CUSTOMER

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| CustomerID | int | NO | no |
| CustomerName | nvarchar | YES | no |
| NPWP | nvarchar | YES | no |
| AccountNo | nvarchar | YES | no |
| Address | nvarchar | YES | no |
| ACCNOUnbill | nvarchar | YES | no |
| ACCNOSales | nvarchar | YES | no |
| ACCNOBill | nvarchar | YES | no |
| BriefName | nvarchar | YES | no |
| IDKelPasar | tinyint | YES | no |
| IDRepMarket | int | YES | no |
| ACCNOBillBank | nvarchar | YES | no |
| Status | bit | YES | no |
| Alias | nvarchar | YES | no |
| Alias1 | nvarchar | YES | no |

## dbo.SLS_DELIVERYORDER

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| Id | int | NO | no |
| HedId | int | YES | no |
| SalesNomor | varchar | YES | no |
| NoPO | varchar | YES | no |
| ProductID | varchar | YES | no |
| Qty | int | YES | no |
| SlsDtlId | bigint | YES | no |
| NoDNS | varchar | YES | no |

## dbo.SLS_DELIVERYORDER_HED

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| Id | int | NO | no |
| Nomor | varchar | YES | no |
| Tanggal | date | YES | no |
| CustomerID | int | YES | no |
| Dari | varchar | YES | no |
| NIP | varchar | YES | no |
| status | int | YES | no |
| inp_by | varchar | YES | no |
| inp_date | datetime | YES | no |
| approval_by | varchar | YES | no |
| approval_date | datetime | YES | no |
| catatan | text | YES | no |
| DONo | nchar | YES | no |
| StsPO | char | YES | no |
| StsDNS | char | YES | no |
| Kendaraan | varchar | YES | no |
| DeliveryPlace | varchar | YES | no |

## dbo.SLS_PRODUCT

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| Id | int | NO | yes |
| ProductDescription | nvarchar | YES | no |
| ProductNo | nvarchar | YES | no |
| BTNo | nvarchar | YES | no |
| CastingWeight | decimal | YES | no |
| MachinedWeight | decimal | YES | no |
| Status | int | YES | no |

## dbo.SLS_SALESORDER

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| ID | int | NO | yes |
| IDheader | int | YES | no |
| ProductID | int | YES | no |
| Qty | decimal | YES | no |
| UnitPrice | decimal | YES | no |
| ConditionID | varchar | YES | no |
| TglBerlaku | datetime | YES | no |
| POUnitPrice1 | decimal | YES | no |
| PODelFrom | date | YES | no |
| PODelTo | date | YES | no |
| DeliveryPlace | varchar | YES | no |

## dbo.SLS_SALESORDER_HED

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| Id | int | NO | yes |
| Nomor | varchar | YES | no |
| PONo | nvarchar | YES | no |
| SKPNo | nvarchar | YES | no |
| PODate | date | YES | no |
| Cycle | varchar | YES | no |
| CustomerID | int | YES | no |
| CurrCode | varchar | YES | no |
| PPN | int | YES | no |
| Discount | decimal | YES | no |
| TermOfPaymentId | varchar | YES | no |
| TermOfDeliveryId | varchar | YES | no |
| DeliveryPlace | char | YES | no |
| PODelFrom | date | YES | no |
| PODelTo | date | YES | no |
| SalesType | varchar | YES | no |
| Note | nvarchar | YES | no |
| TglBerlaku | date | YES | no |
| Attachfile | text | YES | no |
| NIP | varchar | YES | no |
| status | int | YES | no |
| approval_by | varchar | YES | no |
| approval_date | datetime | YES | no |
| catatan | text | YES | no |
| inp_by | varchar | YES | no |
| inp_date | datetime | YES | no |
| StsPono | char | YES | no |
| NoForecast | varchar | YES | no |
| Manager | varchar | YES | no |

## dbo.SLSV_PO_DO_DELIVERY

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| Id | int | NO | no |
| CustId | int | YES | no |
| CustomerName | nvarchar | YES | no |
| PODate | date | YES | no |
| PONo | nvarchar | YES | no |
| DOno | varchar | YES | no |
| DODate | date | YES | no |
| NoPO | varchar | YES | no |
| Nomor | varchar | YES | no |
| BMNo | varchar | YES | no |
| Part_Description | nvarchar | YES | no |
| Model_Part | varchar | YES | no |
| Part_Number | nvarchar | YES | no |
| UnitPrice | decimal | YES | no |
| BCasting | decimal | YES | no |
| Qty | int | YES | no |
| WeightDO | decimal | YES | no |
| totalPrice | decimal | YES | no |

## dbo.SumMatStock

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| OwnerId | char | YES | no |
| Materialid | char | YES | no |
| MaterialName | varchar | YES | no |
| Quantity | numeric | YES | no |
| UoM | char | YES | no |
| Stockid | char | YES | no |

## dbo.WMS_MatStock

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| OwnerId | char | YES | no |
| Materialid | char | NO | no |
| Warehouse | char | YES | no |
| Location | varchar | YES | no |
| LastMonDate | smalldatetime | YES | no |
| LastBeginQty | decimal | YES | no |
| LastBeginAmount | decimal | YES | no |
| LastReceiveQty | decimal | YES | no |
| LastReceiveAmount | decimal | YES | no |
| LastIssueQty | decimal | YES | no |
| LastIssueAmount | decimal | YES | no |
| LastReturnQty | decimal | YES | no |
| LastReturnAmount | decimal | YES | no |
| LastAdjustQty | decimal | YES | no |
| LastAdjustAmount | decimal | YES | no |
| LastMutationQty | decimal | YES | no |
| LastMutationAmount | decimal | YES | no |
| LastRealocQty | decimal | YES | no |
| LastRealocAmount | decimal | YES | no |
| LastWriteOffQty | decimal | YES | no |
| LastWriteOffAmount | decimal | YES | no |
| LastMonQty | decimal | YES | no |
| LastMonAmount | decimal | YES | no |
| Year | char | NO | no |
| Month | char | NO | no |

## dbo.WMS_MUTATION

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| CompCode | char | NO | no |
| RefNo | char | NO | no |
| ItemNo | numeric | NO | no |
| OwnerId | char | YES | no |
| Materialid | char | YES | no |
| WarehouseNoFrom | char | YES | no |
| LocationFrom | char | YES | no |
| WarehouseNoTo | char | YES | no |
| LocationTo | char | YES | no |
| Quantity | numeric | YES | no |
| Inp_Date | datetime | YES | no |
| Inp_By | varchar | YES | no |
| Upd_Date | datetime | YES | no |
| Upd_By | varchar | YES | no |

## dbo.WMS_MUTATIONHED

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| RefNo | nvarchar | YES | no |
| RefDate | datetime | YES | no |
| Month | nvarchar | YES | no |
| Year | nvarchar | YES | no |
| EmployeeId | nvarchar | YES | no |
| CloseDate | datetime | YES | no |
| Id | int | NO | no |
| TGL_ENTRY | datetime | YES | no |
| ENTRY_BY | nchar | YES | no |

## dbo.WMSV_STOEndSumOwner

| Column | Type | Nullable | Primary key |
|---|---|---|---|
| OwnerId | char | YES | no |
| Materialid | char | YES | no |
| Ending | numeric | YES | no |
