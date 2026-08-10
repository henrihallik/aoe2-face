# Static Validation Report

Date: 2026-08-10

This report covers the `v0.1.3` runtime-test candidate. Static checks validate the source contract, but only Age of Empires II: Definitive Edition can prove generation, placement, pathing, AI behavior, runtime stability, and whether the portrait reads clearly in CaptureAge.

## Artifact Hashes

| Artifact | SHA-256 |
| --- | --- |
| `Mirrorwake.rms` | `da44098ae75d596179875756caa72a90ada3d944f553d8d4f32b76395ec9226d` |
| `tools/validate-rms.mjs` | `961210bd0b98434ce502613b5f0754533d8a3a64b22a93a9b1100a87bd28cc6d` |
| `submission/layout-reference.svg` | `c4c8ddfb71be4030d897b4ce19e90a5a1662f8f99aeb6fef4a3b0df436be91fc` |
| `submission/layout-reference.png` | `abdc7ea8ee83d9a08f3e01fe27362458687a8ca8798b9a29dbc691fb62999c44` |

## Passed Checks

### Map-Specific Contract Validator

Command:

```bash
node tools/validate-rms.mjs
```

Result: pass.

- Sections, braces, comments, and conditional control flow are valid.
- All 44 authored lands have fixed positions and exact horizontal mirrors.
- Ten overlapping face bands retain the intended head, jaw, and chin silhouette.
- Hair, beard, brows, eye whites, pupils, cheeks, nose, mouth, and teeth retain their authored terrain counts.
- The smile retains two raised corners, visible teeth, two lower side arcs, and a lowest central arc.
- Both ear starts remain mirrored and each can receive either player color.
- Both assigned ear lands are ID-free, preserving `set_place_for_every_player` for every repeated start object and resource group.
- Each player receives a Town Center, 9 villagers, 2 houses, a scout, 15 gold tiles, 9 stone tiles, standard opening food, 4 shore fish, and 6 deep fish.
- Berries and primary mines keep dedicated per-player working areas; mines remain three tiles from all trees and cannot be crowded by later emergency stragglers.
- Berries plus primary and secondary mines use circular closest-valid placement with tile shuffling, removing the east/west candidate-order bias.
- Five relics remain fixed on the two eyes, two cheeks, and nose.
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
- Packager gate: correctly rejects a release while the four required authentic in-game screenshots are missing

## Runtime Status

Runtime testing of `v0.1.2` exposed entire mine groups missing from one side. The assigned ear lands still carried `land_id` labels, which disable `set_place_for_every_player` in DE. `v0.1.3` removes those IDs while retaining the berry-to-mine clearance and circular closest-valid placement rules. Run a fresh multi-seed 1v1 pass under All Visible first, then repeat under Normal fog of war before submission.
