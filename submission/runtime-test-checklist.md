# Runtime Test Checklist

Static validators cannot reproduce the Definitive Edition map generator. Complete these checks in the current live game build before treating the map as submission-ready.

## First Runtime Pass

- [ ] Install `Mirrorwake.rms` in `resources\_common\random-map-scripts`.
- [ ] Start a 1v1 skirmish on Tiny with Standard resources and All Visible.
- [ ] Confirm both players spawn at opposite ears with a Town Center, 9 villagers, 2 houses, and 1 scout.
- [ ] Confirm the map remains stable for at least 15 minutes with an active AI opponent.
- [ ] Move units from both ears across each eye, both cheeks, the nose, teeth, mouth, and chin.
- [ ] Verify land units cannot cross the surrounding water without transport.
- [ ] Build a dock at each ear and circulate ships around the complete face.

## Portrait Pass

- [ ] Open the generated game in CaptureAge and zoom out until the complete map is visible.
- [ ] Confirm the head silhouette reads as a face before inspecting individual terrain details.
- [ ] Confirm the eyes are level and bright, with dark pupils and brows.
- [ ] Confirm the cheeks appear raised and mirror each other.
- [ ] Confirm the central nose ridge is visible.
- [ ] Confirm the white teeth remain visible between moustache and lower mouth.
- [ ] Confirm both mouth corners are visibly higher than the center of the lower mouth.
- [ ] Confirm hair and beard frame the portrait without covering the smile.

## Competitive Seed Pass

- [ ] Generate at least 20 consecutive 1v1 seeds.
- [ ] Confirm every Town Center, villager, house, scout, food group, mine, fish group, and relic appears in every seed.
- [ ] Compare both sides directly and confirm all three gold groups and both stone groups appear for each player.
- [ ] Confirm each player has practical access to both a northern hair woodline and southern beard woodline.
- [ ] Confirm berries never overlap or conceal either primary mine.
- [ ] Confirm each primary gold and stone group has a workable three-tile clearance from all nearby trees.
- [ ] Confirm primary gold and stone do not touch, overlap, or obstruct each other's mining space.
- [ ] Compare both players' secondary gold and stone distances; corresponding groups should be equivalently exposed.
- [ ] Confirm neither start has a blocked Town Center exit or trapped food.
- [ ] Confirm both ear coastlines permit a dock.
- [ ] Confirm the water ring remains connected for ships in every seed.
- [ ] Confirm five relics appear: left eye, right eye, left cheek, right cheek, and nose.
- [ ] Play at least one complete test game from each side.

## Submission Gate

- [ ] Repeat the stability pass under Normal fog of war.
- [ ] Capture the required full-map, start, smile, and hybrid-route screenshots.
- [ ] Record the tested game build and seed count in `validation-report.md`.
- [ ] Run `node tools/validate-rms.mjs` after the final edit.
- [ ] Rebuild the submission ZIP with `tools/package-submission.sh`.
