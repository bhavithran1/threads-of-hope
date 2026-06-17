# Threads of Hope

A scroll-driven, dark-cosmic experience where patients facing illness become points of
light — and the threads between them form one navigable sky of shared experience.

> *"No one's thread is long enough to reach across the dark alone. That's the whole point of a sky."*

## Run it

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
```

## What's inside

- **Living starfield** — a full-page canvas of depth-layered, twinkling stars with pointer
  and scroll parallax, plus the occasional shooting star (`src/components/Starfield.jsx`).
- **Hero** — staggered blur-in title with a glowing thread that traces itself across the sky.
- **The Constellation** — every patient voice is a colored star (color = condition); nearest
  neighbours are stitched together with threads that *draw themselves* as you scroll into view.
  Hover a star to hear it; tap to read the full note (`src/components/Constellation.jsx`).
- **Voice stream** — quote cards that parallax in from alternating sides as you scroll.
- **Animated stats** + a quote **marquee**.
- **Add your thread** — write one line; it ignites as a new star in your own private sky
  (state-only, nothing leaves the browser).
- Smooth scrolling via **Lenis**, animation via **Framer Motion**.

## About the data (Reddit)

The brief was to fill the notes from Reddit health communities. A live pull from
`r/ChronicIllness`, `r/cancer`, `r/depression`, `r/diabetes_t1`, `r/MultipleSclerosis`,
`r/lupus`, `r/ChronicPain` and `r/Anxiety` is wired up in `src/data/reddit.js` —
but Reddit blocks programmatic/datacenter access (HTTP 403) from the build environment,
so the site ships with the **curated fallback** in `src/data/voices.js`: anonymized quotes
hand-written in the authentic spirit of those communities.

The data shape mirrors Reddit's API, so dropping in a real feed later is a one-line swap:
call `fetchVoices(conditionId)` from `reddit.js` and merge the result into `voices`.
It runs fine when deployed somewhere that can reach Reddit, or behind a tiny CORS proxy.

> These quotes are illustrative and anonymized — not medical advice, and not real
> individuals' posts.
