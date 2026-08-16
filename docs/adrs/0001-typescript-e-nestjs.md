# ADR-0001: TypeScript com NestJS no backend

- **Status:** Aceita
- **Data:** 2026-08-15
- **Fase:** fundação

## Contexto

O backend começa com um desenvolvedor só e cresce em fases: cadastros, conteúdo e
assistente, coleira, monetização. O domínio tem bastante regra de negócio: quem é
tutor de qual pet, ficha clínica, alertas de saúde. Um erro de tipagem nesse
contexto pode, por exemplo, atribuir uma leitura de saúde ao pet errado — e é o
tipo de erro que vale barrar o mais cedo possível, de preferência em compilação.

A carga das primeiras fases é quase toda I/O: banco, pagamento, push, e-mail. Nada
de processamento pesado no horizonte.

Duas coisas pesam na escolha: a produtividade de quem constrói hoje e a facilidade
de contratar amanhã.

## Decisão

**TypeScript em modo estrito, com NestJS.**

- O TypeScript pega em compilação boa parte dos erros que só apareceriam em
  produção — e mantém o ecossistema Node, o maior em bibliotecas prontas para as
  integrações que vêm por aí.
- O NestJS já traz módulos e injeção de dependência: a estrutura que o monólito
  modular ([ADR-0002](0002-monolito-modular-com-entrega-faseada.md)) precisa, sem
  construir do zero.
- Uma linguagem só no backend inteiro: menos troca de contexto agora, contratação
  mais fácil depois.

## Alternativas consideradas

### Go

Tentador pela performance, principalmente pensando na telemetria da coleira. Mas o
gargalo das primeiras fases é I/O, não CPU — e performance que só importa daqui a
um ano não paga a produtividade perdida hoje. Se a telemetria provar o contrário,
o gatilho está na ADR-0002.

### Python com FastAPI

Rápido para prototipar e conversa bem com o futuro assistente de IA. Mas a tipagem
opcional protege pouco um domínio com tanta regra, e a estrutura que o NestJS dá
pronta viraria convenção mantida na mão.

### Node com Fastify puro

Leve e flexível, mas sem estrutura pronta: módulos, injeção de dependência e ciclo
de vida precisariam ser definidos e mantidos manualmente. Esse trabalho consumiria
justamente o tempo que o projeto não tem.

## Consequências

**Ganhamos:** velocidade de entrega, tipos protegendo a regra de negócio e
estrutura pronta.

**Pagamos:** Node é fraco para trabalho pesado de CPU. Hoje isso não custa nada,
porque a carga é I/O.

**Fica mais difícil:** rodar processamento intenso (visão computacional, por
exemplo) dentro deste backend. Se um dia existir, será um serviço à parte.

## Gatilho de revisão

- Uso sustentado de CPU, medido e não previsto, degradando o resto do processo.
- Uma necessidade que o ecossistema Node não cubra — e mesmo aí a revisão é do
  componente, não do backend inteiro.
