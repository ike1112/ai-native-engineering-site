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

## Drafts and the publish gate

Each content entry's frontmatter carries a `status` field (`published` or `draft`).

- `npm run dev` previews **everything**, including drafts, so you can review an
  entry locally before it goes live. Nothing here is public.
- `npm run build` (production, and the deploy pipeline) **excludes** any entry
  with `status: draft`. A draft can be committed and pushed safely and still
  stay off the live site until you flip it to `status: published`.

So the loop is: write with `status: draft` → preview with `npm run dev` →
flip to `status: published` → push. Editing is just editing the Markdown;
"publish" is the status flip plus a push.

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

Two workflow files drive cross-repo deployment:

- site repo: `.github/workflows/deploy-site.yml` — builds and publishes to GitHub Pages on push, on a `content-updated` dispatch, or manually.
- content repo: `.github/workflows/notify-site.yml` — dispatches `content-updated` to the site repo when content changes.

The repo references are already wired:

- site repo: `ike1112/ai-native-engineering-site`
- content repo: `ike1112/ai-native-engineering-content`

Both repos are private, so the workflows authenticate with a personal access token. To finish the setup on GitHub (one-time, manual):

1. Create one personal access token that can read the content repo and trigger
   workflows on the site repo. Simplest: a classic PAT with the `repo` scope.
   A fine-grained PAT scoped to both repos with Contents: read/write also works.
2. Add that token as a secret named `NOTEBOOK_PAT` in **both** repos
   (Settings → Secrets and variables → Actions → New repository secret).
3. On the **site** repo, enable GitHub Pages with **GitHub Actions** as the
   source (Settings → Pages).

After that, the publishing loop runs on its own:

`edit Markdown -> flip status to published -> push content repo -> notify-site dispatches -> deploy-site builds -> GitHub Pages publishes`
