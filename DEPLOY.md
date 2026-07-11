# Deploying Frogapop as a Cloudflare Worker

The repo is set up so you can deploy the **whole project** (game + API) by
just connecting it — no manual build config needed.

## One-time: connect the repo
1. Cloudflare dashboard → **Workers & Pages → Create → Workers → Import a repository**.
2. Pick this GitHub repo and the branch (e.g. `testing` to preview, `main` for prod).
3. Leave the defaults — Cloudflare reads `wrangler.toml`:
   - **Build command:** `npm install && npm run build` (already in `wrangler.toml`)
   - **Deploy command:** `npx wrangler deploy` (default)
4. Click **Deploy**.

That's it. Cloudflare builds the site into `./dist`, serves it via the
`ASSETS` binding, and runs `worker/index.js`. Requests to `/api/*` hit the
leaderboard API; everything else is the game.

Verify at `https://<your-worker>.workers.dev/` (the game) and
`https://<your-worker>.workers.dev/api/health` → `{"ok":false}` until D1 is on.

## Optional: turn on global leaderboards (D1)
Without this, leaderboards are per-device (the app still works fully).
See **LEADERBOARD_SETUP.md** — in short:
1. `npx wrangler d1 create frogapop-lb`
2. Paste the `database_id` into `wrangler.toml` and uncomment the
   `[[d1_databases]]` block.
3. Redeploy. `/api/health` now returns `{"ok":true}` and boards go global.

## Custom domain
In the Worker's **Settings → Domains & Routes**, add your domain
(e.g. `frogapop.afkp.cc`). If it currently points at a Pages project, move
it here.

## Local development
- Game only (fast): `npm run dev` (Vite) — leaderboards fall back to local.
- Full Worker (assets + API): `npm run cf:dev` (`wrangler dev`).
- Deploy from your machine: `npm run cf:deploy`.

## Notes
- `functions/api/` is a thin shim over the same handler, so the repo also
  still works if deployed as a Cloudflare **Pages** project instead.
- The service worker (`public/sw.js`) is network-first for navigations, so
  new deploys reach installed players automatically.
