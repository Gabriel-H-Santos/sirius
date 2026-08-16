---
titulo: Base de testes unitários
estado: concluída
fase: 1
modulo: transversal (test)
---

# Spec-0003: Base de testes unitários

## Problema

A Spec-0001 chegou ao último passo (P6) sem existir estrutura de teste no
repositório: nenhum runner, nenhum dublê, nenhuma convenção de onde um spec
vive. A primeira suíte define o molde que todos os módulos vão copiar — vale o
mesmo raciocínio da primeira migration e do primeiro controller: acertar o
padrão enquanto ele é barato.

## Requisitos

- **R1** — QUANDO `pnpm test` rodar, O SISTEMA DEVE executar as suítes de
  `test/`, cuja árvore espelha a de `src/` (`test/modules/<módulo>/<camada>/`).
- **R2** — QUANDO um use case precisar de persistência em teste, O SISTEMA
  DEVE oferecer um fake de estado do contrato do domínio, com `seed` e
  `clear`, honrando a semântica do contrato — incluindo o conflito de e-mail
  duplicado.
- **R3** — QUANDO um teste precisar de massa, O SISTEMA DEVE oferecer
  factories (`test/factories/`) com dados realistas e sobrescrita pontual.
- **R4** — QUANDO `pnpm test:cov` rodar, O SISTEMA DEVE medir cobertura apenas
  de `domain` e `application` e falhar abaixo dos limites (90% linhas/
  statements/functions, 85% branches).
- **R5** — QUANDO um PR subir, o CI DEVE executar a suíte com cobertura como
  portão, junto de typecheck e build.

## Regras de negócio

- **RN1** — Asserção é sobre estado e comportamento observável, nunca sobre
  interação (quais métodos foram chamados). Origem:
  [ADR-0011](../../docs/adrs/0011-jest-como-ferramenta-de-testes.md).
- **RN2** — Import por alias (`@modules`, `@common`, `@config`, `@database`,
  `@factories`, `@test`) em `src` e `test`; caminho relativo só no `main.ts`
  (`./app.module`) e no `app.module.ts` (`./health.controller`). Origem:
  legibilidade — o espelhamento de árvores torna caminhos relativos profundos
  ilegíveis.

## Critérios de aceite

- [x] `pnpm test:cov` verde com as suítes do módulo `identity` (entidade e use
  cases) e cobertura 100% no escopo medido.
- [x] `pnpm typecheck`, `pnpm build` e a API em contêiner seguem funcionando
  após a varredura de aliases (`/health` respondendo).
- [x] CI executa a suíte como portão.

## Fora de escopo

- **Testes de integração com banco real** — decisão própria quando o segundo
  módulo chegar; hoje a infra é provada por execução real no PR.
- **Testes de contrato da borda HTTP (supertest)** — candidato natural para
  quando o contrato tiver mais de um consumidor.
