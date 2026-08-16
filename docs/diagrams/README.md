# Diagramas

Os diagramas do projeto, numerados e escritos em [Mermaid](https://mermaid.js.org/)
— o GitHub renderiza nativamente, então o diagrama é texto versionável como todo o
resto: muda por PR, tem diff legível e nunca vira imagem desatualizada num drive.

Regras de uso:

- Um diagrama por arquivo, com um parágrafo de contexto dizendo o que ele mostra.
- Cada diagrama é fonte única e **referenciado por uma ADR ou um spike** — quem
  precisa do desenho aponta para cá, nunca o duplica.
- Todo flowchart usa a identidade visual definida no
  [template](0000-template.md): quatro classes de cor com significado fixo
  (componente, serviço externo, armazenamento, futuro).
- Diagrama que ficou obsoleto é atualizado no PR que mudou o comportamento — o
  checklist de PR cobra documentação junto da mudança.

O [template](0000-template.md) traz também os modelos de referência (fluxo,
sequência, estados, entidade-relacionamento e git) para os tipos de documento que
vierem a usá-los.

| # | Diagrama | Usado por |
|---|---|---|
| [0001](0001-fluxo-de-branches.md) | Fluxo de branches | [ADR-0007](../adrs/0007-fluxo-de-entrega.md) |
| [0002](0002-caminho-de-um-pr.md) | Caminho de um PR até a main | [ADR-0007](../adrs/0007-fluxo-de-entrega.md) |
| [0003](0003-modelo-de-dados-identity.md) | Modelo de dados do módulo identity | [ADR-0010](../adrs/0010-tabelas-de-tutor-e-endereco.md) |
