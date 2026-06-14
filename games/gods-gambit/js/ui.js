/* Gods' Gambit — UI rendering and screen flow */

const gameState = {
  screen: 'title',
  run: null,
  combat: null,
  meta: null,
  pendingAction: null,
  pendingEventResult: null,
  oracleResult: null
};

const CODEX_LORE = {
  ares: "God of war in its rawest form — not strategy, but the bloodlust of the clash itself. Even his fellow gods found him distasteful.",
  apollo: "God of the sun, music, prophecy, and plague. His arrows could heal a city or, in anger, fill it with pestilence.",
  hecate: "A goddess older than the Olympians' easy categories — of crossroads, boundaries, ghosts, and witchcraft. Both feared and quietly honored.",
  heracles: "Son of Zeus, strongest of mortals, doomed by Hera's hatred to labors no man should survive — and somehow did.",
  atalanta: "A huntress raised by a bear, faster than any man who challenged her, who outran every suitor but one — and even that race was rigged with golden apples.",
  perseus: "Slayer of Medusa, who succeeded only because Athena taught him not to look directly at what could not be looked at — a mirrored shield was enough.",
  iolaus: "Heracles' nephew and companion, who held the torch that cauterized the Hydra's necks so new heads could not grow back.",
  lykoi: "Ordinary wolves, but the Greek wilds were never just wild — every beast that crossed a hero's path was, in some sense, sent.",
  satyr: "Half-goat companions of Dionysus, more mischief than malice — though a satyr's mischief can still leave you lighter in the purse.",
  centaur: "Most centaurs were drunken, violent creatures — only a few, like wise Chiron, broke the mold.",
  harpy: "Winged spirits of sudden, snatching storms — in myth they tormented blind Phineus by stealing his food at every meal.",
  boar: "The Calydonian Boar required a whole company of heroes to bring down. Lesser boars still gore plenty of overconfident travelers.",
  medusa: "Once a beautiful woman, cursed by Athena after Poseidon's violation in her temple — her gaze now turns the living to stone, a horror she never asked for.",
  hydra: "A serpent of Lerna with regenerating heads — for every one severed, two more grew, unless the wound was cauterized before they could.",
  hydra_head: "A newly-grown head of the Hydra — smaller, but no less hungry.",
  cyclops: "One-eyed giants, sons of earth and sky in the oldest tellings — Odysseus blinded one, Polyphemus, to escape his cave.",
  nemean_lion: "Its hide could not be pierced by any weapon forged by mortals. Heracles, his first labor, eventually strangled it with his bare hands.",
  erinyes: "The Furies — ancient spirits of vengeance who rise specifically for those who have wronged the natural order. They do not forgive, and they do not forget.",
  talaria: "The winged sandals of Hermes, messenger of the gods, lent on occasion to mortals who needed to move faster than fate.",
  cap_of_hades: "The Helm of Darkness, which renders its wearer wholly invisible — even to the gods, in some tellings.",
  aegis: "The storm-shield, sometimes Zeus's, sometimes given to Athena — its edge bore the head of a gorgon and could turn armies to flight.",
  harpe: "The curved adamantine blade gifted to Perseus, the only weapon said capable of beheading a gorgon cleanly.",
  golden_fleece: "The fleece of a golden ram, sought by Jason and the Argonauts across the world's edge — a symbol of impossible quests completed.",
  lyre_of_orpheus: "Orpheus's music could calm beasts, move stones, and — almost — bring the dead back from the underworld.",
  ariadnes_thread: "The thread Ariadne gave Theseus to find his way back out of the Labyrinth, after the Minotaur was slain.",
  cornucopia: "The horn of plenty, broken from the goat Amalthea who nursed the infant Zeus — it overflows endlessly with whatever its bearer needs."
};

