# Static Validation Report

Date: 2026-08-11

This report covers the `v0.3.4` runtime-test candidate. Static checks validate the source contract, but only Age of Empires II: Definitive Edition can prove generation, dock placement, usable building space, pathing, AI behavior, runtime stability, and whether the portrait remains readable in play.

## Artifact Hashes

| Artifact | SHA-256 |
| --- | --- |
| `Mirrorwake.rms` | `b51f02f9be15e67106bc1eb3ff2df6947a87c1e7d68123bd7b84ec05d4fc2142` |
| `tools/validate-rms.mjs` | `6ce036ec9684cab376981ea9adef0467bc868fe3f63b16c1f6c534bf6462c7a7` |
| `submission/layout-reference.svg` | `f9ec3a227430fa6b5eb773015f9b9c6369adc4ba5a7ce4a565ce98065dd9a757` |
| `submission/layout-reference.png` | `8ee70d71445381a667d7fec2f3112b75b210d07537d0b28eedf979485e9d8d64` |
| `submission/screenshots/01-captureage-overview.png` | `95b55d2fc4f1146d2030aa3b24a55f0102a0f4b5f5b61f561d0f33450aec793c` |

The existing overview screenshot records the obsolete `v0.2.1` layout. It is not valid submission evidence for this candidate and must be replaced after runtime approval.

## Passed Checks

### Map-Specific Contract Validator

Command:

```bash
node tools/validate-rms.mjs
```

Result: pass.

- Sections, braces, comments, and conditional control flow are valid.
- All 96 authored lands have fixed positions and exact horizontal mirrors.
- Ten face bands retain the intended head, jaw, and chin silhouette.
- Hair, beard, brows, eye whites, pupils, cheeks, nose, mouth, and teeth retain their authored terrain counts.
- The smile retains two raised corners, visible teeth, two lower side arcs, and a lowest central arc.
- Both assigned ear origins remain ID-free, mirrored, and expanded to reserve starting space.
- Each player receives a Town Center, 9 villagers, 2 houses, a scout, and 8 emergency stragglers.
- Two ordered 180-tile front forests restore the original inward-facing wood mass after the home-clearance pass.
- Four additional fixed 64-tile forest lands provide a northern and southern outer woodline on each side.
- Thirty-six fixed food and fish lands provide exactly 8 sheep, 2 boar, 4 deer, 6 berries, 6 shore fish, and 18 deep fish per side.
- Every food and fish block is Gaia-owned, mandatory, bound to one fixed land ID, restricted to the intended terrain, and confined with `avoid_other_land_zones 0`.
- Fish are divided into twelve non-overlapping locations per side; every location contains two individually separated fish.
- Opening food, mine, home-woodline, and cove bounds are pairwise separated wherever placement collisions would affect the opening economy.
- Ten fixed mine clearings provide 15 gold and 9 stone per side.
- Every mine block is Gaia-owned, mandatory, bound to exactly one clearing, and confined there.
- The complete water ring and twenty-four fish lands use terrain ID 1; no non-dockable depth-texture pass remains.
- Five relics are confined to fixed landmark lands on the two eyes, two cheeks, and nose.
- Triggers, XS, includes, attribute changes, capturable buildings, scripted income, and known hazardous terrain IDs 45 and 47 are absent.
- An elevation section is present because the cheek and nose lands use `base_elevation`.

### Tree-Sitter RMS Parser

- Parser: `tree-sitter` 0.26.6
- Grammar: `twestura/tree-sitter-aoe2-rms`
- Grammar commit: `dae495c167d2ca63ebea0e5f1cc7583cbcf3acfb`
- Result: 1 successful parse, 0 failed parses, 100.00% success

### Supporting Artifacts

- `node --check tools/validate-rms.mjs`: pass
- `bash -n tools/package-submission.sh`: pass
- `git diff --check`: pass
- Packager gate: correctly accepts the existing overview and rejects a release while the three remaining required screenshots are missing

## Playability Revision

External review of `v0.2.1` identified four blocking problems: the coast could not accept docks, fish were absent, each start was cramped, and natural resources were insufficient. The terrain reference used during this revision labels terrain 23 as non-dockable Medium Water, while terrain 1 is ordinary Water ([AoE2 RMS terrain definitions](https://github.com/mangudai/mangudai/blob/master/src/lib/lib.aoc.rms)). `v0.2.1` incorrectly used terrain 23 for the surrounding sea and then painted part of it with another non-dockable water terrain.

Version `v0.3.0` replaces the entire sea with terrain 1, cuts a broad water cove into each ear, and reserves fixed cove and offshore fish lands. It also repaints a large open home core after the portrait details, adds two fixed home woodlines per side, and moves all opening food from fallible distance searches into mirrored land-ID slots. These changes address the reported causes in source, but do not constitute an in-game pass.

The first `v0.3.0` All Visible generation confirmed that the revised start and fish objects appeared, but its home forest lands remained too sparse and the fish were visually compressed into four piles. Version `v0.3.1` changes every home woodline to an exact 64-tile forest and redistributes the unchanged fish total across ten mirrored locations, with two separated fish per location.

Runtime inspection of `v0.3.1` then showed that those reinforced forests were north and south of the base rather than at its original inward-facing front, and that ten fish per side still left the large water ring too empty. Version `v0.3.2` moves the original `(22,49)` and `(78,49)` beard footprints after the clearing pass, fixes each at 180 tiles, and doubles the fish economy to twenty per side across ten locations.

Runtime inspection of `v0.3.2` confirmed that the thick front forests were restored. It also showed that the deer clearing opened on the far side of the forest and that deep-water food remained sparse near each starting shoreline. Version `v0.3.3` attempted to move each four-deer clearing toward the Town Center and added four deep fish per player in two new separated upper-shore locations, for twenty-four fish across twelve locations per side.

Runtime inspection of `v0.3.3` showed that the deer coordinates still resolved to the far half of the forest in the isometric view, while both new deep-fish locations sat along the remote upper water rather than visibly near the start. Version `v0.3.4` moves each deer pocket below and inward from the forest center, directly between the Town Center and the woodline. It also relocates the same four added deep fish into two narrow water bands immediately above and below each starting cove; no fish are stacked onto an existing location.

## Runtime Status

Runtime validation of `v0.3.4` is pending. The next diagnostic run must use 1v1, Tiny, Standard resources, an AI opponent, and All Visible. In particular, confirm that each deer clearing touches the base-facing forest edge, that two new deep-fish pairs visibly flank each cove, that all twelve fish locations are reachable, and that several cove tiles accept dock foundations. Then complete the 20-seed and Normal-fog passes in [`runtime-test-checklist.md`](./runtime-test-checklist.md) before replacing the screenshots or submitting the map.
