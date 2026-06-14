# Gods' Gambit — Product Requirements Document

**A single-player, browser-based Greek-mythology roguelike strategy game.**

Version 0.1 (draft) · 2026-06-13 · Author: Lukas Posolda
Target build: single self-contained HTML file in `games/gods-gambit/`, served from GitHub Pages.

---

## 1. Vision

You are a mortal champion chosen by a patron deity to climb from the mortal world,
through the monster-haunted wilds, into the Underworld or up Mount Othrys, to face a
Titan. Each run is a fresh branching journey: you recruit heroes, win boons from the
gods, collect relics, and make choices that the Fates remember. No two runs are the same.

The design north star is **"reward knowing the myths."** Most roguelikes reward reflexes
or memorising the meta. Gods' Gambit rewards a player who actually knows that Perseus
beat Medusa with a mirror, that Pandora opened a *jar* (pithos) and not a box, that the
Graeae share one eye, and that Hecate rules the crossroads. The deeper cuts are not
trivia pop-ups — they are **mechanics**. The expert player sees options the novice misses.

**Primary player:** Samuel (11), a genuine Greek-mythology expert. The content must go
well past the school-poster myths into the fringes so it keeps surprising him.
**Secondary player:** Adam (13), and any kid who enjoys quick-strategy / "clash of
kingdoms"-style decision games. Must be enjoyable without expert knowledge — expertise is
an *edge*, never a *gate*.

---

## 2. Design pillars

1. **A run, not a save file.** 20–40 minutes start to finish. Death ends the run; you
   start again from the top with new randomised content. "One more go" is the hook.
2. **Strategy over reflexes.** Turn-based. No twitch. Time to think. This is what makes it
   fair across the 11–13 age gap and friendly to a thoughtful kid.
3. **Knowledge is power.** Myth-accurate counters, weaknesses, and synergies. The reward
   for being Samuel is *seeing the right move*, not being told it.
4. **Deep but not obscure-for-its-own-sake.** Every fringe character earns its place with
   a mechanic that reflects its actual story.
5. **Self-contained.** One HTML file, all art baked in or referenced locally, saves to
   `localStorage`, runs offline, no backend, no accounts.

---

## 3. Core gameplay loop

```
Choose patron god  ─►  Enter the map
        ▲                    │
        │                    ▼
   Run ends           Pick next node ──► Resolve node (battle / event / shop / shrine)
   (win or death)           ▲                    │
        ▲                    └────────────────────┘
        │                         (climb the map)
        └────────  Reach & defeat the act boss (a Titan / great monster)
```

**One session = one run.** A run is 3 acts. Each act is a small branching map of ~10–14
nodes ending in a boss. Between nodes you manage your warband (heroes), your relics, and
your **Favor** (the god-currency). Lose all your heroes in battle → run ends.

---

## 4. The run structure

### 4.1 Map
Each act is a branching node map (think a simple tree/lattice you climb bottom-to-top).
At each step the player chooses one of 2–3 forward nodes, so routing is a strategic
decision (greedy for treasure vs. safe healing path vs. elite for big rewards).

Node types:

| Icon idea | Node | What happens |
|-----------|------|--------------|
| crossed spears | **Battle** | Standard turn-based fight vs a monster pack. |
| skull | **Elite** | Harder fight, named monster, better reward (relic / rare boon). |
| scroll | **Event** | A branching choice (often myth-flavoured; see §7). |
| flame altar | **Shrine** | Spend Favor for a boon, or sacrifice for a gamble. |
| amphora | **Agora (shop)** | Spend drachma on relics, heroes, healing. |
| spring | **Spring** | Rest: heal the warband, or upgrade one hero. |
| eye | **Oracle** | Glimpse the road ahead; sometimes a prophecy that grants a buff if fulfilled. |
| Titan glyph | **Boss** | End of act. A Titan or great monster. |

### 4.2 The three acts (settings)
1. **Act I — The Mortal Wilds.** Greece's monster-haunted edges: forests, coasts,
   mountain passes. Bosses: a great beast (Nemean Lion, the Calydonian Boar, the Crommyonian Sow,
   or Ladon).
2. **Act II — The Threshold.** Liminal, mythic places: Circe's isle of Aeaea, the Sirens'
   strait between Scylla and Charybdis, the cave of the Graeae, the garden of the
   Hesperides, the Sphinx's road to Thebes. Bosses: a monster-mother or guardian
   (Echidna, the Sphinx, the Lernaean Hydra, the Chimera).
