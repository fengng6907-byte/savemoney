# Save Your Story V1

A playable, mobile-first life-simulation web app. Original SVG town and animated scenes, a chapter journal, real-life financial profiles, and a distinct savings ledger. English and Simplified Chinese.

## Run

Requires Node.js 20 or later. No packages need installing.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Use an HTTP server rather than opening index.html directly, because the app uses ES modules. Any static host can serve `dist/`.

```sh
npm test
```

## Playing

1. Choose **Begin your story**. Enter a local demo, language, country and income currency. Sample figures are available through an explicitly labelled button; replace them when using the journal personally.
2. Enter net income, fixed commitments, essentials, optional spending, loan repayments, separate savings and reserves, and an optional emergency contribution. Each expense belongs in only one category.
3. Preview and configure a story. Review the duration, costs and capacity before locking one main story.
4. Read the scene and make a decision. Cost, financial-profile and challenge snapshots are saved.
5. Advance the **story calendar** to the checkpoint. This never changes actual dates, income or balances.
6. Transfer to your own bank account outside the app. Record a new transfer or grouped batch, optionally attach evidence, then explicitly self-confirm the local record. Pending and rejected records do not count.
7. Turn the page once the decision, event, story date and contribution conditions are met. You can lower a checkpoint or extend preparation when circumstances change. A reduced target never establishes affordability.

## Playable experiences

- **My First Ride:** 24 monthly chapters; flat-rate and reducing-balance calculations; upfront, monthly and annual provisions; replaced transport offset; inspection and persisted mechanical condition; configured warranty; ownership choices; virtual depreciation and remaining loan principal. Completion of the story does not imply repayment of a longer loan. The ownership phase has 20 loan payments after collection in chapter 5; the standalone calculator also shows a separate 24-payment comparison.
- **Somewhere New:** 8 chapters over 30–365 days; destination, travellers, trip length and custom budgets; separate flight / hotel deadlines; existing trip savings; cumulative daily need; grouped evidence; a persisted weather branch. Budget inputs are explicit quotations; destination and trip length do not query live travel prices.
- **A Little New Life:** 45 chapters, beginning with a test kit, through pregnancy, birth, infant care, toddler life and a third birthday. A 99% single / 1% twin game roll is selected once per session; known twins can be configured. Applicable cost multipliers differ by category. Delivery / postpartum deposits and balances split a single total rather than duplicate it. Care setting, delivery scene month and quotations are configurable. Budget scenes are not clinical guidance.
- **A Safety Net:** a parallel, adjustable savings mode. Contribution and expense-coverage target, separate allocations and reserve balances. It does not block the main story. One transfer may be split, but total allocations cannot exceed its amount.

Six further stories have bilingual five-act definitions using the same choice, cost, event and unlock contracts, plus indicative budget previews. They are labelled **In development** and cannot be started: wedding, first property, entrepreneurship, education, independent living and retirement. A separate property calculator and new-build / subsale route preview are available.

## Data and financial boundaries

- Local demo only: no public user accounts, bank connections, server database, trusted external verification, cross-device synchronization, real notifications or money movement.
- Financial profiles, random outcomes, decisions and ledger records use `localStorage`. Receipt files (PNG, JPG, PDF, up to 5 MB) use local IndexedDB. The hosted Site has owner-only access; it does not receive personal records or receipt files.
- Evidence review is explicitly **local self-confirmation**, not independent or bank verification. Duplicate reference and file-hash checks prevent accidental repeated entries, but do not prove a real transaction occurred. Local records are user-editable through browser tools and are not tamper-proof.
- Profiles are versioned by effective date; actual income changes only through explicit edits. Historical chapter snapshots are preserved. Balance updates exclude already-included deposits so they are not counted again.
- Existing available savings and emergency reserves are separate opening balances. Newly recorded contributions must not already be included in those balances. Only allocated, confirmed amounts contribute to goal progress; unallocated amounts remain visible but do not unlock chapters.
- Cross-border income uses a positive, editable, dated **MYR per SGD** assumption. There is no live exchange-rate feed. Story expenses and contribution records retain their own currency.
- All seeded prices are independently set Malaysian / Singaporean **illustrative assumptions**, prepared 25 November 2026. No seed is claimed to be a verified current provider quotation. User-entered quotations take precedence. Every cost carries country, currency, range, quantity, frequency, date, source and verification fields. Unknown sources and verification dates are null.
- Source links in Finance provide calculation and care context only: MoneySense, Singapore Ministry of Transport, EPF and Malaysia MOH. Property duties, grants, CPF use and individual eligibility require external checks and user quotations; the calculator does not automatically apply legal rules.
- Optional Google Fonts improve typography; readable system-font fallbacks work when unavailable. All illustrations are original inline SVG and do not depend on image generation or external images.

## Architecture

- `dist/data.mjs`: independent cost seeds, story definitions and event rules.
- `dist/future.mjs`: six nonplayable future stories with structured contracts.
- `dist/engine.mjs`: pure finance, loan, snapshot, event, allocation, progression and backup validation functions.
- `dist/art.mjs`: reusable original SVG scenes and illustration components.
- `dist/app.mjs`: accessible UI, onboarding, forms, receipt storage and export / restore.
- `dist/style.css`: responsive storybook theme, bottom mobile navigation, reduced-motion support.
- `tests/`: engine regression checks and full simulated journey completion tests.

## Verification

23 automated tests pass. Coverage includes both-country full car / travel / twin-pregnancy completion, persistent outcomes, historical cost versions, FX direction, annual provisions, loan balances, deposit deduplication, pending review gates, split allocations, effective-date profiles, changed capacity and backup round trips.

Browser checks cover onboarding, all ten library entries, car preview and lock, a price-changing choice, pending contribution review, explicit local confirmation, chapter unlock, reload persistence, finance calculations, Chinese gameplay and a 390-pixel mobile layout.

## Production work still required

This is a complete local-demo gameplay build, not a production financial service. Before multi-user release: implement authenticated accounts, server-side authorization, a transactional ledger and audit trail, an actual evidence-review policy and service, encrypted storage / retention controls, cross-device backups, localization review, broader narrative / event variety, maintained provider quotations and country-specific professional review. Never infer actual savings from a simulated expense or fictional event.

The supplied development prompt ends mid-sentence in section 22, after “Used for cars,”. No missing later requirements were assumed to have been supplied.
