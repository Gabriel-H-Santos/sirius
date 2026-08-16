# Spike-0002: Organização interna dos módulos

- **Status:** Concluído
- **Data:** 2026-08-16
- **Pergunta:** como estruturar os módulos do monólito para que a entrega faseada
  funcione sem virar acoplamento — e qual é o mapa de módulos de cada fase?

## Contexto

A [ADR-0002](../adrs/0002-monolito-modular-com-entrega-faseada.md) decidiu o
monólito modular e prometeu fronteiras explícitas entre módulos. O primeiro módulo
de negócio está prestes a nascer, e ele vai definir o padrão que os seguintes
copiam — decidir a estrutura agora custa uma conversa; decidir depois custa
refatorar todos os módulos existentes.

Três coisas precisam de resposta: a estrutura interna de um módulo, as regras de
dependência entre módulos, e quais módulos existem em cada fase.

## Investigação

Três formas de organizar um módulo NestJS, com o custo e o risco de cada uma:

**1. Padrão da documentação do Nest** — controller, service e repository no mesmo
nível, sem camadas formais. É o caminho mais rápido e com menos arquivos. O risco
aparece com o tempo: a regra de negócio se mistura com o framework e com o acesso
a banco dentro dos services, e separar depois exige refatoração de módulo inteiro.
Funciona bem para aplicações pequenas que vão continuar pequenas — não é o plano
aqui.

**2. Clean Architecture completa** — quatro camadas por módulo, com portas e
adaptadores nas dependências:

```
apps/api/src/modules/<nome>/
  domain/           entidades puras e contratos (repositórios), sem framework
  application/      casos de uso e portas para serviços externos
  infra/            implementações: persistência, adapters de integração
  presentation/     controllers, DTOs de entrada e saída, mappers
  index.ts          a superfície pública — o único arquivo que outro módulo importa
```

O custo é mais arquivos por caso de uso, mesmo em CRUD simples. Três fatores
reduzem esse custo aqui: é a estrutura que quem mantém o projeto pratica
diariamente — o padrão já é memória muscular, não aprendizado; o primeiro módulo
vira molde para os seguintes; e a estratégia de teste planejada (dublês em memória
implementando os contratos do domínio) precisa dos contratos que essa estrutura já
cria.

**3. Três camadas com superfície pública** — o meio-termo: funde `presentation`
dentro de `infrastructure` e só cria porta onde há integração externa. Menos
arquivos na fase de cadastros. O problema aparece adiante: as fases 2 a 4 trazem
integrações (LLM, push, SMS, pagamento) que pedem porta e adaptador de qualquer
forma — o monólito acabaria com dois estilos convivendo, e os testes da fase 1
nasceriam acoplados ao ORM por falta de contrato para dublar.

### O mapa de módulos por fase

| Fase | Módulos de negócio | O que entregam |
|---|---|---|
| 1 — Cadastros | `identity`, `pet-registry` | conta do tutor; pets e suas fichas, com titularidade |
| 2 — Conteúdo e assistente | `care-content`, `assistant` | dicas de cuidado; assistente de dúvidas |
| 3 — Coleira | `devices`, `telemetry`, `alerts` | frota, ingestão de leituras, alertas ao tutor |
| 4 — Monetização | `commerce` | assinatura, pagamento, nota |

Transversal a todos, fora de `modules/`: a plataforma (`config`, `database`,
health) — importável por qualquer módulo, sem importar nenhum.

### Regras de fronteira candidatas

1. **Todo dado tem um dono** — cada tabela pertence a um módulo; os outros não a
   consultam diretamente.
2. **Módulo importa módulo só pela superfície pública** — nunca um arquivo interno.
3. **A dependência aponta para dentro** — o domínio não importa nada das camadas
   externas.

A verificação dessas regras por ferramenta de build (prevista na ADR-0002) só faz
sentido quando existir um segundo módulo — antes disso não há fronteira a violar.

## Recomendação

A forma 2, com o mapa e as regras acima. O critério é o mesmo que decidiu a
linguagem e o ORM: a produtividade de quem constrói hoje — e quem constrói pratica
essa estrutura diariamente, o que inverte o custo usual da cerimônia. Pesam junto:
um único estilo do módulo 1 ao último (as integrações das fases 2 a 4 pedirão
portas de qualquer forma) e os contratos de que a estratégia de teste depende.

A recomendação muda se um módulo se provar CRUD puro sem regra — nesse caso a
cerimônia daquele módulo pode ser reduzida, com a exceção registrada na ADR.

## O que ficou de fora

Comunicação assíncrona entre módulos (eventos) — só se torna necessária na fase 3,
e merece spike próprio. Estratégia de testes por camada — nasce junto com o
primeiro módulo.

## Decisões derivadas

- [ADR-0006 — Estrutura interna dos módulos](../adrs/0006-estrutura-interna-dos-modulos.md)

## Referências

Consultadas em agosto de 2026:

- [Modular Monolith: A Primer — Kamil Grzybek](https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer)
- [MonolithFirst — Martin Fowler](https://martinfowler.com/bliki/MonolithFirst.html)
- [Módulos na documentação do NestJS](https://docs.nestjs.com/modules)
