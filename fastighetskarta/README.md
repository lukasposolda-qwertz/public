# Jernhusens fastigheter – inofficiell karta

En interaktiv karta över fastigheterna i Jernhusen AB:s publicerade
fastighetsförteckning per 2025-12-31.

> **Inofficiell demo.** Ett privat projekt. Kartan är inte framtagen av eller
> för Jernhusen AB och ersätter inte bolagets egna uppgifter.

## Innehåll

| Fil | Innehåll |
|---|---|
| `index.html` | Kartan: en statisk sida med MapLibre GL JS och vektorkartor, platt som standard och 3D när en fastighet väljs |
| `jamforelse.html` | Jämförelsetabell över alla fastigheter |
| `nodplats.html` | Nod–plats-analys av stationslägena |
| `restid.json` | Stationer som nås med tåg inom en timme, per fastighet |
| `tag.json` | Alla tågturer en vardag med vägen längs spåren, för "Tåg i rörelse" |
| `fastigheter.geojson` | Alla 143 fastigheter med uppgifterna, används av jämförelsetabellen |
| `karta.geojson` | De fastigheter som har läge, används av kartan |
| `byggnader.geojson`, `jarnvag.geojson` | Kopplade byggnader och järnvägsnätet |
| `LICENSE` | MIT-licens för koden |

## Källor och licenser

