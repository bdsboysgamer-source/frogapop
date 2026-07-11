// Pages Functions shim → shares the same handler as the Worker entry.
// (Only used if you deploy this repo as a Cloudflare *Pages* project. The
// Worker deployment uses worker/index.js instead.)
import { handleApi } from '../../worker/api.js';

export const onRequest = (context) => handleApi(context.request, context.env);
