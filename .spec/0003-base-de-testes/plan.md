# Plano — Spec-0003: Base de testes unitários

## Decisões de implementação

| # | Decisão | Alternativa descartada |
|---|---|---|
| D1 | Jest + ts-jest, decisão registrada na [ADR-0011](../../docs/adrs/0011-jest-como-ferramenta-de-testes.md) | Vitest (falha de toolchain na prática), `node:test` |
| D2 | Árvore de `test/` espelhando `src/`, fakes na posição da `infra` do módulo | pasta plana de testes |
| D3 | Factories com `fishery` + `faker` | objetos literais por spec |
| D4 | Aliases de import com `tsconfig paths` + `tsc-alias` no build + `moduleNameMapper` no Jest | caminhos relativos profundos |
| D5 | Dependências ESM-only (`uuid`, `@faker-js/faker`) transformadas via `transformIgnorePatterns` ciente do pnpm + `tsconfig.spec.json` CommonJS | mock global das libs; troca de dependência |

**D4** — o build continua `node dist/main.js` puro: o `tsc-alias` reescreve os
aliases para caminhos relativos no `dist`, então nenhum resolvedor entra em
runtime. O dev (`tsx`) resolve os paths nativamente.

**D5** — mockar a lib inteira esconderia o gerador real do id; transformar
mantém o código de produção exercitado como é.

## Passos

### P1 — Runner e configuração

- [x] concluído
- **Requisitos:** R1, R4
- **Arquivos:** `apps/api/jest.config.js`, `apps/api/tsconfig.spec.json`,
  `apps/api/tsconfig.json`, `apps/api/tsconfig.build.json`, scripts em
  `apps/api/package.json` e na raiz

### P2 — Factories e fake

- [x] concluído
- **Requisitos:** R2, R3
- **Arquivos:**
  - `apps/api/test/factories/tutor.factory.ts`
  - `apps/api/test/modules/identity/infra/repositories/fake-tutor.repository.ts`

### P3 — Suítes do identity (P6 da Spec-0001)

- [x] concluído
- **Requisitos:** R1, R2, R3
- **Arquivos:**
  - `apps/api/test/modules/identity/domain/entities/tutor.entity.spec.ts`
  - `apps/api/test/modules/identity/application/use-cases/register-tutor.use-case.spec.ts`
  - `apps/api/test/modules/identity/application/use-cases/get-tutor.use-case.spec.ts`

### P4 — Varredura de aliases

- [x] concluído
- **Requisitos:** RN2
- 22 arquivos de `src/` e `test/` convertidos; `pnpm build` reescreve com
  `tsc-alias` e o runtime foi provado (`/health` de pé com `node dist/main.js`).

### P5 — Portão no CI

- [x] concluído
- **Requisitos:** R5
- **Arquivos:** `.github/workflows/ci.yml`

### P-final — Verificação

- [x] concluído — suíte verde (3 suítes, 10 testes), cobertura 100% no escopo
  medido com gate armado, typecheck/build/runtime provados.

## Riscos

- **O padrão ESM exige manutenção.** Dependência ESM-only nova em código
  testado pede ajuste no `transformIgnorePatterns` — o sintoma é o erro
  "Cannot use import statement outside a module" apontando `node_modules`.
- **Cobertura 100% vira meta.** O gate é 90/85 de propósito: perseguir 100%
  induz teste de implementação. O número alto de hoje é consequência do escopo
  pequeno, não meta.
