# Sirius — contexto do projeto

Plataforma de cuidado com pets: cadastro de tutores e animais, acompanhamento de
saúde e, futuramente, monitoramento por coleira inteligente. Monorepo pnpm com
entrega faseada — fase atual: fundação. As decisões estruturais estão em
`docs/adrs/`; leia a ADR relevante antes de mexer na área que ela governa.

## Convenções

- Documentação em português brasileiro, tom técnico e direto, sem metáforas
  coloridas nem aforismos. Código, identificadores e mensagens de commit em
  inglês.
- Código sem comentários — o nome explica; exceção só para restrição que o
  código não consegue mostrar.
- Import por alias em `src` e `test` (`@modules`, `@common`, `@config`,
  `@database`, `@factories`, `@test`); relativo só no `main.ts` e no
  `app.module.ts` para arquivos da raiz de `src`.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `ci:`). Branch com prefixo por
  tipo (`feat/`, `fix/`, `docs/`, `ci/`).
- Commits e PRs registram autoria humana; não incluir rodapés ou coautoria de
  ferramenta de IA.
- Entrega em passos pequenos: um assunto por PR, decisão estrutural acompanhada
  da ADR no mesmo PR, investigação registrada como spike, fluxo relevante como
  diagrama numerado. Receitas em `.claude/skills/`.

## Comandos

```bash
nvm use && pnpm install
cp apps/api/.env.example apps/api/.env
pnpm db:up          # PostgreSQL local
pnpm db:migrate     # migrations pendentes
pnpm db:revert      # desfaz a última migration
pnpm dev            # API em http://localhost:3000/health
pnpm typecheck && pnpm build
pnpm test           # suíte Jest; test:cov mede cobertura com portão
pnpm infra:up       # stack completa em contêiner (API + banco)
```

## Definição de pronto

Uma mudança está pronta quando: `pnpm typecheck` e `pnpm build` passam; o
comportamento foi provado com comando real (o resultado vai na seção "Como foi
testado" do PR — nunca "testado localmente" sem o quê); a documentação que a
mudança afeta foi atualizada no mesmo PR; e nenhum link relativo quebrou.

## Estrutura

```
apps/api/       API NestJS (módulos em quatro camadas — ADR-0006)
docs/adrs/      decisões numeradas, com template
docs/spikes/    investigações numeradas, com template
docs/guides/    princípios e padrões aplicados — critério de revisão de código
docs/diagrams/  diagramas Mermaid numerados, com identidade visual no template
.spec/          especificações de feature: spec.md + plan.md antes do código
```

## Regras que já causaram retrabalho (não repetir)

- `themeVariables` do Mermaid só têm efeito com `'theme': 'base'` declarado.
- Env booleana valida por lista explícita de valores; nunca `z.coerce.boolean()`.
- O pool do banco trata o evento de erro de cliente ocioso; queda de banco não
  pode derrubar a API — o `/health` responde 503 e o processo sobrevive.
- Toda afirmação de preço ou limite em spike carrega fonte e data; valor sem
  fonte é marcado [estimativa].