function render() {
  const app = document.getElementById('app');
  let html = '';
  switch (gameState.screen) {
    case 'title': html = renderTitle(); break;
    case 'patron': html = renderPatron(); break;
    case 'hero': html = renderHero(); break;
    case 'map': html = renderMap(); break;
    case 'battle': html = renderBattle(); break;
    case 'event': html = renderEvent(); break;
    case 'shrine': html = renderShrine(); break;
    case 'agora': html = renderAgora(); break;
    case 'spring': html = renderSpring(); break;
    case 'oracle': html = renderOracle(); break;
    case 'reward': html = renderReward(); break;
    case 'victory': html = renderVictory(); break;
    case 'defeat': html = renderDefeat(); break;
    case 'codex': html = renderCodex(); break;
    default: html = renderTitle();
  }
  app.innerHTML = html + `<footer class="gg-footer">Gods&rsquo; Gambit &mdash; &copy; 2026 Lukas Posolda</footer>`;
}

/* ---------------------------------------------------------- */
function renderTitle() {
  const meta = gameState.meta;
  const hasRun = !!loadRun();
  return `
    <h1>Gods' Gambit</h1>
    <img class="title-art" src="images/placeholder_title.svg" alt="">
    <p class="center muted">A tragedy in three acts, for one mortal champion of Greece.</p>
    <div class="btn-row">
      <button class="btn gold" data-action="new-run">Begin a Run</button>
      ${hasRun ? '<button class="btn" data-action="continue-run">Continue Run</button>' : ''}
      <button class="btn" data-action="open-codex">Codex</button>
    </div>
    <p class="center muted">Runs attempted: ${meta.runsPlayed||0} &middot; Victories: ${meta.runsWon||0}</p>
  `;
}

function renderPatron() {
  const cards = Object.values(GODS).map(g => `
    <div class="pick-card" data-action="pick-god" data-id="${g.id}">
      <img src="${g.portrait}" alt="${g.name}">
      <h3>${g.name}</h3>
      <div class="sub">${g.title}</div>
      <p>${g.desc}</p>
      <p class="muted"><em>${g.boon.desc}</em></p>
    </div>
  `).join('');
  return `
    <h2 class="center">Choose Your Patron</h2>
    <p class="center muted">The god you pledge to will shape every road ahead.</p>
    <div class="card-grid">${cards}</div>
  `;
}

function renderHero() {
  const cards = RECRUIT_ORDER.map(id => {
    const h = HERO_TEMPLATES[id];
    return `
    <div class="pick-card" data-action="pick-hero" data-id="${id}">
      <img src="${h.portrait}" alt="${h.name}">
      <h3>${h.name}</h3>
      <div class="sub">${h.title}</div>
      <p class="muted">HP ${h.maxHp} &middot; Power ${h.power} &middot; Speed ${h.speed} &middot; ${h.row} row</p>
      <p><strong>${h.signature.name}</strong> (Favor ${h.signature.cost}): ${h.signature.desc}</p>
    </div>`;
  }).join('');
  return `
    <h2 class="center">Choose Your Champion</h2>
    <p class="center muted">Your champion is the one whose name will be remembered &mdash; for good or ill.</p>
    <div class="card-grid">${cards}</div>
  `;
}

/* ---------------------------------------------------------- */
function renderStatbar(run) {
  const relics = run.relics.map(id => `
    <div class="relic-chip" title="${RELICS[id].desc}"><img src="${RELICS[id].portrait}" alt="">${RELICS[id].name}</div>
  `).join('');
  return `
    <div class="statbar">
      <div class="stat">⚡ Favor: <span class="val">${run.favor}/${run.maxFavor}</span></div>
      <div class="stat">⛁ Drachma: <span class="val">${run.drachma}</span></div>
      <div class="stat">Hubris: <span class="hubris-bar"><span class="hubris-fill" style="width:${run.hubris}%"></span></span></div>
    </div>
    ${run.relics.length ? `<div class="relic-row">${relics}</div>` : ''}
  `;
}

function renderPartyMini(run) {
  return `<div class="battle-row">` + run.party.map(h => `
    <div class="unit-card player">
      <img src="${h.portrait}" alt="${h.name}">
      <div class="name">${h.name}</div>
      <div class="hpbar"><div class="hpfill" style="width:${Math.max(0,100*h.hp/h.maxHp)}%"></div></div>
      <div class="hptext">${h.hp}/${h.maxHp} HP</div>
    </div>
  `).join('') + `</div>`;
}

