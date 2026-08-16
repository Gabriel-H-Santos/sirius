# Sirius

Plataforma de cuidado com pets: cadastro de tutores e animais, acompanhamento de
saúde e, futuramente, monitoramento por coleira inteligente.

O nome vem de α Canis Majoris, a *Dog Star* — a estrela cuja ascensão os egípcios
liam como sinal periódico para prever a cheia do Nilo. Ler sinais de um cão e
transformá-los em previsão útil é a tese do sistema.

Monorepo com entrega faseada. Fase atual: **fundação** — a API sobe e responde; os
módulos de negócio entram nas próximas fases.

## Rodando

```bash
nvm use
pnpm install
pnpm dev        # API em http://localhost:3000/health
```

## Estrutura

```
apps/api/   API NestJS
```
