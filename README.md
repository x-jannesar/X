# X — Multi-site platform

A free-tier-first starter for managing multiple independent websites from one GitHub repository.

## Architecture
- `sites.json` stores site identifiers, hostnames, titles, and copy.
- `src/worker.js` is a Cloudflare Worker that resolves a request hostname to the appropriate site.
- `wrangler.jsonc` configures deployment.
- No domains are attached yet. Each custom domain requires its own DNS and Cloudflare configuration.

## Deploy
1. In Cloudflare, go to **Compute (Workers & Pages)** and create a Worker connected to this GitHub repository.
2. Set build command to `npm run build` (or leave blank if Cloudflare offers Worker config autodetection), deploy command to `npx wrangler deploy`, and use the root directory.
3. Deploy to a free `*.workers.dev` address to test.
4. Add real domains individually through the Worker **Settings > Domains & Routes** when the DNS zones are active in Cloudflare.

Do not commit API tokens, secrets, or private customer data. This is a demonstration, not a production-ready multi-tenant CMS.
