# Portfolio Website

A responsive personal portfolio built with HTML, Bootstrap, Sass, and light JavaScript. It is structured for clean maintainability and easy GitHub publishing.

## Features

- Separate HTML structure
- SCSS architecture with variables, mixins, and shared styles
- Bootstrap 5 for layout and utilities
- Font Awesome icons
- Mobile responsive design
- Beginner-friendly JavaScript interactions

## Run locally

1. Install dependencies:
   npm install
2. Build the Sass file:
   npm run build
3. Open the site in a browser or serve it locally:
   python -m http.server 8000

Then visit http://localhost:8000

## GitHub push

```bash
git init
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

## Project structure

- index.html
- assets/scss/styles.scss
- assets/css/styles.css
- assets/js/main.js
