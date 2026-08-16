# Sirius

![ci](https://github.com/Gabriel-H-Santos/sirius/actions/workflows/ci.yml/badge.svg)

Plataforma de cuidado com pets: cadastro de tutores e animais, acompanhamento de
saúde e, futuramente, monitoramento por coleira inteligente.

## Por que o nome **"Sirius"**?

> **Sirius, α Canis Majoris — a Estrela do Cão.** A mais brilhante do céu
> noturno, na constelação do Cão Maior. No Egito antigo, sua ascensão antes do
> Sol marcava o momento de prever a cheia do Nilo: os egípcios observavam um
> cão no céu para antecipar o que mais importava na terra.
>
> Observar sinais do seu pet e transformá-los em previsão útil é a tese deste
> sistema — hoje no cadastro e na ficha de saúde; adiante, na coleira que lê os
> sinais vitais de verdade.

Não é da área de tecnologia? O [glossário](docs/glossario.md) explica os termos
do produto e da técnica em linguagem simples.

## Stack

- [Node.js 24](https://nodejs.org/) — runtime; versão exata no `.nvmrc`
- [TypeScript](https://www.typescriptlang.org/) (strict) + [NestJS 11](https://nestjs.com/) — linguagem e framework ([ADR-0001](docs/adrs/0001-typescript-e-nestjs.md))
- [PostgreSQL 17](https://www.postgresql.org/) + [TypeORM](https://typeorm.io/) — banco e ORM, schema só por migration ([ADR-0004](docs/adrs/0004-postgresql-como-banco.md), [ADR-0005](docs/adrs/0005-typeorm-como-orm.md))
- [Zod](https://zod.dev/) + [nestjs-zod](https://github.com/BenLorantfy/nestjs-zod) — validação de ambiente no boot e de entrada na borda
- [Jest](https://jestjs.io/) + [Fishery](https://github.com/thoughtbot/fishery) + [Faker](https://fakerjs.dev/) — testes com fakes de estado e factories ([ADR-0011](docs/adrs/0011-jest-como-ferramenta-de-testes.md))
- [pnpm](https://pnpm.io/) (workspace) + [Docker](https://www.docker.com/) + [GitHub Actions](https://docs.github.com/actions) — monorepo, contêiner e CI

## Como executar

### Pré-requisitos

- [Git](https://git-scm.com)
- [Node.js 24](https://nodejs.org/) — recomendo o [NVM](https://github.com/nvm-sh/nvm)
  para respeitar o `.nvmrc` sem esforço
- [Docker](https://www.docker.com/products/docker-desktop/) com Compose — para o
  PostgreSQL local e a stack em contêiner

O pnpm não precisa de instalação à parte: o `corepack` (que acompanha o Node)
ativa a versão exata travada no `package.json`.

### Instalação

```bash
# Clone o repositório e entre na pasta
git clone https://github.com/Gabriel-H-Santos/sirius.git
cd sirius

# Ative a versão certa do Node e do pnpm
nvm use
corepack enable

# Instale as dependências
pnpm install

# Crie o arquivo de ambiente da API (os padrões funcionam para uso local)
cp apps/api/.env.example apps/api/.env
```

> Precisa da garantia estrita do lockfile (o equivalente ao `npm ci`)? Use
> `pnpm install --frozen-lockfile`: instala exatamente o que está no
> `pnpm-lock.yaml` e falha se ele estiver dessincronizado do `package.json`.
> É o comando do [CI](.github/workflows/ci.yml) — explícito lá por
> documentação da intenção, já que o pnpm ativa esse modo sozinho quando
> detecta ambiente de integração contínua.

### Variáveis de ambiente

`apps/api/.env` — o ambiente da API:

| Variável | Padrão | Descrição |
|---|---|---|
| `NODE_ENV` | `development` | ambiente de execução |
| `PORT` | `3000` | porta HTTP da API |
| `DATABASE_URL` | — | conexão com o PostgreSQL — **obrigatória**, sem valor embutido no código |

`.env` da raiz — usado só pelo `docker compose` (opcional; sem ele valem os
padrões abaixo, `cp .env.example .env` para personalizar):

| Variável | Padrão | Descrição |
|---|---|---|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | `sirius` / `sirius_local` / `sirius` | credenciais do banco local |
| `POSTGRES_PORT` | `5432` | porta exposta do banco |
| `API_PORT` | `3000` | porta exposta da API em contêiner |

A validação de ambiente roda no boot: variável obrigatória ausente derruba o
processo na largada, com mensagem apontando o campo — nunca em silêncio no
meio da noite.

### Executando localmente

```bash
pnpm db:up      # sobe o PostgreSQL local (docker compose)
pnpm db:migrate # aplica as migrations pendentes
pnpm dev        # API em http://localhost:3000
```

Provando que está de pé:

```bash
# Health check (verifica também a conexão com o banco: 200 ok, 503 banco fora)
curl http://localhost:3000/health
# {"status":"ok","db":"ok"}

# Cadastrar um tutor
curl -X POST http://localhost:3000/tutors \
  -H "Content-Type: application/json" \
  -d '{"name": "Ana Souza", "email": "ana@mail.com"}'
# {"id":"...","name":"Ana Souza","email":"ana@mail.com","createdAt":"..."}

# Consultar pelo id retornado
curl http://localhost:3000/tutors/<id>
```

### Executando com Docker

A mesma imagem que o CI valida em todo PR, com API e banco juntos:

```bash
pnpm infra:up     # constrói a imagem e sobe API + PostgreSQL
pnpm infra:logs   # acompanha a API
pnpm infra:down   # derruba tudo
```

### Executando os testes

```bash
pnpm test         # suíte completa
pnpm test:cov     # com cobertura — o portão exige 90% (85% em branches)
```

A cobertura é medida onde a regra de negócio vive (`domain` e `application`);
o racional está na [ADR-0011](docs/adrs/0011-jest-como-ferramenta-de-testes.md).

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
