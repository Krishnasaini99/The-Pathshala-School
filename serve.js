const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, 'dist', 'pathshala-school', 'browser');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.ico': 'image/x-icon' };
http.createServer((req, res) => {
  let f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(root, 'index.html');
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'text/plain' });
  fs.createReadStream(f).pipe(res);
}).listen(4200, () => console.log('PathShala site running at http://localhost:4200'));
