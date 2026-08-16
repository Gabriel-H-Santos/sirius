# Glossário

Os termos que aparecem neste repositório, explicados em linguagem simples —
para quem não é da área de tecnologia acompanhar o que está sendo construído e
por quê. Termo novo que entrar nos documentos ganha entrada aqui no mesmo PR.

## O produto

- **Tutor** — a pessoa responsável pelo pet. É quem cria a conta e usa o
  aplicativo.
- **Pet** — o animal cadastrado na plataforma, com sua ficha.
- **Ficha do pet** — o prontuário: espécie, raça, sexo, nascimento, medidas e,
  adiante, vacinas e condições de saúde.
- **Titularidade** — o vínculo entre tutor e pet. Um pet pode ter mais de um
  tutor (um casal, uma família) — por isso o sistema já nasce preparado para
  isso.
- **Coleira inteligente** — o dispositivo que, na fase 3, vai ler sinais do pet
  (batimentos, temperatura, localização) e enviá-los à plataforma.
- **Telemetria** — o fluxo contínuo dessas leituras chegando ao sistema.
- **Alerta** — o aviso ao tutor quando as leituras saem do esperado.
- **Assistente** — o recurso da fase 2 que responde dúvidas de cuidado usando
  inteligência artificial.
- **Fases de entrega** — a ordem combinada de construção: 1) cadastros,
  2) conteúdo e assistente, 3) coleira, 4) monetização. Cada fase só começa
  quando a anterior se sustenta ([desenho](diagrams/0005-fases-de-entrega.md)).

## Como o trabalho é registrado

- **ADR** (registro de decisão de arquitetura) — um documento curto por decisão
  importante: o que foi decidido, o que foi descartado e por quê, e qual sinal
  faria a decisão ser revista. É a memória do projeto.
- **Spike** — uma investigação com prazo: uma pergunta, o que foi apurado (com
  fontes) e uma recomendação. Sustenta as ADRs.
- **Guia** — a prática consolidada: como o código deve ser escrito aqui.
- **Spec** (especificação) — antes de qualquer funcionalidade virar código, um
  documento diz o que ela deve fazer e como saberemos que está pronta; um plano
  lista os passos. O código executa o plano.
- **Diagrama** — o desenho de um fluxo ou do sistema, com um código de cores
  fixo (azul: existe; âmbar: serviço de terceiro; verde: dados; cinza
  tracejado: decidido mas ainda não construído).
- **PR** (pull request) — um pacote de mudança proposto ao projeto. Cada PR é
  revisado e passa por verificações automáticas antes de entrar na versão
  oficial.
- **CI** (integração contínua) — o robô que, a cada PR, compila o projeto,
  roda os testes e recusa a mudança se algo quebrar.

## A tecnologia, em uma frase cada

- **Backend / API** — a parte do sistema que não se vê: recebe os pedidos do
  aplicativo (cadastrar um tutor, buscar uma ficha), aplica as regras e guarda
  os dados. Este repositório é o backend.
- **Endpoint** — um "balcão" específico da API: um endereço que atende um tipo
  de pedido (ex.: cadastrar tutor).
- **Monólito modular** — o sistema roda como um programa único (barato e
  simples de operar), mas organizado por dentro em módulos independentes — como
  um prédio único com apartamentos bem separados.
- **Módulo** — um pedaço do sistema com dono e assunto claros: `identity`
  (contas de tutor), `pet-registry` (pets e fichas), e assim por diante.
- **Banco de dados (PostgreSQL)** — onde os dados vivem de forma organizada e
  durável.
- **Migration** — uma mudança na estrutura do banco registrada como código,
  aplicada passo a passo e com caminho de volta. É o histórico de como o banco
  chegou à forma atual.
- **Teste automatizado** — código que verifica o comportamento do sistema
  sozinho, a cada mudança — a rede de proteção contra quebrar o que já
  funcionava.
- **Cobertura de testes** — a medida de quanto do código é exercitado pelos
  testes. Aqui ela é exigida onde as regras de negócio vivem.
- **Contêiner (Docker)** — um pacote com o sistema e tudo de que ele precisa
  para rodar igual em qualquer máquina — na do desenvolvedor e no servidor.
- **Deploy** — o ato de publicar uma versão do sistema para uso real.
- **Nuvem** — servidores alugados de um provedor (em vez de máquinas próprias),
  pagos pelo uso; é onde o sistema vai rodar em produção.
