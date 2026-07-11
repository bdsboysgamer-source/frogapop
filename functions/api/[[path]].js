// Cloudflare Pages Function — Frogapop leaderboard API.
// Routes (same origin as the app):
//   GET  /api/health           -> { ok }        (ok=true only when D1 is bound)
//   POST /api/account {name}   -> { ok, name, token }
//   POST /api/score  {token,key,score} -> { ok, rank, best }
//   GET  /api/board?key=&limit=&me= -> { ok, entries:[{name,score,rank,you}] }
//
// Requires a D1 binding named DB (see LEADERBOARD_SETUP.md). If DB is not
// bound, /health reports ok:false and the client stays on local boards.

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

function token() {
  const b = new Uint8Array(24);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

async function ensureSchema(db) {
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, token TEXT UNIQUE, created INTEGER)'),
    db.prepare('CREATE TABLE IF NOT EXISTS scores (user_id INTEGER, key TEXT, score INTEGER, updated INTEGER, PRIMARY KEY(user_id, key))'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_scores_key ON scores(key, score DESC)'),
  ]);
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const db = env.DB;
  const parts = Array.isArray(params.path) ? params.path : [params.path].filter(Boolean);
  const route = parts.join('/');
  const url = new URL(request.url);

  try {
    if (route === 'health') return json({ ok: !!db });
    if (!db) return json({ ok: false, error: 'no-db' }, 503);
    await ensureSchema(db);

    if (route === 'account' && request.method === 'POST') {
      const { name } = await request.json();
      if (!/^[A-Za-z0-9 _-]{3,16}$/.test(name || '')) return json({ ok: false, error: 'bad-name' }, 400);
      const existing = await db.prepare('SELECT id FROM users WHERE name = ?').bind(name).first();
      if (existing) return json({ ok: false, error: 'name-taken' }, 409);
      const tok = token();
      await db.prepare('INSERT INTO users (name, token, created) VALUES (?, ?, ?)').bind(name, tok, Date.now()).run();
      return json({ ok: true, name, token: tok });
    }

    if (route === 'score' && request.method === 'POST') {
      const { token: tok, key, score } = await request.json();
      const s = Math.max(0, Math.min(1e9, Math.floor(Number(score) || 0)));
      if (!tok || !key) return json({ ok: false, error: 'bad-req' }, 400);
      const user = await db.prepare('SELECT id, name FROM users WHERE token = ?').bind(tok).first();
      if (!user) return json({ ok: false, error: 'bad-token' }, 401);
      // keep only the best score per (user,key)
      await db.prepare(
        `INSERT INTO scores (user_id, key, score, updated) VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(user_id, key) DO UPDATE SET score = MAX(score, ?3), updated = ?4`
      ).bind(user.id, key, s, Date.now()).run();
      const best = await db.prepare('SELECT score FROM scores WHERE user_id = ? AND key = ?').bind(user.id, key).first();
      const rankRow = await db.prepare('SELECT COUNT(*) AS n FROM scores WHERE key = ? AND score > ?').bind(key, best.score).first();
      return json({ ok: true, best: best.score, rank: (rankRow.n || 0) + 1 });
    }

    if (route === 'board' && request.method === 'GET') {
      const key = url.searchParams.get('key');
      const me = url.searchParams.get('me');
      const limit = Math.max(1, Math.min(50, Number(url.searchParams.get('limit')) || 25));
      if (!key) return json({ ok: false, error: 'bad-req' }, 400);
      const rows = await db.prepare(
        'SELECT u.name AS name, s.score AS score FROM scores s JOIN users u ON u.id = s.user_id WHERE s.key = ? ORDER BY s.score DESC LIMIT ?'
      ).bind(key, limit).all();
      const entries = (rows.results || []).map((r, i) => ({ name: r.name, score: r.score, rank: i + 1, you: me && r.name === me }));
      return json({ ok: true, entries });
    }

    return json({ ok: false, error: 'not-found' }, 404);
  } catch (err) {
    return json({ ok: false, error: 'server', detail: String(err && err.message || err) }, 500);
  }
}
