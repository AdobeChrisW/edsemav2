# Fix Missing Service Icons (Tabs-Services Block)

## Issue
In the **Services → "Types of Services"** tab panel, the 7 feature items (Flights, Accommodations, Catering, Transportation, Mashair, Tour guide, Visa Issuance) render as **empty green circles**. The original shows a distinct stroke icon inside each circle.

## Root Cause
Same as the "10 steps" and footer icons already fixed: the source uses an icon font (`hgi` / hugeicons) for these feature icons. During content import the glyphs were stripped, leaving the circular badge background but no icon. The migrated `tabs-services` block renders the badge but has no icon images.

## Source → Icon Mapping (from original `hgi` classes)
| Label | Icon |
|---|---|
| Flights | airplane |
| Accommodations | bed / double-bed |
| Catering | dish / cloche |
| Transportation | bus |
| Mashair | tent / angle peak |
| Tour guide | route / map pin |
| Visa Issuance | passport |

## Approach (mirror the cards-steps icon fix)
1. **Create 7 stroke SVG icons** in the project `icons/` folder (e.g. `svc-flights.svg`, `svc-accommodations.svg`, `svc-catering.svg`, `svc-transportation.svg`, `svc-mashair.svg`, `svc-tour-guide.svg`, `svc-visa.svg`) styled to match the original's thin green stroke look.
2. **Inject icons via the block JS** (`blocks/tabs-services/tabs-services.js`), keyed by each feature item's label text, so the imported content stays untouched (consistent with how the step icons were added).
3. **Style in `tabs-services.css`**: size the icon (~28px) inside the existing circular badge and tint it brand green (`#1b8354`) via filter, matching the other migrated icon badges.
4. **Verify in preview** at desktop that all 7 icons render inside their circles, then re-check responsive behavior.
5. **Lint** `tabs-services.js` and `tabs-services.css`, and run `npm run lint` to confirm the whole project stays clean.

## Considerations
- Label-based mapping must handle exact text ("Tour guide", "Visa Issuance") — normalize/trim before matching.
- Icons are decorative → `alt=""`.
- If any future label doesn't match the map, the badge gracefully stays empty (no crash).
- Keep icons consistent in stroke weight with the already-added step icons for visual cohesion.

## Checklist
- [ ] Inspect the migrated `tabs-services` block DOM to confirm the feature-item structure and label text
- [ ] Create 7 stroke SVG icons in `icons/` (flights, accommodations, catering, transportation, mashair, tour-guide, visa)
- [ ] Update `blocks/tabs-services/tabs-services.js` to inject the matching icon per feature item (keyed by label)
- [ ] Update `blocks/tabs-services/tabs-services.css` to size + green-tint the icons inside the circular badges
- [ ] Reload preview and verify all 7 service icons render correctly inside their circles
- [ ] Confirm other tabs/panels are unaffected and layout is responsive
- [ ] Run `npm run lint` and fix any issues

> **Note:** Execution requires Execute mode. Approve this plan and I'll implement the icon fix.
