# ADR-0005: TypeORM como ORM, com migrations como fonte do schema

- **Status:** Aceita
- **Data:** 2026-08-16
- **Fase:** fundação (o primeiro módulo de negócio já nasce sobre ela)

## Contexto

Com o PostgreSQL decidido ([ADR-0004](0004-postgresql-como-banco.md)), o próximo
módulo é de negócio: cadastro de tutores e pets. Falta a camada de acesso a dados —
e ela define o dia a dia do código mais do que qualquer outra escolha da fundação:
como se declara uma entidade, como se escreve uma consulta e como o schema evolui.

Os critérios, na ordem que pesam aqui: produtividade de quem constrói hoje (uma
pessoa), integração limpa com o NestJS ([ADR-0001](0001-typescript-e-nestjs.md)) e
um caminho de migrations confiável — o schema vai mudar a cada fase.

## Decisão

**TypeORM, com três regras de uso desde o primeiro dia:**

- **`synchronize` desligado, sempre.** O schema nunca é alterado pela aplicação;
  toda mudança de banco é uma migration versionada no repositório, aplicada por
  comando (`pnpm db:migrate`). O histórico de migrations é a fonte da verdade do
  schema.
- **CLI com a mesma validação de ambiente da aplicação.** A DataSource usada pelas
  migrations reutiliza o `validateEnv` — não existe um segundo jeito de configurar
  o banco.
- **Entidades carregadas por módulo** (`autoLoadEntities`): cada módulo de negócio
  registra as suas, coerente com as fronteiras da
  [ADR-0002](0002-monolito-modular-com-entrega-faseada.md).

O que decidiu: integração de primeira classe com o NestJS (módulo oficial, injeção
de repositórios pronta), migrations maduras, e ser a ferramenta que o time domina —
o mesmo argumento de produtividade da ADR-0001, aplicado à camada de dados.

## Alternativas consideradas

### Drizzle

A melhor type-safety do ecossistema — as consultas são praticamente SQL tipado — e
o runtime mais leve. Não levou porque a integração com o NestJS é artesanal (sem
módulo oficial, injeção e ciclo de vida por conta própria) e porque seria
ferramenta nova para o time: dois custos que caem justamente sobre a pessoa que
precisa entregar a fase 1.

### Prisma

A melhor experiência de schema e migrations do mercado. Não levou pelo encaixe: o
cliente gerado vive fora do ciclo de injeção de dependência do Nest, o passo de
codegen entra em todo fluxo de build, e a camada de runtime própria adiciona uma
peça entre a aplicação e o banco que o projeto não precisa.

### Driver puro (ou query builder leve, como Kysely)

Controle total e zero mágica — atraente para quem gosta de SQL. Não levou pelo
custo recorrente: mapeamento de linha para objeto, relações e migrations viram
código artesanal para manter. É a mesma conta do Fastify puro na ADR-0001, e o
resultado é o mesmo.

## Consequências

**Ganhamos:** entidades e repositórios integrados ao Nest sem cerimônia, migrations
versionadas com CLI pronta, e velocidade imediata na construção da fase 1.

**Pagamos:** type-safety inferior à das opções mais novas — erro de consulta que o
Drizzle pegaria em compilação pode chegar ao runtime aqui. Testes sobre os
repositórios cobrem parte dessa lacuna.

**Fica mais difícil:** trocar depois. ORM permeia o código de dados inteiro; a
mitigação é o acesso a dados viver atrás das fronteiras de módulo da ADR-0002, não
espalhado pelos controllers.

## Gatilho de revisão

- Padrão recorrente de defeito que a tipagem do ORM deixou passar e outra
  ferramenta pegaria em compilação — três ocorrências em um trimestre reabrem a
  conversa.
- Consulta crítica que o ORM não expresse bem e force SQL cru com frequência — se
  o SQL cru virar rotina em um módulo, o módulo pede outra ferramenta.

## Referências

- [Documentação do TypeORM](https://typeorm.io/) · [Integração oficial com NestJS](https://docs.nestjs.com/techniques/database) (consultadas em agosto de 2026)
