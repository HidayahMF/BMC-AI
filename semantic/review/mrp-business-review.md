# MRP Business Verification

Status: `NEEDS_DOMAIN_REVIEW`

This package asks for business meaning only. It does not include database rows.

## Qty

Pada data MRP, kolom jumlah/Qty menunjukkan jumlah apa?

- [ ] jumlah kebutuhan material
- [ ] jumlah rencana material
- [ ] jumlah demand
- [ ] jumlah yang sudah dibuat PR
- [ ] jumlah sisa kebutuhan
- [ ] lainnya: ____________________
- [ ] tidak tahu

Physical reference for technical review: `dbo.PURCH_MRP.Qty`

## QtyPR

Dalam laporan MRP vs PR, nilai Qty PR menunjukkan apa?

- [ ] quantity yang dibuat dalam PR
- [ ] quantity MRP yang sudah ter-cover PR
- [ ] quantity PR yang sudah diterima
- [ ] quantity sisa
- [ ] lainnya: ____________________
- [ ] tidak tahu

Physical/reference context: `PURCV_BP_PR` and PR-side quantity expression.

## MRP Date / Month Date

MRP Date / Month Date pada laporan menunjukkan periode/tanggal apa?

- [ ] tanggal dokumen MRP
- [ ] bulan/periode planning
- [ ] tanggal kebutuhan material
- [ ] tanggal dibuat
- [ ] lainnya: ____________________
- [ ] tidak tahu

## Tipe

Apa arti masing-masing tipe MRP yang digunakan sistem?

Codes observed by aggregate evidence: two distinct values. Labels must be supplied by the business owner; no technical label is assumed.

Explanation: ____________________

## Status

Apa arti masing-masing status MRP?

Codes observed by aggregate evidence: five distinct numeric values. No status label is assumed.

Explanation: ____________________

## Optional UI Verification

Business owner may open an MRP record in the internal application and confirm which displayed label corresponds to `dbo.PURCH_MRP.Qty`, `MRPDate`, and `Status`. Store only the mapping confirmation, approver role, timestamp, reason, and evidence type `BUSINESS_UI_VERIFICATION`. Do not store screenshots or row values.
