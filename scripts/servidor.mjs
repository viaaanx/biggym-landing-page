#!/usr/bin/env node
// Servidor estático mínimo para desenvolvimento local (sem dependências).
// Uso: npm start            -> serve a raiz em http://localhost:8080
//      npm start -- dist    -> serve o build gerado por npm run build

import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const raiz = resolve(import.meta.dirname, '..', process.argv[2] ?? '.');
const porta = Number(process.env.PORT ?? 8080);

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
};

createServer((req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  let arquivo = normalize(join(raiz, caminho));
  if (!arquivo.startsWith(raiz)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(arquivo) && statSync(arquivo).isDirectory()) arquivo = join(arquivo, 'index.html');
  if (!existsSync(arquivo)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado');
    return;
  }
  res.writeHead(200, { 'Content-Type': TIPOS[extname(arquivo).toLowerCase()] ?? 'application/octet-stream' });
  createReadStream(arquivo).pipe(res);
}).listen(porta, () => console.log(`Big Gym em http://localhost:${porta} (servindo ${raiz})`));
