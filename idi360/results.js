// IDI 360 – Group results page logic
// Loads idi_results/group from Firestore and renders the team overview.

(function () {
  "use strict";

  const PROFILES = {
    MOTIVATOR: { label: "Motivator", desc: "Hög Påverkan + Hög Relationer" },
    PRODUCER:  { label: "Producer",  desc: "Hög Påverkan + Låg Relationer" },
    RELATOR:   { label: "Relator",   desc: "Låg Påverkan + Hög Relationer" },
    PROCESSOR: { label: "Processor", desc: "Låg Påverkan + Låg Relationer" },
  };

  function fmt(v) {
    return v === null || v === undefined ? "–" : Number(v).toFixed(1);
  }

  function fmtDiff(v) {
    if (v === null || v === undefined) return "–";
    const n = Number(v);
    return (n >= 0 ? "+" : "") + n.toFixed(1);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    let data = null;
    try {
      const doc = await db.collection("idi_results").doc("group").get();
      if (doc.exists) data = doc.data();
    } catch (e) {
      console.error("Failed to load group results", e);
    }

    if (!data) {
      document.getElementById("not-ready-card").style.display = "block";
      return;
    }

    document.getElementById("not-ready-card").style.display = "none";
    document.getElementById("group-results").style.display = "block";

    renderDimensions(data.dimensions);
    renderProfileDist(data.profileDistribution);
    renderProfileMap(data.profileMapPoints);
    renderAdaptation(data.adaptationAvg);
    renderInsights(data.insights);
    renderDiscussion(data.discussionQuestions);

    const ts = new Date(data.generatedAt);
    document.getElementById("generated-at").textContent =
      "Sammanställt: " + ts.toLocaleString("sv-SE");
  });

  // ── Dimension table ───────────────────────────────────────────────────────

  function renderDimensions(dims) {
    const body = document.getElementById("dim-body");
    body.innerHTML = dims
      .map(
        (d) => `
        <tr>
          <td>${d.dimension}</td>
          <td class="num">${fmt(d.groupAvg)}</td>
          <td class="num">${fmt(d.selfAvg)}</td>
          <td class="num">${fmt(d.peerAvg)}</td>
          <td class="num">${fmtDiff(d.diff)}</td>
        </tr>`
      )
      .join("");
  }

  // ── Profile distribution ──────────────────────────────────────────────────

  function renderProfileDist(dist) {
    const el = document.getElementById("profile-dist");
    el.innerHTML = Object.keys(PROFILES)
      .map((key) => {
        const count = dist[key] || 0;
        const p = PROFILES[key];
        return `
          <div class="profile-cell">
            <div class="profile-name">${p.label}</div>
            <div class="profile-count">${count}</div>
            <div class="profile-sub">${p.desc}</div>
          </div>`;
      })
      .join("");
  }

  // ── Profile map (SVG) ─────────────────────────────────────────────────────

  function renderProfileMap(points) {
    const size = 360;
    const pad = 48;
    const inner = size - 2 * pad;

    function toX(rel) { return pad + ((rel - 1) / 6) * inner; }
    function toY(pav) { return size - pad - ((pav - 1) / 6) * inner; }

    const midX = toX(4);
    const midY = toY(4);

    // Quadrant backgrounds
    const q = [
      { x: pad,   y: pad,    w: inner/2, h: inner/2, fill: "#f0f4ff", label: "PRODUCER",  lx: pad + inner*0.25,  ly: pad + 18 },
      { x: midX,  y: pad,    w: inner/2, h: inner/2, fill: "#f0fff4", label: "MOTIVATOR", lx: pad + inner*0.75,  ly: pad + 18 },
      { x: pad,   y: midY,   w: inner/2, h: inner/2, fill: "#fff9f0", label: "PROCESSOR", lx: pad + inner*0.25,  ly: size - pad - 8 },
      { x: midX,  y: midY,   w: inner/2, h: inner/2, fill: "#fdf0ff", label: "RELATOR",   lx: pad + inner*0.75,  ly: size - pad - 8 },
    ];

    const bgRects = q
      .map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill}" />`)
      .join("");

    const qLabels = q
      .map((r) => `<text x="${r.lx}" y="${r.ly}" text-anchor="middle" font-size="11" fill="#64748b" font-family="Segoe UI,system-ui,sans-serif" font-weight="600">${r.label}</text>`)
      .join("");

    // Axis grid lines
    const gridLines = [2, 3, 4, 5, 6]
      .map((v) => {
        const x = toX(v), y = toY(v);
        return `<line x1="${x}" y1="${pad}" x2="${x}" y2="${size - pad}" stroke="#e2e8f0" stroke-width="1"/>
                <line x1="${pad}" y1="${y}" x2="${size - pad}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>`;
      })
      .join("");

    // Crosshair at (4,4)
    const crosshair = `
      <line x1="${pad}" y1="${midY}" x2="${size - pad}" y2="${midY}" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="${midX}" y1="${pad}" x2="${midX}" y2="${size - pad}" stroke="#94a3b8" stroke-width="1.5"/>`;

    // Outer border
    const border = `<rect x="${pad}" y="${pad}" width="${inner}" height="${inner}" fill="none" stroke="#cbd5e1" stroke-width="1"/>`;

    // Scale tick labels
    const tickX = [1, 2, 3, 4, 5, 6, 7]
      .map((v) => `<text x="${toX(v)}" y="${size - pad + 14}" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="Segoe UI,system-ui,sans-serif">${v}</text>`)
      .join("");
    const tickY = [1, 2, 3, 4, 5, 6, 7]
      .map((v) => `<text x="${pad - 8}" y="${toY(v) + 4}" text-anchor="end" font-size="9" fill="#94a3b8" font-family="Segoe UI,system-ui,sans-serif">${v}</text>`)
      .join("");

    // Axis labels
    const axisLabels = `
      <text x="${pad + inner / 2}" y="${size - 4}" text-anchor="middle" font-size="11" fill="#64748b" font-family="Segoe UI,system-ui,sans-serif">Relationer →</text>
      <text x="10" y="${pad + inner / 2}" text-anchor="middle" font-size="11" fill="#64748b" font-family="Segoe UI,system-ui,sans-serif" transform="rotate(-90,10,${pad + inner / 2})">↑ Påverkan</text>`;

    // Data points (anonymous, all same color)
    const dotColors = ["#1d4ed8", "#0891b2", "#7c3aed", "#059669"];
    const dots = (points || [])
      .map((pt, i) => {
        const cx = toX(pt.relationer);
        const cy = toY(pt.påverkan);
        const col = dotColors[i % dotColors.length];
        return `<circle cx="${cx}" cy="${cy}" r="8" fill="${col}" stroke="#fff" stroke-width="2" opacity="0.9"/>`;
      })
      .join("");

    const svg = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      ${bgRects}
      ${gridLines}
      ${crosshair}
      ${border}
      ${qLabels}
      ${tickX}${tickY}
      ${axisLabels}
      ${dots}
    </svg>`;

    document.getElementById("profile-map").innerHTML = svg;
  }

  // ── Adaptation ────────────────────────────────────────────────────────────

  function renderAdaptation(avg) {
    const level =
      avg >= 5.0 ? "Hög" : avg >= 3.0 ? "Medel" : "Låg";
    const desc =
      avg >= 5.0
        ? "Gruppen uppvisar hög samlad anpassningsförmåga – goda förutsättningar för flexibelt samarbete."
        : avg >= 3.0
        ? "Gruppen har en måttlig anpassningsförmåga. Det finns utrymme att öka flexibiliteten i mötet med varandra."
        : "Gruppens låga anpassningssnitt kan innebära att samarbetet upplevs stelt. Det kan vara värt att diskutera hur ni kan möta varandra mer situationsanpassat.";

    document.getElementById("adaptation-text").innerHTML =
      `Gruppens snitt för Anpassning (kollegorsbestämt): <strong>${fmt(avg)}/7</strong> – <strong>${level}</strong>. ${desc}`;
  }

  // ── Insights ──────────────────────────────────────────────────────────────

  function renderInsights(insights) {
    const el = document.getElementById("insights-list");
    el.innerHTML = (insights || [])
      .map((text) => `<li>${text}</li>`)
      .join("");
  }

  // ── Discussion questions ──────────────────────────────────────────────────

  function renderDiscussion(questions) {
    const el = document.getElementById("discussion-list");
    el.innerHTML = (questions || [])
      .map((q) => `<li>${q}</li>`)
      .join("");
  }

})();
