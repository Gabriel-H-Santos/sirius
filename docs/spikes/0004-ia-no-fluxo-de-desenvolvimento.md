# Spike-0004: IA no fluxo de desenvolvimento

- **Status:** Concluído
- **Data:** 2026-08-16
- **Pergunta:** em que forma usar IA no desenvolvimento do projeto, a que custo, e
  com quais salvaguardas para que a qualidade não dependa de confiança cega?

## Contexto

O projeto tem um desenvolvedor e uma cadência de entregas pequenas com
documentação pesada em decisões (ADRs, spikes, diagramas). IA generativa ajuda em
exatamente esses dois gargalos — produção de código com verificação e produção de
documentação de qualidade — mas o uso sem regras cria dois riscos: código aceito
sem entendimento e documentação que ninguém revisou de verdade.

Uma distinção organiza tudo: **IA como ferramenta de desenvolvimento** (este
spike) é diferente de **IA como funcionalidade do produto** (o assistente da fase
2). A primeira é uma assinatura mensal da ferramenta de trabalho; a segunda é
custo por chamada dentro do produto e terá decisão própria quando a fase chegar.

## Investigação

### As formas de uso

| Forma | O que é | Serve para |
|---|---|---|
| **Claude Code** (terminal e IDE) | Agente que lê e edita o repositório, roda comandos, abre PRs | O trabalho principal: código, investigação, documentação — com o contexto do projeto inteiro |
| **Chat** (claude.ai) | Conversa sem acesso ao repositório | Dúvidas pontuais, rascunhos fora do código |
| **API por token** | Chamadas programáticas pagas por uso | IA dentro do produto — a fase 2, não a ferramenta de trabalho |
| **Autocomplete** (GitHub Copilot e similares) | Sugestão inline enquanto digita | Acelera digitação; não investiga, não documenta, não executa |

### Custos

**Assinatura (a ferramenta de trabalho)** — valores de referência de agosto de
2026, câmbio R$ 5,19; confirmar na página oficial antes de contratar:

| Plano | US$/mês | ~R$/mês | Para quem |
|---|---:|---:|---|
| Pro | 20 | 104 | uso leve a moderado do Claude Code |
| Max | 100 a 200 | 519 a 1.038 | uso intenso diário — o perfil deste projeto |

A régua que decide: o custo-hora de uma pessoa desenvolvedora sênior no Brasil é
de ordens de grandeza maior que qualquer plano. Se a ferramenta poupar poucas
horas por mês, ela se paga. Como comparação interna, o plano intenso custa o
equivalente a ~2× a infraestrutura inteira da fase 1
([Spike-0001](0001-custos-de-cloud-por-fase.md)).

**API por token (referência para a fase 2)** — preços oficiais da API Anthropic
[verificado]:

| Modelo | Entrada US$/M tokens | Saída US$/M tokens | Perfil |
|---|---:|---:|---|
| Claude Opus 5 | 5,00 | 25,00 | máxima capacidade |
| Claude Sonnet 5 | 3,00 (2,00 promocional até 31/08/2026) | 15,00 (10,00) | equilíbrio — candidato natural para o assistente do produto |
| Claude Haiku 4.5 | 1,00 | 5,00 | tarefas simples e de alto volume |

Esses números não decidem nada hoje; ficam registrados porque a fase 2 vai
precisar deles, e porque o teto de gasto por usuário — já anotado no
[Spike-0001](0001-custos-de-cloud-por-fase.md) — é o que impede a variação de
10× entre modelos de virar surpresa na fatura.

### IA como auxiliar de documentação

O maior ganho observado neste projeto não é código: é documentação. ADRs com
alternativas argumentadas, spikes com número e fonte, diagramas na identidade
visual — o custo de produzir isso bem é o que normalmente faz times abandonarem a
prática. Com IA no par, o fluxo que funciona é: a pessoa decide e explica o
porquê; a IA estrutura, redige e verifica consistência (links, numeração,
índices); a pessoa revisa o texto final como revisaria o de um colega.

### As salvaguardas que fazem isso funcionar

1. **A decisão é humana.** IA propõe e argumenta; quem aceita, registra e assina
   é a pessoa. Toda ADR documenta uma decisão de quem revisa, nunca da ferramenta.
2. **Os mesmos portões para todo código.** Origem não muda o rito: typecheck,
   build e imagem no CI, PR com prova real de funcionamento, revisão.
3. **Contexto versionado no repositório.** As convenções que a IA deve seguir
   vivem em arquivos versionados (`CLAUDE.md`, `.claude/skills/`) — qualquer
   sessão nova, em qualquer máquina, recebe as mesmas regras. Instrução que só
   existe na cabeça de alguém não escala nem para IA nem para gente.
4. **Especificação antes de código em feature de negócio.** O fluxo `.spec/`
   (especificação e plano numerados) garante que a IA executa um plano revisado,
   em vez de improvisar escopo.
5. **Autoria humana nos registros.** Commits e PRs registram quem decide e
   responde pela mudança; a ferramenta não assina.

## Recomendação

Adotar o Claude Code como par de desenvolvimento e auxiliar de documentação, em
plano de assinatura, com as cinco salvaguardas acima materializadas no
repositório (`CLAUDE.md`, `.claude/skills/`, `.spec/`). A escolha de provedor e
modelo para o assistente **do produto** fica explicitamente fora — é decisão da
fase 2, com spike próprio sobre os preços por token da época.

## O que ficou de fora

Avaliação comparativa de agentes concorrentes (Cursor, Windsurf, Copilot
Workspace) — o custo de troca de ferramenta de trabalho é baixo e a decisão é
reversível a qualquer mês, então não justifica investigação profunda agora.
Política de privacidade de código em ferramentas de IA — vale revisitar se o
repositório passar a conter segredo de negócio sensível.

## Decisões derivadas

- [ADR-0008 — Claude Code como par de desenvolvimento](../adrs/0008-claude-como-par-de-desenvolvimento.md)

## Referências

Consultadas em agosto de 2026:

- [Planos e preços — claude.com/pricing](https://claude.com/pricing)
- [Preços da API por modelo — platform.claude.com](https://platform.claude.com/docs/en/pricing)
- [Documentação do Claude Code](https://code.claude.com/docs)
