// Serves the static export (out/) under the GitHub Pages base path so you can
// verify the production build locally, exactly like the deployed site.
//
//   npm run build
//   npm start            → http://localhost:4574/developer-toolbox/
//
// Unknown paths serve out/404.html with a 404 status, like GitHub Pages.
import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PREFIX = process.env.BASE_PATH || "/developer-toolbox";
const OUT = "out";
const PORT = Number(process.env.PORT) || 4574;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
};

http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      if (!pathname.startsWith(PREFIX)) {
        res.writeHead(404).end(`This server mirrors GitHub Pages: use ${PREFIX}/`);
        return;
      }
      let rel = pathname.slice(PREFIX.length).split("?")[0] || "/";
      if (rel.endsWith("/")) rel += "index.html";
      const safe = normalize(rel).replace(/^([.][.][\\/])+/, "");
      try {
        const data = await readFile(join(OUT, safe));
        res.writeHead(200, {
          "content-type": MIME[extname(safe)] ?? "application/octet-stream",
        });
        res.end(data);
      } catch {
        const data = await readFile(join(OUT, "404.html"));
        res.writeHead(404, { "content-type": "text/html" });
        res.end(data);
      }
    } catch (error) {
      res.writeHead(500).end(String(error));
    }
  })
  .listen(PORT, "127.0.0.1", () => {
    console.log(`Static export served at http://127.0.0.1:${PORT}${PREFIX}/`);
  });
