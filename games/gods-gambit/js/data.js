/* Gods' Gambit — content data
   All gods, heroes, monsters, relics, events live here as plain data
   so the roster can grow by editing this file. */

const GODS = {
  ares: {
    id: 'ares', name: 'Ares', title: 'God of War',
    portrait: 'images/god_ares.png',
    desc: 'Blood calls to blood. Ares asks nothing of his champions but that they never sheathe the blade.',
    boon: { desc: 'Your heroes begin the journey with +1 Power.', apply: (run) => { run.party.forEach(h => h.power += 1); } },
    interventions: [
      { id: 'bloodlust', name: 'Bloodlust', cost: 3, desc: 'A chosen ally gains +3 Power for the rest of this battle.',
        target: 'ally', effect: (state, target) => { target.power += 3; state.log(`${target.name} is gripped by Bloodlust. (+3 Power)`); } },
      { id: 'frenzy', name: 'War Frenzy', cost: 5, desc: 'All allies gain +2 Power, but take +1 damage from every attack this battle.',
        target: 'party', effect: (state) => { state.player.forEach(h => { h.power += 2; h.frenzy = (h.frenzy||0) + 1; }); state.log('A red frenzy falls over your warband. (+2 Power, but +1 damage taken)'); } }
    ]
  },
  apollo: {
    id: 'apollo', name: 'Apollo', title: 'God of Light & Plague',
    portrait: 'images/god_apollo.png',
    desc: 'The sun god\'s gifts cut both ways — his arrows heal the worthy and rot the unworthy from within.',
    boon: { desc: 'Your heroes begin the journey with +5 maximum Health.', apply: (run) => { run.party.forEach(h => { h.maxHp += 5; h.hp += 5; }); } },
    interventions: [
      { id: 'healing_light', name: 'Healing Light', cost: 3, desc: 'A chosen ally is healed for 6 Health.',
        target: 'ally', effect: (state, target) => { const heal = Math.min(6, target.maxHp - target.hp); target.hp += heal; state.log(`${target.name} basks in healing light. (+${heal} HP)`); } },
      { id: 'plague_arrow', name: 'Plague Arrow', cost: 4, desc: 'A chosen enemy takes 4 damage and is Poisoned for 2 turns.',
        target: 'enemy', effect: (state, target) => { state.dealDamage(target, 4, {source:'Apollo'}); addStatus(target, 'poison', 2); state.log(`Apollo\'s plague arrow strikes ${target.name}. (4 dmg, Poisoned)`); } }
    ]
  },
  hecate: {
    id: 'hecate', name: 'Hecate', title: 'Goddess of Crossroads & Witchcraft',
    portrait: 'images/god_hecate.png',
    desc: 'She walks where three roads meet, where the dead linger, and where mortals make the choices that doom or save them.',
    boon: { desc: 'At every crossroads you may glimpse one extra step down each path.', apply: (run) => { run.hecateSight = true; } },
    interventions: [
      { id: 'hex', name: 'Hex', cost: 3, desc: 'A chosen enemy loses 2 Power and 1 Speed for the rest of this battle.',
        target: 'enemy', effect: (state, target) => { target.power = Math.max(0, target.power - 2); target.speed = Math.max(0, target.speed - 1); state.log(`${target.name} is hexed. (-2 Power, -1 Speed)`); } },
      { id: 'veil', name: 'Veil of Night', cost: 4, desc: 'A chosen ally becomes Hidden — the next enemy attack against them automatically fails.',
        target: 'ally', effect: (state, target) => { addStatus(target, 'hidden', 99); state.log(`${target.name} is wrapped in Hecate\'s veil.`); } }
    ]
  }
};

