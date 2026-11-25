# Save Your Story — Savings Rules V2

## Explicit personal goal

The player approves a positive total goal, 1–120 month duration, MYR / SGD goal currency and maximum comfortable **total** monthly saving amount. The optional emergency contribution sits alongside the main goal, within that total. No incident automatically increases a goal, raises income or changes actual employment.

Existing savings are retained as opening real-life balances. They are not silently credited to a new V2 goal. Only new eligible receipt-reviewed contributions tagged with that goal count. A new voluntary goal starts with zero reused contributions.

## Capacity

```
Actual disposable capacity = net income
  - fixed commitments
  - essential living costs
  - optional spending buffer
  - existing loan repayments
  - optional emergency contribution

Main goal monthly limit = max(0, min(
  actual disposable capacity converted to goal currency,
  comfortable total monthly saving - emergency contribution converted to goal currency
))
```

Each expense appears once. Cross-border conversions use the player's positive, explicitly dated MYR-per-SGD assumption. Actual transfers are recorded in their real currency; the app never invents a conversion or a cross-currency bank movement. Emergency allocations in a different currency require a separate correctly denominated record.

## Savings Day calendar

Periods fall on the 8th. A start on or before the 8th may use that month's 8th; a later start uses next month's 8th. Periods continue for the approved duration. Only unexpired periods within the goal deadline receive new assignments. Early deposits are allowed; the date is a savings deadline, not a fictional settlement date.

If the goal exceeds capacity or eligible time, show the mismatch and offer explicit goal / duration / limit adjustments. Never manufacture income, recommend borrowing, sacrifice essentials or imply that a partial contribution pays the full virtual bill.

## Virtual incident conversion

Market unit estimates and quantities determine the itemised market cost. Explicit deposit / balance / coverage shares determine virtual expense. The player chooses a maximum contribution proportion and one of:

- **Affordable slice:** use at most the earliest period's available main-goal capacity.
- **Spread:** reserve the chosen share across eligible periods, never exceeding each period's remaining capacity.

Both modes also cap total assigned savings at the remaining unassigned goal and virtual expense converted using the saved FX assumption. The unconverted expense remains visible. A zero assigned challenge caused by exhausted capacity is labelled as such; it does not imply completion of the personal goal.

## Evidence and contribution integrity

- V2 submissions require a PNG, JPG or PDF receipt of no more than 5 MB.
- Validate the file signature against the declared type, calculate SHA-256, check duplicate file hash and case-insensitive reference, and validate the actual transfer date.
- Main plus emergency allocations cannot exceed the actual transaction amount. Unallocated amounts are visible but do not count towards a goal.
- Pending and rejected records never unlock incidents. Duplicate accepted references / evidence cannot be credited again.
- The player explicitly compares amount, date and reference with the receipt and bank account. The app records local evidence review and attestation, **not bank settlement verification**.
- Contribution offsets allocate confirmed main-goal credit to incident challenges once. Emergency credit is separate and cannot be counted again as main-goal credit.
- A missed optional emergency contribution does not block a main story.

## Adjustments, pause and completion

Goal amount / duration / comfortable-limit changes require explicit approval and an audit reason. A completed goal cannot be expanded in place: a new goal is a separate voluntary action. Pauses preserve the deadline until the player explicitly extends it. A current checkpoint may be lowered with a reason, but not below contributions already credited to it.

After actual recorded contributions reach the approved goal, record one completion achievement, retain the finish line and allow the rest of the fictional story with zero further mandatory savings. Always show cumulative receipt-reviewed savings separately from cumulative virtual living expenses. No virtual expense withdraws actual savings or emergency reserves. The app never receives, holds or transfers funds.
