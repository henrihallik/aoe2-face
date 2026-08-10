#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const rmsPath = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : resolve(here, "../Mirrorwake.rms");
const source = readFileSync(rmsPath, "utf8");

function stripComments(input) {
  let depth = 0;
  let output = "";

  for (let index = 0; index < input.length; index += 1) {
    const pair = input.slice(index, index + 2);
    if (pair === "/*") {
      depth += 1;
      output += "  ";
      index += 1;
    } else if (pair === "*/") {
      assert.ok(depth > 0, `stray comment terminator at offset ${index}`);
      depth -= 1;
      output += "  ";
      index += 1;
    } else {
      output += depth === 0 ? input[index] : input[index] === "\n" ? "\n" : " ";
    }
  }

  assert.equal(depth, 0, "unclosed block comment");
  return output;
}

function readBlock(text, open, label) {
  let depth = 1;
  let cursor = open + 1;

  while (cursor < text.length && depth > 0) {
    if (text[cursor] === "{") depth += 1;
    if (text[cursor] === "}") depth -= 1;
    cursor += 1;
  }

  assert.equal(depth, 0, `unclosed ${label} block`);
  return { body: text.slice(open + 1, cursor - 1), end: cursor };
}

function blocksFor(command, text, hasName = true) {
  const blocks = [];
  const pattern = hasName
    ? new RegExp(`\\b${command}\\s+([^\\s{}]+)\\s*\\{`, "g")
    : new RegExp(`\\b${command}\\s*\\{`, "g");
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const open = text.indexOf("{", match.index);
    const { body, end } = readBlock(text, open, `${command} ${match[1] ?? ""}`);
    blocks.push({ name: hasName ? match[1] : command, body });
    pattern.lastIndex = end;
  }

  return blocks;
}

function valuesFor(attribute, text) {
  return [
    ...text.matchAll(new RegExp(`\\b${attribute}\\s+([^\\s{}]+)`, "g")),
  ].map((match) => match[1]);
}

function valueFor(attribute, text) {
  return valuesFor(attribute, text)[0];
}

function pairFor(attribute, text) {
  const match = text.match(new RegExp(`\\b${attribute}\\s+(-?\\d+)\\s+(-?\\d+)`));
  return match ? [Number(match[1]), Number(match[2])] : undefined;
}

function objectQuantity(block) {
  return (
    Number(valueFor("number_of_objects", block.body) ?? 1) *
    Number(valueFor("number_of_groups", block.body) ?? 1)
  );
}

function totalFor(name, blocks) {
  return blocks
    .filter((block) => block.name === name)
    .reduce((total, block) => total + objectQuantity(block), 0);
}

function landWithId(lands, id) {
  const matches = lands.filter((block) => valueFor("land_id", block.body) === id);
  assert.equal(matches.length, 1, `${id} must identify exactly one land`);
  return matches[0];
}

const code = stripComments(source);

assert.ok(!code.includes("//"), "RMS does not support // comments");
assert.ok(!code.includes("#include"), "custom includes do not transfer in lobbies");
assert.ok(!code.includes("\r"), "source must use LF line endings");

let braceDepth = 0;
for (const character of code) {
  braceDepth += character === "{" ? 1 : character === "}" ? -1 : 0;
  assert.ok(braceDepth >= 0, "closing brace appears before an opening brace");
}
assert.equal(braceDepth, 0, "unbalanced braces");

const controlStack = [];
for (const match of code.matchAll(/\b(start_random|end_random|if|elseif|else|endif)\b/g)) {
  const token = match[1];
  if (token === "start_random" || token === "if") {
    controlStack.push(token);
  } else if (token === "end_random") {
    assert.equal(controlStack.pop(), "start_random", "end_random closes the wrong construct");
  } else if (token === "endif") {
    assert.equal(controlStack.pop(), "if", "endif closes the wrong construct");
  } else {
    assert.equal(controlStack.at(-1), "if", `${token} appears outside an if block`);
  }
}
assert.deepEqual(controlStack, [], "unclosed conditional or random block");

const expectedSections = [
  "PLAYER_SETUP",
  "LAND_GENERATION",
  "ELEVATION_GENERATION",
  "TERRAIN_GENERATION",
  "CONNECTION_GENERATION",
  "OBJECTS_GENERATION",
];
assert.deepEqual(
  [...code.matchAll(/<([A-Z_]+)>/g)].map((match) => match[1]),
  expectedSections,
  "sections are missing or out of order",
);

