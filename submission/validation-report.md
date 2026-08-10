# Static Validation Report

Date: 2026-08-10

This report covers the `v0.1.1` runtime-test candidate. Static checks validate the source contract, but only Age of Empires II: Definitive Edition can prove generation, placement, pathing, AI behavior, runtime stability, and whether the portrait reads clearly in CaptureAge.

## Artifact Hashes

| Artifact | SHA-256 |
| --- | --- |
| `Daut.rms` | `491d1d5bc95368001bc07ffa234a81cd165ed347c6a58580ddc1704fe93efc02` |
| `tools/validate-rms.mjs` | `66ed0f3b5cd2978e14c7a30d45407e45bea0a4786816d8ef6c55c6719a346d9b` |
| `submission/layout-reference.svg` | `eb8a4c00b28b4de43db2a476cad357d059bb6fb26225a39dbb07b0aea852db60` |
| `submission/layout-reference.png` | `983b09bb1ef28ecd4846708ffdf4b729dd68942239596c37960328f5acc884a5` |

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
- Each player receives a Town Center, 9 villagers, 2 houses, a scout, 15 gold tiles, 9 stone tiles, standard opening food, 4 shore fish, and 6 deep fish.
- Primary gold and stone keep dedicated per-player avoidance areas, remain three tiles from all trees, and cannot be crowded by the later emergency stragglers.
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

Earlier runtime generation exposed occasional home gold/stone crowding against nearby wood. `v0.1.1` adds explicit mine-to-mine and mine-to-tree clearance and now requires a fresh multi-seed runtime pass. Test 1v1, Tiny, Standard resources with an active AI opponent under All Visible first, then repeat under Normal fog of war before submission.
