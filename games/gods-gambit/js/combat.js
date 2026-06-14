/* Gods' Gambit — turn-based combat resolution */

function startCombat(run, encounter, onUpdate) {
  const state = {
    run,
    player: run.party.filter(h => h.hp > 0),
    enemies: encounter.monsters.map(id => makeEnemy(id)),
    combatLog: [],
    phase: 'intro',
    activeUnit: null,
    queue: [],
    round: 0,
    interventionUsedThisCombat: false,
    capOfHadesCharge: false,
    onUpdate: onUpdate || function(){},
    dealDamage(target, baseDmg, info) {
      info = info || {};
      let dmg = baseDmg;
      if (target.damageModifier) dmg = target.damageModifier(state, target, dmg, info);
      if (state.player.includes(target)) {
        if ((run.relics||[]).includes('aegis')) dmg = Math.max(1, dmg - 1);
        if (target.frenzy) dmg += target.frenzy;
      }
      dmg = Math.max(0, Math.round(dmg));
      target.hp = Math.max(0, target.hp - dmg);
      if (target.onDamaged) target.onDamaged(state, info.attackerRef, target, info);
      return dmg;
    },
    log(msg) { state.combatLog.push(msg); }
  };

  // reset per-combat state for heroes
  state.player.forEach(h => { h.statuses = {}; h.cooldowns = {}; h.frenzy = 0; });

  // relic onCombatStart hooks
  Object.values(RELICS).forEach(r => {
    if ((run.relics||[]).includes(r.id) && r.onCombatStart) r.onCombatStart(state);
  });

  if (state.enemies.some(e => e.introText)) {
    state.enemies.filter(e => e.introText).forEach(e => state.log(e.introText));
  }

  state.phase = 'round_start';
  beginRound(state);
  advanceTurn(state);
  return state;
}

function beginRound(state) {
  state.round += 1;
  const all = state.player.concat(state.enemies).filter(u => u.hp > 0);
  // decrement cooldowns at round start
  all.forEach(u => {
    if (u.cooldowns && u.cooldowns.signature > 0) u.cooldowns.signature -= 1;
  });
  state.queue = shuffle(all).sort((a,b) => (b.speed||0) - (a.speed||0));
}

function processStatuses(state, unit) {
  unit.statuses = unit.statuses || {};
  if (unit.statuses.poison > 0) {
    const dmg = state.dealDamage(unit, 2, { source: 'Poison', tags: ['poison'] });
    state.log(`${unitName(unit)} writhes from poison. (${dmg} dmg)`);
    unit.statuses.poison -= 1;
    if (unit.statuses.poison <= 0) delete unit.statuses.poison;
  }
  if (unit.hp <= 0) return 'dead';
  if (unit.statuses.petrify > 0) {
    unit.statuses.petrify -= 1;
    if (unit.statuses.petrify <= 0) delete unit.statuses.petrify;
    state.log(`${unitName(unit)} is Petrified and cannot move.`);
    return 'skip';
  }
  ['grappled','cauterized','hidden','cursed'].forEach(s => {
    if (unit.statuses[s] > 0) {
      unit.statuses[s] -= 1;
      if (unit.statuses[s] <= 0) delete unit.statuses[s];
    }
  });
  return 'ok';
}

function unitName(unit) {
  return unit.name + (unit.id && unit.id.startsWith('hydra_head') ? '' : '');
}

function advanceTurn(state) {
  if (checkCombatEnd(state)) return;

  // find next living unit in queue
  while (state.queue.length > 0 && state.queue[0].hp <= 0) state.queue.shift();
  if (state.queue.length === 0) {
    beginRound(state);
    while (state.queue.length > 0 && state.queue[0].hp <= 0) state.queue.shift();
    if (state.queue.length === 0) { checkCombatEnd(state); return; }
  }

  const unit = state.queue.shift();
  state.activeUnit = unit;
  const status = processStatuses(state, unit);

  if (checkCombatEnd(state)) return;

  if (status === 'dead') { advanceTurn(state); return; }
  if (status === 'skip') { state.onUpdate(); advanceTurn(state); return; }

  if (state.player.includes(unit)) {
    state.phase = 'player_action';
    state.onUpdate();
  } else {
    state.phase = 'enemy_action';
    state.onUpdate();
    setTimeout(() => { enemyAction(state, unit); state.onUpdate(); advanceTurn(state); }, 10);
  }
}

function enemyAction(state, enemy) {
  const targets = state.player.filter(h => h.hp > 0);
  if (targets.length === 0) return;
  const front = targets.filter(h => h.row === 'front');
  const back = targets.filter(h => h.row === 'back');
  let pool = targets;
  const isFlying = (enemy.tags||[]).includes('flying') || (enemy.basic.tags||[]).includes('ranged');
  if (!isFlying && front.length > 0) pool = front;
  const target = pool[Math.floor(Math.random()*pool.length)];

  if (state.capOfHadesCharge) {
    state.capOfHadesCharge = false;
    state.log(`${enemy.name} attacks ${target.name} — but the strike passes through empty air. (Cap of Hades)`);
    return;
  }
  if (target.statuses && target.statuses.hidden) {
    delete target.statuses.hidden;
    state.log(`${enemy.name} attacks ${target.name} — but cannot find them in the dark. (Veil of Night)`);
    return;
  }

  const dmg = state.dealDamage(target, enemy.power, { attackerRef: enemy, tags: enemy.basic.tags, source: enemy.name });
  state.log(`${enemy.name} uses ${enemy.basic.name} on ${target.name}. (${dmg} dmg)`);
  if (enemy.onHit) enemy.onHit(state, enemy, target);

  if (target.hp <= 0 && !target.fallen) {
    target.fallen = true;
    state.log(`${target.name} has fallen!`);
  }
}

