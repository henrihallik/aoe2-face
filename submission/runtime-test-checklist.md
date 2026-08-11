# Runtime Test Checklist

Static validators cannot reproduce the Definitive Edition map generator. Complete these checks in the current live game build before treating the map as submission-ready.

## First Runtime Pass

- [ ] Install `Mirrorwake.rms` in `resources\_common\random-map-scripts`.
- [ ] Start a 1v1 skirmish on Tiny with Standard resources and All Visible.
- [ ] Confirm both players spawn at opposite ears with a Town Center, 9 villagers, 2 houses, and 1 scout.
- [ ] Confirm each ear has a broad open plateau around its Town Center rather than a cramped strip between resources.
- [ ] Build a barracks, archery range, blacksmith, market, and at least 8 farms at each start without deleting resources.
- [ ] Confirm the map remains stable for at least 15 minutes with an active AI opponent.
- [ ] Move units from both ears across each eye, both cheeks, the nose, teeth, mouth, and chin.
- [ ] Verify land units cannot cross the surrounding water without transport.
- [ ] Build a dock on at least three shoreline tiles inside each ear cove.
- [ ] Train fishing ships from both docks and confirm they can reach every fish group on their side.
- [ ] Circulate ships around the complete face to confirm the water ring is connected.

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
- [ ] Confirm each side always has exactly 8 sheep, 2 boar, 4 deer, and 6 berry bushes in usable groups.
- [ ] Confirm each side always has exactly 4 shore fish in its cove and 6 deep fish in its offshore school.
- [ ] Confirm all ten authored mine fields appear: three gold and two stone fields on each side.
- [ ] Confirm each start has practical access to its fixed northern hair woodline and southern beard woodline.
- [ ] Confirm villagers can build lumber camps and work both home woodlines without blocked approach tiles.
- [ ] Confirm berries and trees never occupy any of the ten warm mine clearings.
- [ ] Confirm each home gold and stone group has open, practical mining access.
- [ ] Confirm primary gold and stone do not touch, overlap, or obstruct each other's mining space.
- [ ] Compare corresponding fixed mine fields on both sides; their travel distance and exposure should mirror one another.
- [ ] Confirm neither start has a blocked Town Center exit, trapped food, or food mixed into a mine or woodline.
- [ ] Confirm every ear-cove test tile accepts a dock foundation in every seed.
- [ ] Confirm the water ring remains connected for ships in every seed.
- [ ] Confirm five relics appear: left eye, right eye, left cheek, right cheek, and nose.
- [ ] Play at least one complete test game from each side.

## Submission Gate

- [ ] Repeat the stability pass under Normal fog of war.
- [ ] Capture the required full-map, start, smile, and hybrid-route screenshots.
- [ ] Record the tested game build and seed count in `validation-report.md`.
- [ ] Run `node tools/validate-rms.mjs` after the final edit.
- [ ] Rebuild the submission ZIP with `tools/package-submission.sh`.
