I’d separate the project into two private repos with one clear job each.

The website repo is the product layer: layout, styling, components, navigation, deployment, SEO, analytics, and any integrations like comments or email later. This repo changes when we change how the site looks or behaves.

The content repo is the knowledge layer: your articles, build notes, reading notes, metadata, tags, dates, and any future drafts. This repo changes when you publish or revise your actual thinking. That keeps your writing durable, portable, and independent from the frontend.

The workflow I’d use is simple:
1. Write or edit content in the private content repo as Markdown.
2. A small build step pulls that content into the site repo automatically.
3. The website rebuilds whenever content changes, so updates appear on the site without hand-editing the frontend.
4. Design and structure stay in the site repo; ideas and writing stay in the content repo.

Why this is the best setup for you:
- Your actual content stays preserved separately “forever” and is not trapped inside UI code.
- You can redesign the website later without touching the writing archive.
- You can reuse the same content for another site, newsletter, PDF, or book later.
- It matches how serious publishing systems usually work: presentation separated from source material.

What I’d recommend next:
- Keep both repos private for now.
- Use the current site repo as the frontend.
- Keep all real articles in the content repo.
- Replace GitHub-based comments with a private-friendly system later if you still want on-site discussion.
- Continue refining the homepage message first, then wire the content rendering pipeline more cleanly.

In one sentence: the website should be the shell, and your real content should live in its own private source-of-truth repo.