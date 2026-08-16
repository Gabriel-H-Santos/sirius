# ADR-0007: GitHub Flow com imagem Docker validada no CI

- **Status:** Aceita
- **Data:** 2026-08-16
- **Fase:** fundação (o deploy automatizado entra no PR que provisionar a infraestrutura)

## Contexto

O repositório pratica um fluxo desde o primeiro PR — branch curta, Conventional
Commits, template de PR, CI como portão — mas ele não estava formalizado, e o
artefato de deploy não existia. O [Spike-0003](../spikes/0003-fluxo-de-ci-cd.md)
comparou as estratégias de branch, levantou as práticas de imagem e mapeou o
momento certo de cada peça do pipeline.

## Decisão

**GitHub Flow como fluxo oficial, imagem Docker multi-stage como artefato, e a
construção da imagem como portão de CI em todo PR.**

O fluxo está desenhado nos diagramas
[0001 — fluxo de branches](../diagrams/0001-fluxo-de-branches.md) e
[0002 — caminho de um PR](../diagrams/0002-caminho-de-um-pr.md).

As regras do fluxo:

1. **A `main` está sempre íntegra** — tudo que chega nela passou pelo CI e por PR;
   commit direto não existe.
2. **Branch é curta e tem prefixo por tipo** (`feat/`, `fix/`, `docs/`, `ci/`),
   com Conventional Commits nas mensagens.
3. **O CI é o portão, não o aviso** — typecheck, build e a construção da imagem
   Docker rodam em todo PR; Dockerfile quebrado é descoberto no PR que o quebrou.
4. **A imagem pina o Node na mesma versão do `.nvmrc`** — local, CI e produção com
   o mesmo runtime, por construção.
5. **O deploy automatizado entra no PR da infraestrutura** — push para o ECR e
   atualização do serviço no merge da `main`, quando houver serviço para atualizar.

Como rodar o projeto e construir a imagem localmente está no README; os
diagramas do fluxo vivem em [docs/diagrams/](../diagrams/).

## Alternativas consideradas

### Git Flow clássico

O modelo com `develop`, `release/*` e `hotfix/*`. Resolve a manutenção de versões
paralelas em produção — um problema que uma API de entrega contínua não tem: existe
uma versão, a que está no ar. O custo seria real (duas branches de longa vida para
sincronizar, cerimônia de release) sem benefício correspondente. O próprio autor
do modelo recomenda, em nota de 2020, fluxos mais simples para este perfil de
aplicação.

### Commits diretos na main

O caminho de menor atrito para uma pessoa. Não levou porque remove o único ponto
de revisão e verificação antes de o código entrar — e o histórico de PRs é a
memória de decisão do projeto, que já provou valor nas revisões que mudaram
decisões antes do merge.

### Automatizar o deploy agora

Pipeline completo até produção desde já. Não levou porque não existe
infraestrutura provisionada — seria um pipeline apontando para o nada, testando a
si mesmo. A imagem validada no CI garante que o artefato existe e funciona; o
destino entra quando existir.

## Consequências

**Ganhamos:** fluxo formalizado e visível para o próximo dev, artefato de deploy
provado a cada PR, e paridade de runtime entre local, CI e produção.

**Pagamos:** o build de imagem alonga o CI em alguns minutos por PR.

**Fica mais difícil:** mudanças emergenciais fora do fluxo — é intencional; a
exceção de emergência é um PR pequeno com revisão rápida, não um commit direto.

## Gatilho de revisão

- O PR que provisionar a infraestrutura deve incluir o estágio de deploy (ECR +
  atualização do serviço) — esta ADR fica incompleta até lá e isso é deliberado.
- Necessidade real de manter duas versões em produção ao mesmo tempo — reabre a
  conversa de estratégia de branches.
- CI passando de ~10 minutos por PR — reabre a conversa de cache e paralelização.