const HERO_TEMPLATES = {
  heracles: {
    id: 'heracles', name: 'Heracles', title: 'Slayer of Monsters',
    portrait: 'images/hero_heracles.png',
    maxHp: 22, power: 6, speed: 2, row: 'front', tags: ['strong'],
    basic: { name: 'Club Strike', dmg: 6, tags: ['melee'] },
    signature: { id: 'grip', name: "Twelve Labours' Grip", cost: 2, cooldown: 2,
      desc: 'Deal 4 damage to an enemy and strip away any unnatural protection it relies on (Grappled).',
      use: (state, user, target) => {
        state.dealDamage(target, 4, {source:user.name, ignoreHide:true});
        addStatus(target, 'grappled', 2);
        state.log(`${user.name} seizes ${target.name} in an iron grip! (4 dmg, Grappled — hide and unnatural defenses stripped)`);
      } }
  },
  atalanta: {
    id: 'atalanta', name: 'Atalanta', title: 'The Unconquered Huntress',
    portrait: 'images/hero_atalanta.png',
    maxHp: 14, power: 4, speed: 5, row: 'back', tags: ['ranged','swift'],
    basic: { name: 'Hunting Bow', dmg: 4, tags: ['ranged'] },
    signature: { id: 'mark', name: "Huntress's Mark", cost: 2, cooldown: 2,
      desc: 'Deal 5 damage to an enemy. If the target is a Beast, deal 3 extra.',
      use: (state, user, target) => {
        let dmg = 5;
        if ((target.tags||[]).includes('beast')) dmg += 3;
        state.dealDamage(target, dmg, {source:user.name});
        state.log(`${user.name} marks ${target.name} for the hunt. (${dmg} dmg${(target.tags||[]).includes('beast') ? ' — beast slain true' : ''})`);
      } }
  },
  perseus: {
    id: 'perseus', name: 'Perseus', title: 'Bearer of the Gorgon\'s Head',
    portrait: 'images/hero_perseus.png',
    maxHp: 16, power: 4, speed: 3, row: 'front', tags: ['mirror'],
    basic: { name: 'Polished Shield Strike', dmg: 4, tags: ['melee','mirror'] },
    signature: { id: 'gaze', name: "Gorgon's Gaze", cost: 3, cooldown: 3,
      desc: 'All enemies are Petrified for 1 turn (their next turn is skipped).',
      use: (state, user, target) => {
        state.enemies.filter(e=>e.hp>0).forEach(e => addStatus(e, 'petrify', 1));
        state.log(`${user.name} bares the Gorgon\'s severed head — every enemy turns to stone for a moment!`);
      } }
  },
  iolaus: {
    id: 'iolaus', name: 'Iolaus', title: 'The Cauterizer',
    portrait: 'images/hero_iolaus.png',
    maxHp: 15, power: 3, speed: 4, row: 'back', tags: ['ranged'],
    basic: { name: 'Sling Shot', dmg: 3, tags: ['ranged'] },
    signature: { id: 'brand', name: 'Cauterizing Brand', cost: 2, cooldown: 2,
      desc: 'Deal 4 fire damage to an enemy. Fire damage prevents the Hydra from growing new heads.',
      use: (state, user, target) => {
        state.dealDamage(target, 4, {source:user.name, tags:['fire']});
        addStatus(target, 'cauterized', 2);
        state.log(`${user.name} sears ${target.name} with a burning brand! (4 fire dmg)`);
      } }
  }
};

// Recruitable order (heracles is the default starter)
const RECRUIT_ORDER = ['heracles','atalanta','perseus','iolaus'];

