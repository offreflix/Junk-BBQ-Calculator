# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static, single-page web app (PT-BR) that calculates BBQ/churrasco supplies (meat, beer, water) based on the number of adults, children, and event duration. No build step, no package manager, no test framework.

## Running the App

Open `index.html` directly in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Architecture

The entire application is three files:

- **`index.html`** — form inputs (adults, kids, duration) and a "Calcular" button
- **`scripts/script.js`** — all logic; `calc()` is the single entry point called on button click
- **`styles/style.css`** — styling with a responsive breakpoint at 600px

### Calculation logic (`script.js`)

| Function | Purpose |
|---|---|
| `meatPerPerson(duration)` | 600g if < 6 hrs, 750g if ≥ 6 hrs |
| `beerPerPerson(duration)` | 1200ml / 2000ml |
| `waterPerPerson(duration)` | 1000ml / 1500ml |
| `calc()` | Reads inputs, runs calculations, writes results via `innerHTML` |
| `waterQnt2()` | Formats water quantity with proper pluralization |
| `duration2()` | Renders the event summary line |

DOM access uses `getElementById`; results are written to dedicated result elements in `index.html`.