/* ---------------------------------------------------------- */
function renderMap() {
  const run = gameState.run;
  const map = run.map;
  const currentLayer = map.nodes[run.currentNodeId].layer;
  const nextOptions = getNextOptions(run).map(n => n.id);

  let layersHtml = '';
  for (let l = 7; l >= 0; l--) {
    const ids = map.layers[l];
    let rowHtml = '';
    ids.forEach(id => {
      const node = map.nodes[id];
      let cls = 'map-node';
      let clickable = false;
      let showType = false;

      if (id === run.currentNodeId) { cls += ' current'; showType = true; }
      else if (run.visited[id]) { cls += ' visited'; showType = true; }
      else if (nextOptions.includes(id)) { cls += ' available'; clickable = true; showType = true; }
      else if (l <= currentLayer + 2 && (run.hecateSight || run.threadRevealed)) { showType = true; }
      else if (run.threadRevealed) { showType = true; }
      else { cls += ' unknown'; }

      if (node.type === 'boss') cls += ' boss';

      const icon = showType ? NODE_ICON_SVGS[NODE_TYPES[node.type].icon] : '<svg viewBox="0 0 24 24"><text x="12" y="17" font-size="14" text-anchor="middle" fill="var(--terracotta)">?</text></svg>';
      const label = showType ? nodeLabel(node) : '';

      rowHtml += `<div class="${cls}" ${clickable ? `data-action="travel" data-id="${id}"` : ''}>${icon}${label ? `<div class="node-label">${label}</div>` : ''}</div>`;
    });
    layersHtml += `<div class="map-layer">${rowHtml}</div>`;
    if (l > 0) layersHtml += `<div class="map-connector"></div>`;
  }

  return `
    <h2 class="center">The Mortal Wilds</h2>
    ${renderStatbar(run)}
    ${renderPartyMini(run)}
    <div class="map-wrap">${layersHtml}</div>
    <p class="center muted">Choose your road. The gold paths are open to you.</p>
    <div class="btn-row"><button class="btn" data-action="open-codex">Codex</button></div>
  `;
}

function nodeLabel(node) {
  if (node.type === 'battle') return 'Battle';
  if (node.type === 'elite') return 'Elite Foe';
  if (node.type === 'event') return 'Omen';
  if (node.type === 'boss') return 'The Nemean Lion';
  return NODE_TYPES[node.type].label;
}

/* ---------------------------------------------------------- */
function statusBadges(unit) {
  const s = unit.statuses || {};
  const names = { petrify: 'Petrified', poison: 'Poisoned', grappled: 'Grappled', cauterized: 'Cauterized', hidden: 'Hidden', cursed: 'Cursed' };
  return Object.keys(s).filter(k => s[k] > 0).map(k => `<span class="status-badge">${names[k]||k}</span>`).join('');
}

