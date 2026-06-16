// IDI 360 – Shared frontend configuration
// 40 word pairs (§5), dimension mapping (§11.1), participant list.

const PARTICIPANTS = [
  { id: "lukas",  name: "Lukas",  email: "lukas.posolda@jernhusen.se",   pronoun: "hans", color: "#1d4ed8" },
  { id: "benny",  name: "Benny",  email: "benny.karlsson@jernhusen.se",  pronoun: "hans", color: "#16a34a" },
  { id: "jacob",  name: "Jacob",  email: "jacob.svensson@jernhusen.se",  pronoun: "hans", color: "#ea580c" },
  { id: "victor", name: "Victor", email: "victor.josefsson@jernhusen.se",pronoun: "hans", color: "#7c3aed" },
];

// dim: "Påverkan" | "Relationer" | "Anpassning"
// pol: "V" = hög dimension = vänster adjektiv (kräver omvänd kodning: 8 - rawScore)
//      "H" = hög dimension = höger adjektiv (ingen omkodning)
const WORD_PAIRS = [
  { nr:  1, left: "Debattlysten",    right: "Medlöpare",        dim: "Påverkan",   pol: "V" },
  { nr:  2, left: "Strukturerad",    right: "Personlig",         dim: "Relationer", pol: "H" },
  { nr:  3, left: "Organiserad",     right: "Social",            dim: "Relationer", pol: "H" },
  { nr:  4, left: "Saklig",          right: "Livlig",            dim: "Relationer", pol: "H" },
  { nr:  5, left: "Gladlynt",        right: "Disciplinerad",     dim: "Relationer", pol: "V" },
  { nr:  6, left: "Tillmötesgående", right: "Opåverkbar",        dim: "Anpassning", pol: "V" },
  { nr:  7, left: "Foglig",          right: "Sträng",            dim: "Påverkan",   pol: "H" },
  { nr:  8, left: "Självständig",    right: "Delaktig",          dim: "Relationer", pol: "H" },
  { nr:  9, left: "Begränsad",       right: "Vidsynt",           dim: "Anpassning", pol: "H" },
  { nr: 10, left: "Osäker",          right: "Trotsig",           dim: "Påverkan",   pol: "H" },
  { nr: 11, left: "Eftergiven",      right: "Påstridig",         dim: "Påverkan",   pol: "H" },
  { nr: 12, left: "Lyhörd",          right: "Förutsägbar",       dim: "Anpassning", pol: "V" },
  { nr: 13, left: "Maktlysten",      right: "Tam",               dim: "Påverkan",   pol: "V" },
  { nr: 14, left: "Hänsynsfull",     right: "Drivande",          dim: "Påverkan",   pol: "H" },
  { nr: 15, left: "Systematisk",     right: "Lekfull",           dim: "Relationer", pol: "H" },
  { nr: 16, left: "Ordentlig",       right: "Avspänd",           dim: "Relationer", pol: "H" },
  { nr: 17, left: "Fastlåst",        right: "Kompromissvillig",  dim: "Anpassning", pol: "H" },
  { nr: 18, left: "Dominerande",     right: "Lågmäld",           dim: "Påverkan",   pol: "V" },
  { nr: 19, left: "Varierad",        right: "Enkelspårig",       dim: "Anpassning", pol: "V" },
  { nr: 20, left: "Tolerant",        right: "Intolerant",        dim: "Anpassning", pol: "V" },
  { nr: 21, left: "Lugn",            right: "Bestämd",           dim: "Påverkan",   pol: "H" },
  { nr: 22, left: "Anpassbar",       right: "Oböjlig",           dim: "Anpassning", pol: "V" },
  { nr: 23, left: "Energitagande",   right: "Energigivande",     dim: "Relationer", pol: "H" },
  { nr: 24, left: "Nyfiken",         right: "Förnuftig",         dim: "Anpassning", pol: "V" },
  { nr: 25, left: "Lättsam",         right: "Pålitlig",          dim: "Relationer", pol: "V" },
  { nr: 26, left: "Passiv",          right: "Styrande",          dim: "Påverkan",   pol: "H" },
  { nr: 27, left: "Öppen",           right: "Ordentlig",         dim: "Relationer", pol: "V" },
  { nr: 28, left: "Metodisk",        right: "Skojig",            dim: "Relationer", pol: "H" },
  { nr: 29, left: "Informell",       right: "Saklig",            dim: "Relationer", pol: "V" },
  { nr: 30, left: "Ordningsam",      right: "Glad",              dim: "Relationer", pol: "H" },
  { nr: 31, left: "Velig",           right: "Överlägsen",        dim: "Påverkan",   pol: "H" },
  { nr: 32, left: "Uppmärksam",      right: "Okonstlad",         dim: "Anpassning", pol: "V" },
  { nr: 33, left: "Medgörlig",       right: "Oflexibel",         dim: "Anpassning", pol: "V" },
  { nr: 34, left: "Fantasilös",      right: "Förstående",        dim: "Anpassning", pol: "H" },
  { nr: 35, left: "Framåt",          right: "Ödmjuk",            dim: "Påverkan",   pol: "V" },
  { nr: 36, left: "Kraftfull",       right: "Lydig",             dim: "Påverkan",   pol: "V" },
  { nr: 37, left: "Intuitiv",        right: "Metodisk",          dim: "Relationer", pol: "V" },
  { nr: 38, left: "Behärskad",       right: "Vänlig",            dim: "Relationer", pol: "H" },
  { nr: 39, left: "Mångsidig",       right: "Ensidig",           dim: "Anpassning", pol: "V" },
  { nr: 40, left: "Skojig",          right: "Ordningsam",        dim: "Relationer", pol: "V" },
];

// Self first, then the others in PARTICIPANTS order (excluding self)
function getRatingOrder(selfId) {
  const self = PARTICIPANTS.find((p) => p.id === selfId);
  const others = PARTICIPANTS.filter((p) => p.id !== selfId);
  return [self, ...others];
}

function findParticipantByEmail(email) {
  const normalized = email.trim().toLowerCase();
  return PARTICIPANTS.find((p) => p.email.toLowerCase() === normalized) || null;
}
