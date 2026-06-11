# GitDiffViewer

A clean, colorized git diff viewer that runs entirely in the browser. Paste a diff or drag in a `.patch` file and it renders it properly — added lines in green, removed in red, hunks clearly separated.

I made this because `git diff` in the terminal is fine but sometimes you want to review a diff properly without having to push to GitHub just to use their PR view.

## Features

- Paste raw diff text and it renders instantly
- Drag and drop `.patch` or `.diff` files
- Side-by-side and unified view toggle
- Line numbers on both sides
- Syntax highlighting per file type (detects from filename in diff header)
- Copy button on each file section
- Works completely offline

## Usage

```
git clone https://github.com/AadhhyaSharma/GitDiffViewer
cd GitDiffViewer
# open index.html
```

Or just go online to the demo link in the repo description.

## Getting a diff to paste

```bash
# Changes in your working directory
git diff

# Difference between two commits
git diff abc123 def456

# Save to a file
git diff > my_changes.patch
```

Then paste the output into the viewer.

## Why browser-based?

I wanted something I could share with people who don't have git installed. Link them to the file, they can open it, paste the diff, done. No server, no backend, no auth.

---

Built this in a day. Nothing fancy but it does exactly what it's supposed to.
