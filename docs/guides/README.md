# Guias

Referência de prática: como os princípios e padrões clássicos se materializam
neste código, com o mapeamento para a estrutura real do projeto.

O papel de cada tipo de documento: a **ADR** registra uma decisão datada, com
alternativas e gatilho de revisão; o **spike** investiga uma pergunta; o **guia**
consolida a prática que as decisões implicam — é atemporal e evolui por PR quando
a prática muda. Guia não decide nada: quando um guia precisar afirmar algo que
não decorre de uma ADR existente, é sinal de que falta uma ADR.

Guia novo só quando houver prática recorrente a consolidar — para criar, copie o
[0000-template.md](0000-template.md).

| # | Guia | Cobre |
|---|---|---|
| [0001](0001-principios-de-codigo.md) | Princípios de código | SOLID, DRY, KISS e YAGNI aplicados à estrutura do projeto |
| [0002](0002-padroes-de-projeto.md) | Padrões de projeto | os padrões que a arquitetura usa, onde cada um vive e quando entra |
| [0003](0003-convencoes-de-banco.md) | Convenções de banco de dados | nomes, colunas obrigatórias, mapeamento e regras de migration |
