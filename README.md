# FAIZAN Math AI

A free browser-based math and equation solver developed by FAIZAN.

## Main features

- Algebra and equation solving
- Polynomial and quadratic equations
- Symbolic simplification
- Factor / expand commands
- Derivatives
- Integrals
- Trigonometric expressions
- Math image upload with OCR
- Mouse-reactive floating math background
- Responsive design
- No backend required
- No OpenAI API key required
- GitHub Pages compatible

## Important note about image solving

The image feature uses Tesseract.js OCR to read mathematical text from an image. OCR is not perfect, especially with handwritten or low-quality images.

For best results:
1. Use a clear image.
2. Keep the page straight.
3. Use good lighting.
4. Avoid shadows.
5. After OCR, check the detected expression before solving.

## Run locally

Simply open `index.html` in a modern browser. Internet access is required because Nerdamer and Tesseract.js are loaded from CDN.

## GitHub Pages

1. Create a GitHub repository named `FAIZAN-Math-AI`.
2. Upload all files and the `assets` folder.
3. Open repository Settings.
4. Open Pages.
5. Select `Deploy from a branch`.
6. Choose `main` and `/ (root)`.
7. Save.
8. GitHub will provide the public Pages URL.

## Project structure

FAIZAN-Math-AI/
- index.html
- style.css
- script.js
- README.md
- assets/
  - favicon.svg

## Technology

- HTML
- CSS
- JavaScript
- Nerdamer symbolic math engine
- Tesseract.js OCR

Developed by FAIZAN.
