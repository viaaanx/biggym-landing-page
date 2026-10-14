# Big Gym Landing Page

Landing page desenvolvida para uma academia real (Big Gym), com foco em presença digital, estrutura semântica e experiência do usuário.

<img width="1600" height="899" alt="Página inicial da Big Gym Landing Page" src="https://github.com/user-attachments/assets/cc5bdafa-6fb1-47c0-9066-17fcace07d6e" />

O repositório segue o **Plano de Gerenciamento de Configuração — Enfoque DevOps (CI/CD)** da BGLP, versionado em [`docs/`](docs/).

## Links

- Produção: https://viaaanx.github.io/biggym-landing-page/
- Staging: https://viaaanx.github.io/biggym-landing-page/staging/ (a partir da Aula 3)
- Repositório: https://github.com/viaaanx/biggym-landing-page

## Funcionalidades

- Navegação por seções com scroll suave e menu mobile acessível
- Hero com CTA (Comece Agora / Onde Ficamos) e contadores animados
- Seção de diferenciais em cards (Grid Layout)
- Seção de alimentação com overlay e efeitos de hover
- Galeria de estrutura com Lightbox (teclado, setas e contador)
- Seção de instrutores com cards interativos
- Planos com destaque para o "Mais vendido" e integração com WhatsApp
- Depoimentos em carrossel com barra de progresso (JavaScript próprio)
- Localização com mapa incorporado e tema personalizado
- Footer com links sociais (Instagram / WhatsApp)

## Stack

| Parte | Tecnologia |
|---|---|
| Site | HTML5 semântico, CSS3 (Flexbox + Grid), JavaScript vanilla |
| SEO | JSON-LD `LocalBusiness`, Open Graph, Twitter Cards, `sitemap.xml` |
| Qualidade | HTMLHint, Stylelint, ESLint, Vitest + jsdom, Lighthouse CI |
| Ferramentas | Node.js 22 (só para lint, testes e build; o site não depende de Node) |
| Hospedagem | GitHub Pages |

## Estrutura

```
index.html  style.css  script.js     o site (publicado)
assets/  robots.txt  sitemap.xml     imagens e SEO (publicados)
tests/                               testes automatizados (Vitest)
scripts/build.mjs                    monta dist/ só com os arquivos publicados
.github/                             templates de PR/Issue, CODEOWNERS e workflows
docs/                                Plano de Gerenciamento de Configuração (PGC)
```

## Como rodar localmente

Pré-requisito: [Node.js 22](https://nodejs.org/) (o arquivo `.nvmrc` indica a versão).

```bash
git clone https://github.com/viaaanx/biggym-landing-page.git
cd biggym-landing-page
npm ci            # instala exatamente as versões do package-lock.json
npm start         # abre o site em http://localhost:8080
```

Sem Node, basta abrir o `index.html` no navegador (ou usar a extensão Live Server do VS Code).

## Como rodar os testes e as verificações

| Comando | O que faz |
|---|---|
| `npm run lint` | HTMLHint (`index.html`), Stylelint (`style.css`) e ESLint (`script.js`) |
| `npm test` | testes do comportamento do `script.js` e da integridade do `index.html` |
| `npm run test:coverage` | testes + relatório de cobertura (mínimo de 60%, PGC 5.3) |
| `npm run build` | gera `dist/` com os arquivos que vão para o GitHub Pages |

Os testes verificam, entre outras coisas, se todo arquivo referenciado no `index.html` existe, se os links de WhatsApp estão corretos, se o JSON-LD é válido e se o menu, o lightbox, o carrossel e os contadores funcionam.

## Como contribuir

1. Abra uma Issue (modelos: Funcionalidade, Defeito ou Mudança de alto risco).
2. Crie uma branch a partir da `main`: `feature/<issue>-<descricao>`, `fix/<issue>-<descricao>` ou `hotfix/<descricao>`.
3. Abra um Pull Request com título em [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/), por exemplo `feat(planos): adiciona plano trimestral`, e preencha o checklist do template.
4. O PR precisa de **1 aprovação do par de revisão** e do pipeline de CI verde. O merge é sempre *squash*: o título do PR vira o commit na `main` e define a próxima versão.

A `main` é protegida: não aceita push direto, nem do mantenedor.

## Ambientes

| Ambiente | Onde | Como chega lá |
|---|---|---|
| Local | `http://localhost:8080` | `npm start` |
| Staging | `/biggym-landing-page/staging/` | automático a cada merge na `main` |
| Produção | `/biggym-landing-page/` | aprovação manual no Environment `production` |

## Variáveis de ambiente

O site não usa variáveis de ambiente. O `.env.example` documenta o padrão caso alguma seja necessária no futuro; valores reais vão em **GitHub Secrets**, nunca no código.
