# Registros de decisão de arquitetura (ADRs)

Cada decisão estrutural deste projeto vira um registro curto e numerado: o que foi
decidido, o que foi descartado e com qual argumento, e **qual sinal mensurável
obriga a decisão a ser revista**. Decisão sem gatilho de revisão vira dogma.

Uma ADR nasce no mesmo PR em que a decisão vira código — nunca em lote, nunca
retroativa. Para escrever uma nova, copie o [template](0000-template.md).

| # | Decisão | Status |
|---|---|---|
| [0001](0001-typescript-e-nestjs.md) | TypeScript com NestJS no backend | Aceita |
| [0002](0002-monolito-modular-com-entrega-faseada.md) | Monólito modular com entrega faseada | Aceita |
| [0003](0003-aws-como-nuvem.md) | AWS como nuvem, na região norte-americana | Aceita |
| [0004](0004-postgresql-como-banco.md) | PostgreSQL como banco de dados | Aceita |
| [0005](0005-typeorm-como-orm.md) | TypeORM como ORM, com migrations como fonte do schema | Aceita |
| [0006](0006-estrutura-interna-dos-modulos.md) | Estrutura interna dos módulos: quatro camadas e superfície pública | Aceita |
| [0007](0007-fluxo-de-entrega.md) | GitHub Flow com imagem Docker validada no CI | Aceita |
