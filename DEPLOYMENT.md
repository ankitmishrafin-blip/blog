# Ankit Mishra — personal blog deployment guide

Production URL: **https://blog.ankitmishraofficial.com**

Stack: Astro 6 (static) → Cloudflare Pages · Content in Git (Markdown/MDX) ·
CMS: Sveltia CMS (static SPA at `/admin`) + official `sveltia-cms-auth`
Cloudflare Worker for GitHub OAuth. No database, no backend, no paid services.

---

## 1. What was implemented (already in this repo)

- Site identity via `astro-theme-config.ts`: title/author **Ankit Mishra**,
  tagline, nav (Posts, Notes, Projects, Now, About), canonical origin
  `https://blog.ankitmishraofficial.com`, placeholder About/Now/Projects copy
  (clearly marked — replace with your own words).
- Content: `posts` collection (articles/essays, + `tags`) and a new `notes`
  collection (short-form), both Markdown/MDX with `draft` support.
  Drafts are excluded from pages, RSS, sitemap, and search (verified).
- New routes: `/notes`, `/notes/[slug]`, `/projects` (curated static page),
  `/now` (placeholder), `/tags`, `/tags/[tag]`, `/archive`.
- Homepage recomposed as a personal publication (identity, featured, latest,
  notes, topics, projects/now/about links) reusing Astro Tone styles.
- SEO: canonical, OG/Twitter, article JSON-LD, RSS (posts+notes), sitemap,
  `robots.txt` (disallows `/admin`), `/og.png` fallback.
- Performance/security headers in `public/_headers`.
- CI-friendly Cloudflare Pages deploy workflow
  (`.github/workflows/deploy.yml` via `cloudflare/wrangler-action`).
- CMS: static Sveltia CMS at `/admin` (`public/admin/index.html` +
  `public/admin/config.yml`).

## 2. What YOU must configure manually (one-time)

### A. Create the GitHub repository

1. Create/push this project to GitHub (e.g. `ankitmishracoach-ai/blog`).
2. In `public/admin/config.yml`, set `backend.repo` to your `owner/repo`.

### B. GitHub OAuth App (for CMS login)

1. GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App.
2. Application name: anything, e.g. `Ankit blog CMS`.
3. Homepage URL: `https://blog.ankitmishraofficial.com`
4. **Authorization callback URL:** your Worker URL + `/callback`
   (e.g. `https://YOUR-AUTH-WORKER.workers.dev/callback`).
   You get this URL after step C — come back and fill it in.
5. Register, copy the **Client ID**, then generate a **Client Secret**
   (shown once — store it for step C).

### C. Cloudflare `sveltia-cms-auth` Worker (official auth)

1. Deploy the official worker per Sveltia CMS docs
   (“Workers Auth” / `sveltia-cms-auth`) to your Cloudflare account.
2. Set its encrypted environment variables/secrets: GitHub OAuth
   **Client ID** and **Client Secret** from step B, plus anything else the
   official worker README requires (follow that README exactly).
3. Note the Worker URL, finish step B.4, then set in
   `public/admin/config.yml`: `backend.base_url` to the Worker URL
   (replace the `REPLACE-WITH-YOUR-AUTH-WORKER` placeholder).

Security model: only the OAuth **Client ID** (public) is referenced;
the **Client Secret** lives solely as an encrypted Worker secret and never
reaches the browser. Anyone visiting `/admin` sees only a login screen —
without a token from YOUR GitHub OAuth App (granted only to accounts with
write access to YOUR repo) they cannot read or change anything.
Repo write access = CMS access, enforced by GitHub, with GPG-signed commits.

### D. Cloudflare Pages project + DNS for `blog.ankitmishraofficial.com`

Option 1 — Dashboard (simplest):

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
2. Build settings: command `npm run build`, output `dist`, Node `22`.
3. Env vars: `ASTRO_SITE_URL=https://blog.ankitmishraofficial.com`,
   `ASTRO_SITE_BASE=` (empty).
4. Custom domain → add `blog.ankitmishraofficial.com` (CNAME automatic if
   your DNS is on Cloudflare, otherwise add the shown CNAME manually).
5. Optional: delete `.github/workflows/deploy.yml` if you use this path.

Option 2 — GitHub Action (already wired):

1. Create the Pages project once (name `ankit-blog`, or update
   `--project-name` in `deploy.yml`).
2. Repo → Settings → Secrets → Actions: `CLOUDFLARE_API_TOKEN`
   (Pages:Edit) and `CLOUDFLARE_ACCOUNT_ID`.
3. Push to `main` — the action builds and runs `pages deploy dist`.

DNS: `blog.ankitmishraofficial.com` must resolve to the Pages project.
TLS is issued automatically by Cloudflare.


## 3. Publishing workflow

- New article: `/admin` → Posts → New → fill fields → Save as draft
  (`draft: true`) or Publish (`draft: false`). The commit goes to `main` and
  Cloudflare rebuilds automatically.
- Drafts never appear in pages, RSS, sitemap, or search (verified by probe).
- Edit: open the entry in `/admin`, change, save (new commit).
- Update date: set `updatedDate` to show “Updated …” on the article.
- Delete: remove the file in Git (`src/content/posts/<slug>.md(x)` or
  `src/content/notes/<slug>.md`) and push.
- Notes: `/admin` → Notes → same flow, no cover/category fields.
- Projects/Now/About edits: hand-edit `src/pages/projects.astro`,
  `src/pages/now.astro`, `astro-theme-config.ts` (about) in Git.

## 4. Image rule (important — learned the hard way)

- CMS uploads go to `public/uploads/` and are inserted **in the Markdown body**
  as `![alt](/uploads/file.jpg)` — plain `<img>`, no build involvement. Safe.
- NEVER put a root-relative path (`/uploads/…`) in a post's `heroImage`
  frontmatter: Astro's content pipeline treats it as a build-time image asset
  and the build FAILS with `ImageNotFound` when the file pattern doesn't
  resolve. Covers stay build-optimized local files under `src/assets/`
  (relative path, edit via Git) or absolute remote `https://…` URLs.

## 5. Tests performed

- `npx astro check`: 0 errors, 0 warnings, 0 hints (57 files).
- `npm run build` + Pagefind: all routes emit; 7 pages indexed.
- Draft probe: temp draft excluded from pages, RSS, sitemap (then deleted).
- String-`heroImage` probe: confirmed the crash, applied the body-upload fix,
  removed the probe, rebuilt clean.
- Live preview audit: `/`, `/posts`, `/notes`, note page, `/projects`,
  `/now`, `/about`, `/archive`, `/tags`, tag pages, post pages, `/search`,
  `/admin`, `/rss.xml`, `/robots.txt`, sitemap — all 200; bad path → 404.
- Content checks: hero title, home sections, note meta/tags, archive
  Post/Note kinds, tag counts, OG/canonical tags, `/og.png` fallback.
- Secret scan of `dist/*.js,*.html`: no tokens/secrets found.

## 6. Remaining limitations / decisions for you

- CMS OAuth is NOT live until you do steps B–C above.
- `public/uploads/` has only `.gitkeep` — the first CMS image upload fills it.
- Comments are off (`comments.mode: 'off'`); enable giscus later if wanted.
- Analytics: none (per brief).
- About/Now/Projects copy is placeholder — write your own words.
- Demo posts (`*-v2`) and `placeholder-post.md` are still live; delete them
  when you publish real writing.
- `public/_redirects` is intentionally empty (no redirects needed yet).
