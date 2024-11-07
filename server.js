const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/submit-thought') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const { thought } = new URLSearchParams(body);
            const timestamp = new Date().toISOString();
            const entry = { timestamp, thought };

            fs.readFile('entries.json', 'utf8', (err, data) => {
                const entries = data ? JSON.parse(data) : [];
                entries.push(entry);
                fs.writeFile('entries.json', JSON.stringify(entries, null, 2), (err) => {
                    if (err) throw err;
                    res.writeHead(302, { 'Location': '/' });
                    res.end();
                });
            });
        });
    } else {
        const filePath = req.url === '/' ? 'index.html' : req.url.substring(1);
        const extname = path.extname(filePath);
        const contentType = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript'
        }[extname] || 'text/html';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
}).listen(3003, () => console.log('Server running on http://localhost:3003'));


