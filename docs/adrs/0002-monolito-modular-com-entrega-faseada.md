# ADR-0002: Monólito modular com entrega faseada

- **Status:** Aceita
- **Data:** 2026-08-15
- **Fase:** fundação

## Contexto

A plataforma nasce com um desenvolvedor e cresce em fases: primeiro cadastros
(tutores, pets e suas fichas), depois conteúdo e assistente, depois a coleira e por
fim a monetização. Os perfis de carga são bem diferentes — cadastro é CRUD leve,
telemetria de coleira é escrita contínua — mas o volume alto está a meses de
distância, e o custo de operar existe desde já.

Com uma pessoa, o recurso escasso não é máquina, é atenção. Cada serviço separado é
mais um deploy, mais um log para correlacionar e mais um lugar para olhar quando
algo quebra às 3h da manhã.

## Decisão

**Um único processo (NestJS, [ADR-0001](0001-typescript-e-nestjs.md)), dividido em
módulos com fronteiras explícitas, entregue por fases — cada fase liga módulos
novos sem reescrever os anteriores.**

Na prática:

- Uma unidade de deploy, um pipeline, um lugar para operar.
- Cada módulo é dono do seu dado e expõe uma superfície pública definida. Em um
  passo futuro, essas fronteiras passam a ser verificadas no build — regra imposta
  por ferramenta, não combinado entre pessoas.
- O espaço para o que ainda não existe já está reservado: a telemetria entra como
  módulo com perfil próprio e, se um dia precisar de processo separado, o caminho
  já está mapeado.

O desenho do sistema está no
[Diagrama-0004](../diagrams/0004-visao-macro.md) e a sequência de fases no
[Diagrama-0005](../diagrams/0005-fases-de-entrega.md).

## Alternativas consideradas

### Microserviços desde o início

Fazem sentido quando os perfis de carga divergem — e aqui divergem. Mas o preço
(N deploys, N pipelines, tracing distribuído, consistência entre serviços) seria
pago agora, por um time de uma pessoa, para um problema que só chega daqui a meses.
Esse custo passa a valer a pena quando o problema existir de fato — não antes.

### Funções serverless por endpoint

Custo perto de zero em repouso, o que é ótimo. Mas o domínio de cadastro é coeso e
transacional; espalhá-lo em dezenas de funções troca um monólito organizado por um
sistema distribuído sem fronteiras — pior de testar, de versionar e de depurar.

## Consequências

**Ganhamos:** operação mínima, depuração num lugar só, refactor sem atravessar rede
e velocidade nas fases iniciais.

**Pagamos:** deploy acoplado — qualquer mudança publica o processo inteiro. E a
disciplina de fronteira precisa ser mantida ativamente, porque num processo único
nada impede um módulo de importar o que não deveria; por isso a verificação
automática em passo futuro.

**Fica mais difícil:** escalar um módulo sozinho antes de separar o processo.

## Gatilho de revisão

- Time passando de ~6 pessoas, ou dois fluxos de trabalho disputando a mesma
  janela de deploy com frequência.
- Um módulo degradando os outros com carga medida, não prevista — o candidato óbvio
  é a ingestão de telemetria da coleira.
