# Engineering Notebook Site

This repo contains the frontend for a public engineering notebook: a site focused on AI-native engineering, systems thinking, production hardening, and verification.

## What This Repo Is For

- Render the website UI
- Surface essays, learning notes, and build logs
- Give readers a place to react, comment, and ask questions via GitHub Discussions

## Recommended Repo Split

- `engineering-notebook-site`: the website code
- `engineering-notebook-content`: the permanent Markdown content archive

The content repo should remain the long-term source of truth.

## Automatic Content Workflow

The website now reads notebook entries from a separate sibling repo:

- local default content path: `../engineering-notebook-content`
- generator: `scripts/content/build-content.mjs`
- generated site data: `src/generated/notebook-content.ts`

During local development and production builds:

1. the site reads Markdown from `engineering-notebook-content`
2. it generates `src/generated/notebook-content.ts`
3. Vite renders the latest content automatically

When Markdown files change while `npm run dev` is running, the Vite plugin regenerates content and reloads the page.

## Local Development

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local`
3. Fill in the optional Giscus values if you want live comments
4. Make sure the sibling repo exists at `../engineering-notebook-content`
5. Run the dev server:
   `npm run dev`

Useful commands:

- `npm test`: verify the content loader
- `npm run content:build`: regenerate notebook content manually
- `npm run build`: generate content and build the static site

## Reader Discussions

This site is wired for GitHub Discussions via Giscus.

To enable it:

1. Enable GitHub Discussions on your GitHub repo
2. Create a discussion category for notebook feedback
3. Get the repo and category IDs from Giscus
4. Add them to `.env.local`

Once configured, readers can:

- react to individual notes
- comment inline
- ask broader follow-up questions in Discussions

## GitHub Automation

Two workflow files are included:

- site repo: `.github/workflows/deploy-site.yml`
- content repo: `engineering-notebook-content/.github/workflows/notify-site.yml`

To finish the cross-repo deployment setup on GitHub:

1. Create two GitHub repos:
   - `engineering-notebook-site`
   - `engineering-notebook-content`
2. Push each local repo to its matching GitHub repo
3. In the content repo, add a secret named `SITE_REPO_PAT`
   - it should be a personal access token with permission to dispatch workflows in the site repo
4. Replace the placeholder `your-github-username/...` values in:
   - `src/siteConfig.ts`
   - `.env.example`
   - `.github/workflows/deploy-site.yml`
   - `engineering-notebook-content/.github/workflows/notify-site.yml`
5. Enable GitHub Pages on the site repo and use GitHub Actions as the source

After that, the publishing loop becomes:

`edit Markdown -> push content repo -> dispatch site rebuild -> GitHub Pages publishes updated site`
