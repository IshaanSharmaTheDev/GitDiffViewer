## 🚀 Live Demo: [GitDiffViewer](https://ishaansharmathedev.github.io/GitDiffViewer/)

> Try it in your browser: **[https://ishaansharmathedev.github.io/GitDiffViewer/](https://ishaansharmathedev.github.io/GitDiffViewer/)**

# GitDiffViewer

A browser-based side-by-side and unified diff viewer built with a custom Myers diff algorithm — no dependencies, no server required.

## Features
- **Myers diff algorithm** — industry-standard O(ND) diff, same as Git
- **Split view** — side-by-side original vs modified
- **Unified view** — classic patch-style single pane
- **Chunk navigation** — jump between changed sections
- **In-diff search** — highlight and scroll through matches
- **Ignore whitespace** mode
- **Stats bar** — lines added/removed/chunks
- **Light and dark themes**
- **Copy diff** to clipboard

## File Structure
```
GitDiffViewer/
├── index.html
├── styles/main.css
└── src/
    ├── diff.js      # Myers diff algorithm + hunk builder
    ├── renderer.js  # HTML table rendering (split + unified)
    ├── search.js    # In-diff text search and highlight
    └── app.js       # App controller
```

## Usage
Open `index.html`, paste two code versions into the panels, and click **Compute Diff**.

## Tech
Vanilla JS, CSS3. No npm, no frameworks. Zero runtime dependencies.

## License
MIT
