'use strict';

// ─── GAME ENGINE ─────────────────────────────────────────────────────────────
// Manages all game state: scene, inventory, puzzle flags, verb/item selection.
// Emits events for the renderer to react to.

const GameEngine = (() => {

  const SAVE_KEY = 'odyssey_save_v1';

  // ── State ─────────────────────────────────────────────────────────────────
  let state = {
    currentSceneId: 'ogygia',
    inventory: [],          // array of item IDs
    sceneStates: {},        // { sceneId: { flag: value, ... } }
    currentVerb: 'look',
    selectedItem: null,     // item ID selected for USE
    hintLevels: {},         // { sceneId: 0|1|2|3 } — 0 = not used
    gameWon: false
  };

  // ── Event bus ─────────────────────────────────────────────────────────────
  const listeners = {};
  function on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
  }
  function emit(event, data) {
    (listeners[event] || []).forEach(fn => fn(data));
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function getScene(id) { return SCENES_MAP[id || state.currentSceneId]; }

  function getSceneState(sceneId) {
    const scene = SCENES_MAP[sceneId || state.currentSceneId];
    if (!state.sceneStates[scene.id]) {
      state.sceneStates[scene.id] = Object.assign({}, scene.defaultState);
    }
    return state.sceneStates[scene.id];
  }

  function hasItem(id) { return state.inventory.includes(id); }

  function addItem(id) {
    if (!state.inventory.includes(id)) {
      state.inventory.push(id);
      emit('inventoryChanged', { inventory: state.inventory });
    }
  }

  function removeItem(id) {
    const idx = state.inventory.indexOf(id);
    if (idx !== -1) {
      state.inventory.splice(idx, 1);
      emit('inventoryChanged', { inventory: state.inventory });
    }
    if (state.selectedItem === id) {
      state.selectedItem = null;
      emit('verbChanged', { verb: state.currentVerb, selectedItem: null });
    }
  }

  // ── Action resolution ─────────────────────────────────────────────────────
  // Finds the first action in a hotspot's action list that matches:
  // verb, optional requiresItem, optional condition.
  function findAction(hotspot, verb, selectedItem, sceneStateObj) {
    for (const action of hotspot.actions) {
      if (!action.verbs.includes(verb)) continue;
      // If action requires a specific item, check it
      if (action.requiresItem !== undefined) {
        if (action.requiresItem !== selectedItem) continue;
      }
      // If action has a condition, evaluate it
      if (action.condition && !action.condition(sceneStateObj)) continue;
      return action;
    }
    return null;
  }

  // Default feedback when no action matches
  function defaultText(verb, hotspotLabel, selectedItem) {
    const itemName = selectedItem && ITEMS[selectedItem] ? ITEMS[selectedItem].name : null;
    switch (verb) {
      case 'look':  return `You see nothing more to note about the ${hotspotLabel}.`;
      case 'take':  return `You cannot take the ${hotspotLabel}.`;
      case 'talk':  return `There is nobody here to talk to.`;
      case 'use':
        if (itemName) return `Using the ${itemName} on the ${hotspotLabel} achieves nothing.`;
        return `That does nothing here.`;
      case 'open':  return `The ${hotspotLabel} will not open.`;
      case 'push':  return `The ${hotspotLabel} does not budge.`;
      case 'walk':  return `You cannot go that way.`;
      default:      return `Nothing happens.`;
    }
  }

  // ── Core: interact with a hotspot ─────────────────────────────────────────
  function interact(hotspotId) {
    const scene = getScene();
    const hotspot = scene.hotspots.find(h => h.id === hotspotId);
    if (!hotspot) return;

    const sceneStateObj = getSceneState();
    const verb = state.currentVerb;
    const selectedItem = state.selectedItem;

    const action = findAction(hotspot, verb, selectedItem, sceneStateObj);

    if (!action) {
      emit('message', { text: defaultText(verb, hotspot.label, selectedItem) });
      return;
    }

    // Show action text
    if (action.text) {
      emit('message', { text: action.text });
    }

    // Apply results
    const result = action.result || {};

    if (result.setState) {
      Object.assign(sceneStateObj, result.setState);
    }
    if (result.addItem) {
      addItem(result.addItem);
    }
    if (result.removeItem) {
      removeItem(result.removeItem);
    }

    // Auto-save after every meaningful action
    save();

    // Deselect item after use
    if (selectedItem && verb === 'use') {
      state.selectedItem = null;
      emit('verbChanged', { verb: state.currentVerb, selectedItem: null });
    }

    // Trigger scene transition after a short delay
    if (result.nextScene) {
      setTimeout(() => goToScene(result.nextScene), 1800);
    }

    // Trigger win
    if (result.gameWin || action.result?.gameWin) {
      state.gameWon = true;
      save();
      setTimeout(() => emit('gameWon', {}), 2800);
    }
  }

  // ── Interact with inventory item ──────────────────────────────────────────
  function interactInventory(itemId) {
    const verb = state.currentVerb;

    if (verb === 'look') {
      const item = ITEMS[itemId];
      if (item) emit('message', { text: `${item.name}: ${item.desc}` });
      return;
    }

    if (verb === 'use') {
      if (state.selectedItem === itemId) {
        // Clicking selected item again → deselect
        state.selectedItem = null;
        emit('verbChanged', { verb: state.currentVerb, selectedItem: null });
      } else {
        // Select this item for use on a hotspot
        state.selectedItem = itemId;
        emit('verbChanged', { verb: state.currentVerb, selectedItem: itemId });
        const item = ITEMS[itemId];
        emit('message', { text: `Use the ${item.name} on...` });
      }
      return;
    }

    if (verb === 'take') {
      emit('message', { text: `You already have it.` });
      return;
    }

    emit('message', { text: defaultText(verb, ITEMS[itemId]?.name || itemId, null) });
  }

  // ── Verb selection ────────────────────────────────────────────────────────
  function selectVerb(verb) {
    state.currentVerb = verb;
    // Changing verb clears item selection (unless selecting Use)
    if (verb !== 'use') state.selectedItem = null;
    emit('verbChanged', { verb, selectedItem: state.selectedItem });
  }

  // ── Scene navigation ──────────────────────────────────────────────────────
  function goToScene(sceneId) {
    state.currentSceneId = sceneId;
    state.selectedItem = null;
    state.currentVerb = 'look';
    const scene = getScene(sceneId);
    // Initialise scene state if first visit
    getSceneState(sceneId);
    save();
    emit('sceneChanged', { scene });
  }

  // ── Hints ─────────────────────────────────────────────────────────────────
  function getHint(level) {
    // level: 0, 1, 2 (cryptic, specific, direct)
    const scene = getScene();
    if (!scene.hints || scene.hints.length === 0) {
      return "Athena shrugs — even she does not always know the way.";
    }
    const idx = Math.min(level, scene.hints.length - 1);
    // Track highest hint used
    const prev = state.hintLevels[scene.id] || 0;
    state.hintLevels[scene.id] = Math.max(prev, level + 1);
    save();
    return scene.hints[idx];
  }

  // ── Save / Load ───────────────────────────────────────────────────────────
  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) { /* storage unavailable */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        // Validate minimal shape
        if (saved && saved.currentSceneId && SCENES_MAP[saved.currentSceneId]) {
          state = saved;
          return true;
        }
      }
    } catch (e) { /* corrupt save */ }
    return false;
  }

  function hasSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const saved = JSON.parse(raw);
      return !!(saved && saved.currentSceneId);
    } catch (e) { return false; }
  }

  function newGame() {
    state = {
      currentSceneId: 'ogygia',
      inventory: [],
      sceneStates: {},
      currentVerb: 'look',
      selectedItem: null,
      hintLevels: {},
      gameWon: false
    };
    save();
    const scene = getScene('ogygia');
    getSceneState('ogygia');
    emit('sceneChanged', { scene });
  }

  function continueGame() {
    if (load()) {
      if (state.gameWon) {
        emit('gameWon', {});
        return;
      }
      const scene = getScene();
      emit('sceneChanged', { scene });
    } else {
      newGame();
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────
  return {
    on, emit,
    interact, interactInventory,
    selectVerb,
    goToScene, newGame, continueGame,
    getHint, hasSave,
    getState: () => state,
    getScene,
    getSceneState,
    hasItem
  };

})();
