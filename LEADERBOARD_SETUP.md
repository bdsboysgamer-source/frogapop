# Online leaderboards — Cloudflare setup (≈5 min)

The game works fully **without** this — leaderboards just stay per-device
until you switch on the backend. When you're ready for global boards:

## 1. Create a D1 database
```bash
npx wrangler d1 create frogapop-lb
```
Copy the `database_id` it prints.

## 2. Bind it to your Pages project as `DB`
**Dashboard:** Cloudflare → Workers & Pages → your `frogapop` project →
**Settings → Functions → D1 database bindings** → Add binding:
- Variable name: `DB`
- D1 database: `frogapop-lb`

Do it for **Production** (and Preview if you use it), then redeploy.

*(Or, if you deploy with Wrangler, the `wrangler.toml` in this repo already
declares the binding — just paste your `database_id` into it.)*

## 3. Schema
The API auto-creates its tables on first request, so there's nothing to run.
If you'd rather create them manually, `schema.sql` is included:
```bash
npx wrangler d1 execute frogapop-lb --remote --file=./schema.sql
```

## 4. Verify
Visit `https://<your-site>/api/health` — it should return `{"ok":true}`.
When it does, the in-game boards automatically switch from “this device”
to “global”, and signed-in players start posting scores.

## How the client behaves
- No account → plays normally, sees this-device local bests.
- Signed in + `/api/health` ok → scores post to the global board.
- Server unreachable → silently falls back to local. No errors, ever.
- Accounts never expire (the token is stored on-device permanently).

## Endpoints (`functions/api/[[path]].js`)
- `GET  /api/health`
- `POST /api/account` `{name}` → `{token}`
- `POST /api/score`  `{token,key,score}` → `{rank,best}`
- `GET  /api/board?key=&limit=&me=` → `{entries:[{name,score,rank}]}`

Score keys: `level:<id>`, `endless`, `timetrial`, `daily:<YYYY-MM-DD>`.
