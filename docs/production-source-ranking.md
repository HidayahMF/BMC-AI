# Anchored Hino Discovery

Discovery uses a bounded real Sales reference set from MAS_CUSTOMER.CustId=5. Values are not dumped to documentation.

`Transaksi_Stok_Fg` is a high-value finished-goods transaction candidate because its `ProductId` matches real Sales ProductID and it has `Tanggal`, `Qty`, `Satuan`, warehouse/location, and transaction type. It remains **PROBABLE_CANDIDATE**, not actual production, until `JenisTransaksi` and process semantics are validated.

## Reference Set

- Sales reference rows: 44
- Distinct ProductID: 11
- Distinct normalized PartNumber: 12
- Orders represented: 1

## Production Candidate Ranking

| Rank | Object | Type | Rows | ProductID matches | PartNumber matches | Quantity fields | Date fields | Machine/process fields | Reason |
|---:|---|---|---:|---:|---:|---|---|---|---|
| 1 | dbo.FINV_MONITOR_LISTDELIVERY | VIEW | 119202 | 48622 | 0 | Qty | none | none | business-domain match; classify before production use |
| 2 | dbo.SLS_SALESORDER_NEW | TABLE | 28594 | 3203 | 3500 | Qty | none | none | business-domain match; classify before production use |
| 3 | dbo.FIN_INVOICE | TABLE | 32768 | 3361 | 0 | Qty | none | none | business-domain match; classify before production use |
| 4 | dbo.SLS_DELIVERYORDER_NEW | TABLE | 32659 | 2911 | 0 | Qty, QtyCheck | none | none | business-domain match; classify before production use |
| 5 | dbo.Transaksi_Stok_Fg | TABLE | 35063 | 1949 | 0 | Qty | none | none | production/WMS-like domain |
| 6 | dbo.PRDetail | TABLE | 194291 | 125 | 0 | PRQty | none | none | production/WMS-like domain |
| 7 | dbo.MAS_KATALOG_BT | TABLE | 477 | 0 | 16 | none | none | none | business-domain match; classify before production use |
| 8 | dbo.WMS_MAPPING_PART_DELIVERY_PRD | TABLE | 92 | 4 | 0 | none | none | none | production/WMS-like domain |

## Classification

- Exact ProductID or normalized PartNumber match is discovery evidence only.
- PRDetail is not treated as production until PR/PRDetail business purpose is classified.
- Finance, invoice, purchase-request, inventory-balance, master, backup, and temporary objects are not actual-production evidence by row count alone.
- Actual output requires validated output/good/finished semantics plus date and identifier evidence.

## PR / PRDetail Classification

- PR columns: [{"PRID":113097,"PRType":1,"PRNo":"511m19-EM","PRDate":"2019-11-15T00:00:00.000Z","SecID":"02","ETA":"2019-12-25T00:00:00.000Z","Note":"","PIC":"","Toyota":false,"PRMachType":0,"MachVendorId":0,"PRforCustTypeId":0,"Urgent":false,"Appdate":null,"Appby":"","IDLama":null,"JenisPR":null},{"PRID":113096,"PRType":2,"PRNo":"105/HR&GA/XI/19","PRDate":"2019-11-15T00:00:00.000Z","SecID":"54","ETA":"2019-11-22T00:00:00.000Z","Note":"","PIC":"","Toyota":false,"PRMachType":0,"MachVendorId":0,"PRforCustTypeId":0,"Urgent":false,"Appdate":null,"Appby":"","IDLama":null,"JenisPR":null},{"PRID":113095,"PRType":2,"PRNo":"021/MTC-MS/X/19","PRDate":"2019-11-15T00:00:00.000Z","SecID":"82","ETA":"2019-11-16T00:00:00.000Z","Note":"","PIC":"","Toyota":false,"PRMachType":0,"MachVendorId":0,"PRforCustTypeId":0,"Urgent":false,"Appdate":null,"Appby":"","IDLama":null,"JenisPR":null},{"PRID":113094,"PRType":1,"PRNo":"512m19-P2M","PRDate":"2019-11-15T00:00:00.000Z","SecID":"22","ETA":"2019-12-30T00:00:00.000Z","Note":"","PIC":"","Toyota":false,"PRMachType":0,"MachVendorId":0,"PRforCustTypeId":0,"Urgent":false,"Appdate":null,"Appby":"","IDLama":null,"JenisPR":null},{"PRID":113093,"PRType":2,"PRNo":"150/MS/2019","PRDate":"2019-11-15T00:00:00.000Z","SecID":"93","ETA":"2019-11-29T00:00:00.000Z","Note":"","PIC":"","Toyota":false,"PRMachType":0,"MachVendorId":0,"PRforCustTypeId":0,"Urgent":false,"Appdate":null,"Appby":"","IDLama":null,"JenisPR":null}]
- Preliminary domain classification: Purchase Request candidate because parent is `PR`, fields include PR date and requested quantity/material references. Not production actual.

## WMS_MAPPING_PART_DELIVERY_PRD

- Sample row count: 20
- Columns: id, Line, Deliver, Produksi, Name, ProductId, RateDelivery, StokAwal, periodeBulan, periodeTahun, StokAkhir, Sumber, Proses1, Proses2, Proses3, Last, CUST, NEED SUBC, MaterialIdRaw, MaterialIdSub
- ProductID matches from prior bounded validation: 8.
- Role remains bridge candidate until its business purpose and exact target semantics are validated.

## Casting Candidates

- dbo.casting1: 2205 rows; columns: PART_NUMBER (varchar), KODE_PARTNAME (varchar)
- dbo.WMS_CASTING: 430 rows; columns: metadata not in anchor column set
- dbo.WMS_MatStockCasting: 553 rows; columns: Materialid (char), LastBeginQty (decimal), LastReceiveQty (decimal), LastIssueQty (decimal), LastReturnQty (decimal), LastAdjustQty (decimal), LastMutationQty (decimal), LastRealocQty (decimal), LastWriteOffQty (decimal), LastMonQty (decimal)
- dbo.PPC_TonProductTonFinish: 259 rows; columns: TonFinishedP1 (float), TonFinishedP2 (float), TonFinishedP3 (float), TonFinishedP4 (float), TonFinishedP5 (float), TonFinishedAM (float)

## Reverse Delivery -> Sales

- Delivery detail sample: 79
- PO + customer + ProductID matched: 79
- Unmatched: 0
- Ambiguous matches require separate count when one delivery key resolves to multiple Sales headers.


## Production Conclusion

- `Transaksi_Stok_Fg` remains the strongest downstream candidate, but actual production source: NOT CONFIRMED.
- `JenisTransaksi=D` has bounded evidence `Masuk dari LineMP L`, positive Qty, `Satuan=PCS`, `Warehouse=3`, and `LineProduksi=MP L`; status is PROBABLE FG receipt candidate.
- `JenisTransaksi=K` has bounded evidence `Keluar ke` and null LineProduksi; status is PROBABLE outgoing movement candidate.
- No production progress, remaining, achievement, ETA, or output formula implemented.
- Next strongest candidates require targeted sample/definition validation, not row-count promotion.
