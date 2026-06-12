// Landing page logic: render context/scale info, validate email,
// and show the rating order for the recognised participant.

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("context-text").textContent = CONTEXT_TEXT;

  const scaleBody = document.getElementById("scale-body");
  SCALE.forEach(({ value, label }) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${value}</td><td>${label}</td>`;
    scaleBody.appendChild(row);
  });

  document.getElementById("skip-note").textContent =
    `Du kan alltid välja "${SKIP_OPTION.label}" om du inte har tillräcklig observation för att bedöma en fråga.`;

  const form = document.getElementById("email-form");
  const errorMessage = document.getElementById("error-message");
  const welcomeCard = document.getElementById("welcome-card");
  const welcomeTitle = document.getElementById("welcome-title");
  const orderList = document.getElementById("order-list");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const participant = findParticipantByEmail(email);

    if (!participant) {
      errorMessage.classList.add("visible");
      welcomeCard.classList.remove("visible");
      return;
    }

    errorMessage.classList.remove("visible");

    // Remember who is logged in for the next steps
    sessionStorage.setItem("team360_participant_id", participant.id);
    sessionStorage.setItem("team360_email", email.trim().toLowerCase());

    welcomeTitle.textContent = `Välkommen, ${participant.name}!`;

    const order = getRatingOrder(participant.id);
    orderList.innerHTML = "";
    order.forEach((person, index) => {
      const li = document.createElement("li");
      if (index === 0) {
        li.textContent = `${person.name} (dig själv – självskattning)`;
        li.classList.add("self");
      } else {
        li.textContent = person.name;
      }
      orderList.appendChild(li);
    });

    welcomeCard.classList.add("visible");
  });

  document.getElementById("continue-button").addEventListener("click", () => {
    window.location.href = "survey.html";
  });
});
