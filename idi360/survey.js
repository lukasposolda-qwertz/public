// IDI 360 – Survey logic
// Manages the 5-step flow: email → intro → Del A (self) → Del B ×3 → confirmation.

(function () {
  "use strict";

  // ── State ──────────────────────────────────────────────────────────────────
  let participant = null;   // { id, name, email, pronoun, color }
  let ratingOrder = [];     // [self, peer1, peer2, peer3]
  let sectionIdx = -1;      // -1=not started, 0=self, 1-3=peers
  let answers = {};         // { "${targetId}_${nr}": 1..7 }

  // ── DOM refs ───────────────────────────────────────────────────────────────
  const stepEmail   = document.getElementById("step-email");
  const stepIntro   = document.getElementById("step-intro");
  const stepSection = document.getElementById("step-section");
  const stepDone    = document.getElementById("step-done");
  const sectionCard = document.getElementById("section-card");
  const progressBar = document.getElementById("progress-bar");
  const emailInput  = document.getElementById("email-input");
  const emailError  = document.getElementById("email-error");

  // ── Helpers ────────────────────────────────────────────────────────────────
  function showStep(name) {
    [stepEmail, stepIntro, stepSection, stepDone].forEach((el) => (el.style.display = "none"));
    document.getElementById("step-" + name).style.display = "block";
    window.scrollTo(0, 0);
  }

  function answerKey(targetId, nr) {
    return `${targetId}_${nr}`;
  }

  function normalize(rawScore, pol) {
    return pol === "V" ? 8 - rawScore : rawScore;
  }

  // ── localStorage ──────────────────────────────────────────────────────────
  function lsKey(suffix) {
    return `idi360_${participant.id}_${suffix}`;
  }

  function saveState() {
    localStorage.setItem(lsKey("answers"), JSON.stringify(answers));
    localStorage.setItem(lsKey("section"), String(sectionIdx));
  }

  function loadState() {
    const savedAnswers = localStorage.getItem(lsKey("answers"));
    const savedSection = localStorage.getItem(lsKey("section"));
    if (savedAnswers) answers = JSON.parse(savedAnswers);
    if (savedSection !== null) sectionIdx = parseInt(savedSection, 10);
  }

  function markSubmitted() {
    localStorage.setItem(lsKey("submitted"), "1");
    localStorage.removeItem(lsKey("answers"));
    localStorage.removeItem(lsKey("section"));
  }

  function isSubmitted() {
    return localStorage.getItem(lsKey("submitted")) === "1";
  }

  // ── Step 0: Email identification ──────────────────────────────────────────
  document.getElementById("email-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const p = findParticipantByEmail(emailInput.value);
    if (!p) {
      emailError.textContent =
        "Den här e-postadressen finns inte registrerad. Kontrollera stavningen eller kontakta administratör.";
      emailError.classList.add("visible");
      return;
    }
    emailError.classList.remove("visible");
    participant = p;
    ratingOrder = getRatingOrder(p.id);

    if (isSubmitted()) {
      showAlreadySubmitted();
      return;
    }

    loadState();
    document.getElementById("intro-name").textContent = p.name;
    showStep("intro");
  });

  function showAlreadySubmitted() {
    stepEmail.style.display = "none";
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h2>Redan inskickat</h2>
      <p>Du har redan skickat in dina svar. Din individuella rapport skickas till <strong>${participant.email}</strong> när alla deltagare har fyllt i formuläret.</p>
      <p><a href="results.html">Se gruppresultaten när de är klara →</a></p>`;
    document.querySelector(".page").insertBefore(card, stepIntro);
  }

  // ── Step 1: Intro ─────────────────────────────────────────────────────────
  document.getElementById("btn-start").addEventListener("click", () => {
    sectionIdx = 0;
    saveState();
    showStep("section");
    renderSection();
  });

  // ── Progress bar ──────────────────────────────────────────────────────────
  function renderProgress() {
    const labels = ["Del A"].concat(
      ratingOrder.slice(1).map((p) => "Del B: " + p.name)
    );
    progressBar.innerHTML = labels
      .map((label, i) => {
        const cls =
          i < sectionIdx ? "done" : i === sectionIdx ? "active" : "";
        return `<div class="progress-step ${cls}">${label}</div>`;
      })
      .join("");
  }

  // ── Section rendering ─────────────────────────────────────────────────────
  function renderSection() {
    renderProgress();

    const target = ratingOrder[sectionIdx];
    const isSelf = target.id === participant.id;
    const sectionTitle = isSelf
      ? "Del A – Självskattning"
      : `Del B – Så här uppfattar jag: ${target.name}`;
    const sectionSub = isSelf
      ? "Fyll i utifrån hur du tror att dina kollegor uppfattar dig i din roll."
      : `Beskriv hur du uppfattar ${target.name} i ${target.pronoun} arbetsroll.`;

    const anonBanner = !isSelf
      ? `<div class="anon-banner">🔒 Dina svar är anonyma – de ingår enbart i ett aggregerat snitt.</div>`
      : "";

    // Determine next button label
    const isLastSection = sectionIdx === 3;
    const nextLabel = isLastSection ? "Skicka in" : sectionIdx === 0 ? "Nästa – skatta kollegor" : "Nästa kollega";

    document.getElementById("btn-next").textContent = nextLabel;
    document.getElementById("btn-back").style.display =
      sectionIdx === 0 ? "none" : "block";

    const pairsHtml = WORD_PAIRS.map((pair) => renderPairRow(pair, target.id)).join("");

    sectionCard.innerHTML = `
      <div class="section-header">
        <span class="section-badge">${isSelf ? "DEL A" : "DEL B"}</span>
        <h2>${sectionTitle}</h2>
        <p>${sectionSub}</p>
      </div>
      ${anonBanner}
      <div id="pairs-container">
        ${pairsHtml}
      </div>
    `;

    // Re-attach radio listeners
    sectionCard.querySelectorAll("input[type=radio]").forEach((radio) => {
      radio.addEventListener("change", onRadioChange);
    });
  }

  function renderPairRow(pair, targetId) {
    const key = answerKey(targetId, pair.nr);
    const current = answers[key];

    const circles = [1, 2, 3, 4, 5, 6, 7]
      .map((v) => {
        const checked = current === v ? "checked" : "";
        const midClass = v === 4 ? " mid" : "";
        return `<label class="scale-btn${midClass}">
          <input type="radio" name="${key}" value="${v}" ${checked}>
          <span class="dot"></span>
        </label>`;
      })
      .join("");

    const numbers = [1, 2, 3, 4, 5, 6, 7]
      .map((v) => `<span${v === 4 ? ' class="mid-num"' : ""}>${v}</span>`)
      .join("");

    return `
      <div class="pair-row" data-key="${key}">
        <span class="pair-left">${pair.left}</span>
        <div class="pair-scale">
          <div class="scale-circles">${circles}</div>
          <div class="scale-numbers">${numbers}</div>
        </div>
        <span class="pair-right">${pair.right}</span>
      </div>`;
  }

  function onRadioChange(e) {
    const key = e.target.name;
    answers[key] = parseInt(e.target.value, 10);
    const row = e.target.closest(".pair-row");
    if (row) row.classList.remove("unanswered");
    saveState();
  }

  // ── Validation ────────────────────────────────────────────────────────────
  function validateSection() {
    const target = ratingOrder[sectionIdx];
    let firstMissing = null;
    let missingCount = 0;

    WORD_PAIRS.forEach((pair) => {
      const key = answerKey(target.id, pair.nr);
      const row = sectionCard.querySelector(`.pair-row[data-key="${key}"]`);
      if (!answers[key]) {
        missingCount++;
        row.classList.add("unanswered");
        if (!firstMissing) firstMissing = row;
      }
    });

    if (missingCount > 0) {
      firstMissing.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  document.getElementById("btn-next").addEventListener("click", async () => {
    if (!validateSection()) return;

    const isLast = sectionIdx === 3;
    if (isLast) {
      await submitToFirestore();
    } else {
      sectionIdx++;
      saveState();
      showStep("section");
      renderSection();
    }
  });

  document.getElementById("btn-back").addEventListener("click", () => {
    if (sectionIdx === 0) {
      showStep("intro");
    } else {
      sectionIdx--;
      saveState();
      renderSection();
      renderProgress();
    }
  });

  // ── Submission ────────────────────────────────────────────────────────────
  async function submitToFirestore() {
    const btnNext = document.getElementById("btn-next");
    btnNext.disabled = true;
    btnNext.textContent = "Sparar…";

    const rows = [];
    ratingOrder.forEach((target, si) => {
      const section = si === 0 ? "self" : "peer";
      WORD_PAIRS.forEach((pair) => {
        const key = answerKey(target.id, pair.nr);
        rows.push({
          section,
          targetId: target.id,
          itemNr: pair.nr,
          rawScore: answers[key],
        });
      });
    });

    try {
      await db.collection("idi_submissions").doc(participant.id).set({
        raterId: participant.id,
        raterEmail: participant.email,
        submittedAt: new Date().toISOString(),
        rows,
      });

      markSubmitted();
      document.getElementById("done-name").textContent = participant.name;
      document.getElementById("done-email").textContent = participant.email;
      showStep("done");
    } catch (err) {
      console.error("Submission error", err);
      btnNext.disabled = false;
      btnNext.textContent = "Skicka in";
      alert("Något gick fel. Dina svar är sparade lokalt. Försök igen om en stund.");
    }
  }

  // ── Restore on page load if state exists ─────────────────────────────────
  // (Participant not known yet at load time; restore happens after email entry.)

})();
