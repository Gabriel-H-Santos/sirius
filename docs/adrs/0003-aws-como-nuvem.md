# ADR-0003: AWS como nuvem, na região norte-americana

- **Status:** Aceita
- **Data:** 2026-08-15
- **Fase:** fundação (a implantação acontece junto com a primeira infraestrutura)

## Contexto

A infraestrutura do projeto é pequena e estável na forma: borda, API em contêiner e
banco relacional, com serviços pagos por uso entrando nas fases seguintes. O
[Spike-0001](../spikes/0001-custos-de-cloud-por-fase.md) levantou os custos por
fase nas três nuvens principais e mostrou que a diferença de preço entre elas, nas
fases iniciais, é de dezenas de dólares por mês — pequena demais para decidir
sozinha.

O que decide são os fatores que não aparecem na tabela de preço: o caminho para o
monitoramento por coleira na fase 3, a disponibilidade dos serviços que as fases
seguintes vão usar, a facilidade de contratar gente depois, e os programas de
crédito para startup.

## Decisão

**AWS, na região norte-americana (us-east-1).**

Por que AWS:

- **O caminho de IoT existe e é maduro.** A fase 3 conecta uma frota de coleiras; o
  AWS IoT Core é um serviço ativo e consolidado, enquanto o equivalente do Google
  Cloud foi descontinuado em 2023.
- **Contratação.** O mercado brasileiro de profissionais AWS é o maior entre as
  três — reduz o custo de crescer o time.
- **Crédito de startup.** Com um programa de crédito ativo, a vantagem de preço de
  qualquer concorrente desaparece justamente no período em que ela seria relevante.

Por que a região norte-americana:

- **Preço:** os mesmos serviços custam na faixa de 30 a 40% menos que na região de
  São Paulo [estimativa sobre os itens do spike]. O crédito de startup rende
  proporcionalmente mais.
- **Disponibilidade de serviço:** recursos novos chegam primeiro em us-east-1 —
  incluindo o catálogo de modelos do Bedrock que a fase 2 (assistente) pretende
  usar e que na região de São Paulo é limitado. Ficar na região americana evita uma
  arquitetura cross-region já na segunda fase.

## Alternativas consideradas

### AWS na região de São Paulo (sa-east-1)

A opção de menor latência (~10 a 20 ms contra ~110 a 140 ms de ida e volta a partir
do Brasil [estimativa]) e a que simplifica a conversa de residência de dados. Não
levou por dois motivos: o custo 30 a 40% maior em todos os itens, e o catálogo de
serviços mais restrito — a fase 2 provavelmente exigiria chamadas cross-region para
os modelos de IA de qualquer forma. A latência adicional é aceitável para o perfil
das primeiras fases (CRUD e consultas; nada de tempo real fino), e o gatilho de
revisão abaixo cobre o caso de isso mudar.

### Google Cloud

Mais barato na fase 1 (Cloud Run escala a zero), mas o caminho de IoT foi
descontinuado — a fase 3 exigiria integração própria ou um segundo provedor — e a
diferença de preço desaparece sob crédito de startup.

### Azure

Competitivo e com IoT Hub maduro. Faz mais sentido quando a empresa já tem contrato
ou crédito Microsoft, o que não é o caso.

### Postergar a escolha (desenho agnóstico de nuvem)

Tentador em teoria: contêiner e Postgres rodam em qualquer lugar. Na prática,
adiar a escolha significa não usar bem os serviços gerenciados de nenhum provedor.
A portabilidade que importa fica garantida de outro jeito: as peças centrais são
padrão de mercado em qualquer nuvem.

## Consequências

**Ganhamos:** a menor fatura entre as regiões AWS, crédito rendendo mais, e acesso
imediato ao catálogo completo de serviços — em especial os modelos de IA da fase 2.

**Pagamos:** ~100 a 130 ms a mais em cada requisição do app a partir do Brasil
[estimativa], e a obrigação formal da transferência internacional de dados — o
art. 33 da LGPD pede um mecanismo válido (as cláusulas contratuais padrão da ANPD)
documentado na política de privacidade antes do primeiro cadastro real.

**Fica mais difícil:** voltar. Migrar região depois de acumular dados é um projeto
de migração, não uma mudança de configuração — esta decisão fica mais cara de
reverter a cada mês de operação.

## Gatilho de revisão

- Latência percebida virando reclamação ou métrica ruim: p95 do tempo de resposta
  do app acima do aceitável por causa do trecho de rede, medido, por duas janelas
  de quatro semanas.
- Primeiro contrato B2B (clínica ou parceiro) exigindo dado em território nacional.
- A fase 3 definir um orçamento de latência para o caminho do alerta que o trecho
  Brasil–EUA comprometa.
- Crédito de startup relevante concedido em outra nuvem antes da implantação.
