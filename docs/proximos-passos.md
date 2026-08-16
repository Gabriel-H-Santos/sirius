# Próximos passos

O que vem depois do que está entregue, em duas dimensões: o produto (fases e
módulos) e a engenharia (ferramentas e mecanismos que entram quando o gatilho
certo chega — o mesmo critério de [YAGNI](guides/0001-principios-de-codigo.md)
que rege o código). Documento vivo: atualizado no PR que entregar cada item.

## Produto

A fase 1 está com o primeiro módulo completo (`identity`: migration, domínio,
borda HTTP com tratamento de erros, testes). A sequência, cada passo com as
decisões que nascem junto:

| # | Passo | O que nasce junto |
|---|---|---|
| 1 | Módulo `pet-registry`: pets, ficha e titularidade N:N | Spec-0004, copiando o molde do `identity` sobre as tabelas do [Spike-0005](spikes/0005-modelagem-de-dados-da-fase-1.md) |
| 2 | Fluxos de endereço do tutor (estrutura pronta na [ADR-0010](adrs/0010-tabelas-de-tutor-e-endereco.md)) | spec própria |
| 3 | Autenticação do tutor | spike + ADR (serviço gerenciado × implementação própria) antes de qualquer código de login |
| 4 | Deploy da fase 1 na nuvem | infra do [Spike-0001](spikes/0001-custos-de-cloud-por-fase.md), pipeline de deploy e observabilidade mínima |
| 5 | Fase 2 — `care-content` e `assistant` | primeira integração externa (porta + adapter) e a decisão de modelo e custo por token do assistente |
| 6 | Fase 3 — coleira (`devices`, `telemetry`, `alerts`) | modelagem própria de série temporal e a revisão de escala prevista na [ADR-0002](adrs/0002-monolito-modular-com-entrega-faseada.md) |
| 7 | Fase 4 — `commerce` | provedor de pagamento e o modelo de assinatura |

## Engenharia

Organizada por gatilho — cada bloco entra quando o sinal chega, não antes.

### Curto prazo (independe de gatilho)

- **ESLint + Prettier** — o repositório ainda não tem lint; regras estritas de
  TypeScript (proibir `any`, import por alias, convenção de nome de arquivo) e
  formatação única, com script no CI.
- **Husky + lint-staged + commitlint** — os portões do CI rodando também no
  commit: Conventional Commits verificado no `commit-msg`, typecheck e lint
  rápidos no `pre-commit`. Falhar em segundos na máquina é mais barato que
  falhar em minutos no CI.

### Com o segundo módulo (`pet-registry`)

- **Travas de fronteira por ferramenta (dependency-cruiser)** — a promessa
  registrada na [ADR-0002](adrs/0002-monolito-modular-com-entrega-faseada.md) e
  na [ADR-0006](adrs/0006-estrutura-interna-dos-modulos.md): regra de
  dependência entre camadas e proibição de import entre módulos verificadas no
  build. Antes do segundo módulo não há fronteira a violar; com ele, a regra
  deixa de ser combinado e vira gate.

### Antes do deploy público (passo 4 do produto)

- **Observabilidade** — logs estruturados com identificador de correlação por
  requisição (o `traceId` no corpo de erro já ficou anotado como fora de escopo
  na [Spec-0002](../.spec/0002-tratamento-de-erros-na-borda/spec.md)), métricas
  básicas de processo e de rota, e alarme nos sinais que importam. Spike
  próprio para escolher o mínimo que se sustenta.
- **Segurança de borda** — headers de proteção (helmet), rate limiting e CORS
  explícito por ambiente.
- **Gestão de segredos** — credenciais fora de `.env` em produção (gerenciador
  de segredos da nuvem), com a validação zod de boot continuando como contrato.
- **Pipeline de deploy** — o CI já valida imagem; falta o CD que a publica, com
  migration aplicada de forma controlada no rollout.

### Com consumidor real do contrato (app consumindo a API)

- **OpenAPI/Swagger** — o `nestjs-zod` já gera schema a partir dos DTOs; expor
  a documentação viva quando houver quem a consuma.
- **Testes de contrato da borda** — supertest sobre as rotas (anotado na
  [Spec-0003](../.spec/0003-base-de-testes/spec.md)); junto, o versionamento de
  rota.

### Com o crescimento do time e da base

- **Testes de integração com banco real** — decisão própria registrada quando o
  volume de módulos justificar (hoje a infra é provada por execução real no PR).
- **Atualização automática de dependências** (Renovate ou Dependabot) — com os
  portões de teste como rede.
- **Relatório de cobertura no PR** — o portão já falha o build; o relatório
  visível por PR entra quando houver mais de uma pessoa revisando.
