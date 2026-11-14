import config from "../sites.json";

const sites = config.sites;
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function render(site) {
  const title = escapeHtml(site.title);
  const subtitle = escapeHtml(site.subtitle);
  const description = escapeHtml(site.description);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${description}"><title>${title}</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a1220;color:#eef3fa;font-family:system-ui,-apple-system,sans-serif}main{max-width:700px;padding:42px 28px}span{color:#79c7ff;letter-spacing:.15em;text-transform:uppercase;font-size:12px}h1{font-size:clamp(40px,9vw,78px);line-height:1.05;margin:16px 0}h2{font-size:22px;font-weight:400;color:#c7d5e5}p{line-height:1.7;color:#9baec4}hr{border:0;border-top:1px solid #304057;margin:32px 0}</style></head><body><main><span>Independent website</span><h1>${title}</h1><h2>${subtitle}</h2><hr><p>${description}</p></main></body></html>`;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase().replace(/\.$/, "");
    const preview = url.searchParams.get("site");
    const isPreviewHost = host.endsWith(".workers.dev") || host === "localhost" || host === "127.0.0.1";
    const site = (isPreviewHost && preview ? sites.find((s) => s.id === preview) : null)
      ?? sites.find((s) => s.domains.some((d) => d.toLowerCase() === host));

    if (!site) {
      if (isPreviewHost) {
        return new Response(JSON.stringify({message:"Multisite worker is running",previewSites:sites.map((s)=>({id:s.id,previewPath:"/?site="+encodeURIComponent(s.id)}))}),{headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
      }
      return new Response("Unknown website", {status:404,headers:{"content-type":"text/plain; charset=utf-8"}});
    }
    return new Response(render(site), {headers:{"content-type":"text/html; charset=utf-8","x-content-type-options":"nosniff"}});
  }
};
