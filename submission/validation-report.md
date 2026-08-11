# Static Validation Report

Date: 2026-08-11

This report covers the `v0.3.0` runtime-test candidate. Static checks validate the source contract, but only Age of Empires II: Definitive Edition can prove generation, dock placement, usable building space, pathing, AI behavior, runtime stability, and whether the portrait remains readable in play.

## Artifact Hashes

| Artifact | SHA-256 |
| --- | --- |
| `Mirrorwake.rms` | `202f300d6c13aebed8c14da000dc0b90acc6529ea736f24214219b949a000520` |
| `tools/validate-rms.mjs` | `f7ac5b06327e5fd7a1166a6a065500a6ca177f769010ff9d2e6c8e71a9599de7` |
| `submission/layout-reference.svg` | `c4c8ddfb71be4030d897b4ce19e90a5a1662f8f99aeb6fef4a3b0df436be91fc` |
| `submission/layout-reference.png` | `abdc7ea8ee83d9a08f3e01fe27362458687a8ca8798b9a29dbc691fb62999c44` |
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
- All 76 authored lands have fixed positions and exact horizontal mirrors.
- Ten face bands retain the intended head, jaw, and chin silhouette.
- Hair, beard, brows, eye whites, pupils, cheeks, nose, mouth, and teeth retain their authored terrain counts.
- The smile retains two raised corners, visible teeth, two lower side arcs, and a lowest central arc.
- Both assigned ear origins remain ID-free, mirrored, and expanded to reserve starting space.
- Each player receives a Town Center, 9 villagers, 2 houses, a scout, and 8 emergency stragglers.
- Two fixed mirrored forest lands provide a northern and southern home woodline on each side.
- Sixteen fixed food and fish lands provide exactly 8 sheep, 2 boar, 4 deer, 6 berries, 4 shore fish, and 6 deep fish per side.
- Every food and fish block is Gaia-owned, mandatory, bound to one fixed land ID, restricted to the intended terrain, and confined with `avoid_other_land_zones 0`.
- Opening food, mine, home-woodline, and cove bounds are pairwise separated wherever placement collisions would affect the opening economy.
- Ten fixed mine clearings provide 15 gold and 9 stone per side.
- Every mine block is Gaia-owned, mandatory, bound to exactly one clearing, and confined there.
- The complete water ring and four fish lands use terrain ID 1; no non-dockable depth-texture pass remains.
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

## Runtime Status

Runtime validation of `v0.3.0` is pending. The first diagnostic run must use 1v1, Tiny, Standard resources, an AI opponent, and All Visible. In particular, test several dock foundations inside both coves, count every food and fish group, and build normal production plus at least eight farms at both starts. Then complete the 20-seed and Normal-fog passes in [`runtime-test-checklist.md`](./runtime-test-checklist.md) before replacing the screenshots or submitting the map.
