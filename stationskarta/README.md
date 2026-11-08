# Sveriges järnvägsstationer

En interaktiv karta över Sveriges järnvägsstationer: de som används i dag, de som har lagts ned och de som planeras. Kartan visar också spårnätet, foton och historik. Live: https://lukasposolda-qwertz.github.io/public/stationskarta/

Kartan är gjord av Lukas Posolda och senast uppdaterad 2026-11-08.

## Filer

- `index.html`: hela kartan, med data och kartgeometri inbäddade. Leaflet laddas från cdnjs och typsnitten från Google Fonts.
- `photos/p00.js` … `p30.js`: stationsfoton i bitar. Varje bit laddas först när ett stationskort öppnas.

## Källor och licenser

| Innehåll | Källa | Licens |
|---|---|---|
| Järnvägsspår, stationspunkter, sjökonturer | © OpenStreetMaps bidragsgivare, via Geofabrik (data 2026-11-07) | ODbL 1.0. Härledd kartdata här får användas under samma licens. |
| Stationer, status, år, län, grannstationer | Wikidata (hämtat 2026-11-08) | CC0 1.0 |
| Stationstexter | Wikipedia, förkortade till inledningen | CC BY-SA 4.0 |
| Foton | Wikimedia Commons | Fotograf och licens anges per bild |
| Kust och landgränser | Eurostat GISCO 1:1 miljon | © EuroGeographics för de administrativa gränserna |
| Sjöar utanför Sverige | Natural Earth | Allmän egendom |
| Kartbibliotek | Leaflet 1.9.4 | BSD 2-Clause |
| Typsnitt | IBM Plex Sans och Plex Mono | SIL Open Font License 1.1 |
