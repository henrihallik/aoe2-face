# Static Validation Report

Date: 2026-08-10

This report covers the `v0.2.1` runtime-test candidate. Static checks validate the source contract, but only Age of Empires II: Definitive Edition can prove generation, placement, pathing, AI behavior, runtime stability, and whether the portrait reads clearly in CaptureAge.

## Artifact Hashes

| Artifact | SHA-256 |
| --- | --- |
| `Mirrorwake.rms` | `eaa5495ee47ba3a595eccc27acdea288131d08db7ee6af250c92febceb04a792` |
| `tools/validate-rms.mjs` | `e41e7c732a82ae45d35de8436e95ef752d35b098693a081e223df32e0194fdef` |
| `submission/layout-reference.svg` | `c4c8ddfb71be4030d897b4ce19e90a5a1662f8f99aeb6fef4a3b0df436be91fc` |
| `submission/layout-reference.png` | `abdc7ea8ee83d9a08f3e01fe27362458687a8ca8798b9a29dbc691fb62999c44` |
| `submission/screenshots/01-captureage-overview.png` | `95b55d2fc4f1146d2030aa3b24a55f0102a0f4b5f5b61f561d0f33450aec793c` |

## Passed Checks

### Map-Specific Contract Validator

Command:

```bash
node tools/validate-rms.mjs
```

Result: pass.

- Sections, braces, comments, and conditional control flow are valid.
- All 54 authored lands have fixed positions and exact horizontal mirrors.
- Ten overlapping face bands retain the intended head, jaw, and chin silhouette.
- Hair, beard, brows, eye whites, pupils, cheeks, nose, mouth, and teeth retain their authored terrain counts.
- The smile retains two raised corners, visible teeth, two lower side arcs, and a lowest central arc.
- Both ear starts remain mirrored and each can receive either player color.
- Both assigned ear lands are ID-free, preserving `set_place_for_every_player` for repeated start units and food groups.
- Each player receives a Town Center, 9 villagers, 2 houses, a scout, standard opening food, 4 shore fish, and 6 deep fish.
- Ten independent mirrored clearings provide 15 gold and 9 stone per side across home, secondary, and forward fields.
- Every mine block is Gaia-owned, mandatory, bound to exactly one clearing with `place_on_specific_land_id`, and confined there with `avoid_other_land_zones 0`.
- Mine-clearing terrain is excluded from random opening food and tree placement.
- Five relics are confined to fixed land zones on the two eyes, two cheeks, and nose.
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
- `xmllint --noout submission/layout-reference.svg`: pass
- Rendered diagram: 1600 x 1000 PNG, visually inspected
- Packager gate: correctly accepts the stitched overview and rejects a release while the three remaining required in-game screenshots are missing

## Runtime Status

Runtime testing showed that `v0.1.3` could still omit a starting stone, omit central mines, or exhibit both failures in the same generation. `v0.2.0` therefore removed gold and stone from repeated per-player generation entirely. Ten mirrored neutral lands now act as authored resource slots, and each slot receives one mandatory mine block by its unique land ID.

Runtime testing then found that one `v0.2.0` relic could escape its facial landmark and appear in a player base. `v0.2.1` confines every relic to its unique landmark land with `avoid_other_land_zones 0`, restricts it to that landmark's terrain, and resolves placement from the land origin. Run a fresh multi-seed 1v1 pass under All Visible first, then repeat under Normal fog of war before submission.