function renderBattle() {
  const state = gameState.combat;
  const run = gameState.run;

  if (state.phase === 'victory' && !state.handled) {
    state.handled = true;
    const node = getCurrentNode(run);
    saveRun(run);
    if (node.type === 'boss') { return setScreenAndRender('victory'); }
    return setScreenAndRender('reward');
  }
  if (state.phase === 'defeat' && !state.handled) {
    state.handled = true;
    return setScreenAndRender('defeat');
  }

  const enemyCards = state.enemies.map((e, i) => {
    let cls = 'unit-card';
    if (e.hp <= 0) cls += ' dead';
    if (state.activeUnit === e) cls += ' active';
    const targetable = gameState.pendingAction && (gameState.pendingAction.needsTarget === 'enemy') && e.hp > 0;
    if (targetable) cls += ' targetable';
    return `
      <div class="${cls}" ${targetable ? `data-action="select-target" data-side="enemy" data-index="${i}"` : ''}>
        <img src="${e.portrait}" alt="${e.name}">
        <div class="name">${e.name}</div>
        <div class="hpbar"><div class="hpfill" style="width:${Math.max(0,100*e.hp/e.maxHp)}%"></div></div>
        <div class="hptext">${Math.max(0,e.hp)}/${e.maxHp} HP</div>
        <div class="statuses">${statusBadges(e)}</div>
      </div>`;
  }).join('');

  const playerCards = state.player.map((h, i) => {
    let cls = 'unit-card player';
    if (h.hp <= 0) cls += ' dead';
    if (state.activeUnit === h) cls += ' active';
    const targetable = gameState.pendingAction && (gameState.pendingAction.needsTarget === 'ally') && h.hp > 0;
    if (targetable) cls += ' targetable';
    return `
      <div class="${cls}" ${targetable ? `data-action="select-target" data-side="ally" data-index="${i}"` : ''}>
        <img src="${h.portrait}" alt="${h.name}">
        <div class="name">${h.name} <span class="muted">(${h.row})</span></div>
        <div class="hpbar"><div class="hpfill" style="width:${Math.max(0,100*h.hp/h.maxHp)}%"></div></div>
        <div class="hptext">${Math.max(0,h.hp)}/${h.maxHp} HP</div>
        <div class="statuses">${statusBadges(h)}</div>
      </div>`;
  }).join('');

  let actionPanel = '';
  if (state.phase === 'player_action') {
    const user = state.activeUnit;
    if (gameState.pendingAction) {
      actionPanel = `<div class="action-panel"><p class="desc">Choose a target.</p><button class="btn" data-action="cancel-target">Cancel</button></div>`;
    } else {
      const sig = user.signature;
      const sigCd = (user.cooldowns && user.cooldowns.signature) || 0;
      const sigDisabled = sigCd > 0 || run.favor < sig.cost;
      const sigReason = sigCd > 0 ? `ready in ${sigCd} turn(s)` : (run.favor < sig.cost ? 'not enough Favor' : '');

      const god = GODS[run.godId];
      const interventionBtns = god.interventions.map(iv => {
        const disabled = state.interventionUsedThisCombat || run.favor < iv.cost;
        return `<button class="btn gold" data-action="use-intervention" data-id="${iv.id}" ${disabled?'disabled':''} title="${iv.desc}">${iv.name} (${iv.cost})</button>`;
      }).join('');

      actionPanel = `
        <div class="action-panel">
          <h3>${user.name}'s turn</h3>
          <div class="btn-row">
            <button class="btn" data-action="basic-attack">${user.basic.name} (attack)</button>
            <button class="btn" data-action="use-signature" ${sigDisabled?'disabled':''} title="${sig.desc}">${sig.name} (Favor ${sig.cost})</button>
          </div>
          ${sigReason ? `<p class="desc">${sig.name}: ${sigReason}</p>` : `<p class="desc">${sig.desc}</p>`}
          <div class="btn-row">${interventionBtns}</div>
          <p class="desc">Divine intervention &mdash; once per battle.</p>
        </div>`;
    }
  } else if (state.phase === 'enemy_action') {
    actionPanel = `<div class="action-panel"><p class="desc">${state.activeUnit ? state.activeUnit.name + ' acts...' : ''}</p></div>`;
  }

  const log = state.combatLog.slice(-7).map(l => `<p>${l}</p>`).join('');

  return `
    <h2 class="center">Battle</h2>
    ${renderStatbar(run)}
    <h3 class="center muted">Enemies</h3>
    <div class="battle-row">${enemyCards}</div>
    <h3 class="center muted">Your Warband</h3>
    <div class="battle-row">${playerCards}</div>
    ${actionPanel}
    <div class="combat-log">${log}</div>
  `;
}

function setScreenAndRender(screen) {
  gameState.screen = screen;
  render();
  return '';
}

