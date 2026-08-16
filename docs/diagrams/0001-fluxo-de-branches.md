# Diagrama-0001: Fluxo de branches

O GitHub Flow praticado no repositório: branch curta nasce da `main`, recebe
commits de um assunto só, volta por pull request e é apagada depois do merge. A
`main` nunca recebe commit direto.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'git0': '#dbeafe', 'git1': '#fef3c7', 'git2': '#dcfce7', 'gitBranchLabel0': '#1f2328', 'gitBranchLabel1': '#1f2328', 'gitBranchLabel2': '#1f2328', 'commitLabelColor': '#1f2328', 'commitLabelBackground': '#f3f4f6'}}}%%
gitGraph
  commit id: "main"
  commit id: "..."
  branch feat/pet-registry
  commit id: "feat: entidade"
  commit id: "feat: endpoint"
  checkout main
  merge feat/pet-registry id: "PR aprovado"
  branch fix/health-timeout
  commit id: "fix: timeout"
  checkout main
  merge fix/health-timeout id: "PR pequeno"
```

Documentos que usam este diagrama: [ADR-0007](../adrs/0007-fluxo-de-entrega.md).
