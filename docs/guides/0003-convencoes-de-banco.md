# Guia-0003: Convenções de banco de dados

- **Cobre:** nomes de tabela, coluna, constraint e índice; colunas obrigatórias;
  regras de migration e de mapeamento.
- **Decisões de origem:** [ADR-0004](../adrs/0004-postgresql-como-banco.md),
  [ADR-0005](../adrs/0005-typeorm-como-orm.md),
  [ADR-0009](../adrs/0009-uuid-como-chave-primaria.md)

Toda tabela nova segue estas convenções desde a primeira migration — renomear
depois é migration de risco em produção, então a hora de acertar o nome é
antes de ele existir.

## Nomes

- Tudo em inglês, `snake_case`.
- Tabela no **plural**: `tutors`, `pets`. Junção N:N com os dois plurais em
  ordem alfabética: `tutors_pets`.
- Chave primária sempre `id`, tipo `uuid`, v7 gerado na aplicação (ADR-0009).
- Foreign key com o singular da tabela referenciada: `tutor_id`, `pet_id`.
- Constraint e índice nomeados, nunca com o nome automático do banco — prefixo
  por tipo, tabela e colunas: `uq_tutors_email`, `idx_pets_species`,
  `fk_tutors_pets_tutor_id`. O nome aparece em erro de violação e em plano de
  consulta; nome automático transforma esses momentos em adivinhação.

## Colunas obrigatórias

Toda tabela tem `created_at` e `updated_at`, `timestamptz`, preenchidas pelo
mapeamento do ORM. Ordenação temporal usa `created_at` — o id v7 até ordena no
tempo, mas isso é detalhe do gerador, não contrato; o timestamp semântico é a
coluna. Exclusão lógica (`deleted_at`) não é padrão da casa:
entra por tabela, quando uma regra de negócio a pedir, registrada na spec.

## Mapeamento

- A entidade de domínio fica pura; o mapeamento vive no `EntitySchema` da
  `infra` do módulo dono (ADR-0006).
- Propriedade em `camelCase` na entidade, coluna em `snake_case` no banco — a
  tradução é declarada no schema, campo a campo.
- Cada tabela tem um módulo dono e só ele a acessa
  ([Spike-0002](../spikes/0002-organizacao-interna-dos-modulos.md)); consulta
  de outro módulo passa pela superfície pública do dono.

## Migrations

- São a única fonte do schema — `synchronize` desligado para sempre (ADR-0005).
- Nome descreve o efeito: `create-tutors-table`, `add-idx-pets-species`.
- Toda migration implementa o `down` de verdade e ele é provado junto com o
  `up` no PR que a introduz.
- Migration não carrega dado de negócio; carga e correção de dados são scripts
  à parte, com decisão registrada.

## Relacionados

- [Spike-0005 — Modelagem de dados da fase 1](../spikes/0005-modelagem-de-dados-da-fase-1.md)
