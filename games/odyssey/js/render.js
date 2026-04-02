'use strict';

// ─── RENDERER ────────────────────────────────────────────────────────────────
// All DOM manipulation. Subscribes to GameEngine events.

const Renderer = (() => {

  const IMG_BASE = 'assets/images/';
  const MAX_LOG = 8;
  let logLines = [];
  let currentScene = null;

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const $ = id => document.getElementById(id);

  // ── Image helpers ─────────────────────────────────────────────────────────
  function imgSrc(filename) { return IMG_BASE + filename; }

  function safeImg(el, filename, fallbackAlt) {
    el.onerror = () => {
      el.style.display = 'none';
      if (fallbackAlt && el.parentElement) {
        const existing = el.parentElement.querySelector('.img-fallback');
        if (!existing) {
          const fb = document.createElement('span');
          fb.className = 'img-fallback';
          fb.textContent = fallbackAlt;
          el.parentElement.appendChild(fb);
        }
      }
    };
    el.src = imgSrc(filename);
  }

  // ── Hotspot layer: position it to exactly cover the rendered image ─────────
  // The image uses object-fit:contain inside its container, so there may be
  // letterbox/pillarbox padding. We compute the actual rendered image rectangle
  // and size the hotspot layer to match it exactly.
  function repositionHotspotLayer() {
    const img = $('scene-image');
    const container = $('image-container');
    const layer = $('hotspot-layer');
    if (!img || !container || !layer) return;

    const cW = container.clientWidth;
    const cH = container.clientHeight;
    const natW = img.naturalWidth  || cW;
    const natH = img.naturalHeight || cH;

    // Padding from CSS (#image-container has padding: 6px)
    const pad = 6;
    const availW = cW - pad * 2;
    const availH = cH - pad * 2;

    // Scale to contain
    const scale = Math.min(availW / natW, availH / natH);
    const rendW = natW * scale;
    const rendH = natH * scale;

    // Centre within container (including padding offset)
    const offX = pad + (availW - rendW) / 2;
    const offY = pad + (availH - rendH) / 2;

    layer.style.left   = offX + 'px';
    layer.style.top    = offY + 'px';
    layer.style.width  = rendW + 'px';
    layer.style.height = rendH + 'px';
  }

  // ── Title screen ──────────────────────────────────────────────────────────
  function showTitleScreen() {
    $('title-screen').style.display = 'flex';
    $('game-screen').style.display  = 'none';
    $('victory-screen').style.display = 'none';

    const titleImg = $('title-img');
    safeImg(titleImg, 'title-odyssey.png', 'ODYSSEY');

    $('btn-continue').style.display = GameEngine.hasSave() ? 'block' : 'none';
  }

  // ── Full scene render ─────────────────────────────────────────────────────
  function renderScene(scene) {
    currentScene = scene;

    $('title-screen').style.display    = 'none';
    $('victory-screen').style.display  = 'none';
    $('game-screen').style.display     = 'flex';

    // Scene label
    $('scene-name').textContent     = scene.name;
    $('scene-subtitle').textContent = scene.subtitle || '';

    // Scene image — reposition hotspot layer once image loads
    const sceneImg = $('scene-image');
    sceneImg.onload = () => {
      repositionHotspotLayer();
      renderHotspots(scene);
    };
    sceneImg.onerror = () => {
      // Image missing — still render hotspots at default full-layer size
      $('hotspot-layer').style.cssText = 'position:absolute;inset:0;';
      renderHotspots(scene);
    };
    safeImg(sceneImg, scene.image, scene.name);
    // If image is already cached it may not fire onload again
    if (sceneImg.complete && sceneImg.naturalWidth) {
      repositionHotspotLayer();
      renderHotspots(scene);
    }

    // Entry text
    if (scene.entryText) addLog(scene.entryText);

    // Verb bar (only once; it doesn't change between scenes)
    renderVerbBar();
    highlightActiveVerb(GameEngine.getState().currentVerb);

    // Inventory
    renderInventory();

    // Status
    updateStatusLine();

    // Chapter
    updateChapterIndicator(scene.id);
  }

  // ── Hotspots ──────────────────────────────────────────────────────────────
  function renderHotspots(scene) {
    const layer = $('hotspot-layer');
    layer.innerHTML = '';
    // Sort largest hotspots first so smaller ones are painted on top (higher DOM order wins)
    const sorted = [...scene.hotspots].sort((a, b) => (b.w * b.h) - (a.w * a.h));
    sorted.forEach(hs => {
      const div = document.createElement('div');
      div.className = 'hotspot';
      div.dataset.id = hs.id;
      // Positions are % of the layer, which now exactly covers the image
      div.style.left   = hs.x + '%';
      div.style.top    = hs.y + '%';
      div.style.width  = hs.w + '%';
      div.style.height = hs.h + '%';

      const lbl = document.createElement('span');
      lbl.className = 'hotspot-label';
      lbl.textContent = hs.label;
      div.appendChild(lbl);

      div.addEventListener('click', () => {
        GameEngine.interact(hs.id);
        updateStatusLine();
      });
      div.addEventListener('mouseenter', () => updateStatusLine(hs.label));
      div.addEventListener('mouseleave', () => updateStatusLine());
      layer.appendChild(div);
    });
  }

  // ── Verb bar ──────────────────────────────────────────────────────────────
  function renderVerbBar() {
    const bar = $('verb-bar');
    bar.innerHTML = '';
    ['Walk','Look','Talk','Take','Use','Open','Push'].forEach(v => {
      const btn = document.createElement('button');
      btn.className = 'verb-btn';
      btn.textContent = v;
      btn.dataset.verb = v.toLowerCase();
      btn.addEventListener('click', () => GameEngine.selectVerb(v.toLowerCase()));
      bar.appendChild(btn);
    });
  }

  function highlightActiveVerb(verb) {
    document.querySelectorAll('.verb-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.verb === verb);
    });
  }

  // ── Inventory ─────────────────────────────────────────────────────────────
  function renderInventory() {
    const panel = $('inventory-panel');
    panel.innerHTML = '';
    const inv = GameEngine.getState().inventory;

    if (inv.length === 0) {
      const empty = document.createElement('span');
      empty.className = 'inventory-empty';
      empty.textContent = 'No items';
      panel.appendChild(empty);
      return;
    }

    inv.forEach(itemId => {
      const item = ITEMS[itemId];
      if (!item) return;

      const tile = document.createElement('div');
      tile.className = 'inv-tile';
      tile.dataset.id = itemId;
      if (GameEngine.getState().selectedItem === itemId) tile.classList.add('selected');

      const img = document.createElement('img');
      img.className = 'inv-img';
      img.alt = item.name;
      img.onerror = () => {
        img.style.display = 'none';
        const fb = document.createElement('span');
        fb.className = 'inv-fallback-text';
        fb.textContent = item.name;
        tile.appendChild(fb);
      };
      img.src = imgSrc(item.image);

      const name = document.createElement('span');
      name.className = 'inv-name';
      name.textContent = item.name;

      tile.appendChild(img);
      tile.appendChild(name);

      tile.addEventListener('click', () => {
        GameEngine.interactInventory(itemId);
        renderInventory();
        updateStatusLine();
      });
      tile.addEventListener('mouseenter', () => updateStatusLine(null, item.name));
      tile.addEventListener('mouseleave', () => updateStatusLine());
      panel.appendChild(tile);
    });
  }

  // kept for compatibility — inventory-section replaces inventory-area in HTML

  // ── Status line ───────────────────────────────────────────────────────────
  function updateStatusLine(hoverHotspot, hoverItem) {
    const st = GameEngine.getState();
    const verb = st.currentVerb;
    const selected = st.selectedItem;
    const verbCap = verb.charAt(0).toUpperCase() + verb.slice(1);

    let text = verbCap;
    if (selected) {
      const item = ITEMS[selected];
      text += ` ${item ? item.name : selected}`;
      if (hoverHotspot) text += ` on ${hoverHotspot}`;
      else text += ' on...';
    } else if (hoverHotspot) {
      text += ` ${hoverHotspot}`;
    } else if (hoverItem) {
      text += ` ${hoverItem}`;
    }

    $('status-line').textContent = text;
  }

  // ── Text log ──────────────────────────────────────────────────────────────
  function addLog(text) {
    logLines.push(text);
    if (logLines.length > MAX_LOG) logLines.shift();
    renderLog();
  }

  function renderLog() {
    const log = $('text-log');
    log.innerHTML = '';
    logLines.forEach((line, i) => {
      const p = document.createElement('p');
      p.textContent = line;
      if (i < logLines.length - 1) {
        p.style.opacity = Math.max(0.35, 0.35 + (i / logLines.length) * 0.55).toString();
      }
      log.appendChild(p);
    });
    const panel = $('text-log-panel');
    panel.scrollTop = panel.scrollHeight;
  }

  // ── Chapter indicator ─────────────────────────────────────────────────────
  function updateChapterIndicator(sceneId) {
    const scene = SCENES_MAP[sceneId];
    const total = SCENES.length;
    const current = scene ? scene.index + 1 : 1;
    $('chapter-indicator').textContent = `Chapter ${current} / ${total}`;
  }

  // ── Hint modal ────────────────────────────────────────────────────────────
  function showHintModal() {
    $('hint-modal').style.display = 'flex';
    $('hint-text').textContent = 'Choose how much guidance you want...';
    $('hint-text').classList.remove('athena-speaking');
    const portrait = $('athena-portrait');
    portrait.onerror = () => { portrait.style.display = 'none'; };
    portrait.src = imgSrc('portrait-athena-hint.png');
  }

  function hideHintModal() { $('hint-modal').style.display = 'none'; }

  function displayHint(level) {
    const text = GameEngine.getHint(level);
    const el = $('hint-text');
    el.textContent = '';
    el.classList.add('athena-speaking');
    let i = 0;
    const iv = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) clearInterval(iv);
    }, 20);
  }

  // ── Menu modal ────────────────────────────────────────────────────────────
  function showMenu() { $('menu-modal').style.display = 'flex'; }
  function hideMenu() { $('menu-modal').style.display = 'none'; }

  // ── Victory screen ────────────────────────────────────────────────────────
  function showVictory() {
    $('game-screen').style.display    = 'none';
    $('title-screen').style.display   = 'none';
    $('victory-screen').style.display = 'flex';
    const vImg = $('victory-image');
    vImg.onerror = () => { vImg.style.display = 'none'; };
    vImg.src = imgSrc('scene-08-olive-root-bed.png');
  }

  // ── Engine event wiring ───────────────────────────────────────────────────
  function wireEngineEvents() {
    GameEngine.on('sceneChanged', ({ scene }) => {
      logLines = [];
      renderScene(scene);
    });
    GameEngine.on('message', ({ text }) => {
      addLog(text);
    });
    GameEngine.on('verbChanged', ({ verb }) => {
      highlightActiveVerb(verb);
      renderInventory();
      updateStatusLine();
    });
    GameEngine.on('inventoryChanged', () => {
      renderInventory();
    });
    GameEngine.on('gameWon', () => {
      showVictory();
    });
  }

  // ── DOM event wiring ──────────────────────────────────────────────────────
  function wireDOMEvents() {
    $('btn-new-game').addEventListener('click', () => { logLines = []; GameEngine.newGame(); });
    $('btn-continue').addEventListener('click', () => { logLines = []; GameEngine.continueGame(); });

    $('btn-hint').addEventListener('click', showHintModal);
    $('btn-hint-close').addEventListener('click', hideHintModal);
    $('btn-hint-1').addEventListener('click', () => displayHint(0));
    $('btn-hint-2').addEventListener('click', () => displayHint(1));
    $('btn-hint-3').addEventListener('click', () => displayHint(2));

    $('btn-menu').addEventListener('click', showMenu);
    $('btn-menu-close').addEventListener('click', hideMenu);
    $('btn-menu-new').addEventListener('click', () => { hideMenu(); logLines = []; GameEngine.newGame(); });
    $('btn-menu-title').addEventListener('click', () => { hideMenu(); showTitleScreen(); });

    $('btn-victory-restart').addEventListener('click', () => { logLines = []; GameEngine.newGame(); });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { hideHintModal(); hideMenu(); }
    });
    $('hint-modal').addEventListener('click', e => { if (e.target === $('hint-modal')) hideHintModal(); });
    $('menu-modal').addEventListener('click', e => { if (e.target === $('menu-modal')) hideMenu(); });

    // Reposition hotspots on window resize
    window.addEventListener('resize', () => {
      if (currentScene) {
        repositionHotspotLayer();
        renderHotspots(currentScene);
      }
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    wireEngineEvents();
    wireDOMEvents();
    showTitleScreen();
  }

  return { init, showTitleScreen };

})();

document.addEventListener('DOMContentLoaded', () => { Renderer.init(); });
