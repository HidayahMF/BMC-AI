# Delivery Data Lineage

## Active Source

- Header: `dbo.SLS_DELIVERYORDER_HED_NEW`
- Detail: `dbo.SLS_DELIVERYORDER_NEW`
- Customer: `dbo.MAS_CUSTOMER.CustId`
- Header/detail relationship: `SLS_DELIVERYORDER_HED_NEW.Id -> SLS_DELIVERYORDER_NEW.HedId`, **CONFIRMED_BY_DATA** from 20/20 latest delivery headers with detail.

## Field Semantics

- Technical delivery header key: `SLS_DELIVERYORDER_HED_NEW.Id`, **CONFIRMED_BY_DATA**.
- Delivery business number candidate: header `Nomor`, **PROBABLE**.
- Delivery date candidate: header `Tanggal`, **PROBABLE**.
- Customer PO candidate: header `PONo` and detail `NoPO`, **PROBABLE**.
- Delivery quantity candidate: detail `Qty`, **PROBABLE**, semantics not yet proven against repeated/partial deliveries.
- Sales reference candidate: detail `SalesNomor`, **UNKNOWN** as direct link to new Sales `Nomor`.
- Detail product key: `ProductID`, **PROBABLE**.

## Sales Linkage

Hino `MAS_CUSTOMER.CustId=5` validation:

- Sales detail lines tested: 3,321
- Lines with candidate delivery by same customer, normalized PO, and ProductID: 3,113
- Match rate: approximately 93.7%
- Exceptions: 208 lines
- Date was supporting evidence only; it was not used as the sole join key.

Status: **PROBABLE** for Sales-to-Delivery. Do not calculate delivered or remaining quantity until exceptions, repeated deliveries, UOM, and quantity semantics are resolved.

The 50-line cumulative comparison found: exact equal `1`, delivery lower `0`, delivery higher `31`, no delivery candidate `18`, ambiguous `0`. These results are exploratory only; the join key and duplicate/revision behavior require further classification before quantity formulas.

## Empty Legacy View

`dbo.SLSV_PO_DO_DELIVERY` has 0 rows and references the old Sales objects. It is not used as the active Delivery repository source.

## Exception Classification Status

The 208 Sales-line exceptions are not promoted to a definitive classification yet. Keep `NO_DELIVERY_YET`, alternate-PO, revision/cancel, ambiguous, true-unmatched, and unknown as separate investigation outcomes. Delivery higher than Sales in the bounded 50-line comparison is an anomaly signal, not permission to clamp progress or infer revision semantics.

Sales-to-Delivery remains **PROBABLE**, not `CONFIRMED_BY_DATA`, until the broader exception set, repeated deliveries, UOM compatibility, and cumulative quantity behavior are validated.
