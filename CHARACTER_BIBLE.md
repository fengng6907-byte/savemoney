# Original character library

Palette: forest `#24483C`, sage `#697F59`, terracotta `#AC6043`, gold `#DAA34E`, burgundy `#784C50`, brown `#B79D83`, cream `#F5ECDD`.

The same code-native layered model renders player, partner, supporting cast and reference sheets. Contemporary clothing, restrained gestures, dark pencil-like outlines and warm paper textures sit against original painted Malaysian/Singaporean interiors. No franchise character or studio style is used.

Player and partner names, skin tones, hair colors, four hair shapes, clothing colors, gender presentation and glasses/earrings persist in `state.game.characters`. Gender presentation affects silhouette only, independently of role or game outcomes. Names are escaped before appearing in markup and have a 40-character limit. Changing appearance does not rewrite financial snapshots.

## Model sheets

See `dist/assets/characters/*-model-sheet.svg`. Adult sheets include front, three-quarter, side and back rig views; neutral, happy, surprised, worried, confused, disappointed and excited expressions; speaking, sitting, standing and gesture poses. Views are stylized rig rotations, not separately painted anatomical turnarounds. The baby sheet is a separate swaddled design with reusable color variants.

| ID | Character / role | Reuse |
|---|---|---|
| player | Alex by default | Persistent customized protagonist |
| partner | Sam by default | Persistent customized partner |
| doctor | Dr. Hana | Consultation and twins reveal |
| nurse | Nurse Lin | Reference model available for later care scenes |
| mechanic | Ravi | Maintenance and battery failure |
| agent | Mei | Property agent and car salesperson |
| contractor | Idris | Leak inspection and household repair |
| assistant | Ari | Shop assistant / study and business templates |
| family | June | Family and retirement scenes |
| bankOfficer | Daniel | Reference model available for later financing scenes |
| weddingPlanner | Nadia | Reference model available for richer wedding scenes |
| supplier | Amir | Reference model available for later business scenes |
| shopAssistant | Wei | Reference model available for later retail scenes |
| babies | Swaddled infant model | One or two instances from the saved family branch |

Some supporting roles share the same base rig and currently appear only in reference sheets. The current wedding/business templates use existing cast members. Additional clothing, age ranges, body types and frame-by-frame painted performances need further art production.

## Consistency rules

Always derive live scenes and posters from the same rig. Keep the player’s selected skin, hair, glasses and clothing in every incident. Use saved partner settings rather than inventing a new partner per scene. Reuse the saved twins/family result rather than drawing randomness in an animation. Preserve original assets, record revisions and regenerate exports after changing the model.
