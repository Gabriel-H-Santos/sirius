# Diagrama-0004: Visão macro do sistema

O sistema inteiro em uma tela, com o estado honesto de cada peça: o que existe
hoje (azul e verde), o que é serviço de terceiro (âmbar) e o que está decidido
mas ainda não construído (cinza tracejado — ganha cor cheia quando entregue).
A fase em que cada peça tracejada entra está no
[Diagrama-0005](0005-fases-de-entrega.md).

Documentos que usam este diagrama:
[ADR-0002](../adrs/0002-monolito-modular-com-entrega-faseada.md).

```mermaid
flowchart LR
  App["aplicativo do tutor"]
  Collar["coleira"]

  subgraph API["API — monólito modular (NestJS)"]
    direction TB
    identity["identity"]
    petreg["pet-registry"]
    care["care-content"]
    assistant["assistant"]
    devices["devices / telemetry / alerts"]
    commerce["commerce"]
  end

  DB[("PostgreSQL")]
  LLM["provedor de LLM"]
  Notify["provedor de push e SMS"]
  PSP["provedor de pagamento"]

  App -->|HTTPS| API
  Collar -->|leituras| devices
  API --> DB
  assistant --> LLM
  devices --> Notify
  commerce --> PSP

  classDef principal fill:#dbeafe,stroke:#2563eb,color:#1f2328
  classDef externo fill:#fef3c7,stroke:#d97706,color:#1f2328
  classDef dado fill:#dcfce7,stroke:#16a34a,color:#1f2328
  classDef futuro fill:#f3f4f6,stroke:#6b7280,color:#57606a,stroke-dasharray:5 5
  class identity principal
  class DB dado
  class LLM,Notify,PSP externo
  class App,Collar,petreg,care,assistant,devices,commerce futuro
```

Leitura rápida: hoje o sistema é a API com o módulo `identity` de pé sobre o
PostgreSQL. O aplicativo consome a API por HTTPS; a coleira, quando chegar,
alimenta a ingestão de telemetria; e cada integração externa entra por porta e
adapter, nunca direto na regra de negócio
([Guia-0002](../guides/0002-padroes-de-projeto.md)).
