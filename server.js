const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 8080;
const DIR  = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  let url = req.url.replace(/^\/plants/, '') || '/';
  if (url === '/') url = '/index.html';

  const file = path.join(DIR, url);
  const ext  = path.extname(file);

  // Prevent path traversal: resolved path must stay within DIR
  if (!file.startsWith(DIR + path.sep) && file !== DIR) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Plants app running on http://0.0.0.0:${PORT}/plants/`);
});
