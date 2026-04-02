'use strict';

// ─── ITEMS ───────────────────────────────────────────────────────────────────
const ITEMS = {
  'bronze-knife': {
    id: 'bronze-knife', name: 'Bronze Knife',
    desc: 'A well-worn blade. Good for cutting rope or carving wood.',
    image: 'item-bronze-knife.png'
  },
  'cut-sail': {
    id: 'cut-sail', name: 'Cut Sail',
    desc: 'Canvas cut to sail-size. Ready to rig on a mast.',
    image: 'item-cut-sail.png'
  },
  'rope-coil': {
    id: 'rope-coil', name: 'Rope Coil',
    desc: 'Salt-stiff rope. Long enough to rig a small mast.',
    image: 'item-rope-coil.png'
  },
  'seal-of-departure': {
    id: 'seal-of-departure', name: 'Seal of Departure',
    desc: "Calypso's blessing, pressed into cold stone. The sea will recognise it.",
    image: 'item-seal-of-departure.png'
  },
  'wine-skin': {
    id: 'wine-skin', name: 'Wine Skin',
    desc: 'Dark, strong wine. The Cyclops has never tasted its like.',
    image: 'item-wine-skin.png'
  },
  'spare-spear-shaft': {
    id: 'spare-spear-shaft', name: 'Olive Shaft',
    desc: 'A heavy length of olive wood. Could be sharpened to a point.',
    image: 'item-spare-spear-shaft.png'
  },
  'hardened-stake': {
    id: 'hardened-stake', name: 'Hardened Stake',
    desc: 'Fire-hardened olive wood, sharpened to a vicious point.',
    image: 'item-hardened-stake.png'
  },
  'cyclops-eye-ring': {
    id: 'cyclops-eye-ring', name: 'Cyclops Ring',
    desc: "An iron ring from the Cyclops's blinded socket. Proof of your passage.",
    image: 'item-cyclops-eye-ring.png'
  },
  'moly-herb': {
    id: 'moly-herb', name: 'Moly Herb',
    desc: "White flowers, black roots. The gods' antidote to witchcraft.",
    image: 'item-moly-herb.png'
  },
  'witchs-oath': {
    id: 'witchs-oath', name: "Circe's Oath",
    desc: "Sworn by the gods: Circe will not hinder your return. Cold comfort, but binding.",
    image: 'item-witchs-oath.png'
  },
  'beeswax-jar': {
    id: 'beeswax-jar', name: 'Beeswax Jar',
    desc: 'Dense wax, enough to seal every ear on the ship.',
    image: 'item-beeswax-jar.png'
  },
  'siren-prophecy': {
    id: 'siren-prophecy', name: 'Siren Prophecy',
    desc: "What the Sirens sang. You cannot unhear it. Names and fates of what lies ahead.",
    image: 'item-siren-prophecy.png'
  },
  'broken-tiller-pin': {
    id: 'broken-tiller-pin', name: 'Broken Pin',
    desc: 'The bronze tiller pin, snapped clean. Without it the ship cannot steer.',
    image: 'item-broken-tiller-pin.png'
  },
  'carved-helm-pin': {
    id: 'carved-helm-pin', name: 'Carved Pin',
    desc: 'Rough olive wood carved to pin-shape. Needs more work to be seaworthy.',
    image: 'item-carved-helm-pin.png'
  },
  'helmsmans-pin': {
    id: 'helmsmans-pin', name: "Helmsman's Pin",
    desc: 'A finished tiller pin, true and strong. The ship can steer again.',
    image: 'item-helmsmans-pin.png'
  },
  'beggar-cloak': {
    id: 'beggar-cloak', name: "Beggar's Cloak",
    desc: 'Filthy wool, road-stained. The perfect disguise for a king come home.',
    image: 'item-beggar-cloak.png'
  },
  'bow-of-odysseus': {
    id: 'bow-of-odysseus', name: 'Bow of Odysseus',
    desc: 'Your own horn bow. Twenty years in hiding. No suitor can string it.',
    image: 'item-bow-of-odysseus.png'
  },
  'kings-seal': {
    id: 'kings-seal', name: "King's Seal",
    desc: "The hidden seal of Ithaca's king. Penelope will know it at once.",
    image: 'item-kings-seal.png'
  }
};

// ─── SCENES ──────────────────────────────────────────────────────────────────
// Each scene: id, name, subtitle, image, entryText, defaultState, hints[], hotspots[]
// Hotspot actions: verbs[], requiresItem?, condition(state)?, result{}, text
// result keys: addItem, removeItem, setState, nextScene, gameWin, selfUse