const MONSTER_TEMPLATES = {
  lykoi: {
    id: 'lykoi', name: 'Wolves of the Wilds', title: 'Lykoi',
    portrait: 'images/monster_lykoi.png',
    maxHp: 6, power: 2, speed: 4, tags: ['beast'], row: 'front',
    basic: { name: 'Snapping Bite', dmg: 2, tags: ['melee'] }
  },
  satyr: {
    id: 'satyr', name: 'Satyr Raider', title: '',
    portrait: 'images/monster_satyr.png',
    maxHp: 8, power: 3, speed: 3, tags: ['trickster'], row: 'front',
    basic: { name: 'Stolen Blade', dmg: 3, tags: ['melee'] },
    onHit: (state, attacker, target) => {
      if (target.favorSteal === undefined && state.run.favor > 0 && Math.random() < 0.5) {
        state.run.favor = Math.max(0, state.run.favor - 1);
        state.log(`The satyr cackles and steals a sliver of your Favor!`);
      }
    }
  },
  centaur: {
    id: 'centaur', name: 'Centaur Skirmisher', title: '',
    portrait: 'images/monster_centaur.png',
    maxHp: 12, power: 4, speed: 4, tags: ['beast','ranged'], row: 'front',
    basic: { name: 'Spear Throw', dmg: 4, tags: ['ranged'] }
  },
  harpy: {
    id: 'harpy', name: 'Harpy', title: '',
    portrait: 'images/monster_harpy.png',
    maxHp: 7, power: 2, speed: 5, tags: ['flying'], row: 'front',
    basic: { name: 'Diving Talons', dmg: 2, tags: ['melee','flying'] }
  },
  boar: {
    id: 'boar', name: 'Boar of the Thicket', title: '',
    portrait: 'images/monster_boar.png',
    maxHp: 10, power: 4, speed: 2, tags: ['beast'], row: 'front',
    basic: { name: 'Tusked Charge', dmg: 4, tags: ['melee'] }
  },
  medusa: {
    id: 'medusa', name: 'Medusa', title: 'The Gorgon', elite: true,
    portrait: 'images/monster_medusa.png',
    maxHp: 18, power: 5, speed: 2, tags: ['gorgon'], row: 'front',
    basic: { name: 'Serpent Strike', dmg: 5, tags: ['melee'] },
    onDamaged: (state, attacker, defender, dmgInfo) => {
      const tags = dmgInfo.tags || [];
      const safe = tags.includes('mirror') || tags.includes('ranged') || (state.run.relics||[]).includes('harpe');
      if (!safe && attacker && attacker.hp > 0 && !attacker.statuses?.petrify) {
        addStatus(attacker, 'petrify', 2);
        state.log(`${attacker.name} meets the Gorgon\'s gaze and turns to stone! (Petrified)`);
      }
    }
  },
  hydra: {
    id: 'hydra', name: 'Lernaean Hydra', title: '', elite: true,
    portrait: 'images/monster_hydra.png',
    maxHp: 16, power: 3, speed: 1, tags: ['hydra'], row: 'front',
    basic: { name: 'Venomous Bite', dmg: 3, tags: ['melee'] },
    onDamaged: (state, attacker, defender, dmgInfo) => {
      const tags = dmgInfo.tags || [];
      if (defender.hp > 0 && !tags.includes('fire') && !defender.statuses?.cauterized) {
        const heads = state.enemies.filter(e => e.id && e.id.startsWith('hydra_head') && e.hp > 0).length;
        if (heads < 2) {
          const head = makeEnemy('hydra_head');
          head.id = 'hydra_head_' + Date.now() + Math.random();
          state.enemies.push(head);
          state.log(`Where you struck, two new heads burst forth from the Hydra!`);
        }
      }
    }
  },
  hydra_head: {
    id: 'hydra_head', name: 'Hydra Head', title: '',
    portrait: 'images/monster_hydra.png',
    maxHp: 5, power: 2, speed: 1, tags: ['hydra'], row: 'front',
    basic: { name: 'Snapping Jaws', dmg: 2, tags: ['melee'] }
  },
  cyclops: {
    id: 'cyclops', name: 'Cyclops', title: '', elite: true,
    portrait: 'images/monster_cyclops.png',
    maxHp: 24, power: 6, speed: 1, tags: ['giant'], row: 'front',
    basic: { name: 'Crushing Club', dmg: 6, tags: ['melee'] }
  },
  nemean_lion: {
    id: 'nemean_lion', name: 'The Nemean Lion', title: 'Hide of Stone', boss: true,
    portrait: 'images/monster_nemean_lion.png',
    maxHp: 32, power: 6, speed: 3, tags: ['beast','boss'], row: 'front',
    basic: { name: 'Iron Claws', dmg: 6, tags: ['melee'] },
    damageModifier: (state, defender, dmg, dmgInfo) => {
      if (defender.statuses?.grappled || dmgInfo.ignoreHide) return dmg;
      return Math.max(1, Math.floor(dmg / 2));
    },
    introText: 'No blade has ever broken this hide — not bronze, not iron, not even the gods\' own gifts. Only a grip that does not let go will find its mark.'
  },
  erinyes: {
    id: 'erinyes', name: 'Erinys', title: 'Fury of the Wronged', nemesis: true,
    portrait: 'images/monster_erinyes.png',
    maxHp: 14, power: 4, speed: 4, tags: ['divine','nemesis'], row: 'front',
    basic: { name: 'Lash of Retribution', dmg: 4, tags: ['melee'] },
    introText: 'Your pride has not gone unnoticed. The Furies rise from Tartarus to balance the scales.'
  }
};

