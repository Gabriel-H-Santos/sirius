# Sirius

![ci](https://github.com/Gabriel-H-Santos/sirius/actions/workflows/ci.yml/badge.svg)

Plataforma de cuidado com pets: cadastro de tutores e animais, acompanhamento de
saúde e, futuramente, monitoramento por coleira inteligente.

O nome vem de α Canis Majoris, a *Dog Star* — a estrela cuja ascensão os egípcios
liam como sinal periódico para prever a cheia do Nilo. Ler sinais de um cão e
transformá-los em previsão útil é a tese do sistema.

Monorepo com entrega faseada. Fase atual: **fundação** — a API sobe e responde; os
módulos de negócio entram nas próximas fases.

## Rodando

```bash
nvm use
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm db:up      # PostgreSQL local via docker compose
pnpm db:migrate # aplica as migrations pendentes
pnpm dev        # API em http://localhost:3000/health
```

O `/health` verifica a conexão com o banco: responde `200` com tudo de pé e `503`
se o banco estiver fora.

Para subir a stack completa em contêiner (a mesma imagem que o CI valida em todo
PR), com as variáveis vindas do `.env` da raiz (`cp .env.example .env` para
personalizar; sem ele valem os padrões):

```bash
pnpm infra:up     # constrói a imagem e sobe API + PostgreSQL
pnpm infra:logs   # acompanha a API
pnpm infra:down   # derruba tudo
```

## Estrutura

```
apps/api/       API NestJS
docs/adrs/      registros de decisão de arquitetura
docs/spikes/    investigações numeradas que sustentam as decisões
docs/diagrams/  diagramas numerados, em Mermaid
```

Toda decisão estrutural tem um registro em [`docs/adrs/`](docs/adrs/) — com as
alternativas descartadas e o sinal que faria a decisão ser revista. O fluxo de
trabalho (branches, PR, CI) está na
[ADR-0007](docs/adrs/0007-fluxo-de-entrega.md), com os desenhos em
[`docs/diagrams/`](docs/diagrams/).
