# Diagrama-0000: Título curto do que o diagrama mostra

Um parágrafo de contexto: o que este diagrama representa, e o que ele ajuda a
entender que o texto sozinho não mostra bem.

Documentos que usam este diagrama: links para as ADRs e spikes que apontam para cá.

---

## Identidade visual

Quatro papéis, quatro cores — o significado é fixo em todos os diagramas:

| Papel | Cor | Significado |
|---|---|---|
| `principal` | azul `#dbeafe` / borda `#2563eb` | componente do sistema, caminho principal |
| `externo` | âmbar `#fef3c7` / borda `#d97706` | serviço de terceiro — provedor, API externa |
| `dado` | verde `#dcfce7` / borda `#16a34a` | armazenamento — banco, fila, arquivo |
| `futuro` | cinza `#f3f4f6` / borda `#6b7280`, tracejado | decidido mas ainda não existente — some quando entregue |

Cada tipo de diagrama aplica a identidade pelo mecanismo que o Mermaid oferece,
demonstrado nos modelos abaixo: **flowchart** e **estados** usam as classes
`classDef` (que preservam a forma e o espaçamento nativos); **sequência** estiliza
os atores pela diretiva `init` e agrupa papéis em `box transparent`;
**entidade-relacionamento** recebe o tom azul via `init`; **git** colore as
branches pelas variáveis `git0..git2`. Atenção ao detalhe que morde: `themeVariables`
só têm efeito com `'theme': 'base'` declarado na diretiva.

## Modelos de referência

### Fluxo (flowchart)

Quando usar: caminhos, pipelines, dependências entre componentes.

```mermaid
flowchart LR
  A["API"] --> B[("PostgreSQL")]
  A --> C["provedor de pagamento"]
  A --> D["fila de eventos"]
  classDef principal fill:#dbeafe,stroke:#2563eb,color:#1f2328
  classDef externo fill:#fef3c7,stroke:#d97706,color:#1f2328
  classDef dado fill:#dcfce7,stroke:#16a34a,color:#1f2328
  classDef futuro fill:#f3f4f6,stroke:#6b7280,color:#57606a,stroke-dasharray:5 5
  class A principal
  class C externo
  class B dado
  class D futuro
```

### Sequência (sequenceDiagram)

Quando usar: a ordem de chamadas entre partes ao longo do tempo — quem fala com
quem, e o que volta. Os `box` agrupam participantes pelo papel da identidade.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'actorBkg': '#dbeafe', 'actorBorder': '#2563eb', 'actorTextColor': '#1f2328', 'signalColor': '#6b7280', 'signalTextColor': '#6b7280', 'lineColor': '#6b7280'}}}%%
sequenceDiagram
  box transparent sistema
    participant App
    participant API
  end
  box transparent dados
    participant DB as PostgreSQL
  end
  box transparent terceiros
    participant PSP as provedor de pagamento
  end
  App->>API: POST /pets
  API->>DB: INSERT
  DB-->>API: ok
  API-->>App: 201 Created
  App->>API: POST /assinaturas
  API->>PSP: cobrança
```

### Estados (stateDiagram-v2)

Quando usar: ciclo de vida de uma entidade — os estados possíveis e o que dispara
cada transição.

```mermaid
stateDiagram-v2
  classDef principal fill:#dbeafe,stroke:#2563eb,color:#1f2328
  [*] --> ativo: cadastro
  ativo --> suspenso: solicitação do tutor
  suspenso --> ativo: reativação
  ativo --> encerrado: exclusão
  encerrado --> [*]
  class ativo,suspenso,encerrado principal
```

### Entidade-relacionamento (erDiagram)

Quando usar: o modelo de dados de um módulo — tabelas, chaves e cardinalidades.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#dbeafe', 'primaryBorderColor': '#2563eb', 'primaryTextColor': '#1f2328', 'lineColor': '#6b7280'}}}%%
erDiagram
  TUTOR ||--o{ TITULARIDADE : possui
  PET ||--o{ TITULARIDADE : pertence
  PET ||--o{ VACINA : recebe
```

### Git (gitGraph)

Quando usar: fluxos de branch e merge. A `main` leva o azul da identidade; as
branches curtas alternam âmbar e verde.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'git0': '#dbeafe', 'git1': '#fef3c7', 'git2': '#dcfce7', 'gitBranchLabel0': '#1f2328', 'gitBranchLabel1': '#1f2328', 'gitBranchLabel2': '#1f2328', 'commitLabelColor': '#1f2328', 'commitLabelBackground': '#f3f4f6'}}}%%
gitGraph
  commit id: "main"
  branch feat/exemplo
  commit id: "feat: mudança"
  checkout main
  merge feat/exemplo id: "PR"
```