function makeEnemy(templateId) {
  const t = MONSTER_TEMPLATES[templateId];
  return Object.assign({}, t, { hp: t.maxHp, statuses: {}, cooldowns: {} });
}

const RELICS = {
  talaria: { id: 'talaria', name: 'Talaria', title: "Hermes' Winged Sandals",
    portrait: 'images/relic_talaria.png',
    desc: 'All heroes gain +1 Speed.',
    apply: (run) => { run.party.forEach(h => h.speed += 1); } },
  cap_of_hades: { id: 'cap_of_hades', name: 'Cap of Hades', title: 'Helm of Invisibility',
    portrait: 'images/relic_cap_of_hades.png',
    desc: 'The first enemy attack each battle automatically misses.',
    onCombatStart: (state) => { state.capOfHadesCharge = true; } },
  aegis: { id: 'aegis', name: 'Aegis', title: "Shield of Zeus and Athena",
    portrait: 'images/relic_aegis.png',
    desc: 'Your party takes 1 less damage from every attack (minimum 1).',
    apply: (run) => {} },
  harpe: { id: 'harpe', name: 'Harpe', title: 'The Adamantine Sickle',
    portrait: 'images/relic_harpe.png',
    desc: 'Your heroes are immune to Petrification, even in melee against gorgons.',
    apply: (run) => {} },
  golden_fleece: { id: 'golden_fleece', name: 'Golden Fleece', title: '',
    portrait: 'images/relic_golden_fleece.png',
    desc: 'At the start of each battle, every hero heals 2 Health.',
    onCombatStart: (state) => { state.player.forEach(h => { h.hp = Math.min(h.maxHp, h.hp + 2); }); } },
  lyre_of_orpheus: { id: 'lyre_of_orpheus', name: 'Lyre of Orpheus', title: '',
    portrait: 'images/relic_lyre_of_orpheus.png',
    desc: 'On the first turn of each battle, all enemies are soothed (-1 Power).',
    onCombatStart: (state) => { state.enemies.forEach(e => { e.power = Math.max(0, e.power - 1); }); } },
  ariadnes_thread: { id: 'ariadnes_thread', name: "Ariadne's Thread", title: '',
    portrait: 'images/relic_ariadnes_thread.png',
    desc: 'The entire map is revealed to you from the start.',
    apply: (run) => { run.threadRevealed = true; } },
  cornucopia: { id: 'cornucopia', name: 'Cornucopia', title: '',
    portrait: 'images/relic_cornucopia.png',
    desc: 'At the start of each node, gain 1 Drachma and 1 Favor.',
    onNodeStart: (run) => { run.drachma += 1; run.favor = Math.min(run.maxFavor, run.favor + 1); } }
};

