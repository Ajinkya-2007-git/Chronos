# Chronos — Real-Time Life & Age Dashboard

Chronos is a lightweight, zero-dependency single-page web app that calculates your exact age down to the second and translates your time on Earth into interactive biological and cosmic statistics.

![Clean UI](https://img.shields.io/badge/UI-Bento_Grid-blue)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-None-brightgreen)
![Local Execution](https://img.shields.io/badge/Runs_On-file%3A%2F%2F-orange)

## Features

* **Real-Time Live Counter:** Watch your lived seconds increment in real-time using vanilla JavaScript performance loops.
* **Bento Grid Architecture:** A modern visual hierarchy featuring soft glassmorphism effects, fluid CSS Grid layouts, and responsive design for all device screens.
* **Biological & Cosmic Perspective Engine:** Converts time lived into estimated real-world metrics:
  * Total heartbeats (~80 bpm average)
  * Total breaths taken (~16/min average)
  * Estimated total sleep hours
  * Completed orbits around the Sun
* **Milestone Progress Tracker:** Real-time countdowns toward major personal milestones (e.g., 10,000 days lived, next birthday).
* **Fully Accessible & Offline Capable:** Built with high-contrast color palettes, semantic HTML5, keyboard navigation focus states, and zero network-dependent scripts.

## Getting Started

Chronos requires no installation, dependencies, Node.js packages, or local server setups.

1. Download or clone this repository to your local machine.
2. Locate `index.html` in the project directory.
3. **Double-click `index.html`** to launch the dashboard directly in any modern web browser (`file://` protocol compatible).

## Technical Overview

* **Frontend Framework:** Plain HTML5, pure CSS3 (Flexbox/CSS Grid), and Vanilla JavaScript (ES6+).
* **Clock Logic:** Utilizes native JavaScript `Date` object math handling leap years, UTC offsets, and standard timing intervals (`setInterval` / `requestAnimationFrame`).
* **Storage:** No external network fetches or CORS rules applied; runs natively on local file execution.

## Project Structure
├──index.html     # Semantic layout and Bento Grid structure
├── style.css      # CSS variables, glassmorphic styling, media queries
└── script.js      # Time calculations, ticker loops, and event handling

## License

MIT License — Free for personal and educational use.
