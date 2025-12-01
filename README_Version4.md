# Prompt Lookup — Static Site

This is a minimal static site to let students search prompts and view sample images.

How to use
1. Place these files in your repository (root) or in branch prompt-site:
   - index.html
   - styles.css
   - main.js
   - data/prompts.json
2. Open `index.html` in a browser. For local viewing (recommended), run a simple HTTP server:
   - Python 3: `python -m http.server 8000`
   - Node: `npx http-server .`
   Then visit `http://localhost:8000` and test the UI.
3. To add more prompts, edit `data/prompts.json`. Each entry supports:
   - id (string)
   - prompt (string)
   - tags (array of strings)
   - model (string)
   - image (string - relative path, absolute URL, or data URI)
4. Deploy with GitHub Pages:
   - Commit the files to the repository root or to a gh-pages branch.
   - In the repo Settings → Pages: choose the branch and folder (root) and save.
   - The site will be served from `https://<owner>.github.io/<repo>/`

Notes
- The JSON file above uses lightweight data-URI SVG placeholders so thumbnails work without separate image files. If you prefer real image files, create an images/ folder and replace the "image" fields with "images/yourfile.jpg".
- To work on the prompt-site branch locally:
  - git fetch origin
  - git checkout -b prompt-site origin/prompt-site
  - (add/commit the files above)
  - python -m http.server 8000
  - Open http://localhost:8000 in your browser

If you want, you can now open the pull request comparing prompt-site → main using:
https://github.com/sandersung/mybase/compare/main...prompt-site?expand=1
