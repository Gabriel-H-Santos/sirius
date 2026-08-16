# ADR-0008: Claude Code como par de desenvolvimento, com harness versionado

- **Status:** Aceita
- **Data:** 2026-08-16
- **Fase:** fundação (vale para todo o desenvolvimento; a IA do produto é decisão da fase 2)

## Contexto

O projeto tem uma pessoa desenvolvendo e uma prática documental pesada — toda
decisão vira ADR, toda investigação vira spike, todo fluxo relevante vira
diagrama. O [Spike-0004](../spikes/0004-ia-no-fluxo-de-desenvolvimento.md)
levantou as formas de usar IA nesse fluxo, os custos (assinatura para a
ferramenta de trabalho; por token só quando a IA for funcionalidade do produto) e
as salvaguardas que impedem o uso de virar confiança cega.

## Decisão

**Claude Code como par de desenvolvimento e auxiliar de documentação, em plano de
assinatura, com o contexto de trabalho versionado no repositório:**

```
CLAUDE.md          o contexto do projeto: convenções, fluxo, comandos, definição de pronto
.claude/skills/    receitas específicas do repositório (criar documentação, entregar mudança)
.spec/             especificações numeradas: feature de negócio nasce como spec + plano antes do código
```

Com cinco regras que valem mais que a ferramenta:

1. **A decisão é humana.** A IA propõe e argumenta; quem aceita e responde pela
   decisão é a pessoa — e é isso que a ADR registra.
2. **Os mesmos portões para todo código.** Origem não muda o rito: typecheck,
   build e imagem no CI, PR com prova real, revisão.
3. **Contexto versionado.** As convenções que a IA segue vivem em arquivos do
   repositório — sessão nova, máquina nova, mesmas regras. O harness evolui por
   PR como qualquer código.
4. **Especificação antes de código em feature de negócio.** O fluxo `.spec/`
   coloca um plano revisado entre a ideia e a implementação.
5. **Autoria humana nos registros.** Commits e PRs registram quem decide e
   responde pela mudança; a ferramenta não assina.

## Alternativas consideradas

### Não usar IA

Elimina o risco de código não compreendido ao custo de perder o maior ganho de
produtividade disponível para um time de uma pessoa — em especial na
documentação, onde o custo de fazer bem é o que normalmente mata a prática. O
risco de qualidade se mitiga com os portões existentes, não com abstinência.

### Autocomplete (GitHub Copilot e similares)

Acelera a digitação, e só. Não investiga o repositório, não roda comandos, não
redige uma ADR, não verifica links e índices. Cobre uma fração pequena do que
este fluxo precisa; pode até coexistir, mas não substitui.

### API por token como ferramenta de trabalho

Pagar por uso daria custo variável e imprevisível para trabalho diário, sem o
harness de terminal e IDE que a assinatura já entrega pronto. A API tem papel
reservado: a IA **do produto**, na fase 2 — decisão separada, com spike próprio
de preços na época.

## Consequências

**Ganhamos:** velocidade de entrega e — principalmente — documentação de decisão
sustentável para uma pessoa só; contexto de trabalho reproduzível em qualquer
sessão; custo fixo mensal conhecido.

**Pagamos:** a assinatura mensal, e a disciplina de manter o harness atualizado —
convenção nova que não entrar no `CLAUDE.md` é convenção que a próxima sessão
não conhece.

**Fica mais difícil:** aceitar mudança sem entender. É intencional: a regra da
prova real no PR e a revisão humana existem exatamente para que velocidade não
vire opacidade.

## Gatilho de revisão

- O custo da assinatura deixar de se pagar em horas poupadas por dois meses
  seguidos — a régua é honesta: se a ferramenta não acelera, sai.
- Retrabalho ou defeito recorrente em mudanças assistidas que os portões não
  estejam pegando — reabre as salvaguardas, não necessariamente a ferramenta.
- A chegada da fase 2 dispara a decisão separada: provedor e modelo do assistente
  **do produto**, com ADR e spike próprios.

## Referências

- [Spike-0004 — IA no fluxo de desenvolvimento](../spikes/0004-ia-no-fluxo-de-desenvolvimento.md)
