# Spike-0005: Modelagem de dados da fase 1

- **Status:** Concluído
- **Data:** 2026-08-16
- **Pergunta:** quais tabelas a fase 1 precisa, qual estratégia de chave
  primária serve ao projeto inteiro, e quais convenções de modelagem valem para
  toda tabela desde a primeira?

## Contexto

A primeira migration está prestes a existir
([Spec-001](../../.spec/001-cadastro-de-tutor/spec.md)), e chave primária é o
tipo de decisão que fica cara de mudar: ela vaza para toda foreign key, todo
índice e toda URL pública. Convenção de nome tem o mesmo perfil — renomear
tabela depois é migration de risco em produção. Decidir antes da primeira
tabela custa este spike; decidir depois custa retrabalho em cadeia.

## Investigação

### O mapa de tabelas da fase 1

| Tabela | Módulo dono | Guarda |
|---|---|---|
| `tutors` | `identity` | a conta do tutor: nome, e-mail único |
| `pets` | `pet-registry` | a ficha do pet: espécie, raça, sexo, nascimento, medidas |
| `tutors_pets` | `pet-registry` | a titularidade, N:N desde o primeiro dia |

A titularidade nasce N:N de propósito: um pet com dois tutores (casal, família)
é caso comum, não exceção. Modelar N:N agora custa uma tabela de junção;
descobrir depois custa migração de dados em produção. Cada tabela tem um módulo
dono e só ele a acessa — regra de fronteira do
[Spike-0002](0002-organizacao-interna-dos-modulos.md).

### Chave primária: as três candidatas

**Sequencial (`identity`)** — o menor índice e a melhor localidade de escrita.
Dois custos: o id público expõe volume e ritmo de cadastro (URL `/tutors/14`
conta a base para qualquer visitante), e o id só existe depois do INSERT, o que
acopla a criação da entidade ao banco.

**UUID v4 gerado na aplicação** — `crypto.randomUUID()` nativo do Node, zero
dependência. A entidade nasce completa antes de tocar o banco (o que simplifica
os dublês de teste), o id não carrega informação, e nada colide entre
ambientes. O custo: escrita aleatória no índice — cada INSERT cai num ponto
imprevisível da árvore, e a fragmentação vira assunto real conforme o volume
cresce.

**UUID v7 gerado na aplicação** — os mesmos ganhos do v4 (entidade completa sem
banco, sem colisão entre ambientes), mais a ordenação temporal: os bits altos
são timestamp, então INSERTs caem no fim do índice como num sequencial. O
PostgreSQL só o gera nativo na versão 18 [verificado], mas isso não pesa aqui —
a geração é da aplicação de qualquer forma, e a lib `uuid` expõe `v7()` desde a
versão 10 [verificado]. Os custos: uma dependência pequena e estável, e o id
passa a embutir o instante de criação do registro — informação inócua para
cadastros, mas que merece reavaliação em recurso onde o momento de criação for
sensível.

### Onde gerar

Na aplicação, não no banco: o domínio cria a entidade já com identidade (sem
ida ao banco, sem `RETURNING` para compor o objeto), e o dublê de repositório
dos testes não precisa simular geração de chave.

### As convenções que valem para toda tabela

Levantadas aqui, consolidadas no [Guia-0003](../guides/0003-convencoes-de-banco.md):
nomes em inglês `snake_case` (tabela no plural), PK sempre `id`, FK
`<singular>_id`, constraints e índices nomeados, `created_at`/`updated_at` em
toda tabela, migration sempre reversível.

## Recomendação

UUID v7 gerado na aplicação (lib `uuid`) como chave primária de todas as
tabelas de cadastro, com o mapa e as convenções acima. Combina o que o
sequencial tem de bom (escrita ordenada no índice) com o que o UUID tem de bom
(id sem informação de volume, gerado sem ida ao banco) — ao custo de uma
dependência pequena.

## O que ficou de fora

A modelagem de telemetria da fase 3 — leituras de coleira são série temporal
com padrão próprio de escrita e retenção; chave e particionamento de lá terão
spike próprio. Os campos detalhados de `pets` e `tutors_pets` — são assunto da
Spec-002, que os definirá sobre as convenções deste spike.

## Decisões derivadas

- [ADR-0009 — UUID v7 gerado na aplicação como chave primária](../adrs/0009-uuid-como-chave-primaria.md)

## Referências

Consultadas em agosto de 2026:

- [Tipo UUID e `gen_random_uuid()` — documentação do PostgreSQL](https://www.postgresql.org/docs/17/datatype-uuid.html)
- [`uuidv7()` na versão 18 — notas de lançamento do PostgreSQL](https://www.postgresql.org/docs/18/functions-uuid.html)
- [RFC 9562 — UUIDv7](https://www.rfc-editor.org/rfc/rfc9562)
- [Pacote `uuid` no npm — suporte a v7 desde a versão 10](https://www.npmjs.com/package/uuid)
