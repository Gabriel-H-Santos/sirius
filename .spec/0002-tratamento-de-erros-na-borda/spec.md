---
titulo: Tratamento de erros na borda
estado: concluída
fase: 1
modulo: transversal (common)
---

# Spec-0002: Tratamento de erros na borda

## Problema

O primeiro controller nasceu traduzindo erro de domínio para HTTP com
`try/catch` por rota e instanciando o pipe de validação parâmetro a parâmetro —
com zod importado na assinatura do controller. Funciona com dois endpoints;
com vinte, é repetição que cada rota nova copia e cada mudança de formato
espalha. A tradução de erro é preocupação transversal e merece um único dono.

## Requisitos

- **R1** — QUANDO um use case lançar erro de domínio, O SISTEMA DEVE responder
  com o status da categoria do erro (não encontrado `404`, conflito `409`,
  entrada inválida `400`) e corpo `{ code, message }`, sem `try/catch` nos
  controllers.
- **R2** — QUANDO corpo ou parâmetro falhar na validação, O SISTEMA DEVE
  responder `400` com `{ code: "VALIDATION_FAILED", details: [{ field,
  message }] }`.
- **R3** — QUANDO ocorrer erro inesperado, O SISTEMA DEVE responder `500` com
  `{ code: "INTERNAL_ERROR" }` sem vazar detalhe interno, registrando o erro
  completo no log.
- **R4** — QUANDO uma resposta já nascer como exceção HTTP do framework (o
  `503` do `/health`, o `404` de rota inexistente), O SISTEMA DEVE preservar o
  corpo original — sem quebra de contrato existente.

## Regras de negócio

- **RN1** — O domínio conhece a **categoria semântica** do erro (não
  encontrado, conflito, entrada inválida), nunca o status HTTP. A tradução
  categoria → status é responsabilidade exclusiva da borda. Origem: regra de
  dependência da [ADR-0006](../../docs/adrs/0006-estrutura-interna-dos-modulos.md).
- **RN2** — Todo erro de domínio carrega um `code` estável em
  `SCREAMING_SNAKE_CASE` — é o contrato que o consumidor usa para decidir
  comportamento; a `message` é texto livre e pode mudar.
- **RN3** — Controller não traduz erro: recebe DTO validado, chama o use case
  e mapeia a resposta de sucesso. Só isso.

## Critérios de aceite

- [x] Duplicidade de e-mail responde `409 { code: "EMAIL_ALREADY_REGISTERED" }`
  sem `try/catch` no controller.
- [x] Tutor inexistente responde `404 { code: "TUTOR_NOT_FOUND" }`.
- [x] Corpo inválido responde `400 { code: "VALIDATION_FAILED" }` com os campos
  em `details`; id malformado idem, sem chegar ao banco.
- [x] `/health` mantém os corpos originais de `200` e `503`.

## Fora de escopo

- **Identificador de correlação (traceId) no corpo de erro** — entra com a
  decisão de observabilidade, que tem fase própria.
- **Internacionalização de mensagens** — `message` é técnica e em inglês; texto
  para usuário final é responsabilidade do app consumidor.
