# Spike-0001: Custos de cloud por fase de entrega

- **Status:** Concluído
- **Data:** 2026-08-15
- **Pergunta:** quanto custa a infraestrutura em cada fase de entrega, em qual
  nuvem, e o que domina esse custo?

Preços na região norte-americana (us-east-1), a escolhida na
[ADR-0003](../adrs/0003-aws-como-nuvem.md). O levantamento por item foi feito em
agosto de 2026 na região de São Paulo (onde cada valor foi conferido em tabela
oficial) e convertido pela diferença média de 30 a 40% entre as duas regiões — por
isso os totais em dólar abaixo estão marcados [estimativa]. Itens que não variam
com região (SMS, taxas de pagamento, LLM cobrado por token) não sofreram desconto.
Câmbio de referência R$ 5,19.

## As peças, e quando cada uma entra

| Peça | Serviço (AWS) | Entra na fase |
|---|---|---|
| API em contêiner | ECS Fargate (ARM64) | 1 |
| Banco relacional | RDS PostgreSQL | 1 |
| Borda (TLS, roteamento) | Application Load Balancer | 1 |
| Identidade do usuário | Cognito | 1 |
| Notificações push | FCM / APNs (gratuitos) | 2 |
| Chamadas ao LLM do assistente | Bedrock (ou provedor externo) | 2 |
| Armazenamento de telemetria bruta | S3 | 3 |
| SMS para alertas | provedor externo | 3 |
| Pagamento e nota fiscal | PSP + emissor (taxa por transação) | 4 |

A forma não muda entre as fases — três peças fixas (borda, API, banco) e o resto
pago por uso. O que muda é o tamanho e o que está ligado.

## Custo mensal por fase (AWS, us-east-1)

| Fase | Cenário | USD/mês | BRL/mês | O que domina o custo |
|---|---|---|---|---|
| 1 — Cadastros | primeiros milhares de usuários | ~50 [estimativa] | ~R$ 260 | as três peças fixas no menor tamanho |
| 2 — Assistente | idem + LLM com teto de gasto | ~70 a 130 [estimativa] | ~R$ 360 a 670 | a inferência do assistente — por isso o teto por usuário é requisito, não otimização |
| 3 — Coleira (piloto, 500 unidades) | telemetria contínua | ~150 [estimativa] | ~R$ 780 | banco e armazenamento crescem um degrau |
| 3 — Coleira (25 mil unidades) | tração | ~700 [estimativa] | ~R$ 3.600 | banco, armazenamento e SMS |

Dois pontos que mudam a leitura desses números:

- **Programas de crédito para startup cobrem os primeiros anos.** As três nuvens
  têm programas (AWS Activate, Google for Startups, Microsoft for Startups) com
  valores que vão de alguns milhares a centenas de milhares de dólares, conforme o
  estágio da empresa. Com crédito ativo, o desembolso real das fases 1 e 2 tende a
  zero. A ressalva: crédito expira, usado ou não — vale saber a data desde o
  primeiro dia e dimensionar a infraestrutura como se a fatura fosse paga, para não
  herdar um custo inflado quando o crédito acabar.
- **A partir da fase 3, o maior custo por coleira não é a nuvem — é o chip de
  celular dentro dela** (plano de dados M2M, na casa de R$ 2 a 3 por unidade/mês).
  Otimização de infraestrutura importa menos que o custo do produto físico.

## Comparativo entre nuvens (fase 1, regiões norte-americanas)

| | AWS | GCP | Azure |
|---|---|---|---|
| API em contêiner | Fargate | Cloud Run | Container Apps |
| Custo fase 1 [estimativa] | ~US$ 50 | ~US$ 25 a 40 | ~US$ 45 a 60 |
| Escala a zero em repouso | não | sim | parcial |
| Caminho para IoT (fase 3) | maduro (IoT Core) | descontinuado em 2023 | maduro (IoT Hub) |
| Observação | maior mercado de profissionais no Brasil | melhor preço em tráfego baixo | forte se já houver contrato Microsoft |

Leitura honesta: **na fase 1, o GCP é a opção mais barata** — o Cloud Run escala a
zero e cobra por requisição. A diferença, porém, é de dezenas de dólares por mês,
e desaparece se houver crédito de startup ativo em qualquer uma das três.

**Recomendação: AWS**, por três razões que pesam mais que a diferença de preço:
o caminho de IoT da fase 3 existe e é maduro (o do GCP foi descontinuado), o
mercado brasileiro de profissionais AWS é o maior — contratar depois fica mais
fácil — e créditos de startup, quando disponíveis na AWS, eliminam a vantagem de
preço do GCP no período que ela importa. Dentro da AWS, a região norte-americana
custa 30 a 40% menos que a de São Paulo e concentra o catálogo completo de
serviços; os prós e contras dessa escolha, incluindo latência e a transferência
internacional de dados, estão na [ADR-0003](../adrs/0003-aws-como-nuvem.md).

## Armadilhas de custo conhecidas

- **NAT Gateway** — ~US$ 33/mês em us-east-1 antes do primeiro byte útil
  [verificado], e mais que o dobro disso em São Paulo. O desenho evita: sub-rede
  pública com security group fechado para a API, banco em sub-rede privada.
- **Logs** — ingestão e retenção de log viram uma das maiores linhas da fatura se
  não houver política desde o início. Retenção curta e amostragem entram junto com
  a observabilidade.
- **Crédito grande induz desperdício** — a tentação de ligar instância maior
  "porque está de graça". A régua: dimensionar como se a fatura fosse paga.
- **Alarmes de billing desde o dia 1** — um orçamento por serviço com alerta
  configurado custa zero e evita a fatura surpresa.

## O que ficou de fora

Custo de conectividade M2M em volume, comparação detalhada de preço por SKU entre
as três nuvens e o custo do assistente por provedor de LLM. Cada um vira um spike
próprio se e quando a decisão correspondente chegar.

## Decisões derivadas

- [ADR-0003 — AWS como nuvem](../adrs/0003-aws-como-nuvem.md)

## Referências

Tabelas de preço oficiais consultadas (agosto de 2026):

- [AWS Fargate](https://aws.amazon.com/fargate/pricing/) · [RDS PostgreSQL](https://aws.amazon.com/rds/postgresql/pricing/) · [Application Load Balancer](https://aws.amazon.com/elasticloadbalancing/pricing/) · [Cognito](https://aws.amazon.com/cognito/pricing/) · [S3](https://aws.amazon.com/s3/pricing/) · [Bedrock](https://aws.amazon.com/bedrock/pricing/) · [NAT Gateway](https://aws.amazon.com/vpc/pricing/)
- [Google Cloud Run](https://cloud.google.com/run/pricing) · [Azure Container Apps](https://azure.microsoft.com/pricing/details/container-apps/)

Programas de crédito para startup:

- [AWS Activate](https://aws.amazon.com/activate/) · [Google for Startups Cloud Program](https://cloud.google.com/startup) · [Microsoft for Startups](https://www.microsoft.com/startups)

Outros:

- [AWS IoT Core](https://aws.amazon.com/iot-core/) — o caminho de IoT citado na comparação; o serviço equivalente do Google Cloud foi [descontinuado em 2023](https://cloud.google.com/iot-core)
- [Cotações PTAX — Banco Central](https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes) — câmbio de referência
