# Plano — Spec-001: Cadastro de tutor

## Decisões de origem

A modelagem não se decide aqui — ela decorre de:
[ADR-0006](../../docs/adrs/0006-estrutura-interna-dos-modulos.md) (entidade
pura, mapeamento na infra),
[ADR-0009](../../docs/adrs/0009-uuid-como-chave-primaria.md) (UUID v7 gerado
na aplicação com a lib `uuid`) e
[Guia-0003](../../docs/guides/0003-convencoes-de-banco.md) (nomes, colunas
obrigatórias, migration reversível).

## Decisões de implementação

| # | Decisão | Alternativa descartada |
|---|---|---|
| D1 | Unicidade de e-mail garantida pelo índice único; o use case verifica antes para responder `409` limpo | verificar só na aplicação |
| D2 | Resposta JSON direta, sem envelope | envelope `{ data }` |

**D1** — sob requisições concorrentes, só o índice único garante de verdade; a
verificação prévia existe para o caso comum responder `409` sem depender do
formato do erro do banco. A violação do índice na janela de corrida também é
traduzida para `409`.

**D2** — com um único consumidor e nenhum metadado a transportar, envelope é
cerimônia. Se um padrão de resposta mais rico se provar necessário quando houver
mais consumidores, a mudança nasce com ADR.

## Passos

### P1 — Domínio

- [ ] concluído
- **Requisitos:** R1
- **Arquivos:**
  - `apps/api/src/modules/identity/domain/entities/tutor.entity.ts`
  - `apps/api/src/modules/identity/domain/repositories/tutor.repository.ts`

**Teste local:** `pnpm typecheck` — exit 0. Entidade pura com fábrica de
criação (id v7 via lib `uuid`, normalização de e-mail e validação de nome
dentro do domínio); contrato do repositório com `save`, `findById` e
`findByEmail`. A dependência `uuid` entra neste passo.

### P2 — Persistência

- [ ] concluído
- **Requisitos:** R1, R2
- **Arquivos:**
  - `apps/api/src/modules/identity/infra/persistence/tutor.schema.ts`
  - `apps/api/src/modules/identity/infra/repositories/typeorm-tutor.repository.ts`
  - `apps/api/src/database/migrations/*-create-tutors-table.ts`

**Teste local:** `pnpm db:up && pnpm db:migrate` aplica; o revert desfaz.
Tabela `tutors` conforme o
[Guia-0003](../../docs/guides/0003-convencoes-de-banco.md): `id` uuid,
`created_at`/`updated_at`, índice único nomeado `uq_tutors_email`.

### P3 — Use cases

- [ ] concluído
- **Requisitos:** R1, R2, R4
- **Arquivos:**
  - `apps/api/src/modules/identity/application/use-cases/register-tutor.use-case.ts`
  - `apps/api/src/modules/identity/application/use-cases/get-tutor.use-case.ts`

**Teste local:** `pnpm typecheck` — exit 0. `register` consulta por e-mail
normalizado e traduz duplicidade para a exceção de conflito; `get` traduz
ausência para a exceção de não encontrado.

### P4 — Borda HTTP

- [ ] concluído
- **Requisitos:** R1, R2, R3, R4
- **Arquivos:**
  - `apps/api/src/modules/identity/presentation/controllers/tutor.controller.ts`
  - `apps/api/src/modules/identity/presentation/dtos/register-tutor.dto.ts`
  - `apps/api/src/modules/identity/identity.module.ts`
  - `apps/api/src/modules/identity/index.ts`
  - `apps/api/src/app.module.ts`

**Teste local:** `pnpm dev` e os quatro `curl` dos critérios de aceite
(201, 409, 400, 404) com as respostas coladas no PR.

### P5 — Testes (PR próprio)

- [ ] concluído
- **Requisitos:** R1, R2, R3, R4
- **Arquivos:**
  - `apps/api/test/fakes/fake-tutor.repository.ts`
  - `apps/api/test/modules/identity/register-tutor.use-case.spec.ts`
  - `apps/api/test/modules/identity/get-tutor.use-case.spec.ts`

Nasce junto com a ADR da ferramenta e da política de cobertura — a decisão de
teste vira código no mesmo PR, como manda a regra da casa.

### P-final — Verificação

- [ ] concluído — todos os critérios de aceite da spec provados, `pnpm
  typecheck && pnpm build` e a documentação afetada atualizada.

## Riscos

- **O molde vira cópia.** Tudo que este módulo fizer será replicado pelos
  próximos — um nome ruim aqui se multiplica. Revisar nomenclatura com calma
  antes do merge.
- **Corrida na unicidade.** A verificação prévia não cobre requisições
  simultâneas; o teste de sanidade é conferir que a violação do índice também
  resulta em `409`, não em `500`.
