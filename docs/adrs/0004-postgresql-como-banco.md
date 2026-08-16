# ADR-0004: PostgreSQL como banco de dados

- **Status:** Aceita
- **Data:** 2026-08-16
- **Fase:** fundação (entra junto com o ambiente local; em produção, como serviço gerenciado)

## Contexto

A fase 1 é cadastro: tutores, pets e a ficha de cada um. O dado é relacional por
natureza — um tutor tem vários pets, um pet pode ter mais de um tutor, a ficha
referencia o pet — e as regras de integridade importam desde o primeiro registro.

As fases seguintes adicionam perfis diferentes sobre o mesmo banco: histórico de
acompanhamento (fase 2), telemetria da coleira em volume (fase 3) e transações de
pagamento (fase 4). Com um time de uma pessoa, cada banco a mais é um sistema a
mais para operar, versionar e restaurar — a escolha precisa cobrir o caminho todo,
não só a primeira fase.

## Decisão

**PostgreSQL — em contêiner no ambiente local, como serviço gerenciado (RDS) em
produção.**

- Cobre o perfil relacional da fase 1 com integridade referencial e transações.
- Tem resposta para o que vem depois sem trocar de banco: particionamento nativo
  para a telemetria da fase 3 e tipos e índices ricos (JSONB, ranges, GiST) para a
  ficha clínica e para regras que bancos mais simples empurram para a aplicação.
- É padrão de mercado: gerenciado em qualquer nuvem, amplamente conhecido — fácil
  de contratar e de operar.

### Geolocalização: o caminho é o PostGIS

O produto prevê geolocalização em mais de uma frente: busca de parceiros próximos
(petshops, clínicas) e, com a coleira, a localização do pet. Esse caminho já está
dentro da decisão: o **PostGIS** estende o PostgreSQL com tipos e índices
geoespaciais — consulta de proximidade, distância real, áreas e rotas — e está
disponível no serviço gerenciado da nuvem escolhida
([ADR-0003](0003-aws-como-nuvem.md)). Habilita-se por comando quando a fase
chegar, e o dado geográfico passa a morar no mesmo banco que o resto do domínio:
mesmas transações, mesmo backup, nenhum sistema novo para operar.

O mesmo raciocínio vale para o **pgvector**, que cobre a busca semântica do futuro
assistente — extensão habilitada sob demanda, sem infraestrutura própria.

O acesso na aplicação começa pelo driver (`pg`) com um pool de conexões; a escolha
de ORM ou query builder é decisão separada e nasce com o primeiro módulo de
negócio.

## Alternativas consideradas

### MySQL

Cobre a fase 1 tão bem quanto. Perde nas fases seguintes: o particionamento e os
tipos avançados do PostgreSQL fazem diferença na telemetria e na ficha clínica, e
o ecossistema de extensões é menor. Sem vantagem que compense.

### MongoDB

A flexibilidade de esquema é atraente para a ficha do pet, que varia por espécie.
Mas o núcleo do domínio é relacional — titularidade, vínculos, integridade — e
modelar relação em documento cobra caro em consistência. O caso legítimo de
flexibilidade é coberto por colunas JSONB dentro do relacional.

Entrou na balança também o suporte geoespacial nativo do MongoDB — os índices
`2dsphere` (evolução da indexação por geohash), com consulta de proximidade pronta.
Para "parceiros próximos", ele resolve tão bem quanto o PostGIS, e é justo
registrar isso. Não muda o veredito por dois motivos: o PostGIS cobre o mesmo caso
e vai além quando a coleira trouxer localização contínua (distância precisa,
geometrias, histórico de posição junto da telemetria); e adotar MongoDB por causa
da geolocalização significaria ou mover o núcleo relacional para documento, ou
operar um segundo banco só para geo — os dois caminhos já descartados acima.

### Um banco por perfil de carga (relacional + série temporal desde já)

A telemetria da fase 3 tem perfil de série temporal, e há bancos especializados
nisso. Adotar um agora seria pagar por um problema que ainda não chegou — dois
sistemas para operar desde o primeiro dia. O particionamento do PostgreSQL cobre a
escala prevista, e o gatilho abaixo marca o limite.

## Consequências

**Ganhamos:** um único sistema de dados para todas as fases previstas, integridade
no banco em vez de na disciplina da aplicação, e caminho gerenciado em produção.

**Pagamos:** operar bem PostgreSQL em volume (particionamento, vacuum, índices)
exige conhecimento específico — a fatura de aprendizado chega junto com a fase 3.

**Fica mais difícil:** justificar um banco especializado depois — a barreira de
"já temos Postgres" é real e pode atrasar uma troca que se torne necessária.

## Gatilho de revisão

- A telemetria da fase 3 medindo volume de escrita ou custo de armazenamento acima
  do que o particionamento resolve com folga — aí a conversa de banco de série
  temporal reabre, com número na mesa.
- Qualquer necessidade de dado que force um segundo sistema (busca textual pesada,
  grafo) — avaliada primeiro como extensão do PostgreSQL, e só depois como serviço
  novo.

## Referências

- [Spike-0001 — custos de cloud por fase](../spikes/0001-custos-de-cloud-por-fase.md), que já precificava o RDS PostgreSQL como peça fixa.
