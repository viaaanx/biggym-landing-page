// Prepara o jsdom com o index.html real e os recursos de navegador que ele não tem.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { vi } from 'vitest';

export const HTML = readFileSync(resolve(import.meta.dirname, '../index.html'), 'utf8');

/** Observadores criados pelo script, para os testes dispararem a interseção. */
export const observadores = [];

class IntersectionObserverFalso {
  constructor(callback) {
    this.callback = callback;
    this.alvos = new Set();
    observadores.push(this);
  }
  observe(el) { this.alvos.add(el); }
  unobserve(el) { this.alvos.delete(el); }
  disconnect() { this.alvos.clear(); }
  /** Simula os elementos observados entrando na tela. */
  disparar() {
    const entradas = [...this.alvos].map((target) => ({ target, isIntersecting: true }));
    this.callback(entradas, this);
  }
}

export function montarPagina({ semIntersectionObserver = false } = {}) {
  observadores.length = 0;
  const corpo = HTML.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1];
  document.body.innerHTML = corpo.replace(/<script[\s\S]*?<\/script>/gi, '');
  document.body.className = '';
  document.body.style.overflow = '';

  if (semIntersectionObserver) {
    delete window.IntersectionObserver;
  } else {
    window.IntersectionObserver = IntersectionObserverFalso;
  }
  window.scrollTo = vi.fn();
  Element.prototype.scrollBy = vi.fn();
  vi.stubGlobal('requestAnimationFrame', (cb) => setTimeout(() => cb(performance.now()), 16));
}

/** Executa script.js de novo, como se a página tivesse acabado de carregar. */
export async function carregarScript() {
  vi.resetModules();
  await import('../script.js');
}
