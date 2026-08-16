# ADR-0009: UUID v7 gerado na aplicação como chave primária

- **Status:** Aceita
- **Data:** 2026-08-16
- **Fase:** 1 (vale para as tabelas de cadastro; telemetria da fase 3 terá decisão própria)

## Contexto

A primeira migration do projeto vai criar a primeira tabela, e chave primária é
decisão que se propaga: toda foreign key, todo índice e toda URL pública herdam
a escolha. O [Spike-0005](../spikes/0005-modelagem-de-dados-da-fase-1.md)
comparou as candidatas e levantou as convenções de modelagem que acompanham a
decisão.

## Decisão

**Toda tabela de cadastro usa UUID v7 como chave primária, gerado na aplicação
com a lib `uuid` (`v7()`), coluna `id` do tipo `uuid`.** O domínio cria a
entidade já com identidade; o banco garante unicidade, não gera chave.

O v7 carrega timestamp nos bits altos: os INSERTs caem no fim do índice como
num sequencial, sem abrir mão do que o UUID entrega — id público sem informação
de volume e geração sem ida ao banco.

As convenções de modelagem que valem junto estão no
[Guia-0003](../guides/0003-convencoes-de-banco.md).

## Alternativas consideradas

### Sequencial (`identity`)

Índice pequeno e escrita ordenada, mas o id público conta a base de cadastros
para qualquer visitante (`/tutors/14` diz quantos tutores existem), e a
identidade só nasce no INSERT — a entidade dependeria do banco para existir
completa, complicando dublês de teste e composição de objetos. O v7 entrega a
mesma escrita ordenada sem esses custos.

### UUID v4 nativo (`crypto.randomUUID()`)

A única vantagem sobre o v7 é dispensar a dependência — e o preço é a escrita
aleatória no índice, que fragmenta conforme o volume cresce. Uma dependência
pequena e estável custa menos que conviver com esse teto.

### UUID gerado pelo banco

Mesmo tipo de chave, gerador no lugar errado para este projeto: a criação da
entidade passaria a exigir ida ao banco (ou `RETURNING` para compor o objeto),
e o dublê de repositório teria que simular geração de chave. Vale também para o
`uuidv7()` nativo do PostgreSQL 18: quando a versão chegar, a geração continua
na aplicação — o domínio é quem dá identidade às entidades.

## Consequências

**Ganhamos:** entidades que nascem completas sem tocar o banco; escrita
ordenada no índice desde o primeiro registro; ids públicos que não expõem
volume de cadastro; testes com dublês simples; zero colisão entre ambientes.

**Pagamos:** 16 bytes por chave (contra 4 ou 8 do sequencial), e uma
dependência de aplicação (`uuid`).

**Fica mais difícil:** tratar o id como opaco por completo — o v7 embute o
instante de criação do registro. Para cadastros é inócuo; a ordenação temporal
oficial continua sendo `created_at`, que toda tabela tem por convenção.

## Gatilho de revisão

- Surgir recurso em que o momento de criação do registro seja informação
  sensível — para essa tabela, reavaliar (v4 aleatório resolve, nas mesmas
  colunas).
- A chegada da telemetria (fase 3) dispara decisão própria — série temporal tem
  padrão de chave e particionamento que não herda esta ADR.

## Referências

- [Spike-0005 — Modelagem de dados da fase 1](../spikes/0005-modelagem-de-dados-da-fase-1.md)
