---
name: documentacao
description: Receita para criar ADRs, spikes e diagramas no padrão do projeto — numeração, templates, estilo, índices e verificação de links. Use ao registrar uma decisão, uma investigação ou um fluxo visual.
---

# Criar documentação no padrão do projeto

Quatro tipos, quatro papéis: o **spike** investiga e recomenda; a **ADR**
decide; o **diagrama** mostra; o **guia** consolida a prática que as decisões
implicam. Quando uma investigação sustenta uma decisão, o spike e a ADR se
referenciam mutuamente (seções "Decisões derivadas" e "Referências").

## Regras comuns

1. Numeração sequencial de quatro dígitos — o próximo número é o maior do índice
   da pasta + 1. Nunca reusar número.
2. Copiar o `0000-template.md` da pasta correspondente; não inventar seções.
3. Atualizar o `README.md` da pasta (a linha na tabela) no mesmo PR.
4. Estilo: português técnico e direto, sem metáforas coloridas nem aforismos.
   Frases que um dev falaria numa conversa de trabalho.
5. Verificar que todo link relativo aponta para arquivo existente antes de
   encerrar.

## ADR (`docs/adrs/`)

- Nasce no PR em que a decisão vira código — nunca em lote, nunca retroativa.
- Contexto com número quando existir; Decisão em uma frase repetível; toda
  alternativa descartada com o argumento que a derrubou; consequências sem
  maquiagem (Ganhamos / Pagamos / Fica mais difícil); gatilho de revisão
  mensurável.
- Se a decisão corrigiu um erro anterior, dizer isso com naturalidade.

## Spike (`docs/spikes/`)

- Uma pergunta por spike, declarada no topo.
- Todo valor marcado [verificado] tem fonte linkada na seção Referências, com
  data da consulta. Valor derivado ou sem fonte é [estimativa]. Número redondo
  honesto vale mais que precisão falsa.
- A seção "O que ficou de fora" é obrigatória — omissão declarada.

## Guia (`docs/guides/`)

- Consolida prática recorrente; não decide nada — se um guia precisar afirmar
  algo que não decorre de ADR existente, falta uma ADR.
- Formato por conceito: definição em uma ou duas frases + "como aparece aqui"
  apontando estrutura ou regra concreta do projeto. Definição sem aplicação é
  enciclopédia, não guia.

## Diagrama (`docs/diagrams/`)

- Mermaid, um diagrama por arquivo, com parágrafo de contexto.
- Identidade visual do template: quatro papéis com cor fixa (principal azul,
  externo âmbar, dado verde, futuro cinza tracejado). Flowchart e estados usam
  `classDef`; sequência usa `init` + `box transparent`; ER e git usam `init` —
  sempre com `'theme': 'base'`, senão as variáveis são ignoradas.
- Diagramas são fonte única: ADRs e spikes apontam, nunca duplicam. Registrar
  quem usa o diagrama no rodapé e no índice.
