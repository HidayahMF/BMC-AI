# MRP to PR Coverage Review

Status: `NEEDS_DOMAIN_REVIEW`

Technical evidence shows that the reporting path can have multiple PR-side rows for an MRP/material grouping and can produce null combinations. The following business decisions are still required:

1. Jika satu material dalam satu MRP dibuat menjadi beberapa PR, apakah Qty Sudah Dibuat PR adalah total quantity dari seluruh PR tersebut?
2. Jika quantity dari proses PR sudah tercatat tetapi PR final/nomor PR belum muncul, secara bisnis apakah material tersebut dianggap sudah dibuat PR?
3. Apakah Planning Qty MRP dan Qty PR selalu menggunakan satuan/UoM yang sama untuk material yang sama?

Do not approve coverage, null-as-zero, or remaining-quantity calculations until these answers and the corresponding technical grain checks are reconciled.

Current technical exceptions:

- TEMP to FINAL using `PRNo + MaterialId`: 2505 unmatched lines, 2 multiple-match groups.
- TEMP `ItemNo` to FINAL `PRItemNo` plus `PRNo + MaterialId`: no matches in the current schema/data path; this key is not validated.
- MRP to TEMP at `MRPNo + MaterialId + DepartId`: 423 multiple-match groups, maximum multiplicity 15.
- UoM comparison on matched MRP/TEMP/FINAL lines: 4727 different-unit rows and 8 null-unit rows.
- FINAL PR `Qty` is populated for 13601 of 13606 rows, but a canonical mapping from each MRP business line remains unresolved.

Application developer confirmation now supersedes the prior assumption about the bridge:

- `PURC_PURCHREQUEST_TEMP.PRNo + MaterialId` is the intended TEMP-to-FINAL workflow group relationship.
- `PURC_PURCHASE_REQUEST` represents the processed/final PR state.
- `TEMP.ItemNo -> FINAL.PRItemNo` is not required as the cross-stage bridge.
- Evidence type: `APPLICATION_DEVELOPER_CONFIRMATION`.

Canonical bridge validation currently reports:

- Raw TEMP rows: `16027`
- Distinct TEMP bridge rows (`MRPNo + MaterialId + PRNo`): `15777`
- MRP/material coverage groups: `15383`
- Groups with one PR: `14998`
- Groups with multiple PRs: `385`
- Maximum PRs per MRP/material group: `3`
- FINAL PR groups matched: `13077`
- FINAL PR groups with multiple physical rows: `40`
- Maximum physical FINAL rows per `PRNo + MaterialId`: `6`
- FINAL groups with null quantity: `1`

The relationship is structurally usable as a group bridge, but `pr_created_quantity` remains blocked until the null final quantity and UoM exceptions have an explicit handling policy. No runtime coverage join has been enabled.
