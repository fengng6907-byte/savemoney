# Save Your Story — Architecture V2

The existing project, vanilla ES modules, original SVG art, test runner, local persistence and static Vercel deployment are retained. No new framework or separate app was introduced.

## Modules

| Module | Responsibility |
| --- | --- |
| `dist/app.mjs` | Existing application shell, event dispatch, financial profiles, optional calculators, local evidence store, settings, export and restore |
| `dist/v2-ui.mjs` | Goal-first onboarding, virtual-life home, story library, sealed incident journal, conversion review, Savings Day statement, receipt workflow, goal controls and completion |
| `dist/goals.mjs` | Goal lifecycle, dated currency conversion, monthly 8th periods, comfortable limits, contribution schedules, FIFO credit, goal audit, evidence checks and achievements |
| `dist/director.mjs` | V1 journey migration, contextual incident selection, seeded persisted rolls, decisions / consequences, quotation snapshots, checkpoint reductions and idempotent progression |
| `dist/incidents.mjs` | Bilingual playable definitions for ten stories, four categories, chronology / asset conditions, independent country prices and distinct market / virtual totals |
| `dist/game-schema.mjs` | V2 backup validation for goals, incidents, schedules and evidence records |
| `dist/engine.mjs` | Retained V1 finance / loan functions, actual-profile versioning, actual contribution ledger and backward-compatible backup validation |
| `dist/art.mjs` | Reusable original animated SVG scenes, including evolving property, car, family and household scenes |
| `vercel.json` | Static `dist` output, no Node backend detection, JavaScript MIME type for `.mjs` |
| `server.mjs` | Cross-platform local preview server only |

## Persistent state

The existing `save-your-story-v1` localStorage key is retained so upgrades do not abandon existing data. The outer record schema stays backward compatible; the optional `game.version = 2` subtree stores `goals`, `activeGoalId` and `achievements`.

Each V2 journey remains in the existing `sessions` array with `mode = 'v2'`. Its `v2` subtree stores a seed, cursor, turn, virtual month, life stage, virtual assets, flags, persisted rolls, experienced incidents, current incident, history and adjustment audit. Actual financial `versions` and contribution `ledger` remain separate.

V1 migration preserves old decisions, financial profiles, ledger rows and IndexedDB evidence. A conflicting pending V1 checkpoint is archived as `legacyCheckpoint`, not translated into a compulsory new V2 challenge. V1 receipts are not automatically assigned a new goal ID or credited again.

## Decision and receipt transaction boundaries

1. Trigger selects and persists one current incident. Repeated requests return it without rerolling.
2. Decision resolves an available option, snapshots prices, computes a bounded goal challenge, and applies virtual effects once.
3. Receipt submission validates format signature, SHA-256 uniqueness, reference uniqueness, date and allocation total. The file is saved locally; a storage failure rolls back the pending ledger record.
4. Pending records do not count. Explicit local review moves one pending row to confirmed and records the check method. Bank settlement remains `false` / unconfirmed.
5. Goal credit uses only confirmed V2 records for that goal and currency. Incident credit uses an immutable contribution offset so one contribution cannot unlock multiple obligations through reuse.
6. A page turn requires a saved decision, a satisfied challenge and an unpaused goal. The expected incident ID prevents duplicate unlocks. The next incident is not selected until its sealed page is opened.

## Limits and snapshots

Market estimates, simulated expenses, assigned contributions, remaining goal and comfortable monthly capacity are distinct fields. Period reservations cannot exceed the period's available main-goal capacity. The director may choose a different eligible incident or scope; it cannot modify a unit estimate to fit a target.

Goal edits, pauses, resumes, quotation edits and checkpoint reductions are audited. Previously decided incident costs stay frozen. Real profile updates are explicit dated versions. Completion does not create a new goal or reuse old contributions.

## Hosting and security boundary

Vercel serves static files directly from `dist`. There is no server API, public account system, bank connector or independent receipt-review service. Local storage is user-controlled and not tamper-proof. JSON backups exclude receipt files. No credentials or personal receipt fixtures belong in the repository. Production multi-user financial verification would require an authenticated backend, transactional storage, private uploads, retention controls and a separately designed review / bank-data integration.