/* ---------------------------------------------------------- */
function renderReward() {
  const state = gameState.combat;
  const run = gameState.run;
  let relicHtml = '';
  if (state.rewardRelic) {
    const r = RELICS[state.rewardRelic];
    relicHtml = `
      <div class="event-card center">
        <img class="portrait" src="${r.portrait}" alt="${r.name}" style="max-width:160px;">
        <h3>${r.name}</h3>
        <p class="muted">${r.title}</p>
        <p>${r.desc}</p>
      </div>`;
  }
  return `
    <h2 class="center">Victory</h2>
    ${renderStatbar(run)}
    <p class="center">You gained ${state.rewardDrachma} Drachma and 1 Favor.</p>
    ${relicHtml}
    <div class="btn-row"><button class="btn gold" data-action="claim-reward">Onward</button></div>
  `;
}

function renderEvent() {
  const run = gameState.run;
  const node = getCurrentNode(run);
  const ev = EVENTS[node.event];

  if (gameState.pendingEventResult) {
    return `
      <h2 class="center">${ev.title}</h2>
      ${renderStatbar(run)}
      <div class="event-card">
        <img src="${ev.portrait}" alt="">
        <p>${gameState.pendingEventResult.text}</p>
      </div>
      <div class="btn-row"><button class="btn gold" data-action="event-continue">Onward</button></div>
    `;
  }

  const choices = ev.choices.map((c, i) => `<button class="choice-btn" data-action="event-choice" data-index="${i}">${c.text}</button>`).join('');
  return `
    <h2 class="center">${ev.title}</h2>
    ${renderStatbar(run)}
    <div class="event-card">
      <img src="${ev.portrait}" alt="">
      <p>${ev.text}</p>
      <div class="choice-list">${choices}</div>
    </div>
  `;
}

function renderShrine() {
  const run = gameState.run;
  return `
    <h2 class="center">A Shrine by the Roadside</h2>
    ${renderStatbar(run)}
    <div class="panel-card center">
      <img class="portrait" src="images/placeholder.svg" alt="">
      <p>A weathered altar stands among the trees, smoke still rising from old offerings. The gods are listening &mdash; for a price.</p>
      <div class="choice-list">
        <button class="choice-btn" data-action="shrine-heal" ${run.favor < 2 ? 'disabled' : ''}>Offer 2 Favor &mdash; your warband heals 5 HP each (Favor ${run.favor}/${run.maxFavor})</button>
        <button class="choice-btn" data-action="shrine-sacrifice">Make a blood sacrifice &mdash; lose 4 HP from your strongest hero, gain 3 Favor</button>
        <button class="choice-btn" data-action="shrine-leave">Leave without an offering</button>
      </div>
    </div>
  `;
}

function renderAgora() {
  const run = gameState.run;
  const ownedRelics = run.relics;
  const availableRelics = Object.values(RELICS).filter(r => !ownedRelics.includes(r.id)).slice(0, 2);
  const unrecruited = RECRUIT_ORDER.filter(id => !run.party.some(h => h.id === id));

  const relicShop = availableRelics.map(r => `
    <button class="choice-btn" data-action="buy-relic" data-id="${r.id}" ${run.drachma < 6 ? 'disabled':''}>
      Buy <strong>${r.name}</strong> &mdash; ${r.desc} (6 Drachma)
    </button>`).join('');

  const heroShop = unrecruited.map(id => {
    const h = HERO_TEMPLATES[id];
    return `<button class="choice-btn" data-action="recruit-hero" data-id="${id}" ${run.drachma < 8 || run.party.length >= 4 ? 'disabled':''}>
      Recruit <strong>${h.name}</strong>, ${h.title} (8 Drachma)
    </button>`;
  }).join('');

  return `
    <h2 class="center">The Agora</h2>
    ${renderStatbar(run)}
    <div class="panel-card center">
      <img class="portrait" src="images/placeholder.svg" alt="">
      <p>Merchants of the road sell what they've scavenged &mdash; relics, weapons, and the loyalty of wandering fighters.</p>
      <div class="choice-list">
        <button class="choice-btn" data-action="agora-heal" ${run.drachma < 3 ? 'disabled':''}>Pay 3 Drachma &mdash; heal your warband to full</button>
        ${relicShop}
        ${heroShop}
        <button class="choice-btn" data-action="agora-leave">Move on</button>
      </div>
    </div>
  `;
}

