# Animated Storybook — V2.1

This release adds presentation to the existing V2 game. The director, fixed savings goal, affordability rules, evidence review and ledger remain authoritative. There is no animation service, runtime image generation or new account backend.

## Shipped assets

- 21 registered SVG scene compositions and 21 self-contained SVG posters.
- Four original painted settings: home, clinic, car showroom and apartment. Each setting is a separate optimized JPEG; gameplay requests only the current setting and caches it for reuse. The original four-panel atlas is retained as a production source.
- 14 character reference sheets: player, partner, doctor, mechanic, property agent, contractor, assistant, family member, nurse, bank officer, wedding planner, supplier, shop assistant and a swaddled baby model.
- `dist/assets/storyboards.json`: actual scene timings, speakers, dialogue and key poses.
- `dist/assets/animation-manifest.json`: generated manifest; `dist/animation-types.d.ts` defines its contract. `animation-manifest.mjs` is the editable source.

These are layered SVG/CSS animations with painted backgrounds. They are not frame-by-frame character films. Several stories intentionally reuse stage templates. No WebM, MP4, GIF, sprite sheet or recorded voice is included. Optional media adapters exist for later committed assets; the shipped scenes exercise SVG playback. Detailed bespoke animation for every incident in all ten stories remains future art production.

The brief mentioned reference images and a pregnancy clip, but neither was included in the accessible attachment. The original designs follow the written direction and palette.

## Runtime boundaries

`IncidentAnimationPlayer` owns loading, play/pause, replay, skip, poster-like still composition, subtitle beats, sound preferences, visibility handling and cleanup. `PlaybackClock` invokes completion once, including after replay or skip. It imports no director, savings or ledger code.

`animation-ui.mjs` persists `incident.presentation`: opening → dialogue → choices → outcome → financial reveal. Reloading an unfinished scene restarts that scene, preserving the selected option and saved story rolls. It never re-runs the twins roll. A financial decision is committed only by the existing explicit plan form. The player’s callback changes presentation fields only.

Skipping or finishing a scene cannot credit money or satisfy a checkpoint. `D.canUnlock` still requires the saved decision and reviewed savings credit. A completed checkpoint permits `D.finishIncident`; only then is the optional eight-second celebration shown. Its completion simply dismisses the presentation. The next incident remains sealed.

An imported V1/V2 incident without presentation fields receives backward-compatible defaults. Already decided incidents go directly to their financial record. Existing localStorage key, profile versions, actual balances, ledger entries and IndexedDB receipt storage are retained. Character and animation-preference fields are optional and validated on import.

## Important sequences

- `baby-0`: test-purchase opening → dialogue → kit choice → `pregnancy_test_positive` (7 seconds) → savings plan. The purchase remains the first actual incident in the game. The scene is explicitly fictional; consultation is the next main chapter.
- Positive-test beats: anticipation 0–1s, reveal 1–2s, surprise 2–3s, happiness 3–4.5s, celebration 4.5–5.5s, embrace 5.5–7s.
- `baby-1`: clinic scene or twins reveal from the already persisted result. Two illustrative shapes are a story illustration, not diagnostic ultrasound or a medical timetable.
- Battery: ignition, flicker, failure, reaction, mechanic; workshop comparison, warranty check or mobile replacement. Battery, installation, diagnosis and optional roadside attendance are separate cost-engine items. A generic car warranty does not establish battery coverage.
- Leak: rain, drip, bucket, contractor, quotation. A saved defect exists independently of inspection. A warranty response appears only when the saved virtual contract explicitly covers the leak within its configured period. New virtual property contracts use an illustrative 24-month period; this is not a statement about real contracts.

## Accessibility, audio and performance

All openings/outcomes/celebrations can be skipped. Subtitles remain visible. System reduced motion and the independent still-scene preference stop animation; a readable transcript and manual continuation remain available. A missing setting/media file shows a text fallback and continuation. The financial limit, duration, remaining goal and Savings Day remain beside the incident.

Sound starts muted. Independent controls offer quiet original synthesized ambient tones and scene cues. No voice track is included; its disabled control states that limitation. Sound closes on leaving the scene, manual pause or invisibility. There are no external music licenses or sound downloads.

The player suspends time and CSS motion offscreen and in hidden tabs. It cancels listeners, observers, audio and frame callbacks on unmount. Finished and paused scenes do not keep scheduling frames. Rendering is responsive; no external animation library is installed.

`dist/assets/asset-sizes.json` records measured encoded bytes. Each current setting is approximately 76–95 KB; each SVG source is under 9 KB and each self-contained poster is under 140 KB. This meets the requested file-size targets for the shipped assets. These numbers are not a promise about network speed, frame rate or all mobile hardware. Model sheets, storyboards and the source atlas are not requested by gameplay.

## Add or replace an animation

1. Write its storyboard: opening, key poses, choices, distinct outcome props, safe financial reveal and reduced-motion text. Keep prices and ledger writes out of the scene.
2. Reuse `characters.mjs` for consistent character features and the project palette. Extend the layered rig or add an original painted environment. Document any new art provenance and rights.
3. Register the real ID in `animation-manifest.mjs`; set truthful source, poster, duration, category, cast, environment and next action. Do not list a file that has not been committed. Add the incident-code mapping in `animationFor` and any outcome-specific logic in `outcomeFor`.
4. Add setting/prop composition in `story-scenes.mjs`, timed beats in `sceneBeats`, and scoped motion in `animation.css`. Default outcome variants reuse the actual source and add option-specific props at runtime. Add different geometry/timings when choices need a richer visual distinction.
5. Run `npm run build:art`. This exports the actual SVGs, embedded-background posters, references, manifest, storyboards and size report. Generation is a development step, never a gameplay request.
6. For pre-rendered media, commit the compressed WebP/WebM/MP4/GIF/sprite and a still poster first, then set `assetType`. `media-asset.mjs` handles image/video errors and sprite frame positions; sprites require `{columns, rows, frames}` metadata. Keep movies silent if using the separate synthesized sound controls. Test the actual new format in browsers before release; no movie codec is exercised by the current SVG-only asset library.
7. Run `npm test`, parse exported SVGs as XML, test the complete incident in the browser, replay/skip repeatedly, reload during the outcome, enable reduced motion, simulate an asset failure and inspect a narrow mobile viewport. Confirm that no animation can credit savings or reroll outcomes.

## Financial limitations retained

Prices are independent country simulation assumptions, editable before deciding. They are not current verified provider quotations. Evidence review is local self-attestation, not bank settlement verification. Balances and personal savings remain under the player’s control.
