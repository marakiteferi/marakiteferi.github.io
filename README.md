# Maraki Teferi Kassa · personal website

Plain HTML/CSS/JS. No build step, no dependencies. Works on GitHub Pages as is.

## Files
- `index.html`: all content. Each section is marked with a `<!-- ====== NAME ====== -->` comment.
- `style.css`: design. Colours are the variables at the top (`--a1` blue, `--a2` violet, `--a3` cyan).
- `main.js`: theme toggle, mobile menu, scroll animations, hero network animation.
- `cv/Maraki-Teferi-Kassa-CV.pdf`: put the CV here (the Download CV buttons point to it).

## Common edits
- **Add a project:** copy one `<article class="project ...">` block in the Projects section. Add `flip` to alternate the side of the visual.
- **Add a live demo:** inside the project's `.links`, replace the `<span class="pending">` with `<a href="URL" target="_blank" rel="noopener">Live demo ↗</a>`.
- **Add research / a publication:** see the commented example in the Research section.
- **Education years / CGPA:** see the `TODO` comments in the Education section.

## Deploy (GitHub Pages)
1. Create a public repo named `marakiteferi.github.io`.
2. Push these files to the `main` branch root.
3. Settings → Pages → Source: Deploy from branch → `main` / root.
The site goes live at https://marakiteferi.github.io/
