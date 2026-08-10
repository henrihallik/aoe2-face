# Mirrorwake

`Mirrorwake` is an unconventional competitive 1v1 hybrid map for Age of Empires II: Definitive Edition. The entire playable island forms an original smiling terrain portrait when viewed at full-map zoom in CaptureAge.

Players begin at mirrored ear positions with the required 9-villager tournament start. The open face provides the direct land battlefield, while the pine hair and salt-and-pepper beard are ordinary harvestable woodlines that can become alternate attack routes. A navigable water ring supports docks and naval counterplay. Five relics mark both eyes, both raised cheeks, and the central nose.

## Download

Download [`Mirrorwake.rms`](./Mirrorwake.rms) and place it in:

```text
%USERPROFILE%\Games\Age of Empires 2 DE\<player-id>\resources\_common\random-map-scripts\
```

On GeForce NOW, use the same in-session path that exposes the game profile files.

## Intended Settings

- Mode: 1v1 Random Map
- Map size: Tiny; the script enforces 120 x 120 tiles
- Resources: Standard
- Reveal map: Normal for play, All Visible for the first topology test
- Starting age: Dark Age
- Victory: Standard or Conquest

This is deliberately a 1v1-only competition design. Additional player slots are not supported.

## Competitive Layout

- Two horizontally mirrored player starts, independent of player color
- 9 villagers, one Town Center, two houses, and one scout per player
- 8 sheep, 2 boar, 4 deer, and 6 berries per player
- 15 gold and 9 stone per player across home, secondary, and forward bands
- Protected home-mine spacing keeps primary gold and stone apart from each other and nearby trees
- 8 emergency stragglers plus large harvestable hair and beard forests
- 4 shore fish and 6 deep fish per player
- 5 fixed central relics
- No triggers, XS, custom includes, capturable buildings, scripted income, or unit/building attribute changes

## Strategic Identity

- **Open face:** the eyes, cheeks, and nose create several direct land fronts.
- **Choppable frame:** hair and beard provide the principal wood economy and open new late-game lanes as they are harvested.
- **Naval ring:** both ear starts can dock, raid the opposite coast, or contest fish without making water mandatory.
- **Central objective:** the raised nose is the most central high ground and an obvious castle position.
- **Five-feature relic layout:** relic control pulls armies across both eyes, both cheeks, and the nose rather than stacking value in one spot.

## Validation

Run the map-specific validator with Node.js:

```bash
node tools/validate-rms.mjs
```

The validator checks RMS structure, fixed map size, terrain safety, all 44 authored lands, horizontal symmetry, the recognizable head silhouette, the upturned smile and teeth geometry, player starts, home-mine clearances, resources, fish, relics, and prohibited gameplay modifications.

Static validation cannot prove Definitive Edition runtime behavior or portrait readability. Complete the in-game checklist in [`submission/runtime-test-checklist.md`](submission/runtime-test-checklist.md) before submitting the map.

## Submission Assets

- [`submission/discord-submission.txt`](submission/discord-submission.txt): compact competition post
- [`submission/layout-reference.png`](submission/layout-reference.png): original design diagram, not an in-game screenshot
- [`submission/runtime-test-checklist.md`](submission/runtime-test-checklist.md): runtime and seed checks
- [`submission/screenshots/README.md`](submission/screenshots/README.md): required screenshot plan
- [`submission/validation-report.md`](submission/validation-report.md): recorded static checks

## Design Note

The terrain portrait is an original, deliberately stylized design. No source photograph is included or redistributed. The map is not affiliated with or endorsed by Microsoft, World's Edge, CaptureAge, or The Garrison.

## License

Released under the MIT License. Age of Empires II and related names are trademarks of their respective owners.
