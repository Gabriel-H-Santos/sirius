# Sirius

![ci](https://github.com/Gabriel-H-Santos/sirius/actions/workflows/ci.yml/badge.svg)

Plataforma de cuidado com pets: cadastro de tutores e animais, acompanhamento de
saúde e, futuramente, monitoramento por coleira inteligente.

## Por que Sirius

> **Sirius, α Canis Majoris — a Estrela do Cão.** A mais brilhante do céu
> noturno, na constelação do Cão Maior. No Egito antigo, sua ascensão antes do
> Sol marcava o momento de prever a cheia do Nilo: os egípcios observavam um
> cão no céu para antecipar o que mais importava na terra.
>
> Observar sinais de um cão e transformá-los em previsão útil é a tese deste
> sistema — hoje no cadastro e na ficha de saúde; adiante, na coleira que lê os
> sinais vitais de verdade.

## Rodando

```bash
nvm use
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm db:up      # PostgreSQL local via docker compose
pnpm db:migrate # aplica as migrations pendentes
pnpm dev        # API em http://localhost:3000/health
pnpm test       # suíte de testes (test:cov mede cobertura com portão)
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

## Arquitetura

Monólito modular (NestJS) entregue em quatro fases — cada fase liga módulos
novos sem reescrever os anteriores. A decisão e as alternativas estão na
[ADR-0002](docs/adrs/0002-monolito-modular-com-entrega-faseada.md), que aponta
para os dois desenhos que resumem o sistema: a
[visão macro](docs/diagrams/0004-visao-macro.md) e as
[fases de entrega](docs/diagrams/0005-fases-de-entrega.md).

Toda decisão estrutural tem registro numerado, com alternativas descartadas e o
sinal que faria a decisão ser revista. A trilha de leitura sugerida:

1. [`docs/adrs/`](docs/adrs/) — as decisões, em ordem;
2. [`docs/spikes/`](docs/spikes/) — as investigações que as sustentam;
3. [`docs/guides/`](docs/guides/) — princípios e padrões aplicados ao código;
4. [`.spec/`](.spec/) — as features, da especificação ao plano executado;
5. [`docs/diagrams/`](docs/diagrams/) — os desenhos, fonte única referenciada
   pelos documentos acima.

## Estrutura

```
apps/api/       API NestJS (módulos em quatro camadas)
docs/adrs/      registros de decisão de arquitetura
docs/spikes/    investigações numeradas que sustentam as decisões
docs/guides/    princípios e padrões de código aplicados ao projeto
docs/diagrams/  diagramas numerados, em Mermaid
.spec/          especificações de feature: spec e plano antes do código
.claude/        contexto e receitas para desenvolvimento assistido por IA
```

## Próximos passos

A fase 1 está com o primeiro módulo completo (`identity`: migration, domínio,
borda HTTP com tratamento de erros, testes). O plano do que vem a seguir — as
fases do produto e o backlog de engenharia (lint, hooks de commit,
observabilidade, travas de fronteira), cada item com o gatilho que o traz —
está em [docs/proximos-passos.md](docs/proximos-passos.md).