function playerBasicAttack(state, targetIndex) {
  const user = state.activeUnit;
  const target = state.enemies[targetIndex];
  if (!target || target.hp <= 0) return;
  const dmg = state.dealDamage(target, user.power, { attackerRef: user, tags: user.basic.tags, source: user.name });
  state.log(`${user.name} uses ${user.basic.name} on ${target.name}. (${dmg} dmg)`);
  if (target.hp <= 0) state.log(`${target.name} is destroyed!`);
  state.onUpdate();
  advanceTurn(state);
}

function playerSignature(state, targetIndex) {
  const user = state.activeUnit;
  const sig = user.signature;
  user.cooldowns = user.cooldowns || {};
  if ((user.cooldowns.signature || 0) > 0) return;
  if (state.run.favor < sig.cost) return;
  const target = (targetIndex !== null && targetIndex !== undefined) ? state.enemies[targetIndex] : null;
  if (sig.id !== 'gaze' && (!target || target.hp <= 0)) return;
  state.run.favor -= sig.cost;
  user.cooldowns.signature = sig.cooldown;
  sig.use(state, user, target);
  cleanupDeadEnemies(state);
  state.onUpdate();
  advanceTurn(state);
}

function playerIntervention(state, interventionId, targetIndex, targetIsAlly) {
  if (state.interventionUsedThisCombat) return;
  const god = GODS[state.run.godId];
  const intervention = god.interventions.find(i => i.id === interventionId);
  if (!intervention) return;
  if (state.run.favor < intervention.cost) return;

  let target = null;
  if (intervention.target === 'ally') {
    target = state.player[targetIndex];
    if (!target || target.hp <= 0) return;
  } else if (intervention.target === 'enemy') {
    target = state.enemies[targetIndex];
    if (!target || target.hp <= 0) return;
  }

  state.run.favor -= intervention.cost;
  state.interventionUsedThisCombat = true;
  intervention.effect(state, target);
  cleanupDeadEnemies(state);
  state.onUpdate();
  // interventions don't consume the active unit's turn
}

function cleanupDeadEnemies(state) {
  state.enemies.forEach(e => {
    if (e.hp <= 0 && !e.dead) {
      e.dead = true;
      state.log(`${e.name} is destroyed!`);
    }
  });
}

function checkCombatEnd(state) {
  if (state.phase === 'victory' || state.phase === 'defeat') return true;

  const enemiesAlive = state.enemies.some(e => e.hp > 0);
  const playersAlive = state.player.some(h => h.hp > 0);

  if (!enemiesAlive) {
    state.phase = 'victory';
    resolveVictory(state);
    state.onUpdate();
    return true;
  }
  if (!playersAlive) {
    if (state.run.party.some(h => h.hopeRevive)) {
      const fallen = state.run.party.filter(h => h.hp <= 0).sort((a,b) => b.maxHp - a.maxHp);
      if (fallen.length > 0) {
        const reviver = fallen[0];
        reviver.hp = Math.ceil(reviver.maxHp / 2);
        reviver.fallen = false;
        state.run.party.forEach(h => h.hopeRevive = false);
        state.player = state.run.party.filter(h => h.hp > 0);
        state.log(`${reviver.name} draws breath again — Hope, given long ago, is spent. (revived to ${reviver.hp} HP)`);
        return false;
      }
    }
    state.phase = 'defeat';
    state.run.finished = true;
    state.run.victory = false;
    state.onUpdate();
    return true;
  }
  return false;
}

function resolveVictory(state) {
  const run = state.run;
  run.favor = Math.min(run.maxFavor, run.favor + 1);
  const node = getCurrentNode(run);
  let drachmaGain = 2 + Math.floor(Math.random()*3);
  if (node.type === 'elite') drachmaGain += 4;
  if (node.type === 'boss') drachmaGain += 8;
  run.drachma += drachmaGain;
  state.log(`Victory! +${drachmaGain} Drachma, +1 Favor.`);
  state.rewardDrachma = drachmaGain;

  if (node.encounter && node.encounter.monsters) {
    node.encounter.monsters.forEach(id => unlockCodexEntry('monster', id));
  }

  if (node.type === 'elite' || node.type === 'boss') {
    const availableRelics = Object.keys(RELICS).filter(r => !run.relics.includes(r));
    if (availableRelics.length > 0) {
      state.rewardRelic = availableRelics[Math.floor(Math.random()*availableRelics.length)];
    }
  }

  if (node.type === 'boss') {
    run.finished = true;
    run.victory = true;
  }
}

let _metaCache = null;
function unlockCodexEntry(type, id) {
  if (!_metaCache) _metaCache = loadMeta();
  unlockCodex(_metaCache, type, id);
}
