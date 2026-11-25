# Save Your Story — Story Bible V2

All ten library entries now use the V2 incident architecture. A player's savings goal is independent of the selected fictional life. Future incident titles and choices are hidden in the interface until triggered.

| Virtual life | Chronological main progression | Evolving state |
| --- | --- | --- |
| My First Ride | Research, routine, inspection, coverage, collection, instalments / fuel / maintenance, annual renewals, two-year review | New / used vehicle, persisted defect, inspection information, warranty, policy scope, shared trips and outstanding virtual liability |
| Somewhere New | Dream, early flight booking, accommodation, itinerary, contingency, departure, trip and homecoming | Virtual destination, travellers, travel stage, optional shopping and expense scope |
| A Little New Life | Pregnancy test first, confirmation, pregnancy-month expenses, nursery / delivery preparation, birth, infant / toddler life, third birthday | One-time single / twin result, relevant cost quantities, nursery reuse, family care, child life stage |
| A Safety Net | Household shopping, rain, appliance failure, birthday, sustainable habit | Small ordinary surprises; optional actual emergency allocation remains independent of the main goal |
| Our Next Chapter | Proposal, family conversation, registration / venue deposit, photography / attire, optional traditions, wedding balance / honeymoon | Celebration size, optional ceremony, attire reuse and married virtual stage |
| A Place Called Home | New / subsale viewing, condition inspection, financing / contracts, handover, renovation, furniture / appliances, maintenance | Property type, persisted hidden defect, inspection information, keys, renovation level and furnished state |
| My Own Business | Idea, validation / registration, equipment, launch, refund, operations review | Online service / retail, reused equipment, stock and business-open state; no fictional profits become actual income |
| A Brighter Future | Course application, tuition deposit, equipment, term life, exams / tuition balance, graduation | Student and graduate life stages; laptop reuse |
| On My Own | Shared / whole home, tenancy deposit, moving, ordinary rent / groceries / utilities, repairs, housewarming | Rent share, renter stage, furnished household and independent life |
| A Peaceful Tomorrow | Future lifestyle, ordinary spending, care allowance, community / picnic choice, repair, continued life | Fictional retirement stage, chosen activities; no promised investment returns or generated actual salary changes |

Car and pregnancy retain their established 24- and 45-chapter main sequences. Travel retains eight main chapters. Other lives have bounded playable milestone sequences, supplemented by interludes; they are not claimed to be exhaustive simulations of every legal or cultural procedure. The older `future.mjs` definitions remain as V1 reference material, while V2 gameplay comes from `incidents.mjs`.

## Incident categories

- Everyday: rain / transport, groceries, coffee, picnic, ordinary fuel and household life.
- Minor unexpected: appliance failure, car battery, tyres, an existing mechanical defect and a property leak.
- Major milestone: vehicle collection, property handover, proposal / wedding, birth, enrolment and graduation.
- Rare: a 1% twin game outcome at pregnancy confirmation and a low-probability virtual flood event for an owned vehicle.

## Continuity rules

Antenatal incidents follow the pregnancy test and confirmation. Childcare follows birth. Repairs that require car / property ownership cannot occur before ownership. Insurance scope and warranty change applicable virtual liability, never the probability of the underlying incident. Inspection can reveal a condition selected beforehand; skipping inspection does not create a defect. Emergency savings affect preparedness, not mechanical-failure probability.

Twins are selected once at the confirmation incident, unless the branch was explicitly configured before the story. Existing V1 twin outcomes are retained during migration. The 1% figure is a game mechanic, not a medical statistic. Cost quantities vary by category; not every expense doubles. Pregnancy scenes are budgeting fiction, not clinical instructions.

## Choices and costs

Use fixed country-specific unit estimates. Cheaper choices remove optional items, reduce quantities, reuse existing virtual possessions, select a genuinely different model / policy / service, or change future behaviour. Required service prices do not shrink to fit a savings target. Deposits and balances use explicit shares of a single quoted total. Earlier decided incident prices remain snapshots.

The `Virtual month` label is a story-world indicator, not the player's actual date. Savings Day dates remain real calendar dates on the 8th.
