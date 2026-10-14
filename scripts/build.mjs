#!/usr/bin/env node
// Monta dist/ com SOMENTE os arquivos publicados do site (PGC 4.1 e 6.1).
// Configurações de lint, testes, package.json e workflows nunca vão para o GitHub Pages.
//
// Uso: npm run build            -> dist/
//      APP_VERSION=v1.2.0 npm run build   -> grava a versão em <meta name="app-version">

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const raiz = resolve(import.meta.dirname, '..');
const destino = resolve(raiz, 'dist');

// Lista explícita: o que não está aqui não é publicado.
export const PUBLICADOS = ['index.html', 'style.css', 'script.js', 'robots.txt', 'sitemap.xml', 'assets'];

rmSync(destino, { recursive: true, force: true });
mkdirSync(destino);

for (const item of PUBLICADOS) {
  const origem = resolve(raiz, item);
  if (!existsSync(origem)) {
    console.error(`Arquivo publicado não encontrado: ${item}`);
    process.exit(1);
  }
  cpSync(origem, resolve(destino, item), { recursive: true });
}

const versao = process.env.APP_VERSION;
if (versao) {
  const html = resolve(destino, 'index.html');
  const meta = `<meta name="app-version" content="${versao.replace(/[^\w.+-]/g, '')}">`;
  writeFileSync(html, readFileSync(html, 'utf8').replace('</head>', `    ${meta}\n</head>`));
}

console.log(`dist/ pronto (${PUBLICADOS.length} itens${versao ? `, versão ${versao}` : ''}).`);
