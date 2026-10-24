# Jernhusens fastigheter – inofficiell karta

En interaktiv karta över fastigheterna i Jernhusen AB:s publicerade
fastighetsförteckning per 2025-12-31.

> **Inofficiell demo.** Ett privat projekt. Kartan är inte framtagen av eller
> för Jernhusen AB och ersätter inte bolagets egna uppgifter.

## Innehåll

| Fil | Innehåll |
|---|---|
| `index.html` | Kartan: en statisk sida med Leaflet och OpenStreetMap |
| `fastigheter.geojson` | En punkt per fastighet med uppgifterna från förteckningen |
| `LICENSE` | MIT-licens för koden |

## Källor och licenser

| Del | Källa | Licens / rättigheter |
|---|---|---|
| Fastigheter, lokalarea och lokaltyper | Jernhusen AB, [Fastighetsförteckning per 2025-12-31](https://www.datocms-assets.com/163536/1772552927-fastighetsforteckning-2025-1.pdf), publicerad på [jernhusen.se](https://www.jernhusen.se/om-jernhusen/finansiell-information/finansiella-rapporter/) | © Jernhusen AB. Återgiven med källhänvisning; omfattas inte av MIT-licensen. |
| Lägen (koordinater) | Adressen i förteckningen sökt i [OpenStreetMap](https://www.openstreetmap.org) via [Nominatim](https://nominatim.org) | © OpenStreetMap-bidragsgivare, [ODbL 1.0](https://opendatacommons.org/licenses/odbl/) |
| Byggnad på adressen, närmaste station, service inom 500 m | OpenStreetMap via [Overpass API](https://overpass-api.de) | © OpenStreetMap-bidragsgivare, [ODbL 1.0](https://opendatacommons.org/licenses/odbl/) |
| Kollektivtrafik inom 500 m | [GTFS Sverige 2](https://www.trafiklab.se/api/gtfs-datasets/gtfs-sverige-2/), Samtrafiken i Sverige AB via Trafiklab (version 2026-10-01) | CC0 1.0. Källa: Trafiklab |
| Punktlighet och inställda tåg | [Trafikverket, API Öppna Data](https://data.trafikverket.se/) (TrainAnnouncement) | CC0 1.0. Källa: Trafikverket |
| Befolkning inom 1 km | [SCB, öppna geodata](https://www.scb.se/vara-tjanster/oppna-data/oppna-geodata/): befolkning per 1 km-ruta, 2025-12-31 | Öppna data. Källa: SCB |
| Skyddad natur inom 500 m | [Naturvårdsverket, Naturvårdsregistret](https://geodata.naturvardsverket.se/nedladdning/naturvardsregistret/) | CC0. Källa: Naturvårdsverket |
| Kulturmiljö inom 250 m | [Riksantikvarieämbetet, öppna data](https://www.raa.se/hitta-information/oppna-data/oppna-data-portal/): kulturhistoriska lämningar, kulturhistoriskt inventerad bebyggelse, byggnadsminnen (OGC API Features) | CC0 / CC BY. Källa: Riksantikvarieämbetet |
| Bakgrundskarta | OpenStreetMap | © [OpenStreetMap-bidragsgivare](https://www.openstreetmap.org/copyright) |
| Kartbibliotek | [Leaflet](https://leafletjs.com) 1.9.4 | BSD-2-Clause |
| Kod | Lukas Posolda | MIT, se `LICENSE` |

## Hur lägena är framtagna

Varje fastighets adress i förteckningen har sökts i OpenStreetMap
(Nominatim), med "Stationsgatan 7 A-C" sökt som "Stationsgatan 7". Saknas
adress eller träff har fastighetsbeskrivningen sökts i stället (t.ex.
"Nattavaara hållplats"). En träff används bara om den ligger i rätt kommun.
Metoden visas för varje fastighet i kartan.

Punkterna är ungefärliga lägen, inte fastighetsgränser. Fastigheter utan
godkänd träff saknar punkt och visas bara i listan.

## Byggnader och stationer

För fastigheter där läget kommer från en adress med husnummer visas den
byggnad i OpenStreetMap som adresspunkten ligger i, om den är entydig. Det är
inte fastighetens gräns och inte nödvändigtvis alla byggnader på fastigheten.
För alla fastigheter med läge visas närmaste järnvägsstation eller hållplats
(`railway=station/halt`) inom 500 m. Uppgifterna hämtades med Overpass API, ett
anrop i taget, och svaren cachades.

## Omgivning

| Uppgift | Hur den räknas |
|---|---|
| Kollektivtrafik inom 500 m | Planerade avgångar tisdagen 2026-11-10 från alla hållplatser inom 500 m, per trafikslag. En tur som stannar vid flera hållplatser räknas en gång, och tåg som slutar vid hållplatsen räknas inte. Dessutom flest tåg under en timme, första och sista tåg samt tågoperatörer. |
| Punktlighet | Alla annonserade avgångar de tre senaste hela dygnen (så långt bakåt som API:t sparar data) från en Trafikverket-station: i första hand den station vars namn står i fastighetsbeskrivningen (inom 3 km), annars närmaste station inom 500 m. I tid = högst 5 minuter efter tidtabell. Andelen räknas på avgångna och inställda tåg. Tre dygn är ett kort fönster, så siffrorna kan svänga mycket. |
| Invånare inom 1 km | Summan av SCB:s 1 km-rutor, där varje ruta viktas med hur stor del av den som ligger inom 1 km från punkten. En uppskattning. |
| Service inom 500 m | Antal objekt i OpenStreetMap inom 500 m fågelvägen: butiker (`shop`), restauranger och kaféer, övrig service (apotek, bank, vård, skola m.m.), busshållplatser och cykelparkeringar. OSM är inte heltäckande, så siffrorna är ett minimum. |
| Kulturmiljö inom 250 m | Lämningar, inventerad bebyggelse och byggnadsminnen hos RAÄ vars geometri ligger inom 250 m från punkten. Varje objekt länkar till RAÄ:s objektsida. RAÄ påpekar att kvaliteten kan variera och att länsstyrelsen ska kontaktas inför planering eller markarbeten. |
| Skyddad natur inom 500 m | Gällande skyddade områden i Naturvårdsregistret vars gräns ligger inom 500 m från punkten. |

Kartan kan färgas efter varje uppgift (meny **Färga efter**). Numeriska
uppgifter delas i fem lika stora grupper.

## Det som inte finns med

Fastighetsgränser (Lantmäteriet) och energideklarationer (Boverket) finns inte
i den här demon. Båda kräver avtal eller juridisk prövning, och villkoren
tillåter inte att uppgifterna publiceras öppet.

Nominatims [användningsvillkor](https://operations.osmfoundation.org/policies/nominatim/)
följdes: högst ett anrop per sekund, identifierande User-Agent, och varje
adress söktes en gång (svaren cachades).

## Köra lokalt

Sidan läser `fastigheter.geojson` och OpenStreetMaps kartbilder, så den måste
öppnas via en webbserver, inte direkt från disk:

```
python -m http.server 8000
```

Öppna sedan http://localhost:8000/.

---
© 2026 Lukas Posolda
