import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve('dist');
const port = Number(process.env.PORT || 4173);
const host = '127.0.0.1';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${host}:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  let filePath = normalize(join(root, pathname));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = join(root, 'index.html');
  }

  response.writeHead(200, {
    'Content-Type': types[extname(filePath)] || 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);
}).listen(port, host, () => {
  console.log(`Shahin site preview: http://${host}:${port}/`);
});
