import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.env.FRONTEND_ROOT || './dist');
const port = Number(process.env.FRONTEND_PORT || 8078);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function resolveAsset(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  const requested = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  const candidate = resolve(join(root, requested));
  if (!candidate.startsWith(root)) {
    return join(root, 'index.html');
  }
  if (existsSync(candidate) && statSync(candidate).isFile()) {
    return candidate;
  }
  return join(root, 'index.html');
}

createServer((req, res) => {
  const filePath = resolveAsset(req.url || '/');
  const ext = extname(filePath).toLowerCase();
  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  createReadStream(filePath)
    .on('error', () => {
      res.statusCode = 404;
      res.end('Not found');
    })
    .pipe(res);
}).listen(port, '0.0.0.0', () => {
  console.log(`demand-cooking-frontend listening on ${port}`);
});
