// Results page logic: load aggregated group results from
// Firestore (results/group) and render the team overview table.
// Personal results are sent individually via email, not shown here.

function fmt(value) {
  return value === null || value === undefined ? "–" : value.toFixed(1);
}

document.addEventListener("DOMContentLoaded", async () => {
  const notReadyCard = document.getElementById("not-ready-card");
  const groupCard = document.getElementById("group-card");

  let groupData = null;
  try {
    const groupDoc = await db.collection("results").doc("group").get();
    if (groupDoc.exists) groupData = groupDoc.data();
  } catch (e) {
    console.error("Failed to load group results", e);
  }

  if (!groupData) {
    notReadyCard.style.display = "block";
    groupCard.style.display = "none";
    return;
  }

  notReadyCard.style.display = "none";
  renderGroup(groupData);
  groupCard.style.display = "block";

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
});
