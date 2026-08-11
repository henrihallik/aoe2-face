# Mirrorwake

`Mirrorwake` is a competitive 1v1 hybrid map for Age of Empires II: Definitive Edition. The entire playable island forms an original face-shaped terrain portrait.

Players begin on large mirrored ear plateaus with the required 9-villager tournament start. Every opening food group, mine, woodline, and fish school has a fixed mirrored slot. A dense inward-facing forest restores the original front wood mass, while two additional home woodlines and the broader pine hair and salt-and-pepper beard provide choppable attack routes. A dockable water ring with carved home coves supports reliable naval counterplay. Five relics mark both eyes, both raised cheeks, and the central nose.

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
- ID-free player origins preserve DE's per-player generation for starting units and buildings
- 9 villagers, one Town Center, two houses, and one scout per player
- Protected home plateaus reserve practical building and farming space
- 8 sheep, 2 boar, 4 deer, and 6 berries per side in fixed mirrored glades
- 15 gold and 9 stone per side across home, secondary, and forward fields
- Ten fixed mirrored mine clearings guarantee that every gold and stone field exists
- One guaranteed 180-tile front forest and two 64-tile home woodlines per side, plus 8 emergency stragglers
- Dockable water terrain 1 and a broad cove beside each ear start
- 6 shore fish and 18 deep fish per side, split across 12 fixed water slots
- 5 fixed central relics confined to their eye, cheek, and nose landmark zones
- No triggers, XS, custom includes, capturable buildings, scripted income, or unit/building attribute changes

## Strategic Identity

- **Open face:** the eyes, cheeks, and nose create several direct land fronts.
- **Choppable frame:** hair and beard provide the principal wood economy and open new late-game lanes as they are harvested.
- **Naval ring:** carved ear coves open directly onto dockable water, allowing either player to fish, raid the opposite coast, or contest the ring without making water mandatory.
- **Central objective:** the raised nose is the most central high ground and an obvious castle position.
- **Five-feature relic layout:** relic control pulls armies across both eyes, both cheeks, and the nose rather than stacking value in one spot.
- **Known resource fronts:** mirrored fixed mine fields make expansion value predictable while their exposure still rewards map control.

## Validation

Run the map-specific validator with Node.js:

```bash
node tools/validate-rms.mjs
```

The validator checks RMS structure, fixed map size, dockable water, all 96 authored lands, horizontal symmetry, the recognizable head silhouette, protected home space, the ordered 180-tile front forests, fixed 64-tile outer woodlines, every food/fish/mine slot and binding, relics, and prohibited gameplay modifications.

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