const EVENTS = {
  xenia: {
    id: 'xenia', title: 'The Ragged Stranger',
    portrait: 'images/event_xenia.png',
    text: 'A traveler in filthy rags sits by the road, hand outstretched. "A crust of bread, friend? A place by your fire?" His eyes seem to catch the torchlight strangely — too bright, too knowing.',
    choices: [
      { text: 'Share your food and fire (Xenia)', result: (run) => {
          run.hubris = Math.max(0, run.hubris - 10);
          run.drachma += 2;
          return { text: 'The stranger\'s rags fall away for an instant — you glimpse sandals of gold. "Hospitality is remembered, mortal." You feel lighter, and find 2 drachma left in your palm.' };
        } },
      { text: 'Turn him away — you have nothing to spare', result: (run) => {
          run.hubris += 15;
          return { text: 'The stranger\'s smile does not reach his eyes. "As you wish." The night feels colder, and you cannot shake the sense that something has been written down.', curse: true };
        } }
    ]
  },
  pithos: {
    id: 'pithos', title: 'The Sealed Pithos',
    portrait: 'images/event_pithos.png',
    text: 'Half-buried in the ash of a dead hearth, a great clay jar sits sealed with wax and a faded sigil. Something inside shifts when the wind blows.',
    choices: [
      { text: 'Break the seal', result: (run) => {
          const dmg = 3;
          run.party.forEach(h => { h.hp = Math.max(1, h.hp - dmg); });
          run.party.forEach(h => { h.hopeRevive = true; });
          return { text: 'A swarm of pale, biting ills pours out and is gone before you can react — every hero takes 3 damage. But something small and warm remains at the bottom of the jar. You feel it settle into your chest: Hope. (Once this run, a fallen hero will rise again.)' };
        } },
      { text: 'Leave it sealed and walk on', result: (run) => {
          run.favor = Math.min(run.maxFavor, run.favor + 2);
          return { text: 'Some doors are better left closed. You leave an offering of incense at the hearth instead, and feel a god\'s quiet approval. (+2 Favor)' };
        } }
    ]
  },
  crossroads: {
    id: 'crossroads', title: 'The Crossroads of Hecate',
    portrait: 'images/event_crossroads.png',
    text: 'Three roads meet beneath a worn stone pillar with three faces. At its foot, travelers have left offerings for ages. You have one thing to give.',
    choices: [
      { text: 'Leave a black dog at the crossroads', result: (run) => {
          run.favor = Math.min(run.maxFavor, run.favor + 3);
          run.hubris = Math.max(0, run.hubris - 5);
          return { text: 'The torches at the pillar\'s feet flare violet for a moment. You have given Hecate what she is owed. (+3 Favor)' };
        } },
      { text: 'Leave a honey-cake', result: (run) => {
          run.drachma += 3;
          return { text: 'A modest gift, modestly returned — you find a few coins tucked beneath the pillar where none were before. (+3 Drachma)' };
        } },
      { text: 'Leave nothing — the offerings look valuable', result: (run) => {
          run.hubris += 10;
          run.drachma += 5;
          return { text: 'You pocket what others left behind. The coins are heavier than they should be. You do not look back at the three faces of the pillar as you leave. (+5 Drachma)' };
        } }
    ]
  },
  lotus: {
    id: 'lotus', title: 'The Lotus-Eaters\' Shore',
    portrait: 'images/event_lotus.png',
    text: 'A grove of strange fruit grows by a slow, warm river. The air smells sweet, and for the first time since this all began, you feel like you could simply... stop.',
    choices: [
      { text: 'Eat the lotus fruit', result: (run) => {
          run.party.forEach(h => { h.hp = h.maxHp; });
          if (run.relics.length > 0) {
            const lost = run.relics.pop();
            return { text: `For one perfect hour, nothing hurts and nothing matters. Your wounds close. When you rise, your pack feels lighter — you can no longer remember what the ${RELICS[lost]?.name || 'lost relic'} was for, or where it went.`, };
          }
          return { text: 'For one perfect hour, nothing hurts and nothing matters. Your wounds close completely.' };
        } },
      { text: 'Walk on without tasting it', result: (run) => {
          run.favor = Math.min(run.maxFavor, run.favor + 1);
          return { text: 'It is harder than it should be to leave that sweetness behind. But the road is still the road, and you still remember why you walk it. (+1 Favor)' };
        } }
    ]
  },
  sphinx: {
    id: 'sphinx', title: 'The Sphinx\'s Riddle',
    portrait: 'images/event_sphinx.png',
    text: 'A creature with a lion\'s body and a woman\'s face blocks the narrow pass, wings folded. "What walks on four legs in the morning, two legs at noon, and three legs in the evening? Answer, or be devoured."',
    choices: [
      { text: '"Man" — who crawls as a child, walks as an adult, and leans on a staff in old age', result: (run) => {
          run.favor = Math.min(run.maxFavor, run.favor + 4);
          run.hubris = Math.max(0, run.hubris - 5);
          return { text: 'The Sphinx\'s wings unfold slowly — not to attack, but to let you pass. "Few have answered true in an age." She presses something into your hand before fading into the rocks. (+4 Favor)' };
        } },
      { text: '"A crab" — it has many legs at every hour, so the question is meaningless', result: (run) => {
          return { text: 'The Sphinx tilts her head, almost amused. "Clever. Wrong. But clever." She lets you pass anyway, for the novelty of it.' };
        } },
      { text: 'Attack first — riddles are for the weak', result: (run) => {
          run.hubris += 10;
          return { text: 'The Sphinx does not so much fight as correct you. You stagger past her into the pass, every hero bruised and short of breath.', forceBattle: 'sphinx_punish' };
        } }
    ]
  },
  charon: {
    id: 'charon', title: 'Charon\'s Toll',
    portrait: 'images/event_charon.png',
    text: 'A narrow, black river blocks the path. An old ferryman waits in a boat that should not float, palm open. "The toll, or the long way round — and the long way is not short."',
    choices: [
      { text: 'Pay the toll (2 Drachma)', result: (run) => {
          if (run.drachma >= 2) {
            run.drachma -= 2;
            return { text: 'The ferryman\'s fingers close around the coins without a word. The crossing is swift, silent, and colder than the air should allow.' };
          }
          run.hubris += 5;
          return { text: 'You have nothing to give him. He looks at you for a long moment — then pushes off without you. You find another way, scrambling over loose scree, losing time you didn\'t know you had.' };
        } },
      { text: 'Take the long way round', result: (run) => {
          run.hubris += 5;
          return { text: 'The long road is longer than promised. By the time you rejoin the path, you feel watched — as if you were expected at the river, and did not arrive.' };
        } }
    ]
  }
};

