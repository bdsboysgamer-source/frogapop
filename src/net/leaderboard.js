// Leaderboard client.
//
// Talks to the Cloudflare Pages Functions API at /api/* when it's
// available and the player has an account; otherwise it degrades
// gracefully to a per-device local leaderboard stored in localStorage.
// The rest of the app never needs to care which is active.

const API = '/api';
const LOCAL_KEY = 'frogapop.lb.local';
const TIMEOUT = 6000;

function keyFor(mode, sub) {
  if (mode === 'level') return `level:${sub}`;
  if (mode === 'daily') return `daily:${sub}`;
  return mode; // endless | timetrial
}

/* ---------- local fallback store ---------- */
function loadLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || {}; } catch { return {}; }
}
function saveLocal(d) { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(d)); } catch { /* ignore */ } }

function localAdd(key, name, score) {
  const all = loadLocal();
  const list = all[key] || [];
  list.push({ name: name || 'You', score, ts: Date.now(), you: true });
  list.sort((a, b) => b.score - a.score);
  all[key] = list.slice(0, 25);
  saveLocal(all);
  return all[key];
}
function localGet(key) { return (loadLocal()[key] || []); }

/* ---------- online helpers ---------- */
async function req(path, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(`${API}${path}`, { ...opts, signal: ctrl.signal, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
    clearTimeout(t);
    if (!res.ok) return null;
    return await res.json();
  } catch { clearTimeout(t); return null; }
}

let _onlineOk = null; // cache availability for the session
export async function isOnlineAvailable() {
  if (_onlineOk !== null) return _onlineOk;
  const r = await req('/health');
  _onlineOk = !!(r && r.ok);
  return _onlineOk;
}

/** Create an account. Returns { name, token } or null on failure. */
export async function createAccount(name) {
  const r = await req('/account', { method: 'POST', body: JSON.stringify({ name }) });
  if (r && r.token) return { name: r.name, token: r.token };
  return null;
}

/**
 * Submit a score. Always records a local best; also posts online when
 * an account token is supplied and the API is reachable.
 * Returns { rank, online } (rank from online, or null).
 */
export async function submitScore({ mode, sub, score, account }) {
  const key = keyFor(mode, sub);
  localAdd(key, account?.name, score);
  if (account?.token && await isOnlineAvailable()) {
    const r = await req('/score', {
      method: 'POST',
      body: JSON.stringify({ token: account.token, key, score }),
    });
    if (r && r.ok) return { rank: r.rank ?? null, online: true };
  }
  return { rank: null, online: false };
}

/**
 * Fetch the top scores. Prefers online; falls back to local.
 * Returns { online, entries:[{name,score,rank,you}] }.
 */
export async function fetchBoard({ mode, sub, limit = 25, account }) {
  const key = keyFor(mode, sub);
  if (await isOnlineAvailable()) {
    const r = await req(`/board?key=${encodeURIComponent(key)}&limit=${limit}${account?.name ? `&me=${encodeURIComponent(account.name)}` : ''}`);
    if (r && Array.isArray(r.entries)) {
      return { online: true, entries: r.entries };
    }
  }
  const entries = localGet(key).map((e, i) => ({ ...e, rank: i + 1 }));
  return { online: false, entries };
}

export function localBest(mode, sub) {
  const list = localGet(keyFor(mode, sub));
  return list.length ? list[0].score : 0;
}
