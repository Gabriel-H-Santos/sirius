# Guia-0001: Princípios de código

- **Cobre:** SOLID, DRY, KISS e YAGNI aplicados à estrutura deste projeto.
- **Decisões de origem:** [ADR-0002](../adrs/0002-monolito-modular-com-entrega-faseada.md),
  [ADR-0006](../adrs/0006-estrutura-interna-dos-modulos.md)

Princípio sem aplicação concreta é frase de camiseta. Este guia define cada um em
poucas linhas e mostra onde ele já está materializado no projeto — é o critério
de revisão quando um PR parecer "estranho" sem ninguém saber dizer por quê.

## SOLID

### S — Responsabilidade única

Cada arquivo tem um motivo para mudar. Não é "fazer só uma coisa pequena"; é
responder a um único tipo de mudança.

**Aqui:** um use case, um `execute` — regra de negócio muda, só ele muda. O
controller traduz HTTP e delega — contrato público muda, só ele muda. O teste
prático está no [Spike-0002](../spikes/0002-organizacao-interna-dos-modulos.md):
se um arquivo parece caber em duas camadas, ele está fazendo duas coisas.

### O — Aberto/fechado

Comportamento novo entra por extensão, não editando o que já funciona.

**Aqui:** as portas. O use case depende do contrato de repositório; trocar a
implementação (a real de banco, o dublê em memória nos testes) não toca uma
linha do use case. As fases seguintes estendem do mesmo jeito: provedor novo é
um adapter novo numa porta existente, não um `if` novo dentro da regra.

### L — Substituição de Liskov

Toda implementação honra o contrato por inteiro — quem depende do contrato não
pode precisar saber qual implementação recebeu.

**Aqui:** o dublê de teste e o adapter real do mesmo repositório precisam ser
intercambiáveis. Teste que passa com o dublê e comportamento que quebra com o
adapter real é violação deste princípio em um dos dois lados — e é defeito, não
detalhe.

### I — Segregação de interfaces

Contratos pequenos, moldados pelo consumidor.

**Aqui:** o contrato de repositório declara os métodos que os use cases do
módulo usam — não um CRUD genérico completo "por via das dúvidas". Método sem
consumidor é superfície morta: alguém precisa implementar (e dublar) para
ninguém chamar.

### D — Inversão de dependência

Regra de negócio depende de abstração; o concreto se pluga por fora.

**Aqui:** é a regra estrutural da [ADR-0006](../adrs/0006-estrutura-interna-dos-modulos.md)
inteira — o `domain` define contratos, a `infra` implementa, a dependência
aponta para dentro. A injeção do NestJS materializa o princípio no dia a dia.

## DRY

Não repetir **conhecimento** — cada regra de negócio tem uma casa só. Não é
sobre linhas parecidas: dois trechos idênticos que mudam por motivos diferentes
não são repetição, são coincidência.

**Aqui:** a régua de extração é mudar junto. Se as cópias mudam pelo mesmo
motivo, extraia; se não, deixe. A documentação segue o mesmo princípio: um
diagrama tem fonte única e é referenciado, nunca duplicado
([docs/diagrams](../diagrams/README.md)).

Uma abstração errada custa mais caro que uma duplicação honesta — desfazer
abstração compartilhada exige tocar todos os consumidores; apagar cópia é local.
Na dúvida, espere a terceira ocorrência.

## KISS e YAGNI

A solução mais simples que resolve o problema atual, e mecanismo só quando o
problema chega. Os dois andam juntos e são a tese da entrega faseada
([ADR-0002](../adrs/0002-monolito-modular-com-entrega-faseada.md)).

**Aqui:** o projeto pratica isso de forma verificável — as travas de fronteira
por ferramenta só entram com o segundo módulo (antes não há fronteira a violar);
pacote compartilhado só nasce com o segundo consumidor; e todo "vai que precisa"
tem o lugar certo: o **gatilho de revisão** da ADR correspondente, que registra
o sinal que traria o mecanismo — em vez de construí-lo antes da hora.

## Relacionados

- [Guia-0002 — Padrões de projeto](0002-padroes-de-projeto.md)
- [Spike-0002 — Organização interna dos módulos](../spikes/0002-organizacao-interna-dos-modulos.md)
