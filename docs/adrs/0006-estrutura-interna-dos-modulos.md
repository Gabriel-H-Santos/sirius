# ADR-0006: Estrutura interna dos módulos: quatro camadas e superfície pública

- **Status:** Aceita
- **Data:** 2026-08-16
- **Fase:** fundação (vale a partir do primeiro módulo de negócio)

## Contexto

O primeiro módulo de negócio está para nascer e vai definir o padrão que os
seguintes copiam. A [ADR-0002](0002-monolito-modular-com-entrega-faseada.md)
decidiu o monólito modular com fronteiras explícitas, mas não disse como um módulo
é organizado por dentro — e essa é a diferença entre um monólito modular e um
monólito com pastas. O [Spike-0002](../spikes/0002-organizacao-interna-dos-modulos.md)
comparou três formas de organização e mapeou os módulos de cada fase.

Dois fatores pesam além da estrutura em si: a estratégia de teste planejada usa
dublês em memória que implementam contratos do domínio — esses contratos precisam
existir desde o primeiro caso de uso; e as fases 2 a 4 trazem integrações externas
(LLM, push, SMS, pagamento) que pedem porta e adaptador de qualquer forma.

## Decisão

**Cada módulo de negócio segue Clean Architecture com quatro camadas e uma
superfície pública única:**

```
apps/api/src/modules/<nome>/
  domain/           entidades puras e contratos (repositórios), sem framework
  application/      casos de uso e portas para serviços externos
  infra/            implementações: persistência, adapters de integração
  presentation/     controllers, DTOs de entrada e saída, mappers
  index.ts          o único arquivo que outro módulo pode importar
```

Com as regras de fronteira:

1. **Todo dado tem um dono.** Cada tabela pertence a um módulo; os outros não a
   consultam diretamente — pedem ao dono, pela superfície pública.
2. **Módulo importa módulo só pelo `index.ts`.** Arquivo interno de um módulo é
   invisível para os demais.
3. **A dependência aponta para dentro.** `presentation` e `infra` conhecem
   `application`, que conhece `domain`; o domínio não importa Nest, TypeORM nem
   nada externo — o contrato de repositório mora no `domain`, a implementação no
   `infra`.
4. **Integração externa entra por porta.** Interface na `application`, adapter na
   `infra` — o caso de uso não sabe com quem fala.

O critério que decidiu é o mesmo da [ADR-0001](0001-typescript-e-nestjs.md) e da
[ADR-0005](0005-typeorm-como-orm.md): a produtividade de quem constrói hoje. Essa
estrutura é a que quem mantém o projeto pratica diariamente — o custo usual da
cerimônia (aprender e internalizar o padrão) aqui já foi pago, e o primeiro módulo
serve de molde para os demais.

A plataforma (`config`, `database`, health) vive fora de `modules/`: qualquer
módulo pode usá-la, e ela não conhece nenhum. O mapa de módulos por fase está no
spike; a fase 1 cria `identity` e `pet-registry`. A verificação das regras por
ferramenta de build entra junto com o segundo módulo de negócio.

## Alternativas consideradas

### Padrão da documentação do Nest (controller, service, repository)

O caminho mais rápido e o padrão que a maior parte dos exemplos segue. Não levou
porque a regra de negócio acaba morando nos services, misturada com framework e
acesso a banco — e o custo de separar depois é refatorar módulo por módulo.

### Três camadas com portas só onde houver integração (o meio-termo do spike)

Menos arquivos na fase de cadastros, e foi a primeira recomendação avaliada. Não
levou por três razões: os contratos de que a estratégia de teste depende não
existiriam no primeiro módulo — os testes nasceriam acoplados ao ORM; as fases 2 a
4 introduziriam portas de qualquer forma, deixando dois estilos convivendo no
mesmo monólito; e a economia de cerimônia beneficia quem ainda vai aprender o
padrão completo — não é o caso de quem mantém este projeto.

## Consequências

**Ganhamos:** regra de negócio testável com dublês em memória desde o primeiro
caso de uso, um único estilo do módulo 1 ao último, fases novas ligando módulos
sem tocar os antigos, e um padrão documentado de mercado para o próximo dev herdar.

**Pagamos:** mais arquivos por caso de uso que o CRUD direto — atenuado pelo
primeiro módulo servir de molde — e a disciplina de manter cada coisa na sua
camada, que até a ferramenta de verificação chegar depende de revisão.

**Fica mais difícil:** o atalho rápido — consultar a tabela alheia, importar o
interno do vizinho, injetar o ORM direto no caso de uso. É intencional: o atalho
de hoje é o acoplamento que impede a fase de amanhã.

## Gatilho de revisão

- Um módulo em que a estrutura vire peso comprovado — CRUD puro, sem regra de
  negócio e sem integração — pode ter a cerimônia reduzida, com a exceção
  registrada nesta ADR.
- O nascimento do segundo módulo de negócio torna a verificação de fronteira por
  ferramenta obrigatória, não opcional.
