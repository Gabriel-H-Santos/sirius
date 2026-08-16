# Guia-0002: Padrões de projeto

- **Cobre:** os padrões que a arquitetura usa, onde cada um vive na estrutura de
  módulo e quando cada um entra.
- **Decisões de origem:** [ADR-0006](../adrs/0006-estrutura-interna-dos-modulos.md)

Padrão de projeto é resposta nomeada a um problema recorrente. A ordem importa:
primeiro o problema, depois o padrão — aplicado antes do problema existir, o
mesmo padrão vira cerimônia. Por isso este guia marca **quando** cada um entra,
não só o quê.

## Em uso desde a fase 1

### Repository

Separa a regra de negócio do acesso a dados: o `domain` declara o contrato
(interface + token de injeção), a `infra` implementa com o ORM. O use case não
sabe que o banco existe — sabe que o contrato existe.

- Contrato: `modules/<nome>/domain/repositories/`
- Implementação: `modules/<nome>/infra/repositories/`
- Bônus que paga o padrão: o teste dubla o contrato com uma implementação em
  memória, sem banco e sem mock de ORM.

### Dependency Injection

O módulo NestJS liga contrato à implementação; classes declaram o que precisam
no construtor e nunca instanciam dependência com `new`. Token `Symbol` para
injetar por interface. Montagem com lógica (escolher implementação por config,
compor uma cadeia) usa `useFactory` — que é o padrão Factory no ponto exato em
que ele se paga.

### DTO

Nenhuma entidade de domínio atravessa a borda HTTP. A entrada é validada por
schema zod na `presentation` (a borda rejeita o que o domínio nem chega a ver);
a saída é montada explicitamente, campo a campo — o que impede um campo interno
novo de vazar para o contrato público por acidente.

### Fake (dublê de estado)

O dublê de teste da casa: uma implementação em memória do contrato do domínio,
com asserção sobre **estado** (o que ficou gravado), não sobre interação (quais
métodos foram chamados). Testa comportamento, não implementação — refatorar o
use case sem mudar o resultado não quebra teste. A ferramenta e a política de
cobertura estão na
[ADR-0011](../adrs/0011-jest-como-ferramenta-de-testes.md).

## Entram com as próximas fases

### Ports & Adapters (Adapter)

Para serviço externo: a `application` declara a porta (`gateways/`), a `infra`
implementa o adapter nomeado pelo provedor. A regra de negócio conversa com "um
serviço que responde X", nunca com o SDK do fornecedor — trocar de provedor é
trocar o adapter. **Gatilho:** a primeira integração externa (fase 2: LLM,
notificação).

### Strategy

Variações do mesmo algoritmo atrás de um contrato, escolhidas em tempo de
execução — candidato natural para os canais de alerta da fase 3 (push, SMS,
e-mail decididos por preferência do tutor). Registrado como candidato; só vira
código quando o problema chegar.

## O que este projeto evita por decisão

- **Camada de service genérica** — `XxxService` que concentra tudo é o oposto da
  responsabilidade única; aqui a unidade é o use case.
- **Herança para compartilhar comportamento** — classes base tipo `BaseService`
  criam acoplamento invisível; compartilhamento é por composição e injeção.
- **Padrão especulativo** — mecanismo fora deste guia que pareça necessário:
  parar, registrar a discussão (ADR ou atualização deste guia) e só então
  escrever o código.

## Relacionados

- [Guia-0001 — Princípios de código](0001-principios-de-codigo.md)
- [Spike-0002 — Organização interna dos módulos](../spikes/0002-organizacao-interna-dos-modulos.md)
