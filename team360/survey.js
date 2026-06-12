// Survey page logic: step through self-rating then peer-ratings,
// 12 questions each, with a 1-5 scale + skip option and optional
// per-question comments.

const STORAGE_KEY_RESPONSES = "team360_responses";
const STORAGE_KEY_STEP = "team360_step";

document.addEventListener("DOMContentLoaded", () => {
  const participantId = sessionStorage.getItem("team360_participant_id");
  if (!participantId) {
    window.location.href = "index.html";
    return;
  }

  const rater = PARTICIPANTS.find((p) => p.id === participantId);
  const order = getRatingOrder(participantId);

  // responses[ratedPersonId][questionId] = { score: number|null, comment: string }
  const responses = loadResponses();
  let step = parseInt(sessionStorage.getItem(STORAGE_KEY_STEP) || "0", 10);
  if (step < 0 || step >= order.length) step = 0;

  // --- Static content ---
  document.getElementById("rater-label").textContent =
    `Du är inloggad som ${rater.name}`;

  const scaleBody = document.getElementById("scale-body");
  SCALE.forEach(({ value, label }) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${value}</td><td>${label}</td>`;
    scaleBody.appendChild(row);
  });
  document.getElementById("skip-note").textContent =
    `Du kan alltid välja "${SKIP_OPTION.label}" om du inte har tillräcklig observation för att bedöma en fråga.`;

  const personBlock = document.getElementById("person-block");
  const personType = document.getElementById("person-type");
  const personTitle = document.getElementById("person-title");
  const personContext = document.getElementById("person-context");
  const questionsContainer = document.getElementById("questions");
  const progressLabel = document.getElementById("progress-label");
  const progressSteps = document.getElementById("progress-steps");
  const backButton = document.getElementById("back-button");
  const nextButton = document.getElementById("next-button");
  const doneCard = document.getElementById("done-card");

  renderStep();

  backButton.addEventListener("click", () => {
    saveCurrentStepAnswers();
    step = Math.max(0, step - 1);
    sessionStorage.setItem(STORAGE_KEY_STEP, String(step));
    renderStep();
  });

  nextButton.addEventListener("click", () => {
    saveCurrentStepAnswers();
    if (step < order.length - 1) {
      step += 1;
      sessionStorage.setItem(STORAGE_KEY_STEP, String(step));
      renderStep();
    } else {
      finishSurvey();
    }
  });

  function renderStep() {
    const person = order[step];
    const isSelf = step === 0;

    personBlock.style.setProperty("--accent", person.color);
    personType.textContent = isSelf ? "Självskattning" : "Kollegeskattning";
    personTitle.textContent = isSelf
      ? `Steg ${step + 1}: Du skattar dig själv (${person.name})`
      : `Steg ${step + 1}: Du skattar ${person.name}`;
    personContext.textContent = CONTEXT_TEXT;

    progressLabel.textContent = `Person ${step + 1} av ${order.length}`;
    progressSteps.innerHTML = "";
    order.forEach((_, index) => {
      const dot = document.createElement("span");
      dot.className = "dot";
      if (index === step) dot.classList.add("active");
      else if (index < step) dot.classList.add("done");
      progressSteps.appendChild(dot);
    });

    questionsContainer.innerHTML = "";
    const saved = responses[person.id] || {};

    QUESTIONS.forEach((q) => {
      const savedAnswer = saved[q.id] || { score: null, comment: "" };
      const groupName = `q_${person.id}_${q.id}`;

      const block = document.createElement("div");
      block.className = "question-block";
      block.dataset.questionId = q.id;

      const dimension = document.createElement("div");
      dimension.className = "q-dimension";
      dimension.textContent = q.dimension;

      const text = document.createElement("div");
      text.className = "q-text";
      text.textContent = `${q.id}. ${q.text}`;

      const help = document.createElement("div");
      help.className = "q-help";
      help.textContent = q.help;

      const options = document.createElement("div");
      options.className = "scale-options";

      SCALE.forEach(({ value, label }) => {
        const pill = document.createElement("label");
        pill.className = "pill";
        pill.title = label;
        const input = document.createElement("input");
        input.type = "radio";
        input.name = groupName;
        input.value = String(value);
        if (savedAnswer.score === value) input.checked = true;
        const span = document.createElement("span");
        span.textContent = String(value);
        pill.appendChild(input);
        pill.appendChild(span);
        options.appendChild(pill);
      });

      const skipPill = document.createElement("label");
      skipPill.className = "pill skip";
      skipPill.title = SKIP_OPTION.label;
      const skipInput = document.createElement("input");
      skipInput.type = "radio";
      skipInput.name = groupName;
      skipInput.value = "skip";
      if (savedAnswer.score === null && savedAnswer.answered) {
        skipInput.checked = true;
      }
      const skipSpan = document.createElement("span");
      skipSpan.textContent = "Vet inte";
      skipPill.appendChild(skipInput);
      skipPill.appendChild(skipSpan);
      options.appendChild(skipPill);

      const commentToggle = document.createElement("button");
      commentToggle.type = "button";
      commentToggle.className = "comment-toggle";

      const commentBox = document.createElement("textarea");
      commentBox.className = "comment-box hidden";
      commentBox.rows = 2;
      commentBox.placeholder = "Kort kommentar eller exempel (frivilligt)";
      commentBox.value = savedAnswer.comment || "";

      if (savedAnswer.comment) {
        commentBox.classList.remove("hidden");
        commentToggle.textContent = "− Dölj kommentar";
      } else {
        commentToggle.textContent = "+ Lägg till kommentar";
      }

      commentToggle.addEventListener("click", () => {
        const hidden = commentBox.classList.toggle("hidden");
        commentToggle.textContent = hidden
          ? "+ Lägg till kommentar"
          : "− Dölj kommentar";
        if (!hidden) commentBox.focus();
      });

      block.appendChild(dimension);
      block.appendChild(text);
      block.appendChild(help);
      block.appendChild(options);
      block.appendChild(commentToggle);
      block.appendChild(commentBox);

      questionsContainer.appendChild(block);
    });

    backButton.style.visibility = step === 0 ? "hidden" : "visible";
    nextButton.textContent =
      step === order.length - 1 ? "Skicka in" : "Nästa";
  }

  function saveCurrentStepAnswers() {
    const person = order[step];
    const personAnswers = responses[person.id] || {};

    questionsContainer.querySelectorAll(".question-block").forEach((block) => {
      const questionId = parseInt(block.dataset.questionId, 10);
      const checked = block.querySelector("input[type=radio]:checked");
      const comment = block.querySelector(".comment-box").value.trim();

      let score = null;
      let answered = false;
      if (checked) {
        answered = true;
        score = checked.value === "skip" ? null : parseInt(checked.value, 10);
      }

      personAnswers[questionId] = { score, comment, answered };
    });

    responses[person.id] = personAnswers;
    saveResponses(responses);
  }

  function finishSurvey() {
    const payload = buildPayload();

    nextButton.disabled = true;
    nextButton.textContent = "Skickar...";

    db.collection("submissions")
      .doc(rater.id)
      .set({
        raterId: rater.id,
        raterName: rater.name,
        raterEmail: rater.email,
        submittedAt: payload.submittedAt,
        rows: payload.rows,
      })
      .then(() => {
        sessionStorage.removeItem(STORAGE_KEY_STEP);
        sessionStorage.removeItem(STORAGE_KEY_RESPONSES);

        personBlock.style.display = "none";
        document.querySelector(".scale-reference").style.display = "none";
        document.querySelector(".progress").style.display = "none";
        document.querySelector(".progress-steps").style.display = "none";
        document.querySelector(".nav-buttons").style.display = "none";
        doneCard.classList.add("visible");
      })
      .catch((error) => {
        console.error("Failed to submit survey", error);
        nextButton.disabled = false;
        nextButton.textContent = "Skicka in";
        alert(
          "Det gick inte att skicka in dina svar. Kontrollera din " +
            "internetanslutning och försök igen.\n\n" +
            error.message
        );
      });
  }

  function buildPayload() {
    const rows = [];
    order.forEach((person) => {
      const type = person.id === rater.id ? "Självskattning" : "Kollegeskattning";
      const personAnswers = responses[person.id] || {};
      QUESTIONS.forEach((q) => {
        const answer = personAnswers[q.id] || { score: null, comment: "" };
        rows.push({
          skattadPerson: person.id,
          skattare: rater.id,
          typ: type,
          dimension: q.dimension,
          fragaId: q.id,
          fraga: q.text,
          poang: answer.score,
          kommentar: answer.comment || "",
        });
      });
    });

    return {
      rater: { id: rater.id, name: rater.name, email: rater.email },
      submittedAt: new Date().toISOString(),
      rows,
    };
  }

  function loadResponses() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_RESPONSES);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveResponses(data) {
    sessionStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(data));
  }
});
