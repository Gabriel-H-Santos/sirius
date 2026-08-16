# Diagrama-0002: Caminho de um PR até a main

O trajeto de toda mudança: da branch curta ao merge, com o CI como portão — não
como aviso. O estágio de deploy aparece tracejado porque está decidido mas ainda
não existe: entra no PR que provisionar a infraestrutura
([ADR-0007](../adrs/0007-fluxo-de-entrega.md)).

```mermaid
flowchart LR
  B["branch curta"] --> P["pull request - template preenchido"]
  P --> C["CI - typecheck, build, imagem Docker"]
  C --> R["revisão"]
  R --> M["merge na main"]
  M --> D["deploy - entra com a infraestrutura"]
  classDef principal fill:#dbeafe,stroke:#2563eb,color:#1f2328
  classDef futuro fill:#f3f4f6,stroke:#6b7280,color:#57606a,stroke-dasharray:5 5
  class B,P,C,R,M principal
  class D futuro
```

Documentos que usam este diagrama: [ADR-0007](../adrs/0007-fluxo-de-entrega.md).
