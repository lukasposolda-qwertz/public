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
