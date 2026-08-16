# Plano — Spec-0002: Tratamento de erros na borda

## Decisões de implementação

| # | Decisão | Alternativa descartada |
|---|---|---|
| D1 | Categorias abstratas de erro (`NotFoundError`, `ConflictError`, `InvalidInputError`) em `common/errors`, sem nada de HTTP | exceções com status no domínio; `try/catch` por controller |
| D2 | Filter global único traduzindo categoria → status | mapear erro em cada controller |
| D3 | `nestjs-zod` para DTO como classe (`createZodDto`) + pipe global | pipe zod feito à mão instanciado por rota |
| D4 | Exceção HTTP nativa do framework passa pelo filter com o corpo intacto | reformatar tudo |

**D1** — o domínio declara a semântica (`EmailAlreadyRegisteredError extends
ConflictError`); quem sabe que conflito é `409` é a borda. A regra de
dependência da ADR-0006 fica intacta.

**D2** — um dono para o formato de erro: mudar o envelope amanhã é um arquivo.

**D3** — o pipe manual funcionava, mas espalhava zod e instanciação pelos
controllers; `createZodDto` deixa o controller só com a classe do DTO, e a
validação vira comportamento global.

**D4** — o `/health` já tem contrato documentado (`200`/`503` com corpo
próprio); reformatar exceção nativa quebraria sem ganho.

## Passos

### P1 — Categorias de erro

- [x] concluído
- **Requisitos:** R1
- **Arquivos:** `apps/api/src/common/errors/domain.error.ts`

### P2 — Filter global

- [x] concluído
- **Requisitos:** R1, R2, R3, R4
- **Arquivos:** `apps/api/src/common/filters/all-exceptions.filter.ts`

### P3 — Validação declarativa

- [x] concluído
- **Requisitos:** R2
- **Arquivos:**
  - `apps/api/src/modules/identity/presentation/dtos/register-tutor.dto.ts`
  - `apps/api/src/common/pipes/uuid-param.pipe.ts`

Dependência `nestjs-zod`; o pipe manual (`zod-validation.pipe.ts`) sai.

### P4 — Refatoração do identity

- [x] concluído
- **Requisitos:** R1, R2, R3
- **Arquivos:**
  - `apps/api/src/modules/identity/domain/errors/*.ts` (categorias e códigos)
  - `apps/api/src/modules/identity/presentation/controllers/tutor.controller.ts`
  - `apps/api/src/modules/identity/presentation/mappers/tutor.mapper.ts`
  - `apps/api/src/main.ts` (pipe e filter globais)

### P-final — Verificação

- [x] concluído — critérios de aceite provados por `curl` (409, 404, 400 com
  `details`, `/health` intacto), `pnpm typecheck && pnpm build` ok.

## Riscos

- **Filter vira caixa de tudo.** Se um dia ele acumular formatação, log,
  métrica e tradução, dividir — o dono único é do *formato*, não de toda
  preocupação transversal.
- **Código de erro tratado como texto.** O `code` é contrato: renomear um
  código existente é quebra e pede versionamento/aviso ao consumidor.