function renderSpring() {
  const run = gameState.run;
  const trainBtns = run.party.map((h, i) => `
    <button class="choice-btn" data-action="spring-train" data-index="${i}">Train ${h.name} &mdash; permanently +1 Power</button>
  `).join('');
  return `
    <h2 class="center">A Quiet Spring</h2>
    ${renderStatbar(run)}
    <div class="panel-card center">
      <img class="portrait" src="images/placeholder.svg" alt="">
      <p>Clear water rises from between mossy stones. For a moment, the road feels far away.</p>
      <div class="choice-list">
        <button class="choice-btn" data-action="spring-rest">Rest &mdash; your warband heals to full</button>
        ${trainBtns}
      </div>
    </div>
  `;
}

function renderOracle() {
  const run = gameState.run;
  if (gameState.oracleResult) {
    return `
      <h2 class="center">The Oracle</h2>
      ${renderStatbar(run)}
      <div class="panel-card center">
        <img class="portrait" src="images/placeholder.svg" alt="">
        <p>${gameState.oracleResult}</p>
        <div class="btn-row"><button class="btn gold" data-action="oracle-continue">Onward</button></div>
      </div>
    `;
  }
  return `
    <h2 class="center">The Oracle</h2>
    ${renderStatbar(run)}
    <div class="panel-card center">
      <img class="portrait" src="images/placeholder.svg" alt="">
      <p>A veiled figure sits before a cleft in the rock, smoke curling from below. "Ask, mortal &mdash; if you dare hear the answer."</p>
      <div class="choice-list">
        <button class="choice-btn" data-action="oracle-ask">Ask for a glimpse of what lies ahead</button>
      </div>
    </div>
  `;
}

function renderVictory() {
  const run = gameState.run;
  if (!run.metaUpdated) {
    gameState.meta.runsPlayed = (gameState.meta.runsPlayed||0) + 1;
    gameState.meta.runsWon = (gameState.meta.runsWon||0) + 1;
    saveMeta(gameState.meta);
    unlockCodex(gameState.meta, 'monster', 'nemean_lion');
    run.metaUpdated = true;
    clearRun();
  }
  return `
    <h2 class="center">The Nemean Lion Falls</h2>
    <div class="event-card center">
      <img src="images/placeholder.svg" alt="">
      <p>The hide that no blade could pierce gives way at last &mdash; not to a sharper edge, but to a grip that refused to loosen. The Mortal Wilds fall silent behind you.</p>
      <p class="muted">Your champion's name will be sung tonight. Whether the gods are pleased... is a different question.</p>
    </div>
    <div class="btn-row"><button class="btn gold" data-action="return-title">Return to Olympus</button></div>
  `;
}

function renderDefeat() {
  const run = gameState.run;
  if (!run.metaUpdated) {
    gameState.meta.runsPlayed = (gameState.meta.runsPlayed||0) + 1;
    saveMeta(gameState.meta);
    run.metaUpdated = true;
    clearRun();
  }
  return `
    <h2 class="center">The Thread Is Cut</h2>
    <div class="event-card center">
      <p>The Moirai do not unmake what they have measured. Your warband falls here, in the Mortal Wilds, their story ending before the gods above could finish theirs.</p>
      <p class="muted">Another champion may yet rise. The roads will be different next time.</p>
    </div>
    <div class="btn-row"><button class="btn gold" data-action="return-title">Return to Olympus</button></div>
  `;
}