assert.match(code, /\bdirect_placement\b/, "fixed ear starts require direct placement");
assert.match(code, /\bbehavior_version\s+2\b/, "behavior_version 2 is required");
assert.match(code, /\boverride_map_size\s+120\b/, "the portrait requires a 120-tile canvas");
assert.match(code, /\bai_info_map_type\s+RIVERS\s+0\s+0\s+0\b/, "AI must recognize the hybrid layout");
assert.match(code, /\bbase_terrain\s+SEA_WATER\b/, "the water ring must remain the base terrain");
assert.ok(/\bbase_elevation\b/.test(code), "raised cheeks and nose require base_elevation");
assert.ok(!/\bcreate_elevation\b/.test(code), "random hills would distort the portrait");
assert.equal(
  [...code.matchAll(/\bcreate_connect_land_zones\b/g)].length,
  0,
  "generated roads would paint across the facial features",
);

const constants = new Map();
for (const match of code.matchAll(/#const\s+([A-Z0-9_]+)\s+(-?\d+)/g)) {
  assert.ok(!constants.has(match[1]), `duplicate custom constant ${match[1]}`);
  constants.set(match[1], Number(match[2]));
}

for (const [name, value] of [
  ["FACE_GROUND", 14],
  ["CHEEK_GROUND", 41],
  ["NOSE_GROUND", 42],
  ["SEA_WATER", 23],
  ["SEA_DEEP", 22],
  ["HAIR_FOREST", 19],
  ["BEARD_FOREST", 106],
  ["BROW_GROUND", 40],
  ["EYE_WHITE", 32],
  ["TEETH_WHITE", 74],
  ["MOUTH_GROUND", 40],
  ["START_HERDABLE", 594],
  ["START_LUREABLE", 48],
  ["START_HUNTABLE", 65],
  ["START_TREE", 349],
  ["HARBOR_FISH", 457],
  ["DECORATIVE_ROCK", 623],
  ["LEFT_HOME_GOLD_ID", 401],
  ["RIGHT_HOME_GOLD_ID", 402],
  ["LEFT_HOME_STONE_ID", 411],
  ["RIGHT_HOME_STONE_ID", 412],
  ["LEFT_SECONDARY_GOLD_ID", 421],
  ["RIGHT_SECONDARY_GOLD_ID", 422],
  ["LEFT_SECONDARY_STONE_ID", 431],
  ["RIGHT_SECONDARY_STONE_ID", 432],
  ["LEFT_FORWARD_GOLD_ID", 441],
  ["RIGHT_FORWARD_GOLD_ID", 442],
  ["RESOURCE_ZONE", 30],
  ["TC_AREA", 1000],
  ["VILLAGER_AREA", 1010],
  ["BERRIES_AREA", 1040],
]) {
  assert.equal(constants.get(name), value, `${name} must keep terrain/object ID ${value}`);
}

for (const forbidden of [
  "effect_percent",
  "SET_ATTRIBUTE",
  "ADD_ATTRIBUTE",
  "GAIA_SET_ATTRIBUTE",
  "GAIA_ADD_ATTRIBUTE",
  "guard_state",
  "resource_delta",
  "set_building_capturable",
  "make_indestructible",
  "set_gaia_unconvertible",
  "create_trigger",
  "xsScriptCall",
  "create_object_group",
]) {
  assert.ok(!new RegExp(`\\b${forbidden}\\b`).test(code), `forbidden mechanic ${forbidden}`);
}

const terrainValues = [
  "FACE_GROUND",
  "CHEEK_GROUND",
  "NOSE_GROUND",
  "SEA_WATER",
  "SEA_DEEP",
  "HAIR_FOREST",
  "BEARD_FOREST",
  "BROW_GROUND",
  "EYE_WHITE",
  "TEETH_WHITE",
  "MOUTH_GROUND",
].map((name) => constants.get(name));
assert.ok(!terrainValues.includes(45), "terrain 45 changes building damage");
assert.ok(!terrainValues.includes(47), "terrain 47 has known pathfinding defects");

const effects = [...code.matchAll(/\beffect_amount\s+([^\n]+)/g)].map((match) =>
  match[1].trim(),
);
assert.deepEqual(
  effects.sort(),
  [
    "MOD_RESOURCE AMOUNT_STARTING_FOOD ATTR_ADD -100",
    "MOD_RESOURCE AMOUNT_STARTING_WOOD ATTR_ADD -30",
  ].sort(),
  "only the established 9-villager resource adjustments are allowed",
);

const randomBlocks = [...code.matchAll(/\bstart_random\b([\s\S]*?)\bend_random\b/g)].map(
  (match) => match[1],
);
assert.equal(randomBlocks.length, 1, "only the independent player-side swap may be random");
assert.deepEqual(valuesFor("percent_chance", randomBlocks[0]), ["50", "50"]);

const lands = blocksFor("create_land", code, false);
const landsByTerrain = (terrain) =>
  lands.filter((block) => valueFor("terrain_type", block.body) === terrain);

const mineExpectations = new Map([
  ["LEFT_HOME_GOLD_ID", { object: "GOLD", quantity: 7, tiles: 49, position: [12, 44] }],
  ["RIGHT_HOME_GOLD_ID", { object: "GOLD", quantity: 7, tiles: 49, position: [88, 44] }],
  ["LEFT_HOME_STONE_ID", { object: "STONE", quantity: 5, tiles: 36, position: [21, 60] }],
  ["RIGHT_HOME_STONE_ID", { object: "STONE", quantity: 5, tiles: 36, position: [79, 60] }],
  ["LEFT_SECONDARY_GOLD_ID", { object: "GOLD", quantity: 4, tiles: 36, position: [31, 58] }],
  ["RIGHT_SECONDARY_GOLD_ID", { object: "GOLD", quantity: 4, tiles: 36, position: [69, 58] }],
  ["LEFT_SECONDARY_STONE_ID", { object: "STONE", quantity: 4, tiles: 36, position: [38, 50] }],
  ["RIGHT_SECONDARY_STONE_ID", { object: "STONE", quantity: 4, tiles: 36, position: [62, 50] }],
  ["LEFT_FORWARD_GOLD_ID", { object: "GOLD", quantity: 4, tiles: 36, position: [44, 46] }],
  ["RIGHT_FORWARD_GOLD_ID", { object: "GOLD", quantity: 4, tiles: 36, position: [56, 46] }],
]);

assert.equal(lands.length, 54, "the portrait requires exactly 54 authored lands");
for (const [terrain, expected] of [
  ["FACE_GROUND", 12],
  ["HAIR_FOREST", 5],
  ["BEARD_FOREST", 10],
  ["CHEEK_GROUND", 12],
  ["NOSE_GROUND", 2],
  ["BROW_GROUND", 4],
  ["EYE_WHITE", 2],
  ["MOUTH_GROUND", 6],
  ["TEETH_WHITE", 1],
]) {
  assert.equal(landsByTerrain(terrain).length, expected, `${terrain} land count drifted`);
}

const landsByPosition = new Map();
for (const block of lands) {
  const position = pairFor("land_position", block.body);
  assert.ok(position, "every portrait land requires a fixed position");
  const key = position.join(",");
  assert.ok(!landsByPosition.has(key), `duplicate land position ${key}`);
  landsByPosition.set(key, block);
  const mine = mineExpectations.get(valueFor("land_id", block.body));
  if (mine) {
    assert.equal(valueFor("land_percent", block.body), undefined, `${key} must use a fixed tile count`);
    assert.equal(valueFor("number_of_tiles", block.body), String(mine.tiles), `${key} clearing size drifted`);
  } else {
    assert.equal(valueFor("land_percent", block.body), "100", `${key} must fill its bounds`);
  }
  assert.equal(valueFor("border_fuzziness", block.body), "100", `${key} must respect its bounds`);
  assert.equal(valueFor("clumping_factor", block.body), "100", `${key} must remain compact`);
  assert.equal(valueFor("other_zone_avoidance_distance", block.body), "0", `${key} may not drift`);
}

/* Every land has an exact horizontal mirror; central lands mirror themselves. */
for (const [position, block] of landsByPosition) {
  const [x, y] = position.split(",").map(Number);
  const left = Number(valueFor("left_border", block.body));
  const right = Number(valueFor("right_border", block.body));
  const top = Number(valueFor("top_border", block.body));
  const bottom = Number(valueFor("bottom_border", block.body));
  assert.ok(x >= left && x <= 100 - right, `${position} is outside its horizontal bounds`);
  assert.ok(y >= top && y <= 100 - bottom, `${position} is outside its vertical bounds`);

  const partnerPosition = `${100 - x},${y}`;
  const partner = landsByPosition.get(partnerPosition);
  assert.ok(partner, `${position} lacks horizontal partner ${partnerPosition}`);
  for (const attribute of [
    "terrain_type",
    "land_percent",
    "number_of_tiles",
    "base_size",
    "border_fuzziness",
    "clumping_factor",
    "other_zone_avoidance_distance",
    "base_elevation",
  ]) {
    assert.equal(
      valueFor(attribute, partner.body),
      valueFor(attribute, block.body),
      `${position} and ${partnerPosition} differ on ${attribute}`,
    );
  }
  assert.equal(valueFor("left_border", partner.body), String(right));
  assert.equal(valueFor("right_border", partner.body), String(left));
  assert.equal(valueFor("top_border", partner.body), String(top));
  assert.equal(valueFor("bottom_border", partner.body), String(bottom));
}

const faceBands = landsByTerrain("FACE_GROUND").filter(
  (block) => !/\bassign_to_player\b/.test(block.body),
);
assert.deepEqual(
  faceBands.map((block) => {
    const [x, y] = pairFor("land_position", block.body);
    return [
      x,
      y,
      Number(valueFor("left_border", block.body)),
      Number(valueFor("right_border", block.body)),
      Number(valueFor("top_border", block.body)),
      Number(valueFor("bottom_border", block.body)),
    ].join(":");
  }),
  [
    "50:10:40:40:7:86",
    "50:16:32:32:12:79",
    "50:24:26:26:19:71",
    "50:33:21:21:27:61",
    "50:43:17:17:37:51",
    "50:54:14:14:47:39",
    "50:64:18:18:59:30",
    "50:73:25:25:68:20",
    "50:83:34:34:78:11",
    "50:90:42:42:87:6",
  ],
  "the recognizable head, jaw, or chin silhouette drifted",
);

const assignedLands = lands.filter((block) => /\bassign_to_player\b/.test(block.body));
assert.equal(assignedLands.length, 2, "only the two ears may set player origins");
assert.deepEqual(
  assignedLands.map((block) => pairFor("land_position", block.body).join(",")),
  ["14,52", "86,52"],
  "ear start coordinates drifted",
);
for (const block of assignedLands) {
  assert.equal(valueFor("terrain_type", block.body), "FACE_GROUND");
  assert.deepEqual(valuesFor("assign_to_player", block.body).sort(), ["1", "2"]);
  assert.equal(
    valueFor("land_id", block.body),
    undefined,
    "land_id disables set_place_for_every_player on assigned lands in DE",
  );
}
assert.equal(constants.has("LEFT_HOME_ID"), false, "player origins must not expose a land ID");
assert.equal(constants.has("RIGHT_HOME_ID"), false, "player origins must not expose a land ID");

/* Smile contract: high corners, lower side arcs, and the lowest center. */
const smileLeft = landWithId(lands, "LEFT_SMILE_CORNER_ID");
const smileRight = landWithId(lands, "RIGHT_SMILE_CORNER_ID");
const teeth = landWithId(lands, "TEETH_ID");
const lowerLeft = landWithId(lands, "LEFT_LOWER_SMILE_ID");
const lowerCenter = landWithId(lands, "CENTER_LOWER_SMILE_ID");
const lowerRight = landWithId(lands, "RIGHT_LOWER_SMILE_ID");
assert.deepEqual(pairFor("land_position", smileLeft.body), [35, 65]);
assert.deepEqual(pairFor("land_position", smileRight.body), [65, 65]);
assert.deepEqual(pairFor("land_position", teeth.body), [50, 66]);
assert.deepEqual(pairFor("land_position", lowerLeft.body), [41, 70]);
assert.deepEqual(pairFor("land_position", lowerCenter.body), [50, 74]);
assert.deepEqual(pairFor("land_position", lowerRight.body), [59, 70]);
assert.ok(
  pairFor("land_position", smileLeft.body)[1] < pairFor("land_position", lowerLeft.body)[1] &&
    pairFor("land_position", lowerLeft.body)[1] < pairFor("land_position", lowerCenter.body)[1],
  "mouth geometry must remain visibly upturned",
);
assert.equal(valueFor("terrain_type", teeth.body), "TEETH_WHITE");

for (const id of [
  "LEFT_EYE_ID",
  "RIGHT_EYE_ID",
  "LEFT_CHEEK_ID",
  "RIGHT_CHEEK_ID",
  "NOSE_TIP_ID",
]) {
  landWithId(lands, id);
}

const terrainBlocks = blocksFor("create_terrain", code);
assert.equal(terrainBlocks.length, 1, "only the water-depth texture may be random");
assert.equal(terrainBlocks[0].name, "SEA_DEEP");
assert.equal(valueFor("base_terrain", terrainBlocks[0].body), "SEA_WATER");
assert.equal(valueFor("land_percent", terrainBlocks[0].body), "52");
assert.equal(valueFor("number_of_clumps", terrainBlocks[0].body), "18");
assert.equal(valueFor("terrain_mask", terrainBlocks[0].body), "1");

const objects = blocksFor("create_object", code);
const perPlayer = objects.filter((block) => /\bset_place_for_every_player\b/.test(block.body));
const neutral = objects.filter((block) => !/\bset_place_for_every_player\b/.test(block.body));

for (const [name, expected] of [
  ["TOWN_CENTER", 1],
  ["VILLAGER", 9],
  ["HOUSE", 2],
  ["SCOUT", 1],
  ["START_HERDABLE", 8],
  ["START_LUREABLE", 2],
  ["START_HUNTABLE", 4],
  ["FORAGE", 6],
  ["SHORE_FISH", 4],
  ["HARBOR_FISH", 6],
]) {
  assert.equal(totalFor(name, perPlayer), expected, `${name} per-player total must be ${expected}`);
}

for (const block of perPlayer) {
  assert.match(block.body, /\bforce_placement\b/, `${block.name} player object must be mandatory`);
}

const villagers = perPlayer.filter((block) => block.name === "VILLAGER");
assert.equal(villagers.length, 1, "villagers must use one compact start block");
assert.equal(valueFor("actor_area_to_place_in", villagers[0].body), "VILLAGER_AREA");

const forages = perPlayer.filter((block) => block.name === "FORAGE");
assert.equal(forages.length, 1, "berries must use one home forage block");
assert.equal(valueFor("actor_area", forages[0].body), "BERRIES_AREA");
assert.equal(valueFor("actor_area_radius", forages[0].body), "5");

const startTrees = perPlayer.filter((block) => block.name === "START_TREE");
assert.equal(startTrees.length, 2, "one villager anchor and one straggler block are required");
assert.equal(totalFor("START_TREE", perPlayer), 9, "each player requires eight stragglers plus the anchor tree");

assert.equal(totalFor("GOLD", perPlayer), 0, "mines must not use fallible per-player placement");
assert.equal(totalFor("STONE", perPlayer), 0, "mines must not use fallible per-player placement");

const fixedMines = neutral.filter((block) => block.name === "GOLD" || block.name === "STONE");
assert.equal(fixedMines.length, 10, "ten independent fixed mine blocks are required");
assert.equal(totalFor("GOLD", fixedMines), 30, "the mirrored clearings require 30 gold tiles total");
assert.equal(totalFor("STONE", fixedMines), 18, "the mirrored clearings require 18 stone tiles total");

for (const [landId, expected] of mineExpectations) {
  const land = landWithId(lands, landId);
  assert.deepEqual(pairFor("land_position", land.body), expected.position, `${landId} position drifted`);
  assert.equal(valueFor("terrain_type", land.body), "CHEEK_GROUND", `${landId} must exclude food and trees`);
  assert.equal(valueFor("number_of_tiles", land.body), String(expected.tiles), `${landId} size drifted`);
  assert.equal(valueFor("base_size", land.body), "3", `${landId} must retain a workable clearing`);
  assert.equal(valueFor("zone", land.body), "RESOURCE_ZONE", `${landId} must use the resource zone`);

  const blocks = fixedMines.filter(
    (block) => valueFor("place_on_specific_land_id", block.body) === landId,
  );
  assert.equal(blocks.length, 1, `${landId} must receive exactly one mine block`);
  const [block] = blocks;
  assert.equal(block.name, expected.object, `${landId} has the wrong resource`);
  assert.equal(objectQuantity(block), expected.quantity, `${landId} quantity drifted`);
  assert.equal(valueFor("avoid_other_land_zones", block.body), "0", `${landId} must confine its mine`);
  assert.equal(valueFor("terrain_to_place_on", block.body), "CHEEK_GROUND", `${landId} terrain drifted`);
  assert.equal(valueFor("set_place_for_every_player", block.body), undefined, `${landId} must remain neutral`);
  assert.match(block.body, /\bset_gaia_object_only\b/, `${landId} must be Gaia-owned`);
  assert.match(block.body, /\bfind_closest\b/, `${landId} must resolve from its land origin`);
  assert.match(block.body, /\bforce_placement\b/, `${landId} must be mandatory`);
}

const stragglers = startTrees.find(
  (block) => valueFor("number_of_objects", block.body) === "8",
);
assert.ok(stragglers, "the eight emergency stragglers must remain identifiable");

for (const area of ["TC_AREA", "BERRIES_AREA"]) {
  assert.ok(
    valuesFor("avoid_actor_area", stragglers.body).includes(area),
    `emergency stragglers must avoid ${area}`,
  );
}

assert.match(forages[0].body, /\bset_circular_placement\b/, "berries must use circular distances");
assert.match(forages[0].body, /\bfind_closest\b/, "berries must use the closest valid distance");
assert.match(forages[0].body, /\benable_tile_shuffling\b/, "berries must avoid directional tile bias");

const relics = neutral.filter((block) => block.name === "RELIC");
assert.equal(totalFor("RELIC", relics), 5, "the face requires exactly five relics");
const relicExpectations = [
  ["LEFT_EYE_ID", "EYE_WHITE", [37, 40]],
  ["RIGHT_EYE_ID", "EYE_WHITE", [63, 40]],
  ["LEFT_CHEEK_ID", "CHEEK_GROUND", [31, 52]],
  ["RIGHT_CHEEK_ID", "CHEEK_GROUND", [69, 52]],
  ["NOSE_TIP_ID", "NOSE_GROUND", [50, 56]],
];
assert.deepEqual(
  relics.map((block) => valueFor("place_on_specific_land_id", block.body)),
  relicExpectations.map(([landId]) => landId),
  "relics must remain on the eyes, cheeks, and nose",
);
for (const [index, block] of relics.entries()) {
  const [landId, terrain, position] = relicExpectations[index];
  assert.deepEqual(pairFor("land_position", landWithId(lands, landId).body), position, `${landId} position drifted`);
  assert.equal(valueFor("avoid_other_land_zones", block.body), "0", `${landId} relic must stay inside its land`);
  assert.equal(valueFor("terrain_to_place_on", block.body), terrain, `${landId} relic terrain drifted`);
  assert.match(block.body, /\bfind_closest\b/, `${landId} relic must resolve from its land origin`);
  assert.doesNotMatch(block.body, /\bfind_closest_to_map_center\b/, `${landId} relic must not escape toward map center`);
  assert.match(block.body, /\bforce_placement\b/, "every relic must be mandatory");
}

assert.equal(totalFor("DECORATIVE_ROCK", neutral), 18, "facial rock detail count drifted");

console.log(`Mirrorwake validation passed: ${rmsPath}`);
console.log("  sections and control flow: valid");
console.log("  portrait: 54 fixed lands with exact horizontal symmetry");
console.log("  smile: raised corners, visible teeth, and a three-part lower U-arc");
console.log("  start: 9 villagers, Town Center, 2 houses, and scout per player");
console.log("  player origins: ID-free for reliable per-player object generation");
console.log("  economy: 15 gold and 9 stone per side; 8 sheep, 2 boar, and 4 deer per player");
console.log("  mines: 10 mandatory fields confined to fixed mirrored clearings");
console.log("  home economy: clearing terrain separates mines from random food and trees");
console.log("  hybrid food: 4 shore fish and 6 deep fish per player");
console.log("  objectives: 5 relics confined to the eyes, cheeks, and nose");
console.log("  prohibited gameplay modifications: absent");