| Del | Källa | Licens / rättigheter |
|---|---|---|
| Fastigheter, lokalarea och lokaltyper | Jernhusen AB, [Fastighetsförteckning per 2025-12-31](https://www.datocms-assets.com/163536/1772552927-fastighetsforteckning-2025-1.pdf), publicerad på [jernhusen.se](https://www.jernhusen.se/om-jernhusen/finansiell-information/finansiella-rapporter/) | © Jernhusen AB. Återgiven med källhänvisning; omfattas inte av MIT-licensen. |
| Lägen (koordinater) | Adressen i förteckningen sökt i [OpenStreetMap](https://www.openstreetmap.org) via [Nominatim](https://nominatim.org) | © OpenStreetMap-bidragsgivare, [ODbL 1.0](https://opendatacommons.org/licenses/odbl/) |
| Byggnad på adressen, närmaste station, service inom 500 m | OpenStreetMap via [Overpass API](https://overpass-api.de) | © OpenStreetMap-bidragsgivare, [ODbL 1.0](https://opendatacommons.org/licenses/odbl/) |
| Kollektivtrafik inom 500 m | [GTFS Sverige 2](https://www.trafiklab.se/api/gtfs-datasets/gtfs-sverige-2/), Samtrafiken i Sverige AB via Trafiklab (version 2026-10-01) | CC0 1.0. Källa: Trafiklab |
| Befolkning inom 1 km | [SCB, öppna geodata](https://www.scb.se/vara-tjanster/oppna-data/oppna-geodata/): befolkning per 1 km-ruta, 2025-12-31 | Öppna data. Källa: SCB |
| Skyddad natur inom 500 m | [Naturvårdsverket, Naturvårdsregistret](https://geodata.naturvardsverket.se/nedladdning/naturvardsregistret/) | CC0. Källa: Naturvårdsverket |
| Översvämning och stabilitet | [MCF](https://www.mcf.se/sv/verktyg--tjanster/oversvamningsportalen/) (Myndigheten för civilt försvar), översvämningskarteringar (100-, 200-årsflöde, BHF), områden med betydande översvämningsrisk och stabilitetskarteringar, öppen WFS | Ingen avgift, inga åtkomstbegränsningar. Källa: MCF |
| Skred och jordart | [SGU](https://www.sgu.se): förutsättningar för skred i finkornig jordart (OGC API) och jordarter 1:25 000–1:100 000 (WMS) | CC0 1.0. Källa: SGU |
| Befolkning per DeSO | [SCB, Statistikdatabasen](https://www.statistikdatabasen.scb.se): TAB6680 (arbetsmarknadsstatus), TAB6683 (nettoinkomst), TAB6685 (ekonomisk standard), år 2024, samt DeSO 2025-indelningen (öppen WFS) | Öppna data. Källa: SCB |
| Arbetsplatser och dagbefolkning | [SCB, öppna geodata](https://www.scb.se/vara-tjanster/oppna-data/oppna-geodata/): verksamhetsområden och handelsområden 2020 (öppen WFS), samt [Statistikdatabasen](https://www.statistikdatabasen.scb.se) TAB1828 (sysselsatta efter bostadens läge i förhållande till arbetsstället, per kommun, 2024) | Öppna data. Källa: SCB |
| Framtida klimat | [SMHI Klimatscenariotjänsten](https://www.smhi.se/klimat/framtidens-klimat/klimatscenariotjansten): länsvärden (ensemblemedel, RCP4.5 och RCP8.5, mot 1971–2000) ur tjänstens egna datafiler | Källa: SMHI. Bearbetad. Tjänsten anger ingen egen licens; SMHI:s öppna data har CC BY 4.0 |
| Restidsomland, Tåg i rörelse | GTFS Sverige 2 (som ovan), med tågens väg längs spåren ur OpenStreetMap via Overpass | CC0 1.0 (Trafiklab) och ODbL (OSM) |
| Klimat 1991–2020 | [SMHI](https://www.smhi.se/data), meteorologiska observationer (metobs), månadsmedeltemperatur och månadsnederbörd | CC BY 4.0. Källa: SMHI. Bearbetad: normalvärden beräknade av projektet |
| Spår inom 300 m | OpenStreetMap `railway=rail`, uppdelat efter `service` | © OpenStreetMap-bidragsgivare, ODbL |
| Stationslägen | Trafikverket, stationsregister (TrainStation) | CC0 1.0. Källa: Trafikverket |
| Kulturmiljö inom 250 m | [Riksantikvarieämbetet, öppna data](https://www.raa.se/hitta-information/oppna-data/oppna-data-portal/): kulturhistoriska lämningar, kulturhistoriskt inventerad bebyggelse, byggnadsminnen (OGC API Features) | CC0 / CC BY. Källa: Riksantikvarieämbetet |
| Bakgrundskarta | OpenStreetMap | © [OpenStreetMap-bidragsgivare](https://www.openstreetmap.org/copyright) |
| Kartbibliotek | [MapLibre GL JS](https://maplibre.org) 4.7.1 | BSD-3-Clause |
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
| Invånare inom 1 km | Summan av SCB:s 1 km-rutor, där varje ruta viktas med hur stor del av den som ligger inom 1 km från punkten. En uppskattning. |
| Service inom 500 m | Antal objekt i OpenStreetMap inom 500 m fågelvägen: butiker (`shop`), restauranger och kaféer, övrig service (apotek, bank, vård, skola m.m.), busshållplatser och cykelparkeringar. OSM är inte heltäckande, så siffrorna är ett minimum. |
| Kulturmiljö inom 250 m | Lämningar, inventerad bebyggelse och byggnadsminnen hos RAÄ vars geometri ligger inom 250 m från punkten. Varje objekt länkar till RAÄ:s objektsida. RAÄ påpekar att kvaliteten kan variera och att länsstyrelsen ska kontaktas inför planering eller markarbeten. |
| Befolkning i DeSO-området | Det DeSO-område (SCB:s minsta statistikområde) som punkten ligger i: sysselsättningsgrad 20–64 år, medelnettoinkomst (med kommun och riket som jämförelse) och andel med låg/hög ekonomisk standard, år 2024. Beskriver de boende, inte de som arbetar där. |
| Klimat 1991–2020 | Normalvärden beräknade ur SMHI:s kvalitetskontrollerade månadsvärden vid närmaste station med minst 300 av 360 månader, högst 60 km bort. Station och avstånd anges. |
| Spår inom 300 m | Spårlängd i OSM inom 300 m: huvudspår, bangård, sidospår och anslutningsspår, samt elektrifierad längd. Spårtyperna är frivilligt taggade i OSM. Trafikverkets järnvägsnät (Lastkajen) är den officiella källan. |
| Naturrisker inom 100 m | Om ett karterat översvämnings-, stabilitets- eller skredområde ligger inom 100 m från punkten. Karteringarna täcker inte hela Sverige, så "nej" betyder att inget är karterat där, inte att risk saknas. Jordart avläses i punkten. |
| Skyddad natur inom 500 m | Gällande skyddade områden i Naturvårdsregistret vars gräns ligger inom 500 m från punkten. |
| Arbetsplatser inom 1 km | Anställda i SCB:s verksamhetsområden och handelsområden (2020), viktade med hur stor del av området som ligger inom 1 km. Verksamhetsområdena omfattar industri, kontor, handel och logistik utanför bostadsområden, men inte stadskärnor, och täcker ungefär 2 av Sveriges 5 miljoner sysselsatta. Siffran är alltså ett golv. Handelsområden kan överlappa verksamhetsområden och redovisas separat. |
| Dagbefolkning, kommunen | Sysselsatta med arbetsställe i kommunen (bor i kommunen eller pendlar in) jämfört med sysselsatta som bor i kommunen, 2024. Över 1 betyder att fler arbetar än bor i kommunen. Finare indelning än kommun finns inte som öppna data. |
| Framtida klimat | Länets värden i SMHI:s Klimatscenariotjänst: medeltemperatur, högsommardygn (max ≥ 25 °C), tropiska nätter (min ≥ 20 °C), dygn med minst 10 och 20 mm nederbörd, årsnederbörd, graddagar för uppvärmning och kylgraddagar. Förändring mot 1971–2000 för RCP8.5 2041–2070 samt RCP4.5 och RCP8.5 2071–2100. Länsmedel, inte lokala värden: tjänstens kartor anger bara klassade intervall och används därför inte. |
| Skyfall | Tjänsten har inga länsvärden för korta skyfall. Kortet anger SMHI:s klimatfaktorer från den nationella skyfallskarteringen (1,2 för RCP4.5 och 1,4 för RCP8.5 i slutet av seklet). SMHI:s karta över översvämningskänsliga områden vid skyfall har ingen öppen kartjänst, och Lantmäteriets höjddata ingår inte. |

Kartan kan färgas efter varje uppgift (meny **Färga**). Numeriska
uppgifter delas i fem lika stora grupper.

## Restidsomland med tåg

För fastigheter med en tågstation inom 1 km: snabbaste resa med tåg från punkten, med gång till varje
station inom 1 km (fågelvägen, 1,3 m/s), en vanlig vardag (2026-11-10) med avresa var tionde minut
07:00–08:50, där bästa avresa räknas. Resan söks med Connection Scan över alla tågturer i GTFS Sverige 2.
Byten är tillåtna med minst 3 minuter på samma station. Restiden räknas från avresan, så upp till 10
minuters väntan ingår, men inte gång vid målet. Bara tåg, inte buss, spårvagn eller tunnelbana.

Nådda invånare är befolkningen i SCB:s 1 km-rutor vars mittpunkt ligger inom 1 km från en nådd station.
Varje ruta räknas en gång, och bara svenska rutor räknas. Anställda räknas på samma sätt ur verksamhetsområdena
(ett golv, se ovan). **Visa på kartan** visar de nådda stationerna färgade efter restid.

## Nod–plats-analys (`nodplats.html`)

Bertolinis nod–plats-modell (L. Bertolini, 1999, *Spatial development patterns and public transport: the
application of an analytical model in the Netherlands*). **Nodvärde**: tågavgångar och avgångar med buss,
spårvagn och tunnelbana inom 500 m, samt stationer och invånare som nås med tåg inom 30 minuter.
**Platsvärde**: invånare och anställda inom 1 km samt butiker, mat och dryck och service inom 500 m.
Varje del skalas 0–1 (min–max på logaritmen av 1 + värdet) över Jernhusens stationslägen, och nod- respektive
platsvärdet är medelvärdet av delarna. Typ: *balans* när skillnaden är högst 0,15, annars *obalanserad nod*
(mer trafik än stad) eller *obalanserad plats* (mer stad än trafik). Inom balans: *stress* när båda är minst 0,75
och *beroende* när båda är högst 0,25. Fastigheter vid samma stationer räknas som ett läge. Värdena är relativa
inom de här lägena, inte ett nationellt mått.

## Tåg i rörelse

Alla tågturer (snabbtåg, fjärr- och interregionala tåg, regional- och pendeltåg) en vanlig vardag enligt
GTFS Sverige 2, alltså tidtabellen, inte realtid. Vid en station står tåget mellan ankomst och avgång.
Mellan stationerna följer det spåret: kortaste väg i OSM:s spårnät (`railway=rail` och `narrow_gauge` utom
bangårds- och sidospår, med huvudlinjerna till Köpenhamn, Oslo, Trondheim och Narvik), förenklad med
25 m tolerans. Vägen används bara om den är högst 1,6 gånger fågelvägen plus 3 km. Annars, och när en
station ligger mer än 400 m från spårnätet, ritas en rak linje (18 av 809 stationspar). Tåget rör sig med
jämn fart mellan två stationer.

## Jämförelsetabell (`jamforelse.html`)

Samma mått för alla fastigheter i en sorterbar tabell: lokalarea, trafikutbud,
befolkning, arbetsplatser, restidsomland, nod–plats, framtida klimat, service, kulturmiljö, skyddad natur,
översvämning, skred, jordart och lägesmetod.
Kan laddas ner som CSV.

## Kartan

En enda karta byggd med [MapLibre GL JS](https://maplibre.org) 4.7.1 (BSD-3-Clause) och vektorkartor från
[OpenFreeMap](https://openfreemap.org) (© OpenMapTiles, data från OpenStreetMap). Den är platt i mörkt läge
med tända spår som standard. När en fastighet väljs flyger kameran in och lutar till 3D; **Platt** tar en
tillbaka. Menyerna ligger överst: sök, affärsområde, bakgrundskarta, Huvudlinjer och Övriga spår av/på, Tåg i rörelse, vad punkterna färgas efter,
**Platt** (rätar upp kartan där man är) och **Hela Sverige** (platt översikt).

| Lager | Källa |
|---|---|
| Bakgrund Mörk, Ljus, Standard | [OpenFreeMap](https://openfreemap.org) stilarna Dark, Positron och Liberty. © OpenMapTiles, data från OpenStreetMap |
| Bakgrund Flygfoto | [Esri World Imagery](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9). Källa: Esri, Maxar, Earthstar Geographics och GIS-användarsamfundet. Visas enligt Esris användarvillkor |
| **Huvudlinjer** (knapp), stark färg | OpenStreetMap `railway=rail` + `usage=main`: stambanorna och andra stora linjer, i hela landet. Förenklat med 25 m tolerans. ODbL |
| **Övriga spår** (knapp), dämpad färg | `usage=branch` (bandelar och sidolinjer) i hela landet, plus alla spår ur bakgrundskartan inzoomat (se nästa rad). ODbL |
| Alla spår inzoomat (bangårdar, sidospår, industrispår) | OpenFreeMap/OpenMapTiles `transportation`, `class=rail`, från zoom 12; servicespåren finns i vektorrutorna från ca zoom 14. © OpenMapTiles, data från OpenStreetMap |
| Alla byggnader i 3D | OpenFreeMap/OpenMapTiles, höjd från `render_height` |
| Kopplade byggnader (turkos) | OSM-byggnader som kopplats till fastigheten: byggnaden på adressen, byggnader med samma namn som fastigheten, stations-/trafikbyggnader inom 150 m och, för depåer, byggnader på järnvägs- eller depåmark inom 300 m. Färgen läggs på bakgrundskartans egen byggnad (id = OSM-id × 10 + 2), så form och höjd stämmer. En uppskattning, **inte** uppgift om ägande. ODbL |

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
