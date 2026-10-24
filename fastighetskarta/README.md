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
| Översvämning och stabilitet | [MCF](https://www.mcf.se/sv/verktyg--tjanster/oversvamningsportalen/) (Myndigheten för civilt försvar), översvämningskarteringar (100-, 200-årsflöde, BHF), områden med betydande översvämningsrisk och stabilitetskarteringar, öppen WFS | Ingen avgift, inga åtkomstbegränsningar. Källa: MCF |
| Skred och jordart | [SGU](https://www.sgu.se): förutsättningar för skred i finkornig jordart (OGC API) och jordarter 1:25 000–1:100 000 (WMS) | CC0 1.0. Källa: SGU |
| Befolkning per DeSO | [SCB, Statistikdatabasen](https://www.statistikdatabasen.scb.se): TAB6680 (arbetsmarknadsstatus), TAB6683 (nettoinkomst), TAB6685 (ekonomisk standard), år 2024, samt DeSO 2025-indelningen (öppen WFS) | Öppna data. Källa: SCB |
| Klimat 1991–2020 | [SMHI](https://www.smhi.se/data), meteorologiska observationer (metobs), månadsmedeltemperatur och månadsnederbörd | CC BY 4.0. Källa: SMHI. Bearbetad: normalvärden beräknade av projektet |
| Spår inom 300 m | OpenStreetMap `railway=rail`, uppdelat efter `service` | © OpenStreetMap-bidragsgivare, ODbL |
| Stationslägen | Trafikverket, stationsregister (TrainStation) | CC0 1.0. Källa: Trafikverket |
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

När adressen bara träffar en gata ger Nominatim gatans mittpunkt, som kan ligga
långt från fastigheten. Sådana punkter förbättras i tur och ordning:

1. Namnger beskrivningen en station (t.ex. "Solna station") används Trafikverkets stationsläge.
2. För depåer används en namngiven depå i OSM i rätt kommun (t.ex. "Tillberga depå").
3. Annars flyttas punkten till den järnvägsmark i OSM som ligger närmast gatan, om den ligger
   inom 300 m från gatan och flytten är högst 1,5 km.

Metoden och hur långt punkten flyttades visas för varje fastighet.

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
| Befolkning i DeSO-området | Det DeSO-område (SCB:s minsta statistikområde) som punkten ligger i: sysselsättningsgrad 20–64 år, medelnettoinkomst (med kommun och riket som jämförelse) och andel med låg/hög ekonomisk standard, år 2024. Beskriver de boende, inte de som arbetar där. |
| Klimat 1991–2020 | Normalvärden beräknade ur SMHI:s kvalitetskontrollerade månadsvärden vid närmaste station med minst 300 av 360 månader, högst 60 km bort. Station och avstånd anges. |
| Spår inom 300 m | Spårlängd i OSM inom 300 m: huvudspår, bangård, sidospår och anslutningsspår, samt elektrifierad längd. Spårtyperna är frivilligt taggade i OSM. Trafikverkets järnvägsnät (Lastkajen) är den officiella källan. |
| Naturrisker inom 100 m | Om ett karterat översvämnings-, stabilitets- eller skredområde ligger inom 100 m från punkten. Karteringarna täcker inte hela Sverige, så "nej" betyder att inget är karterat där, inte att risk saknas. Jordart avläses i punkten. |
| Skyddad natur inom 500 m | Gällande skyddade områden i Naturvårdsregistret vars gräns ligger inom 500 m från punkten. |

Kartan kan färgas efter varje uppgift (meny **Färga efter**). Numeriska
uppgifter delas i fem lika stora grupper.

## Jämförelsetabell (`jamforelse.html`)

Samma mått för alla fastigheter i en sorterbar tabell: lokalarea, trafikutbud, punktlighet,
befolkning, service, kulturmiljö, skyddad natur, översvämning, skred, jordart och lägesmetod.
Kan laddas ner som CSV.

## 3D-vy: tio största (`3d/`)

En proof of concept med [MapLibre GL JS](https://maplibre.org) 4.7.1 (BSD-3-Clause) och vektorkartor från
[OpenFreeMap](https://openfreemap.org) (© OpenMapTiles, data från OpenStreetMap). Visar de tio största
fastigheterna (lokalarea) som har ett läge. Den största, Örebro CV, saknar läge och är därför inte med.

| Lager | Källa |
|---|---|
| Bakgrund Mörk, Ljus, Färg | [OpenFreeMap](https://openfreemap.org) stilarna Dark, Positron och Liberty. © OpenMapTiles, data från OpenStreetMap |
| Bakgrund Flygfoto | [Esri World Imagery](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9). Källa: Esri, Maxar, Earthstar Geographics och GIS-användarsamfundet. Visas enligt Esris användarvillkor |
| Järnvägsnätet (huvud- och bandelar), synligt över hela Sverige | OpenStreetMap `railway=rail` + `usage=main/branch`, förenklat med 25 m tolerans. ODbL |
| Alla byggnader i 3D | OpenFreeMap/OpenMapTiles, höjd från `render_height` |
| Byggnader på järnvägsmark (turkos) | OSM-byggnader inom 600 m som ligger på `landuse=railway` eller är märkta som stations- eller trafikbyggnader. Höjd från OSM, annars 8 m. Visar järnvägsmiljön, **inte** vilka byggnader Jernhusen äger. ODbL |

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
