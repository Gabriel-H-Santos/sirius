# Especificações

Toda feature de negócio nasce aqui antes de virar código: uma pasta numerada com
`spec.md` (o problema e os critérios de aceite) e `plan.md` (os passos, cada um
com arquivos alvo e teste local). O código é escrito executando o plano — nunca
improvisando escopo no meio do caminho.

O que ganha spec: features de negócio (um módulo novo, um endpoint, uma regra).
O que não ganha: ajuste de documentação, correção pontual, mudança de
configuração — esses seguem direto pelo fluxo normal de PR.

Regras:

- Pasta `NNNN-slug-curto/` com numeração sequencial de quatro dígitos; nunca reusar número.
- O `spec.md` diz **o quê** e **por quê**; o `plan.md` diz **como** e **em que
  ordem**. Requisito sem critério de aceite verificável não está pronto.
- O estado vive no frontmatter do `spec.md` (`rascunho`, `em execução`,
  `concluída`) e é atualizado conforme o trabalho avança.
- Plano executado passo a passo, com o teste local de cada passo rodado antes de
  seguir ao próximo.

Para criar uma nova, copie a pasta [0000-template](0000-template/).

| # | Especificação | Estado |
|---|---|---|
| [0001](0001-cadastro-de-tutor/spec.md) | Cadastro de tutor (módulo `identity`) | em execução |
| [0002](0002-tratamento-de-erros-na-borda/spec.md) | Tratamento de erros na borda (transversal) | concluída |