/* ---------------------------------------------------------- */
function renderCodex() {
  const meta = gameState.meta;
  const unlocked = meta.unlockedCodex || {};

  function section(title, items, type) {
    const html = items.map(item => {
      const isUnlocked = type === 'god' || type === 'hero' || (unlocked[type] && unlocked[type][item.id]);
      const cls = isUnlocked ? 'codex-item' : 'codex-item locked';
      return `
        <div class="${cls}">
          <img src="${item.portrait}" alt="">
          <h4>${isUnlocked ? item.name : '???'}</h4>
          ${isUnlocked ? `<div class="lore">${CODEX_LORE[item.id] || ''}</div>` : ''}
        </div>`;
    }).join('');
    return `<h3>${title}</h3><div class="codex-list">${html}</div>`;
  }

  return `
    <h2 class="center">Codex</h2>
    ${section('Patron Gods', Object.values(GODS), 'god')}
    ${section('Heroes', RECRUIT_ORDER.map(id => HERO_TEMPLATES[id]), 'hero')}
    ${section('Monsters', Object.values(MONSTER_TEMPLATES).filter(m=>m.id!=='hydra_head'), 'monster')}
    ${section('Relics', Object.values(RELICS), 'relic')}
    <div class="btn-row"><button class="btn gold" data-action="return-title">Back</button></div>
  `;
}

