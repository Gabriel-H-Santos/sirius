# ADR-0011: Jest com fakes de estado e cobertura direcionada

- **Status:** Aceita
- **Data:** 2026-08-16
- **Fase:** 1 (vale para todo o desenvolvimento)

## Contexto

O primeiro módulo de negócio está completo e testável: os contratos do domínio
permitem dublar a persistência sem tocar em banco. Falta decidir a ferramenta e
— mais importante que ela — a filosofia de teste que os próximos módulos vão
copiar. A base implementada está descrita na
[Spec-0003](../../.spec/0003-base-de-testes/spec.md).

## Decisão

**Jest como runner, com três regras que valem mais que a ferramenta:**

1. **Dublê é fake de estado, não mock de interação.** O teste usa uma
   implementação em memória do contrato do domínio (com `seed` e `clear`) e
   afirma sobre o que ficou gravado — nunca sobre quais métodos foram chamados.
   Refatorar sem mudar comportamento não quebra teste.
2. **Massa de teste nasce em factory.** Entidades de teste vêm de factories
   (`fishery` + `faker`), com sobrescrita pontual por caso — sem objeto
   literal repetido em cada spec.
3. **Cobertura direcionada, com portão.** A cobertura é medida onde a regra
   vive — `domain` e `application` — com limites que quebram o build (90% de
   linhas, 85% de branches). `infra` e `presentation` são provadas por
   execução real no PR e, adiante, por testes de integração com decisão
   própria.

## Alternativas consideradas

### Vitest

Foi a primeira opção executada: API compatível com Jest, ESM nativo, sem
fricção com dependências ESM-only. Caiu na prática — a versão atual (4.x)
falhou no ambiente de desenvolvimento por binding nativo do bundler ausente na
instalação. Depurar toolchain de teste não é onde este projeto quer gastar
atenção, e o critério que decidiu linguagem, ORM e arquitetura decide aqui
também: a fluência diária de quem mantém o projeto está no Jest.

### `node:test` nativo

Zero dependência, mas sem o ecossistema que o fluxo usa (watch maduro,
cobertura com thresholds por caminho, transformações) — sairia mais caro em
configuração do que a dependência que evita.

## Consequências

**Ganhamos:** runner consolidado que o mantenedor opera sem curva; testes que
sobrevivem a refatoração (asserção de estado); massa de teste barata de criar;
regressão de cobertura bloqueada no CI.

**Pagamos:** o atrito do Jest com dependências ESM-only (`uuid`,
`@faker-js/faker`) — resolvido com transformação declarada no
`jest.config.js` (`transformIgnorePatterns` ciente do layout do pnpm) e um
`tsconfig.spec.json` em CommonJS. É custo assumido e registrado: dependência
ESM-only nova em código testado pode pedir ajuste no padrão.

**Fica mais difícil:** testar interação pura (número de chamadas, ordem). É
intencional — quando a ordem de efeitos externos importar (fase 2, gateways),
a necessidade vira teste de contrato do adapter, não mock no use case.

## Gatilho de revisão

- O padrão de transformação ESM exigir manutenção recorrente a cada dependência
  nova — reabre a comparação com runner ESM nativo.
- Suíte passando de minutos no CI — revisita paralelização e escopo antes de
  trocar de ferramenta.

## Referências

- [Spec-0003 — Base de testes](../../.spec/0003-base-de-testes/spec.md)
- [Guia-0002 — Padrões de projeto](../guides/0002-padroes-de-projeto.md) (o padrão Fake)
