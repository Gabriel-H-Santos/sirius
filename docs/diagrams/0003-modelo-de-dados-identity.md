# Diagrama-0003: Modelo de dados do módulo identity

As duas primeiras tabelas do sistema e o primeiro relacionamento 1:N — o molde
de chave primária e estrangeira que as próximas tabelas copiam: `id` uuid v7
gerado na aplicação, constraints nomeadas, `created_at`/`updated_at` em toda
tabela e FK com índice próprio.

Documentos que usam este diagrama:
[ADR-0010](../adrs/0010-tabelas-de-tutor-e-endereco.md).

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#dbeafe', 'primaryBorderColor': '#2563eb', 'primaryTextColor': '#1f2328', 'lineColor': '#6b7280'}}}%%
erDiagram
  tutors ||--o{ tutor_addresses : "possui (fk_tutor_addresses_tutor_id, on delete cascade)"

  tutors {
    COLUNA TIPO "DETALHE"
    id uuid PK "v7 gerado na aplicação"
    name text
    email text UK "uq_tutors_email"
    created_at timestamptz
    updated_at timestamptz
  }

  tutor_addresses {
    COLUNA TIPO "DETALHE"
    id uuid PK "v7 gerado na aplicação"
    tutor_id uuid FK "idx_tutor_addresses_tutor_id"
    zip_code text
    street text
    number text
    complement text "opcional"
    district text
    city text
    state text
    created_at timestamptz
    updated_at timestamptz
  }
```

As tabelas de `pet-registry` (`pets` e a titularidade `tutors_pets`, N:N desde
o primeiro dia) entram neste desenho quando a Spec-002 as definir — o mapa
completo da fase está no
[Spike-0005](../spikes/0005-modelagem-de-dados-da-fase-1.md).
