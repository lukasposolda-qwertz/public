/* Gods' Gambit — run engine: state, map generation, hubris, save/load */

const SAVE_KEY = 'gods_gambit_save_v1';
const META_KEY = 'gods_gambit_meta_v1';

function loadMeta() {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { unlockedCodex: {}, runsPlayed: 0, runsWon: 0 };
}

function saveMeta(meta) {
  localStorage.setItem(META_KEY, JSON.stringify(meta));
}

function unlockCodex(meta, type, id) {
  meta.unlockedCodex = meta.unlockedCodex || {};
  meta.unlockedCodex[type] = meta.unlockedCodex[type] || {};
  if (!meta.unlockedCodex[type][id]) {
    meta.unlockedCodex[type][id] = true;
    saveMeta(meta);
    return true;
  }
  return false;
}

function saveRun(run) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(run));
}

function loadRun() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

function clearRun() {
  localStorage.removeItem(SAVE_KEY);
}

function makeHeroInstance(id) {
  const t = HERO_TEMPLATES[id];
  return Object.assign({}, t, {
    hp: t.maxHp, statuses: {}, cooldowns: {}, frenzy: 0, hopeRevive: false, fallen: false
  });
}

function createRun(godId, heroId) {
  const run = {
    godId,
    party: [makeHeroInstance(heroId)],
    favor: 2, maxFavor: 10,
    drachma: 3,
    hubris: 0,
    nemesisPending: false,
    nemesisFallen: false,
    relics: [],
    threadRevealed: false,
    hecateSight: false,
    log: [],
    map: null,
    currentNodeId: null,
    visited: {},
    act: 1,
    finished: false,
    victory: false
  };
  GODS[godId].boon.apply(run);
  if (godId === 'hecate') run.hecateSight = true;
  run.map = generateAct1Map();
  run.currentNodeId = run.map.start;
  run.visited[run.currentNodeId] = true;
  return run;
}

/* ---- Map generation: Act I, "The Mortal Wilds" ----
   Layer 0: start (single battle node)
   Layers 1-6: 2 nodes each, special types placed once each
   Layer 7: boss (single node)
   Every node in layer L connects to every node in layer L+1 (full bipartite),
   so from your current node you always choose among that layer's 2 options. */
function generateAct1Map() {
  const nodes = {};
  let idCounter = 0;
  const nextId = () => 'n' + (idCounter++);

  // Layer 0
  const startId = nextId();
  nodes[startId] = { id: startId, layer: 0, type: 'battle', encounter: rollBattleEncounter(), connections: [] };

  // Layers 1-6, 2 nodes each
  const specials = shuffle(['elite','shrine','agora','spring','oracle']);
  const slots = []; // 12 slots across layers 1-6
  for (let l = 1; l <= 6; l++) { slots.push([l,0]); slots.push([l,1]); }
  const shuffledSlots = shuffle(slots.slice());
  const specialSlotMap = {};
  specials.forEach((type, i) => { specialSlotMap[shuffledSlots[i].join(',')] = type; });

  const layerNodeIds = { 0: [startId] };
  for (let l = 1; l <= 6; l++) {
    layerNodeIds[l] = [];
    for (let pos = 0; pos < 2; pos++) {
      const id = nextId();
      let type = specialSlotMap[[l,pos].join(',')];
      if (!type) {
        type = Math.random() < 0.55 ? 'battle' : 'event';
      }
      const node = { id, layer: l, type, connections: [] };
      if (type === 'battle') node.encounter = rollBattleEncounter();
      if (type === 'elite') node.encounter = rollEliteEncounter();
      if (type === 'event') node.event = rollEvent();
      nodes[id] = node;
      layerNodeIds[l].push(id);
    }
  }

  // Layer 7: boss
  const bossId = nextId();
  nodes[bossId] = { id: bossId, layer: 7, type: 'boss', encounter: { monsters: ['nemean_lion'] }, connections: [] };
  layerNodeIds[7] = [bossId];

  // Wire connections: full bipartite between adjacent layers
  for (let l = 0; l <= 6; l++) {
    layerNodeIds[l].forEach(fromId => {
      nodes[fromId].connections = layerNodeIds[l+1].slice();
    });
  }

  return { nodes, start: startId, boss: bossId, layers: layerNodeIds };
}

function rollBattleEncounter() {
  const packs = [
    ['lykoi','lykoi'],
    ['lykoi','lykoi','lykoi'],
    ['centaur'],
    ['boar'],
    ['satyr','satyr'],
    ['boar','lykoi'],
    ['harpy','harpy'],
    ['satyr','lykoi'],
    ['centaur','lykoi']
  ];
  return { monsters: packs[Math.floor(Math.random()*packs.length)].slice() };
}

function rollEliteEncounter() {
  const elites = [['medusa'], ['hydra'], ['cyclops']];
  return { monsters: elites[Math.floor(Math.random()*elites.length)].slice() };
}

function rollEvent() {
  const ids = Object.keys(EVENTS);
  return ids[Math.floor(Math.random()*ids.length)];
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ---- Hubris / Nemesis ---- */
function applyHubrisEffects(run, logFn) {
  if (run.hubris >= 50 && !run.nemesisPending && !run.nemesisFallen) {
    run.nemesisPending = true;
    if (logFn) logFn('Your hubris has drawn the eyes of the Erinyes. The next elite you face will be the Furies themselves.');
  }
  if (run.hubris >= 80 && !run.nemesisCurse) {
    run.nemesisCurse = true;
    run.party.forEach(h => { h.power = Math.max(1, h.power - 1); });
    if (logFn) logFn('The gods turn their gaze on you fully. Your warband feels weaker for it. (-1 Power, all heroes — permanent this run)');
  }
}

/* ---- Node travel ---- */
function getCurrentNode(run) {
  return run.map.nodes[run.currentNodeId];
}

function getNextOptions(run) {
  const node = getCurrentNode(run);
  return node.connections.map(id => run.map.nodes[id]);
}

function travelTo(run, nodeId) {
  run.currentNodeId = nodeId;
  run.visited[nodeId] = true;
  Object.values(RELICS).forEach(r => {
    if (run.relics.includes(r.id) && r.onNodeStart) r.onNodeStart(run);
  });
}