const NODE_TYPES = {
  battle: { icon: 'sword', label: 'Battle' },
  elite: { icon: 'skull', label: 'Elite' },
  event: { icon: 'scroll', label: 'Omen' },
  shrine: { icon: 'flame', label: 'Shrine' },
  agora: { icon: 'amphora', label: 'Agora' },
  spring: { icon: 'droplet', label: 'Spring' },
  oracle: { icon: 'eye', label: 'Oracle' },
  boss: { icon: 'crown', label: 'The Nemean Lion' }
};

const NODE_ICON_SVGS = {
  sword: '<svg viewBox="0 0 24 24"><path d="M14.5 2 21 8.5 12.5 17l-3-3L18 5z M9.5 14 3 20.5 5 22 6.5 20.5 8 22 11.5 18.5"/><circle cx="19" cy="6.5" r="1.4"/></svg>',
  skull: '<svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="7"/><rect x="9" y="16" width="6" height="4"/><circle cx="9" cy="10" r="1.3" fill="var(--bone)"/><circle cx="15" cy="10" r="1.3" fill="var(--bone)"/></svg>',
  scroll: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="2"/><line x1="8" y1="8" x2="16" y2="8" stroke="var(--bone)"/><line x1="8" y1="12" x2="16" y2="12" stroke="var(--bone)"/><line x1="8" y1="16" x2="13" y2="16" stroke="var(--bone)"/></svg>',
  flame: '<svg viewBox="0 0 24 24"><path d="M12 2c2 4-3 5-3 9a5 5 0 0010 0c0-2-1-3-2-4 1 3-1 4-2 4-2 0-1-3-1-5 0-2-1-3-2-4z"/></svg>',
  amphora: '<svg viewBox="0 0 24 24"><path d="M9 3h6v2l2 3v10a3 3 0 01-3 3h-4a3 3 0 01-3-3V8l2-3z"/><line x1="9" y1="3" x2="15" y2="3" stroke="var(--bone)"/></svg>',
  droplet: '<svg viewBox="0 0 24 24"><path d="M12 2c4 5 7 9 7 12.5A7 7 0 015 14.5C5 11 8 7 12 2z"/></svg>',
  eye: '<svg viewBox="0 0 24 24"><path d="M2 12c3-5 8-7 10-7s7 2 10 7c-3 5-8 7-10 7s-7-2-10-7z"/><circle cx="12" cy="12" r="3" fill="var(--bone)"/></svg>',
  crown: '<svg viewBox="0 0 24 24"><path d="M3 18h18l-1-9-4 4-3-6-3 6-4-4z"/></svg>'
};

function addStatus(unit, status, duration) {
  unit.statuses = unit.statuses || {};
  unit.statuses[status] = Math.max(unit.statuses[status] || 0, duration);
}
