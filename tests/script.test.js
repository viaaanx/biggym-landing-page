import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { carregarScript, montarPagina, observadores } from './ambiente.js';

const $ = (sel) => document.querySelector(sel);
const clicar = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const tecla = (key, alvo = document) =>
  alvo.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'performance'] });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('menu de navegação', () => {
  beforeEach(async () => {
    montarPagina();
    await carregarScript();
  });

  it('abre e fecha pelo botão, atualizando a acessibilidade', () => {
    const botao = $('.nav-toggle');
    clicar(botao);
    expect($('.nav-menu').classList.contains('is-open')).toBe(true);
    expect(botao.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.classList.contains('nav-open')).toBe(true);

    clicar(botao);
    expect($('.nav-menu').classList.contains('is-open')).toBe(false);
    expect(botao.getAttribute('aria-label')).toBe('Abrir menu');
  });

  it('fecha com Escape e com clique fora do menu', () => {
    clicar($('.nav-toggle'));
    tecla('Escape');
    expect($('.nav-menu').classList.contains('is-open')).toBe(false);

    clicar($('.nav-toggle'));
    clicar(document.querySelector('main') ?? document.body);
    expect($('.nav-menu').classList.contains('is-open')).toBe(false);
  });

  it('rola suavemente até a seção do link âncora', () => {
    clicar($('.nav-menu a[href="#planos"]'));
    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));
  });

  it('marca a navbar como "scrolled" depois de 40px de rolagem', () => {
    window.scrollY = 100;
    window.dispatchEvent(new Event('scroll'));
    expect($('.navbar').classList.contains('scrolled')).toBe(true);
    window.scrollY = 0;
  });
});

describe('lightbox da galeria', () => {
  beforeEach(async () => {
    montarPagina();
    await carregarScript();
  });

  it('abre na foto clicada, com legenda e contador', () => {
    const fotos = document.querySelectorAll('[data-lightbox]');
    clicar(fotos[1]);
    expect($('#lightbox').hidden).toBe(false);
    expect($('.lightbox-img').getAttribute('src')).toBe(fotos[1].dataset.lightbox);
    expect($('.lightbox-caption').textContent).toBe(fotos[1].dataset.caption);
    expect($('.lightbox-counter').textContent).toBe(`2 / ${fotos.length}`);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('navega pelas setas do teclado, voltando ao início depois da última', () => {
    const fotos = document.querySelectorAll('[data-lightbox]');
    tecla('Enter', fotos[fotos.length - 1]);
    tecla('ArrowRight');
    vi.advanceTimersByTime(200);
    expect($('.lightbox-counter').textContent).toBe(`1 / ${fotos.length}`);

    tecla('ArrowLeft');
    vi.advanceTimersByTime(200);
    expect($('.lightbox-counter').textContent).toBe(`${fotos.length} / ${fotos.length}`);
  });

  it('navega pelos botões criados pelo script', () => {
    clicar(document.querySelector('[data-lightbox]'));
    clicar($('.lightbox-nav-next'));
    vi.advanceTimersByTime(200);
    expect($('.lightbox-counter').textContent.startsWith('2 /')).toBe(true);
    clicar($('.lightbox-nav-prev'));
    vi.advanceTimersByTime(200);
    expect($('.lightbox-counter').textContent.startsWith('1 /')).toBe(true);
  });

  it('fecha com Escape e libera a rolagem da página', () => {
    clicar(document.querySelector('[data-lightbox]'));
    tecla('Escape');
    expect($('#lightbox').hidden).toBe(true);
    expect(document.body.style.overflow).toBe('');
  });
});

describe('carrossel de depoimentos', () => {
  beforeEach(async () => {
    montarPagina();
    await carregarScript();
  });

  it('cria a barra de progresso abaixo do carrossel', () => {
    expect($('.feedback-bar-wrap .feedback-bar-thumb')).not.toBeNull();
  });

  it('avança e volta um card por clique', () => {
    const trilho = $('.feedback-track');
    Object.defineProperty(trilho, 'scrollWidth', { value: 1200, configurable: true });
    Object.defineProperty(trilho, 'clientWidth', { value: 400, configurable: true });

    clicar($('[data-feedback="next"]'));
    expect(trilho.scrollBy).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));

    trilho.scrollLeft = 300;
    trilho.dispatchEvent(new Event('scroll'));
    clicar($('[data-feedback="prev"]'));
    expect(trilho.scrollBy).toHaveBeenCalledTimes(2);
    expect($('.feedback-bar-thumb').style.width).not.toBe('');
  });
});

describe('contadores do hero', () => {
  it('animam até o valor de data-target quando aparecem na tela', async () => {
    montarPagina();
    await carregarScript();
    observadores.forEach((o) => o.disparar());
    vi.advanceTimersByTime(2500);

    document.querySelectorAll('.hero-stat-number[data-target]').forEach((el) => {
      expect(el.textContent).toBe(el.dataset.target);
    });
  });
});

describe('animação de entrada das seções', () => {
  it('revela as seções quando entram na tela', async () => {
    montarPagina();
    await carregarScript();
    observadores.forEach((o) => o.disparar());
    const secoes = document.querySelectorAll('.reveal-section');
    const reveladas = [...secoes].filter(
      (s) => s.classList.contains('section-revealed') || s.classList.contains('section-visible'),
    );
    expect(reveladas.length).toBe(secoes.length);
  });

  it('mostra tudo de imediato em navegadores sem IntersectionObserver', async () => {
    montarPagina({ semIntersectionObserver: true });
    await carregarScript().catch(() => {});
    document.querySelectorAll('.reveal-section').forEach((s) => {
      expect(s.classList.contains('section-revealed')).toBe(true);
    });
  });
});
