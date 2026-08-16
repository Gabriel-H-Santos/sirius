# Spike-0003: Fluxo de CI/CD e estratégia de branches

- **Status:** Concluído
- **Data:** 2026-08-16
- **Pergunta:** qual o caminho do código da máquina do desenvolvedor até produção —
  estratégia de branches, portões de qualidade e forma do artefato — em cada fase
  do projeto?

## Contexto

O CI mínimo já existe (typecheck e build em todo PR). Antes do primeiro módulo de
negócio, faltam três definições: a estratégia de branches formalizada (hoje é
praticada, não documentada), a forma do artefato de deploy (a
[ADR-0003](../adrs/0003-aws-como-nuvem.md) aponta para contêiner na AWS) e o
momento em que o deploy automatizado entra.

## Investigação

### Estratégia de branches

| | GitHub Flow | Git Flow clássico | Trunk direto |
|---|---|---|---|
| Como funciona | branch curta a partir da `main`, PR, merge | `develop` + `release/*` + `hotfix/*` + `main` | commit direto na `main` |
| Serve bem quando | entrega contínua, uma versão em produção | várias versões mantidas em paralelo, ciclo de release formal | protótipo de uma pessoa sem revisão |
| Custo | baixo | duas branches de longa vida para sincronizar, cerimônia de release | nenhum portão antes do código entrar |

O Git Flow clássico resolve um problema que este projeto não tem: manter versões
paralelas em produção (v1.x e v2.x ao mesmo tempo, como um produto instalável).
Uma API de entrega contínua tem uma versão só — a que está no ar. O próprio autor
do modelo publicou, em nota de 2020, que para aplicações web de entrega contínua
recomenda fluxos mais simples, como o GitHub Flow.

O repositório já pratica GitHub Flow desde o primeiro PR: branch com prefixo por
tipo (`feat/`, `fix/`, `docs/`, `ci/`), Conventional Commits, template de PR e CI
como portão. O que falta é formalizar, não mudar.

### Forma do artefato

O destino é contêiner (ECS Fargate, ADR-0003). O artefato natural é uma imagem
Docker, e as práticas que pesam:

- **Multi-stage**: um estágio compila com todas as dependências; o estágio final
  carrega só o resultado e as dependências de produção. Imagem menor, superfície
  de ataque menor, sem toolchain de build em produção.
- **Versão de Node pinada na mesma fonte do repositório** (`.nvmrc` = 24.19.0):
  ambiente local, CI e imagem usam o mesmo número — divergência de versão deixa de
  ser possível por construção.
- **Processo sem privilégio** (`USER node`) e **`NODE_ENV=production`** no estágio
  final.
- **`HEALTHCHECK`** apontando para o `/health` que já verifica o banco.
- **Construir a imagem no CI de todo PR**: o Dockerfile quebrado é descoberto no
  PR que o quebrou, não no dia do deploy.

### Deploy por fase

| Fase | O que existe | Deploy |
|---|---|---|
| Agora (fundação) | nenhuma infraestrutura provisionada | a imagem é construída e validada no CI — o artefato existe e é provado, ainda sem destino |
| Fase 1 no ar | ECS Fargate + RDS (ADR-0003) | push da imagem para o ECR e atualização do serviço, no merge na `main` |
| Fases seguintes | idem | o mesmo fluxo — o que muda é o conteúdo da imagem, nunca o caminho |

Automatizar o deploy antes de existir infraestrutura seria manter um pipeline
apontando para o nada. A ordem que se sustenta: artefato provado agora, entrega
automatizada no PR que provisionar a infraestrutura.

## Recomendação

Formalizar o GitHub Flow como fluxo oficial, adicionar o Dockerfile multi-stage
com a construção da imagem como portão de CI, e deixar o deploy automatizado
declarado como passo do PR de infraestrutura. Documentar o fluxo com diagramas em
um guia de contribuição — o repositório ganha o segundo desenvolvedor um dia, e o
fluxo não deve morar só na cabeça do primeiro.

## O que ficou de fora

Provisionamento da infraestrutura (Terraform ou similar) — é o PR em que o deploy
automatizado entra, com ADR própria. Ambientes intermediários (staging) — decisão
para quando houver o que ensaiar e para quem. Assinatura e verificação de imagem —
relevante com produção no ar, não antes.

## Decisões derivadas

- [ADR-0007 — Fluxo de entrega](../adrs/0007-fluxo-de-entrega.md)

## Referências

Consultadas em agosto de 2026:

- [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow)
- [A successful Git branching model — Vincent Driessen](https://nvie.com/posts/a-successful-git-branching-model/), incluindo a nota de reflexão de 2020 do próprio autor
- [Multi-stage builds — Docker](https://docs.docker.com/build/building/multi-stage/)
- [Building best practices — Docker](https://docs.docker.com/build/building/best-practices/)
