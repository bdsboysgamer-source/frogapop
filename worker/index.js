// Cloudflare Worker entry point.
//
// Deploy model: connect this GitHub repo as a Worker. Wrangler builds the
// site (`npm run build` → ./dist), uploads it via the ASSETS binding, and
// runs this script. Requests to /api/* hit the leaderboard API; everything
// else is served as a static asset, with an index.html fallback for SPA
// navigations. No manual steps required (D1 is optional — see wrangler.toml).

import { handleApi } from './api.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      return handleApi(request, env);
    }

    // static asset
    const res = await env.ASSETS.fetch(request);
    if (res.status === 404 && request.method === 'GET' &&
        (request.headers.get('accept') || '').includes('text/html')) {
      // SPA fallback → serve the app shell
      return env.ASSETS.fetch(new Request(new URL('/index.html', url), request));
    }
    return res;
  },
};
