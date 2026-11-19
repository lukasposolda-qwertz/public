# Odyssey: The Return

A Sierra-style point-and-click adventure game following Odysseus through eight trials on his journey home to Ithaca.

## How to Run

**Option A — Open directly (recommended for most browsers):**
Open `index.html` in any modern browser. Firefox and Safari work directly from the filesystem. Chrome may require a local server due to its stricter file:// policies.

**Option B — Local static server (Chrome / any browser):**
```bash
# Python 3
cd games/odyssey
python -m http.server 8080
# Then open: http://localhost:8080
```
```bash
# Node (npx)
cd games/odyssey
npx serve .
```

## How to Play

### Controls
- **Click a verb** (Walk / Look / Talk / Take / Use / Open / Push) to select it
- **Click a hotspot** on the scene to act on it
- **USE + item:** Click Use → click an item in your inventory to select it → click a scene hotspot to use it there
- **LOOK + inventory item:** Click Look → click any item in inventory to examine it
- The **status line** always shows your current action

### Hint System
Click **Ask Athena** at any time to open the hint panel:
- **A Sign** — cryptic poetic nudge
- **Guidance** — more specific direction
- **Direction** — direct actionable steps

No penalty for using hints. You can never get permanently stuck.

### Progress
The game saves automatically to browser `localStorage` after every action. On the title screen, **Continue** resumes your last session. **New Game** starts fresh (clears the save).

## Scenes (in order)

1. **Ogygia** — Build a raft and earn Calypso's blessing
2. **Cyclops Cave** — Blind Polyphemus and escape
3. **Circe's Hall** — Resist witchcraft and extract an oath
4. **Sirens Strait** — Protect the crew and survive the song
5. **Scylla & Charybdis** — Repair the tiller and navigate the narrows
6. **Ithaca Shore** — Arrive in disguise, recover your bow
7. **The Great Hall** — Win the contest, reveal yourself, reclaim the hall
8. **Olive Root Bed** — Prove your identity to Penelope with the only proof that matters

## Files

```
games/odyssey/
├── index.html          ← entry point
├── scenario.md         ← full game design document
├── css/
│   └── style.css
├── js/
│   ├── game-data.js    ← all scenes, items, puzzles, hints
│   ├── game-engine.js  ← state machine, save/load
│   └── render.js       ← UI rendering, event wiring
└── assets/
    └── images/         ← all art assets (29 files)
```

## All Images Present

All 29 expected image files were found in `assets/images/` — including all optional items (`item-beggar-cloak.png`, `item-bow-of-odysseus.png`, `item-kings-seal.png`, etc.). No fallbacks were needed.
