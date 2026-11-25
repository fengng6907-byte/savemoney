# Save Your Story V2.1 — Animated Storybook

**Virtual expenses become real savings.** A cozy virtual life simulation that turns fictional incidents into affordable savings challenges. Players do not need to intend to buy a car, own property, marry or have children in reality.

Live app: https://savemoney-alpha.vercel.app

## Run and test

Requires Node.js 20 or later. No dependencies need installing.

```sh
npm run dev
npm test
```

Open http://127.0.0.1:4173. Use an HTTP server rather than opening index.html directly, because the app uses ES modules.

The 84 automated checks cover legacy functionality, complete V2 journeys for ten stories in both countries, goal completion, safe reservations, persistent outcomes, duplicate receipts and unlocks, partial contributions, actual-income changes, V1 migration and static hosting.

## Animation release

Open **My story characters** to customize the player and partner, or **Animation studio** to preview the 21 available compositions. The first family incident starts with a test purchase, then a seven-second positive-test outcome. Existing saved twins results select the clinic reveal. Car battery and home leak responses retain itemized country costs.

Play/pause, replay, skip, subtitles, still scenes, asset-error continuation and offscreen pause are included. The current assets are SVG/CSS scenes with original painted settings; pre-rendered films and voice tracks are not included. The other stories use reusable stage templates. Playback cannot credit savings or unlock an incident.

Run `npm run build:art` to rebuild committed art exports. Read [ANIMATION_INTEGRATION.md](ANIMATION_INTEGRATION.md), [CHARACTER_BIBLE.md](CHARACTER_BIBLE.md) and [ART_PROVENANCE.md](ART_PROVENANCE.md) for the manifest, real asset inventory, storyboards, production prompt and extension instructions.

## V2 gameplay

1. Set your total savings goal, duration, country, MYR or SGD goal currency, comfortable total monthly savings and optional emergency contribution.
2. Enter actual income and commitments only to keep the game comfortable. Virtual events never change actual income or employment.
3. Choose one virtual life from the ten-story library.
4. Reveal a sealed incident. The director considers remaining goal, time, capacity, choices, virtual assets, life stage, country prices and incident history. Future incidents remain hidden.
5. Watch or skip the opening, read the dialogue, choose a response and watch its outcome. Make a meaningful decision. Review the estimated market cost, virtual expense and assigned real savings separately. Choose an affordable slice or spread a share over eligible Savings Days.
6. Save in your own bank account. Upload a PNG, JPG or PDF receipt and explicitly review it. Partial and grouped deposits are supported; pending evidence does not count.
7. Satisfy the current checkpoint, turn the page and reveal the next surprise. Savings Day is the 8th of each month; early contributions are welcome.
8. On goal completion, celebrate recorded savings and review virtual expenses and decisions. Continue the story with no additional mandatory savings. A new goal is voluntary and starts with no reused receipt credit.

## Virtual lives

- My First Ride: 24 main chapters, new / used vehicles, inspection, policy scope, collection, instalments, fuel, maintenance, renewals and continuing loan responsibility.
- Somewhere New: eight main trip chapters, destination, travellers, bookings, itinerary, contingency and homecoming.
- A Little New Life: 45 main chapters beginning with a pregnancy test, then confirmation, pregnancy, birth, infant / toddler life and a third birthday. Twins use one persisted 1% game roll at confirmation, unless preconfigured. This is not a medical statistic or clinical timetable.
- A Safety Net: household surprises, alongside the separate optional actual emergency plan.
- Our Next Chapter: proposal, family preferences, deposits / balances, optional traditions, wedding and honeymoon.
- A Place Called Home: new / subsale branches, inspection, financing / contracts, keys, hidden defects, renovation, furniture and maintenance.
- My Own Business: idea, registration, equipment, launch, refunds and review. Fictional profits never become actual personal income.
- A Brighter Future: application, tuition deposit / balance, equipment, term life, examination and graduation.
- On My Own: shared / whole home, tenancy deposit, moving, rent / groceries / utilities, repairs and housewarming.
- A Peaceful Tomorrow: virtual retirement routine, care allowances, community activities and household surprises.

Interludes add everyday, minor, milestone and rare incidents. At most one interlude occurs between main chapters. Different products, service scopes and quantities can change costs; the director never changes an identical item's unit price to fit a goal. Story time and actual Savings Day dates are separate clocks.

## Preserved data and functions

The project and dependency-free stack are unchanged. The existing localStorage key is retained. V1 profiles, ledger records, decisions and receipt files are preserved, including prior twin outcomes. A conflicting pending V1 checkpoint is archived during migration; it does not become a compulsory new V2 challenge. Old contributions are not credited again.

The bilingual shell, local receipt storage, profile versioning, emergency allocations, export / restore, privacy controls and optional virtual car / property calculators remain. Calculators are under My limits, outside the main gameplay loop.

## Financial and verification boundaries

- The app never receives, holds or transfers funds. Virtual expenses never deduct real savings or emergency reserves.
- Goal, limit, pause, quotation and checkpoint changes require explicit actions and are audited. The capacity calculation protects essential spending.
- Receipt checks cover file signatures, SHA-256 duplicates, references, allocation totals and explicit player review. This is local self-attestation, not independent verification or proof of bank settlement. No bank or external review service is connected.
- Progress and profiles live in localStorage; receipt files live in local IndexedDB. There is no account backend, cross-device synchronization or tamper-proof server ledger. JSON backups exclude receipt files.
- Seeded prices are independent country-specific illustrative assumptions, not verified provider quotes. Quotes may be edited before a decision; decided incident prices stay frozen.
- Currency conversion uses the player's positive, dated MYR-per-SGD assumption, not a live feed. Actual transfers are recorded in their actual currency.

## Deployment

Vercel imports the repository root. vercel.json selects Other (framework: null), skips install / build commands, publishes dist, and gives .mjs files a JavaScript MIME type. The earlier blank-deployment fix is retained. server.mjs is a cross-platform local preview server only.

Any static host can serve dist. Committed painted JPEG settings and original SVG rigs need no runtime image service; optional Google Fonts have system-font fallbacks.

## Design documents

- [GAME_DESIGN.md](GAME_DESIGN.md): V2 philosophy, loop, clocks, director and completion.
- [STORY_BIBLE.md](STORY_BIBLE.md): ten storylines, categories and continuity.
- [ARCHITECTURE.md](ARCHITECTURE.md): modules, persistence, migration and transaction boundaries.
- [SAVINGS_RULES.md](SAVINGS_RULES.md): capacity, schedules, evidence, adjustments and completion.

V2 modules are goals.mjs, director.mjs, incidents.mjs, game-schema.mjs and v2-ui.mjs. Existing finance and V1 definitions remain in engine.mjs, data.mjs and future.mjs for compatibility.
