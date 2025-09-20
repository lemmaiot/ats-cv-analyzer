
# ATS CV Evaluator

A lightweight single-page app to analyze, score, and visualize applicant CVs for Applicant Tracking System (ATS) compatibility using an LLM (Gemini). Upload a CV file and the app returns a suitability score, visual charts, and a breakdown of strengths and issues relevant to ATS parsing and common recruiter heuristics.

Key features

- Upload CV files (PDF, DOCX, or plain text) and parse content for analysis.
- Generate an ATS-compatibility score with a short explanation and recommendations.
- Visual components for quick insights: radial score, score bars, and detailed analysis.
- Client-side React + Vite app that calls a backend service to run the LLM evaluation (configured via `GEMINI_API_KEY`).

Quick links

- Source files: see the `components/` and `services/` folders for UI and parsing logic.

Getting started (local)

Prerequisites

- Node.js (16+ recommended)

Install dependencies

```
npm install
```

Environment

- Create a `.env.local` file at the project root with your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Run the app in development

```
npm run dev
```

Build for production

```
npm run build
```

Preview production build

```
npm run preview
```

How it works (high level)

- The UI in `App.tsx` and components in `components/` handle file selection and display.
- `services/fileParser.ts` extracts text from uploaded files.
- `services/geminiService.ts` wraps calls to the Gemini LLM (requires `GEMINI_API_KEY`) to evaluate parsed CV content and return scores/recommendations.

Development notes

- This project uses TypeScript, React and Vite. Check `tsconfig.json` and `vite.config.ts` for build settings.
- If you need to add additional file formats, extend `services/fileParser.ts`.

Troubleshooting

- If the app fails to call the LLM, verify `GEMINI_API_KEY` is set and valid.
- If file parsing is incorrect for specific DOCX/PDF files, try converting to plain text and re-testing; consider adding a more robust parser library if needed.

License & attribution

- See `metadata.json` for app metadata. Replace or update the project image/banner as needed.

Contact

- For questions about this repository, open an issue or update the README with additional project-specific instructions.

Publishing & deploying

This project can be published to GitHub and deployed to Netlify. Below are step-by-step instructions.

1) Push to GitHub

```
git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

2) Netlify setup (two options)

- Option A: Connect repository via Netlify UI
	1. In Netlify, click "New site from Git" and choose GitHub.
	2. Select your repository.
	3. Set the build command to `npm run build` and the publish directory to `dist`.
	4. Add `GEMINI_API_KEY` as an environment variable in the Netlify site settings if you want the key available at build time.

- Option B: Automated deploy via GitHub Actions
	1. In your GitHub repository settings, add two repository secrets:
		 - `NETLIFY_AUTH_TOKEN` — a Netlify Personal Access Token (create in Netlify user settings).
		 - `NETLIFY_SITE_ID` — your Netlify site ID (found in the Site settings -> Site information).
	2. Push to the `main` branch and the GitHub Actions workflow `.github/workflows/deploy-netlify.yml` will build and deploy on each push.

Notes

- The GitHub Actions job uses `netlify/actions/cli` with the `deploy` command; ensure your site is set up in Netlify and `NETLIFY_SITE_ID` matches.
- If you don't want secrets in GitHub, use Netlify's direct GitHub integration (Option A).

