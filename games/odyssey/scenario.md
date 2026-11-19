# Odyssey: The Return — Game Design Document

## Overview

**Title:** Odyssey: The Return
**Genre:** Sierra-style point-and-click adventure
**Target playtime:** ~60 minutes (first playthrough)
**Platform:** Browser (plain HTML/CSS/JS, no backend)

---

## Tone

Mythic, grim, sea-worn. Odysseus is clever, exhausted, and relentless. Penelope is sharp, patient, and equal to him. The language is compact and dramatic. No comedy or parody.

---

## Structure

Eight scenes following the "greatest trials" structure of The Odyssey, compressed for adventure-game pacing. Each scene has one primary puzzle chain of 4–7 steps, clear objectives, and no dead ends.

---

## Scene 1 — Ogygia: The Shore of Years

**Background:** `scene-01-ogygia.png`
**Setting:** Rocky shore. A half-finished raft. Calypso stands apart watching the sea.

**Objective:** Build a seaworthy raft and earn Calypso's blessing to leave.

**Puzzle chain:**
1. LOOK at tool chest → discover bronze knife inside
2. TAKE bronze knife from chest
3. USE bronze knife on canvas cloth → cut sail
4. TAKE rope coil from shore
5. TALK to Calypso → she gives seal of departure
6. USE cut sail on raft → sail attached
7. USE rope coil on rigged raft → fully rigged
8. USE seal of departure on completed raft → depart

**Items acquired:** Bronze Knife (carried forward), Cut Sail, Rope Coil, Seal of Departure
**Items consumed this scene:** Cut Sail, Rope Coil, Seal of Departure

**Hotspots:** Tool Chest, Canvas, Rope Coil, Calypso, Raft

---

## Scene 2 — Cyclops Cave: The Dark Beneath the Mountain

**Background:** `scene-02-cyclops-cave.png`
**Setting:** A vast cave. The Cyclops sleeps fitfully. A fire burns low.

**Objective:** Blind the Cyclops and escape.

**Puzzle chain:**
1. TAKE wine skin from cave floor
2. TAKE olive shaft (spare spear shaft) from corner
3. USE olive shaft in fire pit → hardened stake
4. USE wine skin on Cyclops → he drinks and sleeps
5. USE hardened stake on sleeping Cyclops → blinded; cyclops ring falls
6. TAKE cyclops eye ring from ground
7. OPEN or PUSH cave entrance (Cyclops is blind and helpless) → escape → next scene

**Items acquired:** Wine Skin, Spare Spear Shaft → Hardened Stake, Cyclops Eye Ring
**Items consumed:** Wine Skin, Hardened Stake
**Items carried forward:** Bronze Knife, Cyclops Eye Ring

**Hotspots:** Wine Skin, Olive Shaft, Fire Pit, Cyclops, Cave Entrance

---

## Scene 3 — Circe's Hall: The Witch's Bargain

**Background:** `scene-03-circe-hall.png`
**Setting:** A marble hall. Circe at the centre. A cauldron steams. Through a garden window, herbs grow.

**Objective:** Resist Circe's magic and extract her sworn oath.

**Puzzle chain:**
1. LOOK at garden window → discover moly herb
2. TAKE moly herb
3. USE moly herb at cauldron/on self → eaten; you are protected
4. TALK to Circe (she tries to transform you; it fails)
5. PUSH/confront Circe → she is startled
6. TALK to Circe again → demand oath
7. She produces witch's oath → received
8. WALK to exit door → unlocked → next scene

**Items acquired:** Moly Herb → eaten, Witch's Oath
**Items consumed:** Moly Herb
**Items carried forward:** Bronze Knife, Cyclops Eye Ring, Witch's Oath

**Hotspots:** Garden Window, Cauldron/Eating Area, Circe, Exit Door

---

## Scene 4 — Sirens Strait: The Song That Kills

**Background:** `scene-04-sirens-strait.png`
**Setting:** The ship's deck. Rocks ahead. Distant figures on the rocks.

**Objective:** Pass the Sirens safely — crew protected, yourself bound and able to hear the prophecy.

**Puzzle chain:**
1. TAKE beeswax jar from deck
2. TAKE ship rope (rope coil) from deck
3. USE beeswax jar on crew → their ears sealed; beeswax consumed
4. USE rope coil on ship mast → bind yourself
5. LOOK at sirens (while bound) → receive siren prophecy
6. WALK to horizon/forward → next scene

