# Animation verification — 26 November 2026

## Story under test

A player opens a fictional incident, watches or skips the opening, reads dialogue, selects a response, sees its outcome and reviews an affordable savings plan. Only the existing local receipt-review process can credit savings and enable a checkpoint; animation is a separate presentation layer.

## Automated evidence

`npm test`: 84 passing tests. The 67 existing financial, hosting and complete MY/SG story checks remain passing. Seventeen animation/UI checks cover timing, callback idempotence, pause/replay/skip, ambient loops, cutscene-first HTML, stale choices, delayed financial reveal, legacy incidents, funded celebrations, saved characters, invalid imports, asset existence/budgets, sprite layouts and financial/roll invariants.

`npm run build:art`: 21 scene compositions, 14 reference sheets, real posters, storyboards and manifest exported. All exported SVG files parsed as XML. Entry modules passed Node syntax checks.

## Browser evidence

Verified on an isolated local preview origin using synthetic sample finances:

- Test-purchase opening initially showed no incident item list or choice buttons. Dialogue followed, then choices.
- Selecting the kit played the seven-second positive-test scene with the saved customized character name. Skipping reached the financial reveal and the explicit itemized-plan modal.
- Saving the RM18 test plan left recorded savings at RM0 and **Turn this page** disabled. Reload retained the decision, character glasses and partner hair selection.
- The still-scene preference paused playback, disabled Pause, retained subtitles and exposed the transcript. The mobile check used a 390×844 viewport; the document reported 375px client width and 375px scroll width, with no horizontal overflow. The temporary viewport override was reset.
- An isolated fault-injection server returned 404 for the current painted setting. The player showed a missing-art message, disabled playback/replay, retained Continue and exposed the complete scene transcript.
- No browser console errors were reported in the normal preview when inspected. The deliberate missing-art test produces expected asset 404s.

The browser automation file picker stalled while attaching a synthetic receipt, so the newly requested receipt upload → review → celebration path was not completed in that browser run. The automated UI integration test completed that same financial gate with synthetic evidence and proved that celebration is available only after reviewed credit. No real money was moved and no real receipt or personal financial data was uploaded.

## Limits of this verification

The release contains SVG/CSS animations, not movies. The optional movie/image/sprite adapters need format-specific browser QA when real media are added. Encoded sizes were measured; device FPS, throttled-network startup and long sessions across a device lab were not measured. Local evidence review is still self-attestation, not independent bank verification.
