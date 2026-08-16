---
titulo: Cadastro de tutor
estado: concluída
fase: 1
modulo: identity
---

# Spec-0001: Cadastro de tutor

## Problema

Nada existe na plataforma antes do tutor: o pet pertence a um tutor, a
titularidade liga os dois, e a conta de acesso da fase 1 nasce sobre esse
registro. Este é também o primeiro módulo de negócio do monólito — ele estreia o
molde de quatro camadas da
[ADR-0006](../../docs/adrs/0006-estrutura-interna-dos-modulos.md) e vira a
referência que os módulos seguintes copiam.

O escopo é deliberadamente o menor que prova o molde inteiro: criar um tutor e
consultá-lo. Módulo conforme o mapa do
[Spike-0002](../../docs/spikes/0002-organizacao-interna-dos-modulos.md):
`identity`. A tabela segue a modelagem do
[Spike-0005](../../docs/spikes/0005-modelagem-de-dados-da-fase-1.md) e as
convenções do [Guia-0003](../../docs/guides/0003-convencoes-de-banco.md).

## Requisitos

- **R1** — QUANDO receber `POST /tutors` com nome e e-mail válidos, O SISTEMA
  DEVE criar o tutor e responder `201` com `id`, `name`, `email` e `createdAt`.
- **R2** — QUANDO o e-mail informado já pertencer a um tutor, O SISTEMA DEVE
  responder `409` sem gravar nada.
- **R3** — QUANDO o corpo da requisição for inválido (e-mail malformado, nome
  vazio ou ausente), O SISTEMA DEVE responder `400` apontando os campos
  rejeitados, sem tocar o banco.
- **R4** — QUANDO receber `GET /tutors/:id` de um tutor existente, O SISTEMA
  DEVE responder `200` com os dados; QUANDO o `id` não existir, DEVE responder
  `404`.

## Regras de negócio

- **RN1** — E-mail é único e é o identificador natural da conta: o login da
  fase 1 nascerá sobre ele. Origem: mapa de módulos do Spike-0002 (`identity` é
  a conta do tutor).
- **RN2** — E-mail é normalizado antes de validar e gravar: minúsculas e sem
  espaços nas pontas. `Ana@Mail.com` e `ana@mail.com` são o mesmo tutor.
  Origem: prevenção de duplicidade óbvia; sem normalização, RN1 vira loteria de
  digitação.
- **RN3** — Nome é obrigatório, de 2 a 120 caracteres, sem outra restrição de
  formato. Origem: decisão de produto — nome é identificação de exibição, não
  documento.

## Critérios de aceite

- [x] `POST /tutors` válido responde `201` e o `GET /tutors/:id` devolve o que
  foi criado (prova por `curl` no PR).
- [x] `POST /tutors` com o mesmo e-mail (mesmo variando maiúsculas) responde
  `409`.
- [x] `POST /tutors` com corpo inválido responde `400` com os campos rejeitados.
- [x] `GET /tutors/:id` inexistente responde `404`.
- [x] A migration da tabela aplica e reverte (`pnpm db:migrate` e o revert
  provados no PR).
- [x] Os testes do use case cobrem R1 a R4 com dublê em memória do repositório.

## Fora de escopo

- **Autenticação e login** — a decisão do mecanismo (serviço gerenciado versus
  implementação própria) é a próxima decisão estrutural da fase 1 e merece
  spike e ADR próprios antes de qualquer código.
- **Fluxos de endereço do tutor** — a estrutura (`tutor_addresses`) nasce na
  migration do módulo conforme a
  [ADR-0010](../../docs/adrs/0010-tabelas-de-tutor-e-endereco.md); criar,
  listar e alterar endereço entram em spec própria.
- **Cadastro de pets e titularidade** — Spec-002, no módulo `pet-registry`.
- **Atualização e exclusão de tutor** — entram quando houver fluxo que os
  exija; a exclusão em particular envolve o destino dos pets vinculados e
  merece regra de negócio própria.
- **Verificação de e-mail** (confirmação por link ou código) — depende do envio
  de e-mail, que é integração externa e chega com as portas da fase 2.
