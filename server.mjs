import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = process.env.PORT || 8080;
const IMAGES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'images');

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.bmp': 'image/bmp',
  '.tiff': 'image/tiff',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);

  // Listing at root
  if (urlPath === '/') {
    const files = fs.readdirSync(IMAGES_DIR).filter((f) => MIME[path.extname(f).toLowerCase()]);
    const links = files.map((f) => `<li><a href="/${encodeURIComponent(f)}">${f}</a></li>`).join('\n');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>Images</h1><ul>${links}</ul>`);
    return;
  }

  const filePath = path.join(IMAGES_DIR, urlPath);
  // Keep requests inside the images folder
  if (!filePath.startsWith(IMAGES_DIR + path.sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  const type = MIME[path.extname(filePath).toLowerCase()];
  if (!type || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404).end('Not found');
    return;
  }

  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': fs.statSync(filePath).size,
    'Cache-Control': 'public, max-age=3600',
    'Access-Control-Allow-Origin': '*',
  });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Image server running at http://0.0.0.0:${PORT}/ (serving ${IMAGES_DIR})`);
});
