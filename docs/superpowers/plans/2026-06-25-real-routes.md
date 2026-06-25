# Real Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace in-memory tab navigation with real browser paths for `/`, `/articles`, and `/about`, while keeping GitHub Pages direct loads working.

**Architecture:** Keep the site as a single Vite SPA and add a tiny route helper around the browser History API instead of introducing a routing library. Add a `404.html` redirect shim so GitHub Pages can bounce nested URLs back into the SPA and let the app restore the intended route.

**Tech Stack:** React 19, TypeScript, Vite, GitHub Pages, Node test runner with `tsx`

---

### Task 1: Lock route behavior with tests

**Files:**
- Create: `tests/routing.test.ts`
- Create: `src/routing.ts`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run `npx tsx --test tests/routing.test.ts` and confirm it fails because `src/routing.ts` is missing**
- [ ] **Step 3: Add minimal route helpers for known routes, base-path-aware href generation, and redirect parsing**
- [ ] **Step 4: Re-run `npx tsx --test tests/routing.test.ts` and confirm it passes**

### Task 2: Move the app onto URL-backed navigation

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Initialize the active section from `window.location.pathname` instead of hard-coded state**
- [ ] **Step 2: Replace tab buttons with anchors that update browser history without full reloads**
- [ ] **Step 3: Listen to `popstate` so back/forward stays in sync**
- [ ] **Step 4: Handle GitHub Pages redirect query on first load and normalize the visible URL**

### Task 3: Support direct loads on GitHub Pages

**Files:**
- Create: `public/404.html`

- [ ] **Step 1: Add a small redirect page that turns unknown nested requests into `/?redirect=...` under the repo base path**
- [ ] **Step 2: Build the site and confirm `dist/404.html` is emitted**

### Task 4: Verify the whole change

**Files:**
- Modify: `package.json` only if needed for routine test execution

- [ ] **Step 1: Run the targeted route test**
- [ ] **Step 2: Run `npm run lint`**
- [ ] **Step 3: Run `npm run build`**
- [ ] **Step 4: Review the built output for `index.html`, `404.html`, and the route assets**