const SCENES = [

  // ═══════════════════════════════════════════════════
  // SCENE 1 — OGYGIA
  // ═══════════════════════════════════════════════════
  {
    id: 'ogygia',
    name: 'Ogygia',
    subtitle: "Calypso's Shore",
    image: 'scene-01-ogygia.png',
    entryText: "Seven years on Calypso's island. Seven years of soft captivity, of a goddess's love you could not return. Today, at last, Hermes has come and gone — and Calypso has given her permission. The sea calls. You must answer.",
    defaultState: {
      knifeFound: false, sailCut: false, ropeFound: false,
      calypsoTalked: false, sealFound: false,
      sailOnRaft: false, ropeOnRaft: false
    },
    hints: [
      "The sea does not wait. This shore holds everything you need to leave — but the raft must be made ready before Calypso's blessing will mean anything.",
      "You need a sail cut from the canvas, rope to rig it, and Calypso's seal. The knife is in the tool chest. The rope lies on the shore. Calypso herself holds the seal.",
      "Take the bronze knife from the tool chest. Use it on the canvas cloth to cut a sail. Take the rope coil. Talk to Calypso to receive her seal. Then use the cut sail on the raft, the rope on the rigged raft, and finally the seal on the completed raft to depart."
    ],
    hotspots: [
      {
        id: 'tool_chest', label: 'Tool Chest',
        x: 2, y: 68, w: 18, h: 26,
        actions: [
          { verbs: ['look'], text: "A cedar chest, left open by Calypso's nymphs. Bronze tools and scraps of wood — and among them, a knife." },
          { verbs: ['take', 'open'],
            condition: s => !s.knifeFound,
            result: { addItem: 'bronze-knife', setState: { knifeFound: true } },
            text: "You take the bronze knife. The blade is dull at the edge but serviceable." },
          { verbs: ['take'], condition: s => s.knifeFound,
            text: "You already have the knife." }
        ]
      },
      {
        id: 'sail_cloth', label: 'Canvas',
        x: 30, y: 8, w: 24, h: 42,
        actions: [
          { verbs: ['look'], condition: s => !s.sailCut,
            text: "Heavy canvas, rolled and bound. Enough for a sail — if you had something to cut it with." },
          { verbs: ['look'], condition: s => s.sailCut,
            text: "The canvas has been cut. You took what you needed." },
          { verbs: ['use'], requiresItem: 'bronze-knife', condition: s => !s.sailCut,
            result: { addItem: 'cut-sail', setState: { sailCut: true } },
            text: "You draw the knife through the canvas in one long cut. A rough but proper sail." },
          { verbs: ['use'], condition: s => !s.sailCut,
            text: "You need something sharp to cut the canvas." },
          { verbs: ['take'], text: "The whole bolt is too heavy. You would need to cut it first." }
        ]
      },
      {
        id: 'rope_coil', label: 'Rope',
        x: 40, y: 74, w: 16, h: 18,
        actions: [
          { verbs: ['look'], text: "A coil of rope, salt-stiffened. Long enough to rig a small mast." },
          { verbs: ['take'], condition: s => !s.ropeFound,
            result: { addItem: 'rope-coil', setState: { ropeFound: true } },
            text: "You take the rope. Heavy and rough against your palms." },
          { verbs: ['take'], condition: s => s.ropeFound,
            text: "You have the rope already." }
        ]
      },
      {
        id: 'calypso', label: 'Calypso',
        x: 68, y: 5, w: 32, h: 88,
        actions: [
          { verbs: ['look'],
            text: "Calypso. Goddess of the isle. She does not look at you. Seven years of her love, and she has not looked at you once since Hermes came. The sea has her attention now." },
          { verbs: ['talk'], condition: s => !s.calypsoTalked,
            result: { addItem: 'seal-of-departure', setState: { calypsoTalked: true, sealFound: true } },
            text: "Calypso: 'You truly wish to leave. After everything.' She says it the way water says it — slow, deep, final. Then without turning she holds out a smooth stone seal. 'Take this. My blessing made cold. May it carry you where I cannot.'" },
          { verbs: ['talk'], condition: s => s.calypsoTalked,
            text: "Calypso has said all she will say. The sea has the rest of her." },
          { verbs: ['push'], text: "You do not want to provoke a goddess without cause." }
        ]
      },
      {
        id: 'raft', label: 'Raft',
        x: 22, y: 44, w: 44, h: 40,
        actions: [
          { verbs: ['look'], condition: s => !s.sailOnRaft && !s.ropeOnRaft,
            text: "Your raft. Solid lashed timbers — you built it with your own hands. It needs a sail and rigging before it will hold the open sea." },
          { verbs: ['look'], condition: s => s.sailOnRaft && !s.ropeOnRaft,
            text: "The sail is up and catching the breeze. It needs rope to hold it in place." },
          { verbs: ['look'], condition: s => s.sailOnRaft && s.ropeOnRaft && !s.sealFound,
            text: "The raft is rigged. All it lacks is Calypso's blessing. Talk to her." },
          { verbs: ['look'], condition: s => s.sailOnRaft && s.ropeOnRaft && s.sealFound,
            text: "The raft is ready. Calypso's seal will free it." },
          { verbs: ['use'], requiresItem: 'cut-sail', condition: s => !s.sailOnRaft,
            result: { removeItem: 'cut-sail', setState: { sailOnRaft: true } },
            text: "You raise the sail on the mast and make it fast. It fills slightly with the sea breeze." },
          { verbs: ['use'], requiresItem: 'rope-coil', condition: s => s.sailOnRaft && !s.ropeOnRaft,
            result: { removeItem: 'rope-coil', setState: { ropeOnRaft: true } },
            text: "You rig the sail with the rope, lashing each line taut. Crude work, but it will hold." },
          { verbs: ['use'], requiresItem: 'rope-coil', condition: s => !s.sailOnRaft,
            text: "Put the sail up first, then rig it with rope." },
          { verbs: ['use'], requiresItem: 'seal-of-departure',
            condition: s => s.sailOnRaft && s.ropeOnRaft,
            result: { removeItem: 'seal-of-departure', nextScene: 'cyclops_cave' },
            text: "You press Calypso's seal to the prow. The timber warms beneath your hand. The horizon clears. You push off from Ogygia's shore — and do not look back." },
          { verbs: ['use'], requiresItem: 'seal-of-departure',
            condition: s => !s.sailOnRaft || !s.ropeOnRaft,
            text: "The raft is not ready. It needs a sail and rigging first." },
          { verbs: ['walk'], text: "Not yet. Finish the raft." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════
  // SCENE 2 — CYCLOPS CAVE
  // ═══════════════════════════════════════════════════
  {
    id: 'cyclops_cave',
    name: 'Cyclops Cave',
    subtitle: 'The Dark Beneath the Mountain',
    image: 'scene-02-cyclops-cave.png',
    entryText: "The cave of Polyphemus. You and your men were trapped here by the boulder he rolls across the mouth each night. Two men eaten at his last meal. You have one chance — and it requires patience, wine, and fire.",
    defaultState: {
      wineTaken: false, shaftTaken: false, stakeHardened: false,
      cyclopsAsleep: false, cyclopsBlinded: false, ringTaken: false
    },
    hints: [
      "The Cyclops is strong and the cave is sealed. Strength alone will not open that door. Think about what lowers a giant's guard.",
      "The wine will put him to sleep. The olive shaft, hardened in the fire, will blind him. Take both, use the fire on the shaft, then act while he sleeps.",
      "Take the wine skin. Take the olive shaft. Use the shaft in the fire pit to harden it. Use the wine skin on the Cyclops to make him sleep. Then use the hardened stake on the sleeping Cyclops. Take the ring that falls. Push open the cave entrance to escape."
    ],
    hotspots: [
      {
        id: 'wine_skin', label: 'Wine Skin',
        x: 2, y: 72, w: 12, h: 24,
        actions: [
          { verbs: ['look'], text: "A bulging wine skin — the strong dark wine you brought from the ship. The Cyclops has never tasted wine." },
          { verbs: ['take'], condition: s => !s.wineTaken,
            result: { addItem: 'wine-skin', setState: { wineTaken: true } },
            text: "You take the wine skin. It sloshes heavily." },
          { verbs: ['take'], condition: s => s.wineTaken, text: "You already have it." }
        ]
      },
      {
        id: 'olive_shaft', label: 'Olive Shaft',
        x: 8, y: 74, w: 22, h: 22,
        actions: [
          { verbs: ['look'], condition: s => !s.shaftTaken,
            text: "A length of olive trunk, propped in the corner. Heavy. Green-hard. You could sharpen it — and fire would make it harder still." },
          { verbs: ['look'], condition: s => s.shaftTaken,
            text: "You already took the olive shaft." },
          { verbs: ['take'], condition: s => !s.shaftTaken,
            result: { addItem: 'spare-spear-shaft', setState: { shaftTaken: true } },
            text: "You heft the olive trunk. It is heavier than a spear, dense as bone." },
          { verbs: ['take'], condition: s => s.shaftTaken, text: "You have it already." }
        ]
      },
      {
        id: 'fire_pit', label: 'Fire Pit',
        x: 30, y: 65, w: 30, h: 30,
        actions: [
          { verbs: ['look'], text: "The Cyclops's fire. Embers still red. Enough heat to harden olive wood to iron-hardness." },
          { verbs: ['use'], requiresItem: 'spare-spear-shaft', condition: s => !s.stakeHardened,
            result: { removeItem: 'spare-spear-shaft', addItem: 'hardened-stake', setState: { stakeHardened: true } },
            text: "You thrust the point of the shaft into the coals, turning it slowly. When you pull it out, the tip glows — and when it cools, it is hard as bronze." },
          { verbs: ['use'], condition: s => !s.stakeHardened,
            text: "You could harden an olive shaft in this fire, but you need one first." },
          { verbs: ['use'], condition: s => s.stakeHardened,
            text: "The fire has already done its work." }
        ]
      },
      {
        id: 'cyclops', label: 'Cyclops',
        x: 8, y: 0, w: 62, h: 78,
        actions: [
          { verbs: ['look'], condition: s => !s.cyclopsAsleep && !s.cyclopsBlinded,
            text: "Polyphemus. One eye, large as a wheel, tracking your movement. He is not sleeping. Not yet." },
          { verbs: ['look'], condition: s => s.cyclopsAsleep && !s.cyclopsBlinded,
            text: "The Cyclops sleeps. His great body heaves with each breath. The moment is now." },
          { verbs: ['look'], condition: s => s.cyclopsBlinded,
            text: "Polyphemus, blinded, roars and clutches his ruined eye. He flails toward the sound of you — but cannot see." },
          { verbs: ['talk'], condition: s => !s.cyclopsAsleep,
            text: "Polyphemus: 'Nobody! I will eat Nobody last.' He laughs, and the cave shakes. Talking will not save you." },
          { verbs: ['talk'], condition: s => s.cyclopsAsleep,
            text: "He sleeps too deeply to hear you." },
          { verbs: ['use'], requiresItem: 'wine-skin', condition: s => !s.cyclopsAsleep,
            result: { removeItem: 'wine-skin', setState: { cyclopsAsleep: true } },
            text: "You offer the Cyclops wine, refilling his cup three times. He has never tasted wine. It hits him like a hammer blow. He slumps, and his great eye closes. The cave fills with his snoring." },
          { verbs: ['use'], requiresItem: 'hardened-stake', condition: s => s.cyclopsAsleep && !s.cyclopsBlinded,
            result: { removeItem: 'hardened-stake', addItem: 'cyclops-eye-ring', setState: { cyclopsBlinded: true, ringTaken: true } },
            text: "With all your strength you drive the burning stake into the Cyclops's eye. He screams — a sound that cracks the cave walls. He tears at the stake; an iron ring flies from his socket and clatters to the floor. He is blinded. He cannot find you." },
          { verbs: ['use'], requiresItem: 'hardened-stake', condition: s => !s.cyclopsAsleep,
            text: "The Cyclops is still awake. He would catch you before you could act." },
          { verbs: ['use'], requiresItem: 'wine-skin', condition: s => s.cyclopsAsleep,
            text: "He is already asleep." },
          { verbs: ['push'], text: "You cannot move a giant barehanded." }
        ]
      },
      {
        id: 'cave_entrance', label: 'Cave Entrance',
        x: 65, y: 35, w: 33, h: 55,
        actions: [
          { verbs: ['look'], condition: s => !s.cyclopsBlinded,
            text: "A massive stone seals the cave mouth. You cannot move it alone — and the Cyclops would hear you try." },
          { verbs: ['look'], condition: s => s.cyclopsBlinded,
            text: "The Cyclops has rolled back the stone to let his sheep out — and now flails at the entrance, checking each animal. He cannot see you. You could slip through." },
          { verbs: ['open', 'push', 'walk'], condition: s => !s.cyclopsBlinded,
            text: "The stone will not move. Not while the Cyclops watches." },
          { verbs: ['open', 'push', 'walk'], condition: s => s.cyclopsBlinded,
            result: { nextScene: 'circe_hall' },
            text: "Clinging to the belly of a ram, you pass beneath the Cyclops's blind, groping hands and out into the light. Behind you, his voice calls: 'Nobody has blinded me!' The gods laugh, but you do not." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════
  // SCENE 3 — CIRCE'S HALL
  // ═══════════════════════════════════════════════════
  {
    id: 'circe_hall',
    name: "Circe's Hall",
    subtitle: "The Witch's Bargain",
    image: 'scene-03-circe-hall.png',
    entryText: "The island of Aeaea. Your men went ahead and did not return. Hermes met you on the path and pressed a white-flowered herb into your hands. 'This is moly,' he said. 'It will protect you from what she is.' You enter the hall alone.",
    defaultState: {
      molyFound: false, molyEaten: false,
      confronted: false, oathDemanded: false, oathReceived: false
    },
    hints: [
      "Circe's magic works on those who eat her food unprotected. Something in this hall can change that — look beyond the obvious.",
      "The moly herb grows near the garden window. Eat it before you face Circe directly. Only then can you safely confront her and demand her oath.",
      "Look at the garden window to find the moly herb. Take it. Use it at the cauldron to eat it. Then talk to Circe — she cannot transform you now. Push/confront her, then talk to her again to demand the oath. Walk to the exit door once you have it."
    ],
    hotspots: [
      {
        id: 'garden_window', label: 'Moly Flower',
        x: 4, y: 77, w: 12, h: 18,
        actions: [
          { verbs: ['look'], condition: s => !s.molyFound,
            text: "A narrow window onto a walled garden. Among common herbs grows something unusual — white flowers, black roots. Moly. The gods' antidote." },
          { verbs: ['look'], condition: s => s.molyFound,
            text: "The moly is gone. The garden holds only ordinary herbs now." },
          { verbs: ['take'], condition: s => !s.molyFound,
            result: { addItem: 'moly-herb', setState: { molyFound: true } },
            text: "You reach through the window and pull up the moly by its black roots. It comes free easily, as if it wanted to be taken." },
          { verbs: ['take'], condition: s => s.molyFound,
            text: "You already took the moly." }
        ]
      },
      {
        id: 'cauldron', label: 'Cauldron',
        x: 22, y: 54, w: 24, h: 28,
        actions: [
          { verbs: ['look'], text: "Circe's cauldron. A yellow brew that smells of honey and iron. You know what it does to men." },
          { verbs: ['use'], requiresItem: 'moly-herb', condition: s => !s.molyEaten,
            result: { removeItem: 'moly-herb', setState: { molyEaten: true } },
            text: "You chew the moly root before the cauldron, tasting bitterness and something older than bitter. A strange clarity settles over you. Whatever Circe brews will not hold." },
          { verbs: ['use'], condition: s => !s.molyEaten && !s.molyFound,
            text: "You need the moly herb first. Look around the hall." },
          { verbs: ['use'], condition: s => s.molyEaten,
            text: "You have already eaten the moly. The protection is in you." },
          { verbs: ['open', 'push'], text: "The cauldron is heavy and hot. Best leave it alone." }
        ]
      },
      {
        id: 'circe', label: 'Circe',
        x: 46, y: 8, w: 36, h: 84,
        actions: [
          { verbs: ['look'],
            text: "Circe. She is exactly what you were told — beautiful, cold, patient. She watches you with the calm of someone who has never been refused." },
          { verbs: ['talk'], condition: s => !s.molyEaten,
            text: "Circe offers you the cup with a smile. 'Drink, traveller. You look tired.' You feel the pull of it. Do not drink before you are protected." },
          { verbs: ['talk'], condition: s => s.molyEaten && !s.confronted,
            text: "You drink from Circe's cup. She waits for the change — and it does not come. Her smile falters. She raises her wand." },
          { verbs: ['push'], condition: s => s.molyEaten && !s.confronted,
            result: { setState: { confronted: true } },
            text: "You knock her wand aside and press your sword to her throat. For the first time since you entered the hall, Circe is afraid. 'What manner of man are you,' she breathes, 'that my magic cannot hold?'" },
          { verbs: ['push'], condition: s => !s.molyEaten,
            text: "Without the moly's protection, Circe's magic would stop you before you raised a hand." },
          { verbs: ['talk'], condition: s => s.confronted && !s.oathReceived,
            result: { addItem: 'witchs-oath', setState: { oathDemanded: true, oathReceived: true } },
            text: "You demand her sworn oath — by the Styx, by the gods — that she will not hinder your return and will restore your men. Circe's eyes are unreadable. Then she nods, once, and speaks the words. They settle over the hall like a cold wind. A sealed scroll forms in her hand and she gives it to you." },
          { verbs: ['talk'], condition: s => s.oathReceived,
            text: "Circe: 'The oath stands. Your men are restored. Go, Odysseus — but hear what I tell you of the road ahead.'" },
          { verbs: ['push'], condition: s => s.confronted,
            text: "There is no need for more force. You have what you came for." }
        ]
      },
      {
        id: 'exit_door', label: 'Barred Gate',
        x: 76, y: 14, w: 22, h: 74,
        actions: [
          { verbs: ['look'], condition: s => !s.oathReceived,
            text: "A heavy door of polished wood. You sense it would not open for you — not yet." },
          { verbs: ['look'], condition: s => s.oathReceived,
            text: "The door stands ready. The road continues." },
          { verbs: ['open', 'walk'], condition: s => !s.oathReceived,
            text: "The door does not move. Circe's hall holds you until you settle matters with her." },
          { verbs: ['open', 'walk'], condition: s => s.oathReceived,
            result: { nextScene: 'sirens_strait' },
            text: "You walk out of Circe's hall into clean air. She watches from the doorway. You do not look back — there is a pattern to how you leave islands now." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════
  // SCENE 4 — SIRENS STRAIT
  // ═══════════════════════════════════════════════════
  {
    id: 'sirens_strait',
    name: 'Sirens Strait',
    subtitle: 'The Song That Kills',
    image: 'scene-04-sirens-strait.png',
    entryText: "Circe's warning is fresh in your mind: the Sirens sing to passing ships, and all who hear them steer to the rocks. She told you what to do. Now it is time to do it — before the rocks come into view.",
    defaultState: {
      waxTaken: false, ropeFound: false,
      crewProtected: false, selfBound: false, prophecyReceived: false
    },
    hints: [
      "The Sirens' song is not the danger — steering toward it is. Find a way to keep the crew deaf and yourself anchored.",
      "The beeswax in the jar can seal the crew's ears. The rope on deck can bind you to the mast so you hear the song but cannot act on it.",
      "Take the beeswax jar and the rope coil. Use the beeswax jar on the crew to seal their ears. Use the rope coil on the mast to bind yourself. Then look at the Sirens while bound — you will hear the prophecy without dying for it. Walk to the horizon to sail on."
    ],
    hotspots: [
      {
        id: 'beeswax_jar', label: 'Beeswax Jar',
        x: 2, y: 76, w: 18, h: 20,
        actions: [
          { verbs: ['look'], text: "A clay jar of thick beeswax. Soft enough to press into ears." },
          { verbs: ['take'], condition: s => !s.waxTaken,
            result: { addItem: 'beeswax-jar', setState: { waxTaken: true } },
            text: "You take the beeswax jar. It is heavier than it looks." },
          { verbs: ['take'], condition: s => s.waxTaken, text: "Already taken." }
        ]
      },
      {
        id: 'ship_rope', label: 'Ship Rope',
        x: 32, y: 68, w: 18, h: 22,
        actions: [
          { verbs: ['look'], text: "A coil of ship rope, heavy and long. Circe said to bind yourself to the mast with it." },
          { verbs: ['take'], condition: s => !s.ropeFound,
            result: { addItem: 'rope-coil', setState: { ropeFound: true } },
            text: "You take the rope. It will have to hold against the strongest pull you have ever felt." },
          { verbs: ['take'], condition: s => s.ropeFound, text: "You already have it." }
        ]
      },
      {
        id: 'crew', label: 'Crew',
        x: 0, y: 50, w: 32, h: 46,
        actions: [
          { verbs: ['look'], text: "Your men. Tired, scarred, still here. They trust you — and they do not yet know what is coming." },
          { verbs: ['talk'],
            text: "The men look at you steadily. They have followed you this far. Whatever you tell them to do, they will do it." },
          { verbs: ['use'], requiresItem: 'beeswax-jar', condition: s => !s.crewProtected,
            result: { removeItem: 'beeswax-jar', setState: { crewProtected: true } },
            text: "You soften the wax and press a plug into every man's ears. They cannot hear you now — only see you. They row in silence, not knowing what silence is protecting them from." },
          { verbs: ['use'], requiresItem: 'beeswax-jar', condition: s => s.crewProtected,
            text: "The crew's ears are already sealed." },
          { verbs: ['use'], condition: s => !s.crewProtected,
            text: "You need the beeswax to protect the crew's hearing." }
        ]
      },
      {
        id: 'mast', label: 'Mast',
        x: 35, y: 0, w: 15, h: 60,
        actions: [
          { verbs: ['look'], text: "The main mast. A fixed point in a world about to become very loud." },
          { verbs: ['use'], requiresItem: 'rope-coil', condition: s => s.crewProtected && !s.selfBound,
            result: { removeItem: 'rope-coil', setState: { selfBound: true } },
            text: "You lash yourself to the mast, arms pinned, face forward. You ordered the crew: no matter what you say or gesture, do not untie you. They nod. They cannot hear you anymore. This is how it must be." },
          { verbs: ['use'], requiresItem: 'rope-coil', condition: s => !s.crewProtected,
            text: "Seal the crew's ears first. If they hear the song, they will sail you onto the rocks." },
          { verbs: ['use'], condition: s => !s.selfBound,
            text: "You will need the rope to bind yourself to the mast." },
          { verbs: ['use'], condition: s => s.selfBound,
            text: "You are already bound." }
        ]
      },
      {
        id: 'sirens', label: 'Sirens',
        x: 55, y: 0, w: 43, h: 62,
        actions: [
          { verbs: ['look'], condition: s => !s.selfBound,
            text: "Shapes on the rocks ahead. Figures. Feathers and faces. You cannot hear them yet — but the water around the rocks is white with wreckage." },
          { verbs: ['look'], condition: s => s.selfBound && !s.prophecyReceived,
            result: { addItem: 'siren-prophecy', setState: { prophecyReceived: true } },
            text: "The song hits you like a wave breaking over your whole body. Every part of you wants to go to them. You scream at the crew to free you. They row on, stone-deaf. The ropes hold. And in the agony of wanting, you hear what the Sirens are actually saying — names, routes, fates. Things no living sailor knows. When it fades, you are breathing hard, tears on your face, a prophecy burned into your memory." },
          { verbs: ['look'], condition: s => s.prophecyReceived,
            text: "The rocks are behind you now. The Sirens' voices fade. You are shaking." },
          { verbs: ['walk', 'talk'], condition: s => !s.selfBound,
            text: "Do not go toward the rocks without first protecting yourself and the crew." }
        ]
      },
      {
        id: 'horizon', label: 'Open Sea',
        x: 0, y: 2, w: 26, h: 30,
        actions: [
          { verbs: ['look'], text: "Open water ahead. The narrows are past — but not the last danger." },
          { verbs: ['walk'], condition: s => s.selfBound && s.prophecyReceived,
            result: { nextScene: 'scylla_charybdis' },
            text: "The crew cuts you free from the mast. Your wrists are raw. Nobody speaks. The ship moves on into the narrows between Scylla and Charybdis." },
          { verbs: ['walk'], condition: s => !s.selfBound,
            text: "You cannot sail on yet. Prepare for the Sirens first." },
          { verbs: ['walk'], condition: s => s.selfBound && !s.prophecyReceived,
            text: "You are bound to the mast. The Sirens are still ahead — look at them." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════
  // SCENE 5 — SCYLLA AND CHARYBDIS
  // ═══════════════════════════════════════════════════
  {
    id: 'scylla_charybdis',
    name: 'Scylla and Charybdis',
    subtitle: 'The Narrows',
    image: 'scene-05-scylla-charybdis.png',
    entryText: "The narrows. To port, Scylla — six heads, one for each man she will take. To starboard, Charybdis — a whirlpool that swallows ships whole. And now the helmsman shouts: the tiller pin has snapped. The ship is without steering.",
    defaultState: {
      tillerExamined: false, shaftTaken: false,
      pinRough: false, pinFinished: false, tillerRepaired: false, helmsmanReady: false
    },
    hints: [
      "The ship cannot be steered without the tiller pin. There is material on this deck that could replace it — if shaped properly.",
      "The broken pin shows you what shape you need. Spare shaft in the hold can provide the wood. The bronze knife in your pack can do the shaping — twice, for a rough cut and then a fine one.",
      "Take the broken tiller pin from the tiller. Take the spare spear shaft from the storage hold. Use your bronze knife on the spear shaft to make a carved pin. Use the knife again on the carved pin to finish it into a helmsman's pin. Use the finished pin on the tiller to repair it. Then talk to the helmsman and walk forward."
    ],
    hotspots: [
      {
        id: 'tiller', label: 'Steering Oar',
        x: 26, y: 52, w: 40, h: 44,
        actions: [
          { verbs: ['look'], condition: s => !s.tillerExamined,
            text: "The steering oar hangs loose — the bronze locking pin has snapped. Without it, the oar spins freely and the ship cannot be directed. The current is already pulling toward Charybdis." },
          { verbs: ['look'], condition: s => s.tillerExamined && !s.tillerRepaired,
            text: "The pin socket waits. You need a replacement pin that fits — bronze-weight olive wood, shaped true." },
          { verbs: ['look'], condition: s => s.tillerRepaired,
            text: "The steering oar holds. The helmsman is at it now." },
          { verbs: ['take'], condition: s => !s.tillerExamined,
            result: { addItem: 'broken-tiller-pin', setState: { tillerExamined: true } },
            text: "You pick up the two halves of the bronze pin. Snapped clean. You hold them together to understand the shape you need to carve." },
          { verbs: ['use'], requiresItem: 'helmsmans-pin', condition: s => !s.tillerRepaired,
            result: { removeItem: 'helmsmans-pin', setState: { tillerRepaired: true } },
            text: "You seat the finished pin in the tiller socket. It fits true. The tiller locks and swings properly. You shout to the helmsman." },
          { verbs: ['use'], condition: s => !s.tillerRepaired,
            text: "You need a finished replacement pin to repair the tiller." }
        ]
      },
      {
        id: 'storage_hold', label: 'Storage Hold',
        x: 18, y: 62, w: 44, h: 30,
        actions: [
          { verbs: ['look'], condition: s => !s.shaftTaken,
            text: "The ship's storage hold, propped open. Inside: coiled lines, spare oars — and a long shaft of olive wood." },
          { verbs: ['look'], condition: s => s.shaftTaken,
            text: "The hold is emptied of anything useful. You took the shaft." },
          { verbs: ['take', 'open'], condition: s => !s.shaftTaken,
            result: { addItem: 'spare-spear-shaft', setState: { shaftTaken: true } },
            text: "You pull the olive shaft from the hold. Straight-grained, dense. Good carving wood." },
          { verbs: ['take'], condition: s => s.shaftTaken, text: "You already took the shaft." }
        ]
      },
      {
        id: 'helmsman', label: 'Helmsman',
        x: 36, y: 22, w: 34, h: 62,
        actions: [
          { verbs: ['look'], text: "Your helmsman, white-knuckled, watching the water. He knows the narrows. He needs the tiller back." },
          { verbs: ['talk'], condition: s => !s.tillerRepaired,
            text: "Helmsman: 'The pin is gone, lord. I can do nothing without the tiller.' He does not panic — but the water is narrowing." },
          { verbs: ['talk'], condition: s => s.tillerRepaired && !s.helmsmanReady,
            result: { setState: { helmsmanReady: true } },
            text: "The helmsman grips the restored tiller and steadies it. 'I have it, lord. Stand ready — Scylla will take some of us no matter what we do. Do not look at her. Keep your eyes on the far water.' You nod. He is right." },
          { verbs: ['talk'], condition: s => s.helmsmanReady,
            text: "The helmsman watches the water. He has nothing more to say." }
        ]
      },
      {
        id: 'workbench', label: 'Deck Rail',
        x: 20, y: 50, w: 28, h: 18,
        actions: [
          { verbs: ['look'], text: "The ship's deck rail — a flat surface. You could work here." },
          { verbs: ['use'], requiresItem: 'bronze-knife', condition: s => s.shaftTaken && !s.pinRough,
            result: { removeItem: 'spare-spear-shaft', addItem: 'carved-helm-pin', setState: { pinRough: true } },
            text: "You brace the shaft against the rail and work the knife down its length, following the shape of the broken pin. The first rough cut takes shape. It needs more work." },
          { verbs: ['use'], requiresItem: 'bronze-knife', condition: s => s.pinRough && !s.pinFinished,
            result: { removeItem: 'carved-helm-pin', addItem: 'helmsmans-pin', setState: { pinFinished: true } },
            text: "You make the fine cuts — tapering the end, smoothing the socket-face. The pin is finished. It will hold." },
          { verbs: ['use'], requiresItem: 'bronze-knife', condition: s => !s.shaftTaken,
            text: "You need a piece of wood to shape. Look in the storage hold." },
          { verbs: ['use'], condition: s => !s.shaftTaken,
            text: "There is nothing here to work on yet." }
        ]
      },
      {
        id: 'scylla_side', label: 'Scylla',
        x: 62, y: 0, w: 38, h: 50,
        actions: [
          { verbs: ['look'],
            text: "Scylla. Six necks, six heads, each with three rows of teeth. She takes six men from every ship that passes. The prophecy told you this. You were told not to fight her — there is no fighting her. You can only keep moving." },
          { verbs: ['push', 'use', 'take'], text: "There is nothing to be done about Scylla. She will take what she will take." }
        ]
      },
      {
        id: 'charybdis_side', label: 'Charybdis',
        x: 0, y: 12, w: 30, h: 72,
        actions: [
          { verbs: ['look'],
            text: "Charybdis — the whirlpool. Three times a day she swallows the sea and vomits it back. A ship caught in her pull is gone. Hug the Scylla side. Stay in the channel." },
          { verbs: ['push', 'use'], text: "Nothing can be done about Charybdis from here." }
        ]
      },
      {
        id: 'forward_passage', label: 'Forward',
        x: 16, y: 8, w: 42, h: 26,
        actions: [
          { verbs: ['look'], text: "The far end of the narrows. Open sea beyond. But the ship must be steerable to reach it." },
          { verbs: ['walk'], condition: s => s.tillerRepaired && s.helmsmanReady,
            result: { nextScene: 'ithaca_shore' },
            text: "You come through the narrows. Six men are gone — taken by Scylla while you watched the helmsman and could do nothing. The rest row in silence. The open sea receives you." },
          { verbs: ['walk'], condition: s => !s.tillerRepaired,
            text: "The ship cannot be steered. Repair the tiller first." },
          { verbs: ['walk'], condition: s => s.tillerRepaired && !s.helmsmanReady,
            text: "Talk to the helmsman — he needs to take the wheel before you can move." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════
  // SCENE 6 — ITHACA SHORE
  // ═══════════════════════════════════════════════════
  {
    id: 'ithaca_shore',
    name: 'Ithaca Shore',
    subtitle: 'The Hidden Cove',
    image: 'scene-06-ithaca-shore.png',
    entryText: "Ithaca. You have not seen it in twenty years. The cove is familiar — you used to fish here as a boy. There is a mist over the shore that feels deliberate. Athena's work. You arrive alone, unrecognised, as she intended. Think before you walk up that hill.",
    defaultState: {
      cloakFound: false, thicketSearched: false, bowFound: false, cloakWorn: false
    },
    hints: [
      "A king walking home openly will be dead before he reaches the hall. This shore holds the tools for a less conspicuous arrival.",
      "There is a bundle on the shore — a disguise. And the thicket near the rocks hides something even more important. Find both before you take the path to the palace.",
      "Take the beggar's cloak from the shore bundle. Push the thicket to reveal your bow; take it. Use the beggar's cloak on yourself (click yourself) to put it on. Then walk to the path forward."
    ],
    hotspots: [
      {
        id: 'shore_bundle', label: 'Cloak Bundle',
        x: 2, y: 48, w: 18, h: 34,
        actions: [
          { verbs: ['look'], condition: s => !s.cloakFound,
            text: "A rough bundle tied with cord, left at the waterline. A cloak — filthy wool, road-stained, smelling of old fire. Not the garment of a king. Exactly what you need." },
          { verbs: ['look'], condition: s => s.cloakFound,
            text: "The bundle is empty. You took the cloak." },
          { verbs: ['take', 'open'], condition: s => !s.cloakFound,
            result: { addItem: 'beggar-cloak', setState: { cloakFound: true } },
            text: "You pull the beggar's cloak free. It stinks. It is perfect." },
          { verbs: ['take'], condition: s => s.cloakFound, text: "Already taken." }
        ]
      },
      {
        id: 'thicket', label: 'Rocky Ground',
        x: 2, y: 74, w: 28, h: 24,
        actions: [
          { verbs: ['look'], condition: s => !s.thicketSearched,
            text: "Tall reeds and thornbush, dense along the rock face. Something long and straight is hidden in there. You can see it if you know what you are looking for." },
          { verbs: ['look'], condition: s => s.thicketSearched && !s.bowFound,
            text: "You pushed the reeds aside but haven't taken the bow yet." },
          { verbs: ['look'], condition: s => s.bowFound,
            text: "The thicket is pushed aside. Nothing remains." },
          { verbs: ['push', 'open'], condition: s => !s.thicketSearched,
            result: { setState: { thicketSearched: true } },
            text: "You force the reeds apart. Your bow — your own horn bow, wrapped in oilcloth — is lying in the shadows where you left it twenty years ago. Someone kept faith with it." },
          { verbs: ['take'], condition: s => s.thicketSearched && !s.bowFound,
            result: { addItem: 'bow-of-odysseus', setState: { bowFound: true } },
            text: "You lift the bow free and strip the oilcloth. The horn is still supple. The string is wrapped separately. You know this bow like your own name." },
          { verbs: ['take'], condition: s => !s.thicketSearched,
            text: "The reeds are too dense. Push them aside first." },
          { verbs: ['take'], condition: s => s.bowFound, text: "You already have the bow." }
        ]
      },
      {
        id: 'odysseus_self', label: 'Yourself',
        x: 18, y: 34, w: 34, h: 56,
        actions: [
          { verbs: ['look'],
            text: "You. Older than when you left. Harder. You look nothing like a king — which may be the only advantage left to you." },
          { verbs: ['use'], requiresItem: 'beggar-cloak', condition: s => !s.cloakWorn,
            result: { setState: { cloakWorn: true } },
            text: "You pull the beggar's cloak over your shoulders and hunch into it. Your bearing changes — twenty years of sea and war compressed into a stoop. Not even your dog would know you. Almost." },
          { verbs: ['use'], requiresItem: 'beggar-cloak', condition: s => s.cloakWorn,
            text: "You are already in disguise." }
        ]
      },
      {
        id: 'palace_view', label: 'Palace',
        x: 62, y: 4, w: 26, h: 28,
        actions: [
          { verbs: ['look'],
            text: "Ithaca's palace, up on the hill. Smoke from the hall. Torchlight already, though it is barely evening. The suitors are feasting again. They have been feasting for three years." }
        ]
      },
      {
        id: 'path_forward', label: 'Path to Palace',
        x: 52, y: 22, w: 30, h: 68,
        actions: [
          { verbs: ['look'], text: "The path up to the palace. It is familiar. Everything is familiar and nothing is the same." },
          { verbs: ['walk'], condition: s => s.cloakWorn && s.bowFound,
            result: { nextScene: 'great_hall' },
            text: "You take the path. Nobody recognises you. You are a returning beggar, nothing more. The palace gates stand open — they always are, for the suitors." },
          { verbs: ['walk'], condition: s => !s.cloakWorn,
            text: "You cannot walk in as yourself. Put on the beggar's cloak first." },
          { verbs: ['walk'], condition: s => s.cloakWorn && !s.bowFound,
            text: "You have the disguise. But you will need your bow for what comes next. Check the thicket." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════
  // SCENE 7 — THE GREAT HALL
  // ═══════════════════════════════════════════════════
  {
    id: 'great_hall',
    name: 'The Great Hall',
    subtitle: 'Blood and Silence',
    image: 'scene-07-great-hall.png',
    entryText: "The great hall of Ithaca. Suitors fill every bench — laughing, eating, throwing bones. Penelope sits at the far end, still and composed, watching nothing in particular. A contest is set: the man who can string Odysseus's bow and shoot through twelve axe-handles may have her hand. None of them have managed it. Yet.",
    defaultState: {
      sealFound: false, contestAttempted: false,
      bowUsed: false, penelopeTalked: false, sealGiven: false
    },
    hints: [
      "The hall holds something hidden that belongs only to you. And the bow in your hands can change everything — but timing matters.",
      "There is a loose stone behind the throne pillar. Find the king's seal there. Win the contest with your bow. Only then speak to Penelope and show her what no suitor could ever have.",
      "Open the loose stone nook to find the king's seal. Use your bow on the contest target to string it and shoot. Talk to Penelope (she is watching). Then use the king's seal on her — she will know it. Walk to the inner chamber door when it opens."
    ],
    hotspots: [
      {
        id: 'throne_nook', label: 'Loose Stone',
        x: 16, y: 65, w: 20, h: 28,
        actions: [
          { verbs: ['look'], condition: s => !s.sealFound,
            text: "The stone behind the throne pillar. Loose — you left it loose on purpose, twenty years ago. Nobody has touched it." },
          { verbs: ['look'], condition: s => s.sealFound,
            text: "The stone is shifted. The hollow is empty." },
          { verbs: ['open', 'push', 'take'], condition: s => !s.sealFound,
            result: { addItem: 'kings-seal', setState: { sealFound: true } },
            text: "You press the stone aside. The hollow behind it is exactly as you left it. The king's seal sits in the dust, patient as stone." },
          { verbs: ['open'], condition: s => s.sealFound,
            text: "The nook is empty now." }
        ]
      },
      {
        id: 'contest_target', label: 'Axe Contest',
        x: 10, y: 58, w: 22, h: 40,
        actions: [
          { verbs: ['look'], condition: s => !s.bowUsed,
            text: "Twelve axe-handles set in a row, holes aligned. The contest: string the bow of Odysseus and drive a single arrow through all twelve. The suitors have been trying for days." },
          { verbs: ['look'], condition: s => s.bowUsed,
            text: "The twelve axes. The arrow still in them." },
          { verbs: ['use'], requiresItem: 'bow-of-odysseus', condition: s => !s.bowUsed,
            result: { removeItem: 'bow-of-odysseus', setState: { contestAttempted: true, bowUsed: true } },
            text: "You step forward in your beggar's rags. The suitors laugh. You pick up your own bow — your hands remember it — and string it in one motion. The hall goes quiet. The arrow flies. It passes through all twelve axe-handles and buries itself in the far wall. The silence in the hall is the loudest thing you have ever heard." },
          { verbs: ['use'], condition: s => !s.bowUsed,
            text: "You need your bow to enter the contest." },
          { verbs: ['use'], condition: s => s.bowUsed,
            text: "The contest is already decided." }
        ]
      },
      {
        id: 'suitors', label: 'Suitors',
        x: 26, y: 22, w: 44, h: 60,
        actions: [
          { verbs: ['look'], condition: s => !s.bowUsed,
            text: "The suitors. A hundred or more. Eating your food, drinking your wine, wearing out your floors. They do not look at a beggar twice." },
          { verbs: ['look'], condition: s => s.bowUsed,
            text: "The suitors have stopped laughing. Some are standing. Some are reaching for weapons. The moment is balanced on an edge." },
          { verbs: ['talk'], condition: s => !s.bowUsed,
            text: "A suitor glances over: 'Get away from me, beggar.' They will not speak to you as what you are." },
          { verbs: ['talk'], condition: s => s.bowUsed,
            text: "The suitors are past talking. The hall is becoming something else." },
          { verbs: ['push'], text: "There are a hundred of them. This is not the right moment." }
        ]
      },
      {
        id: 'penelope', label: 'Penelope',
        x: 0, y: 8, w: 18, h: 62,
        actions: [
          { verbs: ['look'],
            text: "Penelope. Three years of suitors and she has not broken. Her face gives nothing away — but her eyes are watching the beggar who just strung the bow. Those eyes do not believe in coincidence." },
          { verbs: ['talk'], condition: s => !s.bowUsed,
            text: "Penelope: 'Have you eaten, traveller? The hall provides.' Her voice is careful. She is watching you too closely for someone who thinks you are a beggar." },
          { verbs: ['talk'], condition: s => s.bowUsed && !s.penelopeTalked,
            result: { setState: { penelopeTalked: true } },
            text: "Penelope watches you. She does not show what she is thinking. 'A beggar who can string that bow.' She lets the silence sit. 'If you have more to say — show me something.' She does not look away." },
          { verbs: ['talk'], condition: s => s.penelopeTalked && !s.sealGiven,
            text: "She is waiting. The seal is what she needs." },
          { verbs: ['use'], requiresItem: 'kings-seal', condition: s => s.bowUsed,
            result: { removeItem: 'kings-seal', setState: { sealGiven: true }, nextScene: 'olive_root_bed' },
            text: "You hold out the king's seal — the seal only Odysseus and Penelope knew. She looks at it a long time without moving. Then she looks at you. What happens next is not quiet. The hall fills with sound and violence, and when it is over, only loyal men are standing. Penelope stands at the end of the hall and says, quietly: 'Come with me.'" },
          { verbs: ['use'], requiresItem: 'kings-seal', condition: s => !s.bowUsed,
            text: "Win the contest first. Your word alone will not move her." }
        ]
      },
      {
        id: 'inner_door', label: 'Inner Chamber',
        x: 36, y: 82, w: 26, h: 16,
        actions: [
          { verbs: ['look'], condition: s => !s.sealGiven,
            text: "The door to the inner chambers. Closed." },
          { verbs: ['walk', 'open'], condition: s => !s.sealGiven,
            text: "Not yet. There is work to do in the hall first." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════
  // SCENE 8 — OLIVE ROOT BED
  // ═══════════════════════════════════════════════════
  {
    id: 'olive_root_bed',
    name: 'Olive Root Bed',
    subtitle: 'The Only Proof',
    image: 'scene-08-olive-root-bed.png',
    entryText: "The royal bedchamber. Twenty years of absence in this room — and Penelope standing across from it, arms folded, face composed. You have killed a hall full of suitors. You have come home through monsters and gods. And she is still not certain. She should not be. You understand that. You would do the same.",
    defaultState: {
      penelopeTested: false, bedExamined: false, treeExamined: false, secretRevealed: false
    },
    hints: [
      "Penelope has waited twenty years. She will not accept less than absolute proof. Observe everything in this room before you speak.",
      "The bed itself is the test. Penelope will ask you to move it — and only Odysseus knows why that is impossible. Look at the bed, look at the olive tree outside, then speak to Penelope again.",
      "Talk to Penelope — she will order the bed moved. Look at the bed to remember its secret. Look at the olive tree through the window to confirm it. Then talk to Penelope again — tell her the bed cannot be moved, and why. That is the only proof she will accept."
    ],
    hotspots: [
      {
        id: 'penelope_bed', label: 'Penelope',
        x: 0, y: 14, w: 30, h: 80,
        actions: [
          { verbs: ['look'],
            text: "Penelope. She has been waiting twenty years for the right man to say the right thing. She is not going to make it easy. You would not respect her if she did." },
          { verbs: ['talk'], condition: s => !s.penelopeTested,
            result: { setState: { penelopeTested: true } },
            text: "Penelope: 'I am glad the suitors are gone. But words are easy, and men lie.' A pause. 'Move the great bed to the outer chamber. I would have fresh sleeping arrangements tonight.' Her voice is steady. She is watching your face." },
          { verbs: ['talk'], condition: s => s.penelopeTested && !s.bedExamined,
            text: "She is waiting for your answer. Look at the bed first — remember what you know about it." },
          { verbs: ['talk'], condition: s => s.bedExamined && !s.secretRevealed,
            result: { setState: { secretRevealed: true }, gameWin: true },
            text: "You speak carefully — not loudly, not with anger: 'Move the bed? No mortal man could move that bed. I built it myself, twenty years ago. The main post is the trunk of a living olive tree — I built the bedroom around it, the walls, the roof. It is rooted in the earth. It cannot be moved. No one living knows this but you and me — and one handmaiden.' Penelope breaks. Not loudly. She comes across the room and her arms go around you and she says nothing for a long time. When she speaks, her voice is unsteady for the first time. 'Only you could know that. Only you.'" },
          { verbs: ['talk'], condition: s => s.secretRevealed,
            text: "There is nothing left to say with words." },
          { verbs: ['push'], text: "This is not the moment for force." }
        ]
      },
      {
        id: 'the_bed', label: 'The Bed',
        x: 22, y: 45, w: 38, h: 48,
        actions: [
          { verbs: ['look'], condition: s => !s.bedExamined,
            result: { setState: { bedExamined: true } },
            text: "The great bed. You built this. The main post is the trunk of an olive tree — you cleared the growth, shaped the trunk, and built the bedroom walls around it. The tree is still alive beneath the stone. The bed cannot be moved. Only you know this. Only you and Penelope." },
          { verbs: ['look'], condition: s => s.bedExamined,
            text: "The olive post. The living tree inside it. The secret held for twenty years." },
          { verbs: ['push'], condition: s => !s.bedExamined,
            result: { setState: { bedExamined: true } },
            text: "You put your hands to the bedpost. It does not move. Of course it does not — it is the trunk of a living olive tree. You remember building this. You built the walls around it." },
          { verbs: ['push'], condition: s => s.bedExamined,
            text: "The bed does not move. It never will." },
          { verbs: ['take'], text: "You do not need to take it. You need to explain it." }
        ]
      },
      {
        id: 'olive_window', label: 'Olive Tree',
        x: 32, y: 0, w: 34, h: 55,
        actions: [
          { verbs: ['look'], condition: s => !s.treeExamined,
            result: { setState: { treeExamined: true } },
            text: "The window looks out onto the old olive tree — the one you built the bedpost from. It is still there. Still alive. The branches move in the night wind, and the roots go down into the floor of your bedroom. Twenty years and it has kept the secret without being asked." },
          { verbs: ['look'], condition: s => s.treeExamined,
            text: "The olive tree. It outlasted the war. It will outlast everything." }
        ]
      }
    ]
  }

]; // end SCENES

// ─── LOOKUP MAP ──────────────────────────────────────────────────────────────
const SCENES_MAP = {};
SCENES.forEach((s, i) => { s.index = i; SCENES_MAP[s.id] = s; });
