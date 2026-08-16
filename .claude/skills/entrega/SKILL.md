---
name: entrega
description: Fluxo de entrega de uma mudança — branch, verificação com prova real, commit e PR com o template preenchido. Use ao finalizar qualquer mudança que vai para a main.
---

# Entregar uma mudança

O fluxo é GitHub Flow (ADR-0007): branch curta a partir da `main`, PR, CI como
portão, merge. A `main` nunca recebe commit direto.

## Antes do commit

1. `pnpm typecheck && pnpm build` — precisa passar local, não só no CI.
2. Provar o comportamento com comando real. A prova depende da mudança:
   - endpoint: subir e dar `curl`, mostrando a resposta;
   - banco: `pnpm db:up && pnpm db:migrate` aplicando de verdade;
   - imagem/stack: `pnpm infra:up` e o `/health` respondendo;
   - caminho de falha: provocar a falha e mostrar que o sistema responde certo
     (exemplo do padrão da casa: derrubar o banco e mostrar o 503 com a API viva).
3. Documentação afetada atualizada no mesmo PR; links relativos verificados.

## Commit e branch

- Branch: `feat/`, `fix/`, `docs/` ou `ci/` + slug curto.
- Mensagem: Conventional Commits, em inglês, descrevendo o efeito.
- Sem rodapé ou coautoria de ferramenta de IA — autoria é de quem decide.

## PR

Preencher o template inteiro:

- **O que muda** — o efeito em uma ou duas frases, com link para ADR/spike/
  diagrama que a mudança criou ou alterou.
- **Como foi testado** — os comandos da prova e o resultado observado. Nunca
  "testado localmente" sem dizer o quê.
- **Checklist** — só marcar o que é verdade.

Decisão estrutural sem ADR no diff é PR incompleto: criar a ADR (skill
`documentacao`) antes de abrir.
