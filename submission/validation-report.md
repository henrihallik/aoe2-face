# Static Validation Report

Date: 2026-08-09

This report covers the `v0.1.0` runtime-test candidate. Static checks validate the source contract, but only Age of Empires II: Definitive Edition can prove generation, placement, pathing, AI behavior, runtime stability, and whether the portrait reads clearly in CaptureAge.

## Artifact Hashes

| Artifact | SHA-256 |
| --- | --- |
| `Daut.rms` | `5fb383ae7a7a1a186db424e34980a62b0885138f12c34aa155df4fe7dfaecc8f` |
| `tools/validate-rms.mjs` | `eaa9ca1764eda02b7838aeecb37189cd7e588d5b916b84c192cb9c4325871f8a` |
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

Runtime validation has not yet been performed. Treat `v0.1.0` as a diagnostic candidate, not a final competition release. The first test should use 1v1, Tiny, Standard resources, an active AI opponent, and All Visible reveal. Complete [`runtime-test-checklist.md`](./runtime-test-checklist.md), then repeat under Normal fog of war before submission.
