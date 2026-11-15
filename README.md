# PHAGE RAGE!

An interactive, kid-friendly introduction to bacteriophages—the viruses that infect bacteria. Explore how phages work, how researchers find phages that match bacterial strains, and the people who helped advance phage science.

## Explore the levels

| Level | Page | What you'll explore |
| --- | --- | --- |
| **Meet a Phage** | [`anatomy.html`](./anatomy.html) | A narrated infection story, photo explainers about antibiotic resistance and phages, and a color-matching game. |
| **The Right Match** | [`hunting.html`](./hunting.html) | A photo story about sequencing bacterial strains, receptor-binding proteins (RBPs), and testing phage candidates. |
| **Phage Hero** | [`phage_saviors.html`](./phage_saviors.html) | Photo slides about five scientists, followed by a scientist-to-contribution matching game. |

Complete each level's activity to unlock the next one. Use **Reset levels** in the navigation to clear saved progress and start over.

## Run locally

From the project directory, start a local web server:

```sh
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in a browser.

## Project files

- `index.html` — home page and level selection
- `anatomy.html` / `anatomy.js` — Meet a Phage story and game
- `hunting.html` / `hunting.js` — The Right Match slides
- `phage_saviors.html` / `phage_saviors.js` — Phage Hero slides and matching game
- `progression.js` — level locks, saved completion, and reset behavior
- `style.css` — shared layout and visual styles

## Media and libraries

The project loads p5.js 1.11.3 and the Nunito font from CDNs. Educational photos are loaded from Wikimedia Commons. An internet connection is needed for these external assets.
