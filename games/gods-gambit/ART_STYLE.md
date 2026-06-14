# Gods' Gambit — Art Style Guide

## Visual direction

Flat, bold vector illustration inspired by **ancient Greek black-figure and red-figure
pottery**, filtered through a modern dark-fantasy poster style. Tragic, ominous, mythic —
not cute, not cartoonish.

## Palette (locked)

- Terracotta / clay red: `#b5512c`
- Deep wine / oxblood: `#5c1a1f`
- Bone / parchment white: `#e8e0cf`
- Black (ink): `#1a1410`
- Gold leaf accent: `#c9a44c`

Use **black backgrounds with terracotta/gold figures** (black-figure pottery feel) OR
**terracotta backgrounds with black silhouette figures** (red-figure feel). Gold is an
accent only — small highlights, weapons, eyes, borders. No other colors.

## Base prompt template (portraits — gods, heroes, monsters)

```
Flat vector illustration in the style of ancient Greek black-figure pottery art,
[SUBJECT DESCRIPTION], bold black silhouette with terracotta (#b5512c) and gold (#c9a44c)
detail linework, deep wine red (#5c1a1f) background, ominous and tragic mood, dramatic
pose, no photorealism, no 3D, no gradients, no soft shading, hard geometric edges,
square composition, 1024x1024
```

## Base prompt template (relics / items)

```
Flat vector icon of [ITEM DESCRIPTION], ancient Greek pottery art style, bold black
silhouette with terracotta (#b5512c) and gold (#c9a44c) linework detail, on a bone/
parchment (#e8e0cf) circular background, no gradients, no shadows, no 3D, simple
geometric shapes, single object centered, 1024x1024
```

## Base prompt template (backgrounds)

```
Wide flat vector landscape illustration, ancient Greek pottery art style, [SCENE
DESCRIPTION], silhouetted dark shapes in black and deep wine red (#5c1a1f), terracotta
(#b5512c) sky or ground accents, gold (#c9a44c) highlight details, ominous tragic
atmosphere, no gradients, no photorealism, flat layered silhouettes, 1792x1024
```

## Title art

```
Flat vector key art, ancient Greek pottery art style, a lone mortal champion silhouette
facing a distant mountain where shadowy gods and monsters loom, bold black silhouettes
with terracotta (#b5512c) and gold (#c9a44c) linework, deep wine red (#5c1a1f) sky, tragic
epic mood, no gradients, no photorealism, flat layered composition, 1792x1024
```

## Consistency rules

- Reuse the exact palette hex values in every prompt.
- Every portrait: square, single subject, centered, dramatic.
- Every relic icon: bone/parchment circular background so they read as "item slots".
- Node icons on the map are drawn with CSS/inline SVG (no generated art) for crispness at
  small sizes.
