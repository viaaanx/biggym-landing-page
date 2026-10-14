// Integridade do index.html: links, imagens e dados estruturados (PGC 5.3 e 10.1).
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { HTML } from './ambiente.js';

const doc = new DOMParser().parseFromString(HTML, 'text/html');
const raiz = resolve(import.meta.dirname, '..');

describe('index.html', () => {
  it('todos os arquivos locais referenciados existem no repositório', () => {
    const refs = [
      ...[...doc.querySelectorAll('[src], [href]')].map((el) => el.getAttribute('src') ?? el.getAttribute('href')),
      ...[...doc.querySelectorAll('[data-lightbox]')].map((el) => el.dataset.lightbox),
    ];
    const locais = refs.filter((r) => r && !/^(https?:|mailto:|tel:|#|data:)/.test(r));
    expect(locais.length).toBeGreaterThan(0);
    const faltando = locais.filter((r) => !existsSync(resolve(raiz, r.split(/[?#]/)[0])));
    expect(faltando).toEqual([]);
  });

  it('toda imagem tem texto alternativo', () => {
    const semAlt = [...doc.querySelectorAll('img')].filter((img) => !img.hasAttribute('alt'));
    expect(semAlt).toEqual([]);
  });

  it('links do WhatsApp apontam para o número da academia e abrem com segurança', () => {
    const links = [...doc.querySelectorAll('a[href*="wa.me"]')];
    expect(links.length).toBeGreaterThan(0);
    for (const a of links) {
      expect(a.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/55\d{10,11}(\?text=.+)?$/);
      expect(a.getAttribute('rel') ?? '').toContain('noopener');
    }
  });

  it('o mapa da localização está incorporado com título acessível', () => {
    const mapa = doc.querySelector('iframe[title]');
    expect(mapa).not.toBeNull();
    expect(mapa.getAttribute('src') ?? mapa.dataset.src).toMatch(/^https:\/\/www\.google\.com\/maps\/embed/);
  });

  it('o JSON-LD é válido e descreve um LocalBusiness', () => {
    const bloco = doc.querySelector('script[type="application/ld+json"]');
    const dados = JSON.parse(bloco.textContent);
    const tipos = [dados['@type']].flat();
    expect(tipos.some((t) => /LocalBusiness|SportsActivityLocation|ExerciseGym|HealthClub/.test(t))).toBe(true);
    expect(dados.name).toBeTruthy();
  });

  it('tem título, descrição e URL canônica para SEO', () => {
    expect(doc.title.trim()).not.toBe('');
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBeTruthy();
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toMatch(/^https:\/\//);
  });
});
