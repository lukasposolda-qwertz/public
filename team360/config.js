// Shared configuration for the Finans 360 samarbetstest
// Fixed participant order, used to derive each person's rating order
// (self first, then the others in this order, excluding self)

const PARTICIPANTS = [
  { id: "lukas", name: "Lukas", email: "lukas.posolda@jernhusen.se", color: "#1d4ed8" },
  { id: "benny", name: "Benny", email: "benny.karlsson@jernhusen.se", color: "#16a34a" },
  { id: "jacob", name: "Jacob", email: "jacob.svensson@jernhusen.se", color: "#ea580c" },
  { id: "victor", name: "Victor", email: "victor.josefsson@jernhusen.se", color: "#7c3aed" },
];

// 1-5 rating scale, plus an explicit "no opinion / skip" option
const SCALE = [
  { value: 1, label: "I låg grad" },
  { value: 2, label: "Delvis" },
  { value: 3, label: "Ganska väl" },
  { value: 4, label: "I hög grad" },
  { value: 5, label: "Mycket väl" },
];

const SKIP_OPTION = {
  value: null,
  label: "Vet inte / vill inte svara",
};

const CONTEXT_TEXT =
  "Skattningen avser samarbetet i finansgruppen kring prioriteringar, " +
  "beslutsunderlag, uppföljning, analys, affärsstöd och gemensam styrning. " +
  "Det handlar inte om hur en person “är” generellt, utan hur personens " +
  "beteenden uppfattas i just denna samarbetsmiljö.";

// 12 questions across 4 dimensions
const QUESTIONS = [
  {
    id: 1,
    dimension: "Relation och samarbete",
    text: "Lyssnar aktivt på andras perspektiv.",
    help: "Beteende som visar lyhördhet och vilja att förstå innan slutsats dras.",
  },
  {
    id: 2,
    dimension: "Relation och samarbete",
    text: "Bidrar till ett öppet och konstruktivt samtalsklimat.",
    help: "Beteende som gör att andra vågar bidra, fråga och nyansera.",
  },
  {
    id: 3,
    dimension: "Relation och samarbete",
    text: "Hjälper gruppen att använda olika perspektiv på ett bra sätt.",
    help: "Beteende som fångar upp skillnader i synsätt och gör dem användbara.",
  },
  {
    id: 4,
    dimension: "Påverkan och riktning",
    text: "Uttrycker sina ståndpunkter tydligt.",
    help: "Beteende som gör att andra förstår vad personen tycker, föreslår eller rekommenderar.",
  },
  {
    id: 5,
    dimension: "Påverkan och riktning",
    text: "Hjälper gruppen att komma vidare när frågor är otydliga eller komplexa.",
    help: "Beteende som skapar rörelse framåt utan att förenkla bort viktiga aspekter.",
  },
  {
    id: 6,
    dimension: "Påverkan och riktning",
    text: "Vågar utmana resonemang på ett konstruktivt sätt.",
    help: "Beteende som prövar antaganden, risker och slutsatser utan att låsa samtalet.",
  },
  {
    id: 7,
    dimension: "Struktur och analys",
    text: "Skiljer tydligt på fakta, antaganden och bedömningar.",
    help: "Beteende som ökar kvaliteten i analys, diskussion och beslut.",
  },
  {
    id: 8,
    dimension: "Struktur och analys",
    text: "Bidrar till välstrukturerade beslutsunderlag.",
    help: "Beteende som gör underlag begripliga, relevanta och användbara.",
  },
  {
    id: 9,
    dimension: "Struktur och analys",
    text: "Hjälper gruppen att förstå konsekvenser, risker och prioriteringar.",
    help: "Beteende som tydliggör vad olika vägval innebär.",
  },
  {
    id: 10,
    dimension: "Anpassning och gruppnytta",
    text: "Anpassar sin kommunikation efter situation och mottagare.",
    help: "Beteende som gör kommunikationen tydlig och träffsäker i olika sammanhang.",
  },
  {
    id: 11,
    dimension: "Anpassning och gruppnytta",
    text: "Bidrar till att gruppens tid används effektivt.",
    help: "Beteende som hjälper gruppen att fokusera, prioritera och hålla tempo.",
  },
  {
    id: 12,
    dimension: "Anpassning och gruppnytta",
    text: "Bidrar till att beslut och nästa steg blir tydliga.",
    help: "Beteende som klargör ansvar, beslutspunkt och fortsättning.",
  },
];

// Given the logged-in participant id, return the order in which
// this person should rate people: self first, then the rest in
// PARTICIPANTS order.
function getRatingOrder(selfId) {
  const self = PARTICIPANTS.find((p) => p.id === selfId);
  const others = PARTICIPANTS.filter((p) => p.id !== selfId);
  return [self, ...others];
}

// Look up a participant by email (case-insensitive, trimmed)
function findParticipantByEmail(email) {
  const normalized = email.trim().toLowerCase();
  return PARTICIPANTS.find((p) => p.email.toLowerCase() === normalized) || null;
}