3. **Act III — Beyond.** Choose a descent: **the Underworld** (rivers Styx, Acheron,
   Lethe, Phlegethon, Cocytus → Tartarus) or **the ascent of Mount Othrys** (the Titan
   stronghold). Final bosses: a Titan (Kronos, Atlas, Hyperion) or the deadliest of all,
   **Typhon**, with the Gigantes as a hidden/alternate finale.

A full clear = defeat the Act III boss. Later, unlock harder difficulties ("Wrath of the
Gods" tiers) that add a hubris/nemesis pressure and tougher rosters.

---

## 5. Combat system

Turn-based, party vs. enemy pack. Deliberately simple to read, deep to master.

- Your **warband** is 1–4 heroes, arranged in **front / back row** (front shields back;
  some attacks hit only front, some pierce, some hit the back row).
- Initiative order each round is by a **Speed** stat (the swift — Hermes-blessed heroes,
  Atalanta, the Anemoi's sons — act first).
- Each hero has: **Health**, **Power** (attack), **Speed**, a **basic attack**, and one
  **signature ability** drawn from their myth, gated by a short cooldown or by **Favor**.
- **Favor** is the shared god-currency you spend on **divine interventions** (your patron
  god's powers) and some hero signatures. You earn Favor by fighting well, at shrines, and
  via certain relics.
- **Status effects** with mythic flavour: *Petrified* (skip turns, from Medusa/Gorgons),
  *Charmed* (act for the enemy, from Sirens/Circe), *Cursed*, *Burning* (Chimera, Typhon),
  *Poisoned* (Hydra blood, Echidna), *Blessed*, *Hubris* (see §9).

### 5.1 Myth as mechanic — worked examples
These are the "knowing the story = knowing the move" hooks. A sample, not the full list:

- **Medusa / Gorgons** apply *Petrify* to whoever attacks them in melee from the front.
  *Counter (expert play):* attack with a hero who has the **Mirror** or **Ranged** tag
  (Perseus with the polished shield; any archer), or use the **Cap of Hades** relic
  (invisibility) — they petrify nothing they cannot meet your eyes with.
- **The Hydra** grows **+1 head (a new attacker) each time you damage a head without
  finishing it.** *Counter:* burst it down, or bring **fire** (Iolaus's cautery, a
  Burning effect) to stop heads regrowing.
- **The Sphinx** does not fight first — it poses a **riddle event**. Answer well and it
  yields treasure; answer poorly and it enrages. Knowing the Oedipus answer ("man") is one
  of several.
- **The Sirens** *Charm* your highest-Power hero unless you have **Orpheus** (out-sing
  them), **beeswax** (an item — Odysseus's trick: deafen your crew), or you bind a hero to
  "the mast" (a defensive stance).
- **The Graeae** share **one eye and one tooth** between three bodies — disable "the eye"
  (a single target) and all three are *Blinded* at once.
- **Talos**, the bronze automaton, is immune to normal damage but has a single **ankle
  vein (the bronze nail)** — a called-shot weakness; Medea-style guile or a precise hero
  exploits it.
- **Antaeus** (giant, son of Gaia) **heals every round while he stands** — you must apply
  *Lifted* (a throw/displace effect) to cut him from the earth, as Heracles did.
- **The Nemean Lion** has an **impenetrable hide** (damage reduction) until *Grappled* —
  its own claws are the only thing that cut it.

The point: a novice can still brute-force most of these; the expert finds the elegant kill.

---

## 6. Patron gods (run-defining choice)

At the start of a run you pledge to one deity. The patron grants a **starting boon**, a
set of **divine interventions** (Favor-powered abilities), and shapes which boons appear.
The roster deliberately spans famous and **fringe** so Samuel gets to pick the obscure
ones:

**Tier — the expected:**
- **Zeus** — lightning (high single-target burst), storm control.
- **Athena** — wisdom & defence; the Aegis shield; sees enemy intents.
- **Ares** — raw offence, frenzy, bleed.
- **Poseidon** — water/earthquake, hits whole rows.
- **Apollo** — ranged precision, healing, plague arrows.
- **Artemis** — the hunt, traps, first-strike against beasts.
- **Hades** — death magic, summon the dead, raise fallen enemies.

**Tier — the deeper cuts (the good stuff for an expert):**
- **Hecate** — goddess of witchcraft, crossroads, and ghosts. Mechanic: **at every
  branching node you may peek down *all* paths** (crossroads sight), plus curse/hex powers.
- **Nyx** — primordial Night, whom even Zeus fears. Mechanic: **darkness** that lowers
  enemy accuracy; powerful but the gods are wary of you (a risk/reward "feared" status).
- **Nemesis** — retribution. Mechanic: damage scales with the **enemy's own hubris** and
  with how badly you are losing — a comeback deity.
- **Hephaestus** — the smith. Mechanic: you can **forge and upgrade relics** at shrines;
  automatons (bronze servitors) fight for you.
- **Pan** — the wild. Mechanic: **Panic** (rout enemies), nature healing, but chaotic.
- **Hypnos** — sleep. Mechanic: put enemies to *Sleep*, skip fights, dream-boons.
- **Eris** — strife. Mechanic: the **golden apple** — turn enemies against each other.
- **Asclepius** — healing demigod-turned-god. Mechanic: superior healing, **revive a
  fallen hero once per act** (the very thing Zeus killed him for).
- **The Anemoi (the four winds — Boreas, Notos, Zephyros, Euros)** — pick a wind;
  speed/displacement powers, weather.

Locked at start; some unlock by achievement (e.g. beat the game with Athena to unlock
Nyx). This gives a meta-progression reason to keep playing.

---

## 7. Events & encounters (where the fringe lore shines)

Events are short branching-choice screens. They are the easiest place to pack in deep
mythology, and they teach without lecturing. Examples (each is a small "what do you do?"
with myth-true outcomes):

- **Xenia (guest-friendship).** A ragged stranger asks for food and shelter. *(He may be
  Zeus or Hermes in disguise — the Baucis & Philemon test.)* Generosity → a blessing;
  refusal → a curse. The expert knows strangers are often gods.
- **The pithos.** You find a sealed **jar** (not a box — Pandora's *pithos*) at a ruined
  hearth. Open it (gamble: release a swarm of ills, but **Hope** remains — a lingering
  buff) or leave it sealed.
- **Crossroads of Hecate.** Three roads, three offerings. Leave the right offering (a
  deep-cut: a dog, honey, a key) for a boon.
- **Tiresias / the blind seer.** Trade something (sight, a relic, health) for true
  prophecy about the act boss's weakness.
- **The Lotus-Eaters.** Eat and heal fully but **forget** (lose a relic), or abstain.
- **Circe's feast.** Risk being turned to swine (a debuff) unless you carry **moly** (the
  herb Hermes gave Odysseus) — reward if you resist.
- **Phineus and the Harpies.** Drive off the Harpies fouling a blind king's food; he
  repays you with the route through the **Symplegades** (clashing rocks) — a safe-passage
  buff.
- **The golden apples of the Hesperides**, guarded by **Ladon** and the nymphs — steal,
  trade, or ask Atlas to fetch them (and risk the "hold up the sky" trick).
- **The teeth of the dragon (Spartoi).** Sow dragon's teeth (Cadmus / Jason) — they sprout
  armed warriors who fight *you*, unless you "throw a stone among them" so they kill each
  other.
- **The ferryman.** Charon at the Styx wants his **obol** (coin). No coin → a hard
  alternate route. (Set up earlier: keep a coin from a battle.)
- **The Moirai.** The three Fates (Clotho spins, Lachesis measures, Atropos cuts) offer to
  re-thread your run: reroll your current map at the cost of a permanent thread of fate.

---

## 8. Heroes (recruitable warband members)

You start with one hero (a few unlockable starters) and recruit more on the road. Each has
a signature drawn from myth. Mix of famous and fringe:

**Famous:** Heracles (raw strength, the labours as abilities), Perseus (Mirror tag,
Medusa-counter, Talaria/Cap of Hades synergy), Theseus (the Labyrinth: bonus vs
maze/beast), Achilles (huge Power but a **Heel** — one fixed vulnerability), Odysseus
(guile: tricks, the beeswax/mast/moly toolkit), Atalanta (Speed, first-strike, never
caught).

**Fringe (expert delight):**
- **Bellerophon** + **Pegasus** — flight (hits back row, dodges ground attacks); a hubris
  arc (gets stronger but risks a fall if hubris peaks).
- **Iolaus** — Heracles's nephew; **fire-cautery** that hard-counters the Hydra.
- **Orpheus** — the lyre: charm/soothe enemies, the only hard counter to the Sirens; can
  attempt to "bring back" a fallen hero once (Eurydice rules: don't look back / a tension
  mechanic).
- **Cadmus** — the Spartoi: summons sown-warrior allies.
- **Meleager** — the Calydonian boar-slayer; tied to a **burning brand** (his life is the
  log: high power, a fated fragility).
- **Atalanta** — see above; also the golden-apple footrace as an event tie-in.
- **The Dioscuri (Castor & Pollux)** — twins who fight as a pair; if one falls the other
  rages.
- **Lynceus** — the Argonaut with supernatural sight; reveals hidden enemy weaknesses.
- **Medea** — sorceress; powerful curses and the Talos-counter, but morally costly choices.
- **Phaethon, Tiresias, Daedalus** — as event-bound specialists / hireable utility.

Heroes can fall permanently in a run (roguelike stakes), which makes recruiting and
protecting them a real decision.

---

## 9. Relics & the hubris system

### 9.1 Relics (passive items, myth-true)
- **Talaria** (winged sandals) — +Speed, evasion.
- **Cap / Helm of Hades** — invisibility: skip the first enemy turn / counter gaze attacks.
- **Aegis** — Athena/Zeus's shield: party-wide defence, *Fear* on enemies.
- **Harpe** — the adamantine sickle that beheaded Medusa; bonus vs petrify-users.
- **Golden Fleece** — heal-over-time aura.
- **Lyre of Orpheus** — charm support even without Orpheus.
- **Ariadne's thread** — never get lost: see and freely re-route the map.
- **Cornucopia** — steady drachma/Favor income.
- **Pandora's jar (emptied)** — carries **Hope**: one free revive from a wipe.
- **Adamantine sickle of Kronos**, **Girdle of Hippolyta**, **Necklace of Harmonia**
  (cursed — strong but a catch), **moly**, **beeswax**, **the obol** (consumables).

### 9.2 Hubris & Nemesis (the signature tension mechanic)
Greek tragedy runs on **hubris** — mortals who overreach are struck down. Gods' Gambit
models it: certain greedy actions (refusing the gods, hoarding, boasting choices, stacking
power too fast) raise a hidden **Hubris** meter. High hubris = stronger short-term effects
**but** invites **Nemesis**: tougher elites, divine penalties, a possible "fall"
(Bellerophon, Icarus, Phaethon, Niobe themes). Playing humble (honouring xenia, leaving
offerings, sparing foes) keeps Nemesis at bay. This is pure Greek-myth logic turned into a
risk dial — and exactly the kind of thing an expert will *feel* is right.

---

## 10. Meta-progression (between runs)

- **Unlocks:** new patron gods, new starting heroes, new relics, and new event/enemy pools
  unlock as you hit milestones (clears, specific kills, "knowledge" achievements like
  "answer the Sphinx 5 different correct ways").
- **Codex / Bestiary:** every god, hero, monster, relic, and event the player encounters is
  logged with a short, accurate myth blurb and its mechanic. This is the one place lore is
  explicit — and it doubles as a reward Samuel will want to complete 100%. Aim for genuine
  accuracy (the kind a young expert will fact-check).
- **Difficulty tiers** ("Trials of the Gods" 1–5+) for replay depth.

No microtransactions, no online, nothing to buy. Purely a local unlock ledger in
`localStorage`.

---

## 11. Art & audio

All assets generated via the personal **image-gen** plugin (`mcp__image-gen__generate_image`
/ `generate_image_batch`), saved locally under `games/gods-gambit/images/` and pushed with
the HTML.

### 11.1 Art direction
- **Style:** flat, bold, modern vector-illustration with a **Greek black/red-figure
  pottery** influence — limited palette (terracotta, black, bone-white, deep wine, gold
  leaf accents), clean shapes, no photo-realism, no busy 3D. Reads well small (cards/nodes)
  and scales to portraits.
- **Consistency:** one fixed style prompt suffix reused across every asset so the set looks
  cohesive (same approach as the school-icon `ICON_STYLE.md` discipline).
- **Asset classes:**
  - **God / hero / monster portraits** (square, ~512–1024) — for the codex, cards, combat.
  - **Node icons** (small, simple, single-color-on-parchment) — battle/event/shop/etc.
  - **Relic icons** — small flat objects.
  - **Backgrounds** — one per act/biome (wilds, threshold, underworld, Othrys), wide.
  - **Title art** — one hero key image.
- **Style guide doc:** create `games/gods-gambit/ART_STYLE.md` (mirroring `ICON_STYLE.md`)
  before mass-generating, with the locked prompt suffix and palette.

### 11.2 Audio (stretch / optional)
- Light, royalty-free or generated ambience + simple SFX (lyre pluck, thunder, sword).
  v1 can ship silent or with minimal SFX. Not a blocker.

---

## 12. Technical design

- **Single self-contained `index.html`** in `games/gods-gambit/`, plus an `images/`
  subfolder. Vanilla HTML/CSS/JS — no build step, no framework needed (optionally a tiny
  bit of Canvas for combat; DOM is fine for v1). Matches the existing `games/` pattern.
- **Save:** `localStorage` for meta-progression (unlocks, codex, settings) and for an
  in-progress run (so a run survives a refresh). One "abandon run" button.
- **Content as data:** gods, heroes, monsters, relics, events live in a **JSON-ish data
  table at the top of the script**, so adding a fringe character later is a data edit, not
  a code change. This is the key to letting the roster grow over time.
- **RNG with seed:** seeded random so a run *could* be shared/retried (nice-to-have;
  "share your seed").
- **Responsive:** must work on a laptop browser primarily; tablet-friendly layout a plus.
  Designed for mouse/touch clicks (turn-based, no fast input).
- **Offline-first:** all assets local; works from the GitHub Pages URL with no network
  after load.
- **No backend, no accounts, no tracking.**

---

## 13. Screens / UI

1. **Title** — key art, "Begin a run", "Codex", "Settings". Shows meta-unlocks.
2. **Patron select** — choose god (with its boon + intervention summary).
3. **Warband / loadout** — starting hero(es), starting relic.
4. **Map** — the branching climb; current node highlighted, paths selectable.
5. **Battle** — front/back rows, turn order track, ability bar, Favor & status readouts.
6. **Event** — illustration + prose + 2–4 choices with foreshadowed outcomes.
7. **Shrine / Agora / Spring** — simple transaction panels.
8. **Reward** — post-battle pick (relic / hero / boon / drachma).
9. **Boss intro & defeat/victory** screens.
10. **Codex / Bestiary** — browsable, the lore home.
11. **Run summary** — what killed you, how far you got, unlocks earned.

---

## 14. Scope

### 14.1 MVP (v1 — the first playable, finishable build)
- 1 full act (the Mortal Wilds) with a branching map and one boss.
- 3 patron gods (1 famous, 1 mid, 1 fringe — e.g. Ares, Apollo, **Hecate**).
- 4 starting/recruitable heroes (Heracles, Atalanta, Perseus, **Iolaus**).
- ~10 monsters incl. 2–3 with a real myth-mechanic (Medusa/petrify, Hydra/regrow,
  Nemean Lion/hide).
- ~6 events (xenia, the pithos, crossroads, lotus-eaters, the Sphinx riddle, the obol).
- ~8 relics.
- Turn-based combat with front/back rows, Favor, and 4–5 status effects.
- Hubris/Nemesis as a simple hidden meter with one visible consequence.
- localStorage save of an in-progress run + a basic codex.
- Generated art for everything in v1 (portraits + node icons + 1 background + title).

### 14.2 v2+
- Acts II & III, the Underworld/Othrys fork, Titan + Typhon bosses.
- Full god/hero/monster rosters incl. the deep-cut lists in the appendix.
- Difficulty tiers, more meta-unlocks, seed sharing.
- Audio.
- "Endless" or daily-seed mode.

### 14.3 Explicit non-goals
- No multiplayer / online / accounts.
- No real-time/twitch combat.
- No monetisation.
- Not a faithful base-builder (that was the *other* concept) — this is run-based.

---

## 15. Success criteria

- Samuel plays it more than once unprompted, and **finds at least one deep-cut he didn't
  expect to see in a game.**
- A first-timer (Adam, or a friend) can win a run without knowing the myths — but loses to
  things the expert would have seen coming.
- A full run fits in ~20–40 minutes.
- Ships as one HTML file + images, pushed to the repo, live on GitHub Pages.

---

## 16. Open questions

1. **Language:** Swedish or English for UI and codex? (Samuel/Adam read both; codex lore is
   easier to keep myth-accurate in English, but Swedish fits the school site.)
2. **Combat depth:** front/back rows + abilities as specced, or go even simpler for v1
   (single line, no rows) and add depth later?
3. **Art scale:** how many portraits is reasonable for the image-gen budget in v1? (Rough:
   ~3 gods + 4 heroes + 10 monsters + 8 relics + 6 node icons + 1 bg + title ≈ 30–35 images.)
4. **Tone:** keep it kid-bright and heroic, or lean into the darker tragic register the
   myths actually have (the hubris/Nemesis theme invites some darkness)?
5. **Where it lives:** its own folder `games/gods-gambit/` and a card on the school landing
   page under the green `.spel` section — correct?

---

## Appendix A — Fringe content bank (for an expert audience)

Not all v1; this is the pool the game can draw from so Samuel keeps meeting things he knows
(and a few he has to look up).

**Primordials & Titans:** Nyx, Erebus, Chaos, Gaia, Uranus, Pontus, Tartarus; Kronos,
Rhea, Hyperion, Theia, Coeus, Phoebe, Oceanus, Tethys, Iapetus, Crius, Mnemosyne, Themis,
Atlas, Prometheus, Epimetheus, Menoetius, Helios, Selene, Eos, Leto, Asteria, Perses.

**Lesser/fringe deities & spirits:** Hecate, Nemesis, Eris, Hypnos, Thanatos, the Keres,
the Moirai (Clotho, Lachesis, Atropos), the Erinyes/Furies (Alecto, Megaera, Tisiphone),
Iris, the Anemoi (Boreas, Notos, Zephyros, Euros), Pan, Priapus, the Horae, the Charites,
the Hesperides, the Oceanids/Nereids, Phobos & Deimos, Eros, Anteros, Hebe, Eileithyia,
Triton, Proteus, Glaucus, Phorcys, Ceto, Achelous.

**Monsters — beyond the famous five:** Echidna (mother of monsters), Typhon (father of
monsters), Campe (Tartarus's keeper), Ladon (hundred-headed apple-dragon), the Colchian
dragon, Python, Cetus, Scylla & Charybdis, the Graeae, the Telchines, the Gegenees
(six-armed giants), Geryon & Orthrus, the Caucasian Eagle, Argus Panoptes, Talos, the
Stymphalian birds, the Lernaean Hydra, the Chimera, the Sphinx, Empusa, Lamia, Mormo, the
Crommyonian Sow, the Teumessian fox (uncatchable), the Catoblepas, the Cyclopes
(Brontes/Steropes/Arges vs. the wild Polyphemus), the Hekatoncheires (Briareus, Cottus,
Gyges).

**Heroes & mortals:** Bellerophon, Atalanta, Meleager, Cadmus, Orpheus, Iolaus, the
Dioscuri, Lynceus, Zetes & Calais, Peleus, Telamon, Amphiaraus, Phineus, Tiresias,
Daedalus, Medea, Jason, Perseus, Theseus, Heracles, Achilles, Odysseus, Bellerophon,
Oedipus, Hippolyta, Pelops, Tantalus, Sisyphus, Niobe, Arachne, Marsyas (cautionary
hubris tales for the Nemesis system).

**Places & rivers:** Olympus, Othrys, Tartarus; the five rivers (Styx, Acheron, Lethe,
Phlegethon, Cocytus); Aeaea, Ogygia, the Hesperides' garden, Delphi, Dodona, the Labyrinth,
Colchis, the Symplegades, the Lotus-Eaters' shore.

**Deep-cut "gotchas" to bake into mechanics (rewards for the expert):**
- Pandora's container is a **pithos (jar)**, not a box.
- The Graeae share **one eye and one tooth**.
- Talos's weakness is the **single nail/vein at his ankle**.
- Antaeus is invincible **only while touching the earth** (his mother Gaia).
- Achilles' heel; the **Teumessian fox** is destined never to be caught (paired with
  Laelaps, the dog destined always to catch — a paradox encounter).
- Sirens are defeated by **wax + the mast** or by **out-singing** them (Orpheus).
- The Sphinx's riddle answer is **"man"** — but reward alternate correct lateral answers.
- **Charon needs the obol**; **Cerberus can be soothed by music or honey-cakes**.
