# Diagrama-0005: Fases de entrega

As quatro fases do produto e os módulos que cada uma liga — sem reescrever os
anteriores, que é a promessa central da
[ADR-0002](../adrs/0002-monolito-modular-com-entrega-faseada.md). Uma fase só
começa quando a anterior sustenta uso real; o mapa de módulos vem do
[Spike-0002](../spikes/0002-organizacao-interna-dos-modulos.md).

Documentos que usam este diagrama:
[ADR-0002](../adrs/0002-monolito-modular-com-entrega-faseada.md).

```mermaid
flowchart LR
  subgraph F1["fase 1 — cadastros"]
    direction TB
    identity["identity"]
    petreg["pet-registry"]
  end
  subgraph F2["fase 2 — conteúdo e assistente"]
    direction TB
    care["care-content"]
    assistant["assistant"]
  end
  subgraph F3["fase 3 — coleira"]
    direction TB
    devices["devices"]
    telemetry["telemetry"]
    alerts["alerts"]
  end
  subgraph F4["fase 4 — monetização"]
    direction TB
    commerce["commerce"]
  end

  F1 --> F2 --> F3 --> F4

  classDef principal fill:#dbeafe,stroke:#2563eb,color:#1f2328
  classDef futuro fill:#f3f4f6,stroke:#6b7280,color:#57606a,stroke-dasharray:5 5
  class identity principal
  class petreg,care,assistant,devices,telemetry,alerts,commerce futuro
```

O azul marca o que já está entregue: o `identity` completo — migration,
domínio, borda HTTP e testes ([Spec-0001](../../.spec/0001-cadastro-de-tutor/spec.md)).
Cada módulo que fica azul carrega junto suas decisões registradas: é assim que
o diagrama envelhece sem mentir.
