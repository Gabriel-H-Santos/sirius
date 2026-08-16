# ADR-0010: Endereço do tutor em tabela própria

- **Status:** Aceita
- **Data:** 2026-08-16
- **Fase:** 1

## Contexto

O cadastro do tutor ([Spec-0001](../../.spec/0001-cadastro-de-tutor/spec.md))
traz o primeiro dado composto do sistema: o endereço — útil já na fase 1 como
dado de cadastro e insumo dos serviços por localização das fases seguintes.
Este é também o primeiro relacionamento 1:N do banco, e a forma escolhida aqui
vira o padrão de chave estrangeira que as próximas tabelas seguem, sobre as
convenções da [ADR-0009](0009-uuid-como-chave-primaria.md) e do
[Guia-0003](../guides/0003-convencoes-de-banco.md).

## Decisão

**Endereço em tabela própria, `tutor_addresses`, relacionada a `tutors` por
chave estrangeira — um tutor tem N endereços.** As duas tabelas nascem na
primeira migration do módulo `identity`, para o padrão PK/FK existir completo
desde o primeiro schema. O desenho está no
[Diagrama-0003](../diagrams/0003-modelo-de-dados-identity.md).

- `tutors` — `id` uuid PK, `name`, `email` com `uq_tutors_email`,
  `created_at`/`updated_at`.
- `tutor_addresses` — `id` uuid PK; `tutor_id` uuid com
  `fk_tutor_addresses_tutor_id` e índice `idx_tutor_addresses_tutor_id`;
  campos de endereço (`zip_code`, `street`, `number`, `complement`,
  `district`, `city`, `state`); `created_at`/`updated_at`.
- A FK usa `ON DELETE CASCADE`: endereço é dado do tutor, sem vida própria —
  removido o dono, não sobra registro órfão.

Os fluxos de endereço (criar, listar, alterar) entram em spec própria; esta
ADR define a estrutura, não os endpoints.

## Alternativas consideradas

### Colunas de endereço embutidas em `tutors`

O caminho com menos peças, ao custo de fixar "um endereço por tutor" no schema:
o segundo endereço (casa e trabalho, endereço de entrega) exigiria remodelar e
migrar dados em produção. A tabela própria custa uma FK agora e deixa a
cardinalidade aberta.

### Endereço em coluna `jsonb`

Flexível para variar o formato, mas abre mão do que o banco relacional faz de
graça: integridade referencial, validação de forma por coluna e consulta
indexável por cidade ou UF sem expressão sobre JSON. Para um dado de estrutura
conhecida e estável, o relacional é o padrão da casa
([ADR-0004](0004-postgresql-como-banco.md)).

## Consequências

**Ganhamos:** o molde de relacionamento 1:N pronto e nomeado conforme as
convenções — as próximas tabelas com FK copiam daqui; múltiplos endereços sem
mudança de schema; exclusão de tutor sem órfãos.

**Pagamos:** um JOIN para montar o cadastro completo, e uma tabela a mais para
manter.

**Fica mais difícil:** tratar o endereço como texto livre — a estrutura por
coluna exige entrada minimamente normalizada desde o primeiro fluxo.

## Gatilho de revisão

- Um consumidor precisar de endereço com forma variável (internacionalização,
  campos por país) — reavalia a estrutura de colunas, não necessariamente a
  tabela própria.
- A fase 3 trazer localização por coleira — geolocalização é outro dado
  (coordenadas, não logradouro) e terá modelagem própria, prevista na seção de
  PostGIS da [ADR-0004](0004-postgresql-como-banco.md).

## Referências

- [Diagrama-0003 — Modelo de dados do módulo identity](../diagrams/0003-modelo-de-dados-identity.md)
- [Spike-0005 — Modelagem de dados da fase 1](../spikes/0005-modelagem-de-dados-da-fase-1.md)