/* ---------------------------------------------------------- */
function handleAction(action, el) {
  const run = gameState.run;
  switch (action) {
    case 'new-run':
      gameState.run = null;
      gameState.screen = 'patron';
      break;
    case 'continue-run':
      gameState.run = loadRun();
      gameState.screen = 'map';
      break;
    case 'open-codex':
      gameState.prevScreen = gameState.screen;
      gameState.screen = 'codex';
      break;
    case 'return-title':
      gameState.run = null;
      gameState.combat = null;
      gameState.screen = 'title';
      break;
    case 'pick-god':
      gameState.pendingGod = el.dataset.id;
      gameState.screen = 'hero';
      break;
    case 'pick-hero': {
      const newRun = createRun(gameState.pendingGod, el.dataset.id);
      gameState.run = newRun;
      saveRun(newRun);
      gameState.screen = 'map';
      break;
    }
    case 'travel':
      resolveNode(run, el.dataset.id);
      break;

    /* combat */
    case 'basic-attack':
      gameState.pendingAction = { type: 'basic', needsTarget: 'enemy' };
      break;
    case 'use-signature': {
      const sig = gameState.combat.activeUnit.signature;
      if (sig.id === 'gaze') {
        playerSignature(gameState.combat, null);
      } else {
        gameState.pendingAction = { type: 'signature', needsTarget: 'enemy' };
      }
      break;
    }
    case 'use-intervention': {
      const god = GODS[run.godId];
      const iv = god.interventions.find(i => i.id === el.dataset.id);
      if (iv.target === 'enemy') gameState.pendingAction = { type: 'intervention', id: iv.id, needsTarget: 'enemy' };
      else if (iv.target === 'ally') gameState.pendingAction = { type: 'intervention', id: iv.id, needsTarget: 'ally' };
      else playerIntervention(gameState.combat, iv.id, null);
      break;
    }
    case 'select-target': {
      const idx = parseInt(el.dataset.index, 10);
      const pa = gameState.pendingAction;
      if (pa.type === 'basic') playerBasicAttack(gameState.combat, idx);
      else if (pa.type === 'signature') playerSignature(gameState.combat, idx);
      else if (pa.type === 'intervention') playerIntervention(gameState.combat, pa.id, idx);
      gameState.pendingAction = null;
      break;
    }
    case 'cancel-target':
      gameState.pendingAction = null;
      break;

    /* reward */
    case 'claim-reward': {
      const state = gameState.combat;
      run.party.forEach(h => { if (h._foresightBonus) { h.power -= h._foresightBonus; delete h._foresightBonus; } });
      if (state.rewardRelic) {
        run.relics.push(state.rewardRelic);
        const rl = RELICS[state.rewardRelic];
        if (rl.apply) rl.apply(run);
        unlockCodex(gameState.meta, 'relic', state.rewardRelic);
      }
      saveRun(run);
      gameState.combat = null;
      gameState.screen = 'map';
      break;
    }

    /* events */
    case 'event-choice': {
      const node = getCurrentNode(run);
      const ev = EVENTS[node.event];
      const choice = ev.choices[parseInt(el.dataset.index, 10)];
      const result = choice.result(run);
      applyHubrisEffects(run, (msg) => { result.text += ' ' + msg; });
      gameState.pendingEventResult = result;
      if (result.forceBattle) {
        const enc = { monsters: ['lykoi','lykoi'] };
        gameState.combat = startCombat(run, enc, () => render());
        gameState.pendingEventAfterBattle = true;
      }
      break;
    }
    case 'event-continue':
      gameState.pendingEventResult = null;
      if (gameState.pendingEventAfterBattle) {
        gameState.pendingEventAfterBattle = false;
        gameState.screen = 'battle';
      } else {
        saveRun(run);
        gameState.screen = 'map';
      }
      break;

    /* shrine */
    case 'shrine-heal':
      run.favor -= 2;
      run.party.forEach(h => { h.hp = Math.min(h.maxHp, h.hp + 5); });
      saveRun(run);
      gameState.screen = 'map';
      break;
    case 'shrine-sacrifice': {
      const strongest = run.party.reduce((a,b) => a.maxHp >= b.maxHp ? a : b);
      strongest.hp = Math.max(1, strongest.hp - 4);
      run.favor = Math.min(run.maxFavor, run.favor + 3);
      saveRun(run);
      gameState.screen = 'map';
      break;
    }
    case 'shrine-leave':
      run.hubris += 5;
      applyHubrisEffects(run, () => {});
      saveRun(run);
      gameState.screen = 'map';
      break;

    /* agora */
    case 'agora-heal':
      run.drachma -= 3;
      run.party.forEach(h => { h.hp = h.maxHp; });
      saveRun(run);
      break;
    case 'buy-relic':
      run.drachma -= 6;
      run.relics.push(el.dataset.id);
      if (RELICS[el.dataset.id].apply) RELICS[el.dataset.id].apply(run);
      unlockCodex(gameState.meta, 'relic', el.dataset.id);
      saveRun(run);
      break;
    case 'recruit-hero':
      run.drachma -= 8;
      run.party.push(makeHeroInstance(el.dataset.id));
      saveRun(run);
      break;
    case 'agora-leave':
      saveRun(run);
      gameState.screen = 'map';
      break;

    /* spring */
    case 'spring-rest':
      run.party.forEach(h => { h.hp = h.maxHp; });
      saveRun(run);
      gameState.screen = 'map';
      break;
    case 'spring-train':
      run.party[parseInt(el.dataset.index,10)].power += 1;
      saveRun(run);
      gameState.screen = 'map';
      break;

    /* oracle */
    case 'oracle-ask': {
      run.foresight = true;
      run.threadRevealed = run.threadRevealed; // no-op
      run.hecateSight = true; // oracle grants crossroads sight from here on too
      gameState.oracleResult = 'The veiled figure speaks: "The road ahead bends through trial and rest alike. Trust your warband’s strength in the next clash &mdash; it will be sharper than you think." (Your next battle: all heroes +1 Power.)';
      break;
    }
    case 'oracle-continue':
      gameState.oracleResult = null;
      saveRun(run);
      gameState.screen = 'map';
      break;
  }
  render();
}

function resolveNode(run, nodeId) {
  travelTo(run, nodeId);
  const node = run.map.nodes[nodeId];

  if (node.type === 'battle' || node.type === 'elite' || node.type === 'boss') {
    let encounter = node.encounter;
    if (node.type === 'elite' && run.nemesisPending) {
      encounter = { monsters: ['erinyes', 'erinyes'] };
      run.nemesisPending = false;
      run.nemesisFallen = true;
    }
    if (run.foresight) {
      run.party.forEach(h => { h._foresightBonus = 1; h.power += 1; });
      run.foresight = false;
    }
    gameState.combat = startCombat(run, encounter, () => render());
    gameState.screen = 'battle';
  } else if (node.type === 'event') {
    gameState.pendingEventResult = null;
    gameState.screen = 'event';
  } else if (node.type === 'shrine') {
    gameState.screen = 'shrine';
  } else if (node.type === 'agora') {
    gameState.screen = 'agora';
  } else if (node.type === 'spring') {
    gameState.screen = 'spring';
  } else if (node.type === 'oracle') {
    gameState.oracleResult = null;
    gameState.screen = 'oracle';
  }
}