**Items acquired:** Beeswax Jar, Rope Coil (ship's rope), Siren Prophecy
**Items consumed:** Beeswax Jar, Rope Coil
**Items carried forward:** Bronze Knife, Cyclops Eye Ring, Witch's Oath, Siren Prophecy

**Hotspots:** Beeswax Jar, Ship Rope, Crew Members, Mast, Sirens/Rocks, Horizon

---

## Scene 5 — Scylla and Charybdis: The Narrows

**Background:** `scene-05-scylla-charybdis.png`
**Setting:** Ship deck. The tiller hangs broken. Scylla looms port. Charybdis churns starboard.

**Objective:** Repair the tiller and navigate through before the ship is destroyed.

**Puzzle chain:**
1. LOOK at tiller → broken pin; TAKE broken tiller pin
2. TAKE spare spear shaft from storage hold
3. USE bronze knife on spare spear shaft → carved helm pin (rough)
4. USE bronze knife on carved helm pin → helmsman's pin (finished)
5. USE helmsman's pin on tiller → tiller repaired
6. TALK to helmsman → he takes the helm and navigates
7. WALK forward → next scene

**Items acquired:** Broken Tiller Pin, Spare Spear Shaft → Carved Helm Pin → Helmsman's Pin
**Items consumed:** Spare Spear Shaft, Carved Helm Pin, Helmsman's Pin
**Items carried forward:** Bronze Knife, Cyclops Eye Ring, Witch's Oath, Siren Prophecy, Broken Tiller Pin (trophy)

**Hotspots:** Tiller, Storage Hold, Helmsman, Scylla (danger, descriptive), Charybdis (danger, descriptive), Forward Passage

---

## Scene 6 — Ithaca: The Hidden Shore

**Background:** `scene-06-ithaca-shore.png`
**Setting:** A rocky cove. Ithaca's palace visible on the hill. Athena's mist nearby.

**Objective:** Arrive in disguise and recover your bow before entering the palace.

**Puzzle chain:**
1. LOOK at shore bundle → beggar's cloak
2. TAKE beggar's cloak
3. LOOK at thicket → bow hidden there
4. PUSH thicket to reveal bow
5. TAKE bow of Odysseus
6. USE beggar's cloak on yourself (self-hotspot) → disguise applied
7. WALK to palace path → next scene

**Items acquired:** Beggar's Cloak, Bow of Odysseus
**Items carried forward:** All previous, plus Beggar's Cloak (worn), Bow of Odysseus

**Hotspots:** Shore Bundle, Thicket, Yourself/Odysseus, Palace View, Path Forward

---

## Scene 7 — The Great Hall: Blood and Silence

**Background:** `scene-07-great-hall.png`
**Setting:** Ithaca's feast hall. Suitors everywhere. Penelope on a chair at the far end. A contest pillar.

**Objective:** Win the bow contest, reveal yourself, and clear the hall.

**Puzzle chain:**
1. LOOK at hall pillar nook → hidden stone; OPEN nook → king's seal
2. TAKE king's seal
3. LOOK at bow contest target
4. USE bow of Odysseus on contest target → you string and shoot; hall goes silent; bow consumed/set down
5. TALK to Penelope → she watches but is not certain
6. USE king's seal on Penelope → she sees the seal; scene concludes violently (narrated); suitors fall
7. WALK to inner chamber → next scene

**Items acquired:** King's Seal
**Items consumed:** Bow of Odysseus (set aside after contest), King's Seal
**Items carried forward:** Bronze Knife (symbolic), Cyclops Eye Ring, Witch's Oath, Siren Prophecy

**Hotspots:** Hall Nook, Contest Target/Pillar, Suitors, Penelope, Inner Chamber Door

---

## Scene 8 — Olive Root Bed: The Only Proof

**Background:** `scene-08-olive-root-bed.png`
**Setting:** The royal bedchamber. Penelope stands near the great bed, arms folded. A window shows the olive tree outside.

**Objective:** Prove you are truly Odysseus by revealing the secret of the bed.

**Puzzle chain:**
1. TALK to Penelope → she says: "Move the bed to the outer chamber."
2. LOOK at the bed → you notice the olive-root post; you remember
3. LOOK at the olive tree through the window → confirmation of the secret
4. TALK to Penelope again → you reveal: the bed cannot be moved; it is rooted in the living olive tree; you built it so yourself twenty years ago
5. Penelope breaks → reunion; VICTORY

**No items needed — the puzzle is memory and speech.**

**Hotspots:** Penelope, The Bed, Olive Tree Window

---

## Hint System — Athena

At any time the player can click **Ask Athena** to open the hint panel. Athena's portrait (`portrait-athena-hint.png`) appears alongside three escalating hints for the current scene:

- **Hint 1 (Cryptic):** A poetic nudge toward the next step
- **Hint 2 (Specific):** Names objects or actions without spelling out the exact combination
- **Hint 3 (Direct):** Exact next action to take

No penalty for using hints.

---

## Items Summary

| Item | Scene Found | Scene Used | Carries Forward |
|------|-------------|------------|-----------------|
| Bronze Knife | 1 | 5 (crafting) | Yes — to end |
| Cut Sail | 1 | 1 | No |
| Rope Coil | 1 | 1 | No |
| Seal of Departure | 1 | 1 | No |
| Wine Skin | 2 | 2 | No |
| Spare Spear Shaft | 2, 5 | 2, 5 | No |
| Hardened Stake | 2 | 2 | No |
| Cyclops Eye Ring | 2 | Trophy | Yes |
| Moly Herb | 3 | 3 | No |
| Witch's Oath | 3 | Trophy | Yes |
| Beeswax Jar | 4 | 4 | No |
| Rope Coil (ship) | 4 | 4 | No |
| Siren Prophecy | 4 | Trophy | Yes |
| Broken Tiller Pin | 5 | Trophy | Yes |
| Carved Helm Pin | 5 | 5 | No |
| Helmsman's Pin | 5 | 5 | No |
| Beggar's Cloak | 6 | 6 | Yes (worn) |
| Bow of Odysseus | 6 | 7 | No |
| King's Seal | 7 | 7 | No |

---

## Verb Set

- **Walk** — move to exits, advance scene
- **Look** — examine hotspots and inventory items
- **Talk** — speak to characters
- **Take** — pick up items
- **Use** — use an item (on hotspot or self)
- **Open** — open containers, doors, objects
- **Push** — move, force, confront

---

## Save System

Progress is saved automatically to `localStorage` after every meaningful action. On load, the player can choose Continue or New Game.

---

## Victory

After the bed secret is revealed, a victory screen plays with the scene-08 image and a narrative ending text. Restart is offered.
