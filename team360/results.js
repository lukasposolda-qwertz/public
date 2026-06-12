// Results page logic: load aggregated group + personal results from
// Firestore (results/group, results/<personId>) and render them.

function fmt(value) {
  return value === null || value === undefined ? "–" : value.toFixed(1);
}

document.addEventListener("DOMContentLoaded", async () => {
  const notReadyCard = document.getElementById("not-ready-card");
  const loginCard = document.getElementById("login-card");
  const groupCard = document.getElementById("group-card");
  const personCard = document.getElementById("person-card");
  const errorMessage = document.getElementById("error-message");

  let groupData = null;
  try {
    const groupDoc = await db.collection("results").doc("group").get();
    if (groupDoc.exists) groupData = groupDoc.data();
  } catch (e) {
    console.error("Failed to load group results", e);
  }

  if (!groupData) {
    notReadyCard.style.display = "block";
    loginCard.style.display = "none";
    groupCard.style.display = "none";
    personCard.style.display = "none";
    return;
  }

  notReadyCard.style.display = "none";
  renderGroup(groupData);
  groupCard.style.display = "block";

  const form = document.getElementById("email-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const participant = findParticipantByEmail(email);

    if (!participant) {
      errorMessage.classList.add("visible");
      return;
    }
    errorMessage.classList.remove("visible");

    sessionStorage.setItem("team360_participant_id", participant.id);
    sessionStorage.setItem("team360_email", email.trim().toLowerCase());

    await showPersonResults(participant.id);
  });

  // If already identified from an earlier step, show results right away
  const existingId = sessionStorage.getItem("team360_participant_id");
  if (existingId) {
    await showPersonResults(existingId);
  }

  async function showPersonResults(participantId) {
    let personData = null;
    try {
      const doc = await db.collection("results").doc(participantId).get();
      if (doc.exists) personData = doc.data();
    } catch (e) {
      console.error("Failed to load personal results", e);
    }

    if (!personData) return;

    renderPerson(personData);
    personCard.style.display = "block";
    loginCard.style.display = "none";
  }

  function renderGroup(data) {
    const body = document.getElementById("group-body");
    body.innerHTML = "";
    data.dimensions.forEach((d) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${d.dimension}</td>
        <td>${fmt(d.groupAvg)}</td>
        <td>${fmt(d.selfAvg)}</td>
        <td>${fmt(d.peerAvg)}</td>
        <td>${d.diff === null ? "–" : d.diff.toFixed(1)}</td>
      `;
      body.appendChild(row);
    });

    const generated = new Date(data.generatedAt);
    document.getElementById("generated-at").textContent =
      `Sammanställt: ${generated.toLocaleString("sv-SE")}`;
  }

  function renderPerson(data) {
    document.getElementById("person-title").textContent =
      `Dina resultat – ${data.name}`;

    const body = document.getElementById("person-body");
    body.innerHTML = "";
    data.dimensions.forEach((d) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${d.dimension}</td>
        <td>${fmt(d.self)}</td>
        <td>${fmt(d.peers)}</td>
        <td>${d.gap === null ? "–" : d.gap.toFixed(1)}</td>
        <td>${d.gapLabel}</td>
      `;
      body.appendChild(row);
    });

    const totalRow = document.createElement("tr");
    totalRow.style.fontWeight = "600";
    totalRow.innerHTML = `
      <td>Totalt</td>
      <td>${fmt(data.overall.self)}</td>
      <td>${fmt(data.overall.peers)}</td>
      <td>${data.overall.gap === null ? "–" : data.overall.gap.toFixed(1)}</td>
      <td>${data.overall.gapLabel}</td>
    `;
    body.appendChild(totalRow);

    const commentsSection = document.getElementById("comments-section");
    commentsSection.innerHTML = "";
    const withComments = data.questions.filter(
      (q) => q.peerComments && q.peerComments.length > 0
    );
    if (withComments.length > 0) {
      const heading = document.createElement("h2");
      heading.textContent = "Kommentarer från kollegor";
      commentsSection.appendChild(heading);

      withComments.forEach((q) => {
        const qHeading = document.createElement("p");
        qHeading.style.fontWeight = "600";
        qHeading.style.marginBottom = "0.25rem";
        qHeading.textContent = `${q.id}. ${q.text}`;
        commentsSection.appendChild(qHeading);

        const list = document.createElement("ul");
        list.style.marginTop = "0";
        q.peerComments.forEach((c) => {
          const li = document.createElement("li");
          li.textContent = c;
          list.appendChild(li);
        });
        commentsSection.appendChild(list);
      });
    }
  }
});
