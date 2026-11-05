# VALE RESCUE — PLANTÃO DE EMERGÊNCIA
## BÍBLIA MESTRE DO JOGO | VALE GAMES | Versão 1.0 | 05/11/2026

**Nome provisório:** VALE RESCUE — PLANTÃO DE EMERGÊNCIA. O título pode mudar sem alterar a arquitetura.  
**Categoria:** simulação de atendimento pré-hospitalar, gestão de emergência e carreira.  
**Plataforma inicial:** jogo web responsivo (Windows, macOS, Android e iOS por navegador); PWA instalável depois.  
**Distribuição inicial:** repositório GitHub público + GitHub Pages; salvamento local sem backend.  
**Idioma inicial:** português brasileiro.  
**Referências do solicitante:** duas capturas do jogo Reanimation Inc. O novo jogo deverá possuir estética, interface, código, sons, modelos e identidade próprios, sem reproduzir elementos protegidos da referência.

> **REGRA DE OURO AO CODEX:** entregar um jogo que funcione na Parte 1. Nenhum botão de ação pode ser apenas decorativo. Não confundir uma imagem de ambulância com um ambiente 3D, nem uma sequência aleatória de números com uma simulação fisiológica. Priorizar um ciclo de atendimento integral, polido e testável antes de aumentar o escopo.

> **AVISO MÉDICO:** esta é uma simulação de entretenimento/educação, não um dispositivo médico nem um protocolo de atendimento real. Os cenários, medicamentos, diagnósticos e desfechos serão validados por profissional de saúde habilitado antes de uma eventual alegação de fidelidade clínica. Não ensinar nem parametrizar dosagens reais sem validação. Não apresentar resultados de jogo como orientação médica.

---

# 01. VISÃO, PROMESSA E DIFERENCIAIS

O jogador é um integrante da equipe de uma ambulância em plantão urbano brasileiro ficcional. A Central de Regulação envia uma ocorrência; o jogador recebe informações incompletas, acessa anamnese e relatos, examina a vítima, escolhe intervenções dentro da competência de sua função, acompanha a evolução dos sinais vitais e define o destino com justificativa. O jogo avalia segurança, raciocínio, tempo e resultado clínico simulado.

**Pilares obrigatórios:**
1. **Imersão cinematográfica:** ambulância detalhada, maca central, equipamentos identificáveis, materiais críveis, paciente humano e sinais de ferimentos visíveis sem exageros gratuitos.
2. **Causa e consequência:** hipóteses, sinais clínicos e ações ligadas por um motor de simulação. Não usar barras de saúde arbitrárias como substituto dos sinais vitais.
3. **Raciocínio antes do clique:** relato, avaliação, achados, suspeita, conduta, reavaliação e destino.
4. **Decisão com responsabilidade:** medicamentos inadequados, choque inapropriado, alta precoce, demora, falhas de comunicação e omissões devem influenciar a pontuação e a evolução do caso.
5. **Carreira e variedade:** casos leves, moderados e críticos; ocorrências variáveis; qualificação da equipe; desbloqueios compatíveis com o nível profissional.
6. **Acessibilidade e eficiência:** interfaces legíveis no celular e no PC; modo de baixa qualidade gráfica; suporte a teclado, mouse e toque; sem exigir rapidez física repetitiva para quem não puder.

**Não prometer no lançamento:** formação ou certificação profissional, diagnóstico médico confiável para pessoas reais, cooperação online gratuita sem infraestrutura adicional, controle remoto real de equipamentos ou conformidade regulatória sem auditoria.

# 02. FLUXO COMPLETO DA PARTIDA

**HOME → PERFIL/CONTINUAR → CENTRAL DE CHAMADOS → FICHA DA OCORRÊNCIA → AMBULÂNCIA/ATENDIMENTO → RELATÓRIO FINAL → EXPERIÊNCIA/CARREIRA → PRÓXIMO CHAMADO.**

1. **Tela inicial:** Começar plantão, Continuar carreira, Modo Treino, Casos, Garagem, Configurações, Créditos e Aviso educacional.
2. **Central:** chamada com ID, bairro fictício, horário, tipo, prioridade preliminar, clima, tempo estimado e informações de testemunha. O jogador aceita e confirma composição da equipe/veículo. Na primeira versão, deslocamento é uma transição curta, não um simulador de direção.
3. **Chegada e contexto:** cena curta de abordagem com ambiente ilustrado; na Parte 1, o paciente já estará posicionado na maca. A primeira informação nunca revela o diagnóstico verdadeiro.
4. **Atendimento:** o relógio do caso corre; o jogador pode pausar em modo treino, consultar o relato, investigar, aplicar intervenções autorizadas, reavaliar e solicitar suporte/regulação.
5. **Destino:** clicar em **Casa/Alta** ou **Ambulância/Hospital**, podendo haver **Solicitar suporte avançado** ou **Transferir à equipe competente**. Toda escolha exige justificativa clínica simulada e registro. Algumas opções ficam bloqueadas por risco ou limite de função.
6. **Resultado:** mostrar causa provável revelada, achados importantes, decisões corretas/inadequadas, linha do tempo, evolução dos sinais vitais, XP, créditos de carreira e aprendizado. O jogo nunca afirmará que uma única escolha sempre equivale ao tratamento correto em qualquer situação real.
7. **Persistência:** salvar fim da ocorrência e os checkpoints, com botão 'Continuar' e histórico local.

## 02.1 Duração, dificuldade e ritmo

- **Treino:** tempo pausável, ajuda contextual, mensagens sobre achados; sem penalidade de carreira.
- **Carreira:** tempo contínuo, 1x por padrão, penalidade por omissões e condutas inadequadas, registro permanente de resultados.
- **Desafio:** menos pistas, distratores e casos com deterioração mais rápida, sem artificialidade absurda.
- **Velocidade:** Pausar, 1x, 2x e 3x (quando não comprometer a lógica); ações com duração clínica ou animações não podem ser puladas de forma incoerente. Em compressões, mostrar controle de cadência independente da aceleração geral.

# 03. DESIGN VISUAL E CÂMERA DA AMBULÂNCIA

**Composição principal em 16:9, 1920×1080 de referência:** vista interna da ambulância de trás para frente, câmera levemente acima da maca, paciente horizontal ocupando 50–65% da largura, equipamento médico em armários e suportes laterais, monitor cardíaco grande na região superior esquerda, desfibrilador e ventilação mecânica no lado superior direito, barra de indicadores no alto, comandos na borda inferior. A perspectiva deve permitir reconhecer rosto, tórax, braços, pernas, acesso vascular, ferimentos e equipamentos sem esconder paciente por menus.

**Nível de imagem desejado:** cinematográfico realista (materiais PBR, iluminação física indireta, texturas calibradas, oclusão e sombras moderadas), ambiente limpo porém usado, elementos brasileiros genéricos, cintos, gavetas, cilindro de oxigênio, maletas, luzes da ambulância e reflexos suaves. Evitar visual cartunesco e menus gigantes que encubram a vítima.

**Câmeras:** vista geral; foco cabeça/vias aéreas; foco tórax; foco abdome; foco membros; zoom do monitor; zoom do desfibrilador; interior ampliado quando o equipamento estiver sendo manipulado. Transições rápidas, sem perda de estado.

**Dispositivos móveis:** priorizar orientação paisagem, detectar telas estreitas e trocar para HUD compacta com abas inferiores roláveis, controles de toque grandes, possibilidade de ampliar ficha e monitor, safe areas, zoom de pinça opcional. Se em retrato, exibir alternativa reduzida ou aviso amigável para girar o dispositivo; não quebrar a interface.

**Modo sem 3D disponível:** fallback 2,5D com fundo premium original e paciente em camadas com regiões clicáveis e efeitos ancorados. Este modo deve manter 100% da lógica de atendimento e ser claramente chamado de 2,5D, não 3D. O código deve permitir substituir por modelos .glb sem reescrever o motor do jogo.

## 03.1 Guia de estilo do HUD

- Fundo do HUD grafite/preto translúcido; cores semânticas: turquesa para investigação, vermelho controlado para risco/ações, azul para medicações, verde para confirmação segura, âmbar para alerta, cinza para opções bloqueadas.
- Fontes limpas com acentos, textos em português e alto contraste; iconografia original ou livre com atribuições.
- O paciente e o monitor nunca desaparecem totalmente quando se abre uma aba: usar painel lateral e transparência moderada.
- Os alertas devem mostrar **causa + consequência**, por exemplo 'Procedimento indisponível: requer equipamento/competência' em vez de erro genérico.
- Exibir sinal sonoro do monitor e alarmes configuráveis; nunca deixar som contínuo sem opção de silenciar.

# 04. MAPA DE INTERFACE — CADA BOTÃO DEVE EXECUTAR UMA AÇÃO

| Local | Controle | Interação obrigatória | Feedback/estado |
|---|---|---|---|
| Inferior esquerdo | CASA / ALTA | Abre formulário de hipótese, justificativa e revisão de segurança; só encerra depois de confirmar | XP, possível penalidade e resumo; indisponível em casos incompatíveis |
| Inferior esquerdo | AMBULÂNCIA / TRANSPORTE | Escolher unidade receptora, prioridade, relatório e condições de transporte | Tempo, estabilidade, comunicação e desfecho |
| Inferior centro-esquerda | PACIENTE / PRONTUÁRIO | Abre chamada da central, relato, testemunha, idade, identificação fictícia, antecedentes e alergias quando conhecidos | Pistas reveladas gradualmente; 'não informado' quando desconhecido |
| Inferior centro | PESQUISA / INVESTIGAÇÃO (verde) | Avaliação de consciência, dor, palpação, ausculta simulada, temperatura, pressão, glicemia, SpO2 e inspeção da pele/ferimentos | Achados próprios do caso; consome tempo; ferramentas necessárias |
| Inferior centro-direita | AÇÕES (vermelho) | Lista contextual de posicionamento, vias aéreas, hemorragia, oxigenação, acesso vascular, imobilização e suporte | Animação curta, duração, possíveis efeitos e riscos |
| Inferior direita | MEDICAÇÃO (azul) | Catálogo pesquisável com categorias, indicações simuladas e restrições, sem posologia real não validada | Confirmação da ordem, verificação de alergias, registro e evolução |
| Centro-superior | COMPRESSÃO | Um toque = uma compressão registrada; modo segurar/metrônomo acessível opcional | Contador, cadência e qualidade modelada; não é mero botão de 'curar' |
| Superior direito | DESFIBRILAÇÃO → CARREGAR → CHOQUE | Detectar ritmo, colocar eletrodos, carregar, 'todos afastados', aplicar quando permitido | Ritmos chocáveis vs. não chocáveis; riscos e efeitos registrados |
| Superior direito | VENTILAÇÃO MECÂNICA | Verificar indicação, equipamento, conexão, iniciar/ajustar em nível autorizado | Animação torácica e parâmetros coerentes; alarmes se houver problema |
| Barra superior | DOR / CONSCIÊNCIA | Mostra escalas em linguagem compreensível; requer avaliação para revelar valor preciso | Dados atualizados por mudança real de estado |
| Barra superior | INFUSÃO | Inicialmente fluidos/soluções quando previstos. Hemocomponentes apenas em cenários especializados, com autorização e equipamento | Variação clínica, estoque, checagens e riscos; não é recurso universal de ambulância |
| Superior lateral | PAUSAR / 1x / 2x / 3x | Controle do tempo simulado | Timer coerente, sem pontuação artificial ao pausar em treino |
| Superior esquerda | MONITOR MULTIPARAMÉTRICO | ECG, FC, PA, SpO2, FR, temperatura e alarmes | Números, curvas e cores devem vir do mesmo estado fisiológico |
| Margem direita | DIÁRIO / RÁDIO / AJUDA | Histórico cronológico e troca com central/apoio | Informação contextual, nenhuma 'resposta certa' gratuita na carreira |

**Regra de consistência:** botões desabilitados devem explicar por quê. É proibido abrir painéis vazios ou mostrar mensagens falsas do tipo 'procedimento realizado' sem alterar o estado/diário.

# 05. PRONTUÁRIO, RELATOS E INVESTIGAÇÃO

## 05.1 Prontuário

Campos: ID do atendimento; idade aparente ou informada; sexo/gênero conforme roteiro sem inferência por rosto; nome fictício quando disponível; motivo do chamado; localização; mecanismo do evento; horário; fala da vítima; relato de testemunha; informação da central; histórico relevante; medicamentos de uso contínuo; alergias; riscos ambientais; última avaliação; hipóteses selecionadas; condutas; destino. Cada campo indica sua origem: central, familiar, paciente, testemunha, exame ou equipamento.

**Informação incompleta é parte do jogo:** não revelar tudo no início; alguns relatos serão vagos, errados ou contraditórios. O usuário precisa separar queixa, evidência observada e hipótese. Quando a vítima está inconsciente, não permitir depoimento impossível.

## 05.2 Menu Pesquisa

- **Observação inicial:** respiração visível, reação, posição, coloração, sinais de trauma, sangramento, vômitos e objetos associados à ocorrência.
- **Sinais vitais:** monitorização/medição e tendências ao longo do tempo, registrando horário e fonte; parâmetros não medidos aparecem como '—' ou 'não aferido'.
- **Exame dirigido:** crânio e pupilas, face, vias aéreas, tórax, abdome, pele, coluna, extremidades, avaliação neurológica simplificada.
- **Glicemia capilar:** instrumento e consumíveis no inventário; valor coerente com o caso.
- **Temperatura:** instrumento adequado; valor só aparece após medição.
- **Dor:** avaliação subjetiva quando comunicável, ou indeterminação explícita.
- **Ausculta:** sons sintetizados/gravados licenciados, relacionados ao estado simulado.
- **Testes adicionais:** apenas exames plausíveis no cenário pré-hospitalar e conforme equipamento/função; exames laboratoriais ou de imagem hospitalares não aparecem como disponíveis dentro de ambulância comum.

O motor de jogo registra avaliações que mudam a decisão, repetição desnecessária, exame não indicado, falta de equipamento e custo de tempo. Não penalizar avaliações razoáveis só porque o jogador não adivinhou a resposta oculta.

# 06. MOTOR CLÍNICO (A PARTE MAIS IMPORTANTE DO CÓDIGO)

Criar um domínio clínico **independente** de React/Three.js. O motor é o único dono do estado real do paciente; o monitor, animações, feridas, vozes e HUD são projeções desse estado. A interface envia comandos; o motor valida pré-condições, registra eventos, calcula efeitos e devolve um estado novo.

## 06.1 Estado mínimo

- **Identidade e cenário:** `caseId`, `patientId`, `age`, `bodyPreset`, `history`, `hiddenConditions`, `visibleSigns`, `seed`, `difficulty`, `elapsedSeconds`.
- **Parâmetros fisiológicos:** frequência cardíaca, ritmo ECG, pulso presente, PA sistólica/diastólica, saturação, frequência respiratória, temperatura, escala de consciência, dor (ou não aferível), perfusão, via aérea, volume circulante efetivo simplificado, glicose e nível de oxigenação/ventilação.
- **Metadados:** estado da monitorização (sensor ligado/solto), equipamentos, inventário, ações tentadas, ações concluídas, contraindicações, alergias relatadas, intervenção em curso, timers, transporte/autorização, `isAlive` e `outcome`.
- **Conhecimento do jogador:** sinais descobertos, relatos vistos, medidas efetuadas e hipóteses. **Não confundir conhecimento visível com variáveis ocultas**.

## 06.2 Evolução temporal

`tick(deltaSimulado)` calcula a mudança coerente de sinais vitais a partir das condições subjacentes, sangramento/ventilação/perfusão, intervenções vigentes, eventos próprios do caso e ruído instrumental controlado por semente. O ECG não pode simplesmente oscilar aleatoriamente sem relação com o pulso/ritmo. Se a frequência cardíaca mudar, a densidade de complexos na onda visual muda também. A curva de oximetria reflete pulso e perfusão; se sensor não estiver instalado, não exibir leitura válida. A PA é aferida em intervalos ou por instrumento apropriado, com timestamp e sem atualização mágica a cada frame.

**Arquitetura funcional:** `applyAction(state, action) -> {nextState, effects, log, feedback}`; `advanceTime(state, seconds) -> nextState`; `deriveVisibleState(state, observations) -> visibleState`; `evaluateOutcome(state, destination) -> scoreReport`. Todas as funções testáveis sem ambiente gráfico. Pseudorrandom com semente para reprodução de casos. Valores de cenário devem ser calibrados por revisor clínico, não inventados por IA sem validação.

## 06.3 Transições e condições

- Evolução de quadro leve pode permanecer estável; quadro grave tende a deteriorar se a causa não é abordada.
- Alguns tratamentos melhoram um parâmetro e não todos; efeitos podem levar tempo, e não devem garantir recuperação.
- Avaliação/investigação modifica informação conhecida, **não** cura paciente.
- Intervenção exige nível de competência, indicações, recursos e confirmação quando necessário.
- Tratamento inadequado pode não funcionar, ter risco ou ser recusado pela engine.
- Se for incompatível com o cenário, deve aparecer feedback clínico neutro e ser registrado.
- Deterioração extrema é representada sem sensacionalismo; o usuário pode continuar um protocolo adequado ou solicitar suporte, conforme a simulação.
- Transporte pode ocorrer com paciente ainda instável, se a decisão estiver justificada e o suporte for adequado; não exigir que todos os números voltem ao 'normal' para permitir hospital.

## 06.4 Monitor e áudio

ECG contínuo animado por função de ritmo; FC, PA, SpO2, FR, temperatura, capnografia opcional futura; histórico de tendências; indicação 'sem leitura' ou 'sensor desconectado'; alarmes visuais e sons coerentes com ritmo, limite e estado do sensor; silenciar alarme sem apagar evidência clínica. Não reproduzir numerais estáticos sobre uma imagem do monitor. Atualização visual suave, estado clínico atualizado em passos determinísticos (ex.: tempo interno de 250 ms e UI em 1 s), desacoplando renderização e simulação.

## 06.5 RCP / compressões

Um toque real gera **uma compressão registrada** com timestamp. Mostrar cadência, sequência, fadiga simplificada e qualidade a partir de regularidade e presença de técnica requerida na simulação. A compressão afeta perfusão de maneira limitada e contextual; não restaura automaticamente o ritmo. Oferecer `pressionar e segurar` como alternativa acessível com cadência guiada e possível assistente no modo treino. A qualidade, ritmos e ações de suporte devem seguir protocolos revisados, sem usar o jogo como orientação de prática real.

## 06.6 Desfibrilador

Passos de interface: identificar ritmo/situação; disponibilidade do dispositivo; colocar adesivos; carregar; confirmar afastamento; executar choque quando houver indicação segundo o modelo e diretrizes aprovadas. Rejeitar ou penalizar indicação inapropriada; não produzir 'cura' garantida; registrar pós-choque e requerer reavaliação. Não oferecer choque apenas porque o usuário clicou `Carregar`. O desfibrilador deve ter estado `desligado/pronto/eletrodos colocados/carregando/carregado/descarga/recarga`.

## 06.7 Ventilação, vias aéreas e oxigênio

Menu contextual com abertura de vias aéreas, aspiração, dispositivos simulados, suporte ventilatório e oxigenação conforme competência e inventário. Ventilação mecânica apenas quando permitida pelo caso, equipamento e equipe; conexão e parâmetros do jogo tratados de forma abstrata e revisada, com animação de tórax, alarmes e resposta ao monitor. Não transformar 'Começar ventilação' em botão sempre habilitado.

## 06.8 Infusão e transfusão

O botão superior pode ser rotulado **INFUSÃO**, exibindo acesso vascular, fluidos e itens disponíveis. Hemocomponentes e transfusão de sangue devem ser **recurso avançado**, desbloqueado somente em cenários/equipes habilitados e com checagens fictícias de compatibilidade, disponibilidade e autorização. Não tratar transfusão como parte do equipamento padrão de qualquer ambulância. Sem posologia nem velocidade de infusão real no conteúdo inicial.

# 07. AÇÕES, MEDICAMENTOS E SEGURANÇA

**Ações possíveis por categoria:** avaliação primária; controle externo de hemorragia; curativo/pressão/torniquete em indicação revisada; imobilização; manipulação de vias aéreas; aspiração; oxigenação; suporte ventilatório; monitorização; acesso vascular; fluidos; aferição; posicionamento e temperatura; comunicação com central; chamada de reforço; transporte. O procedimento deve indicar (a) requisito de equipe, (b) material, (c) tempo, (d) feedback e (e) consequência simulada.

**Menu de medicações:** cards com nome genérico, categoria, finalidade resumida em contexto de jogo, itens de inventário, contraindicações/alertas e competência requerida. Exemplos para futura revisão: glicose, adrenalina, naloxona, salbutamol, antiemético, analgésico e soluções de hidratação. Esta lista é um **backlog**, não autorização clínica, nem conjunto de medicamentos para um caso real. Nunca fornecer dosagens/posologia reais não auditadas. Incluir confirmação de alergias e ordem dentro do modelo; sinais de decisão incorreta devem ter feedback educativo.

**Regras de segurança:**
- Avaliar o quadro antes de permitir medidas de maior risco; opção de solicitar orientação da regulação quando o papel do jogador não autoriza.
- O simulador nunca recompensa choque indiscriminado, medicação aleatória ou transporte inadequado.
- Ninguém tem certeza absoluta sobre prognóstico apenas por clicar em diagnóstico.
- Ao encerrar caso, a explicação pedagógica distingue achado, hipótese, ação e resultado.
- Material de treinamento será comparado com os protocolos oficiais vigentes pelo consultor clínico.

# 08. PACIENTES, DIVERSIDADE E FERIMENTOS CINEMATOGRÁFICOS

## 08.1 Biblioteca de personagens

**Meta de expansão:** quatro conjuntos variados de fenótipo/tons de pele como parâmetros de direção de arte (sem equiparar aparência a etnia); para cada conjunto, **dois modelos visuais masculinos e dois femininos**, totalizando **16 identidades base**. Incluir idades, estaturas, biotipos, cabelo, roupas, cicatrizes e características faciais variáveis. A identidade étnico-racial de cada personagem pode constar apenas se o roteiro a declarar; o sistema não deve inferi-la pela aparência. O mesmo quadro médico pode ocorrer em qualquer aparência; proibir associação automática entre grupo racial e doença.

**Parte 1:** entregar pelo menos **dois personagens adultos distintos** que possam aparecer na maca (um masculino e um feminino, idealmente com diferentes tons de pele), ambos com resposta facial/torácica básica e superfícies que aceitem ferimentos. Não adiar o jogo inteiro até produzir a biblioteca completa de 16.

**Modelagem:** a rota ideal utiliza glTF/.glb com malha otimizada, pele e olhos realistas, rig/ossos, blendshapes de respiração/expressão, LOD, mapeamento UV, texturas e pontos anatômicos de ancoragem. Uma PNG bonita **não é** um modelo 3D riggado; usá-la somente para fundo, textura ou fallback 2,5D.

## 08.2 Ferimentos e sinais sobre o próprio corpo

- Usar sistema por camada: manchas, contusões, escoriações, cortes, edema, palidez, suor, sangue, curativos e acessórios.
- Renderizar decals/overlays ancorados a regiões anatômicas (`forehead`, `chest_left`, `forearm_right`, `abdomen`, `leg_left`), com intensidade 0–1.
- Mesmo personagem pode ser reutilizado em dezenas de casos; ferimentos configurados no JSON do cenário, em vez de exigir um modelo completo por lesão.
- Ferimento tratado pode mudar de aparência; sangramento persistente pode continuar se medida for insuficiente; curativo e bandagem devem ser visíveis.
- Animar respiração, piscar, olhar, dor, tremor e postura quando compatível. Movimentos sutis, nunca grotescos.
- Ajustar nível de sangue e ferimentos nas configurações (`reduzido`, `padrão`, `realista`) e opção de ocultar imagens mais fortes.

## 08.3 Política de assets e originalidade

Produzir **assets autorais**. Não copiar layouts, texturas, modelos, sprites, logotipos, sons nem ícones de Reanimation Inc. ou de marcas médicas reais sem permissão. Os dois prints são **referência de função e enquadramento**. Registrar licença/autor por asset. Para mockups gerados por IA, revisar consistência anatômica, posição dos equipamentos e legibilidade; nunca alegar que um raster é uma malha 3D. Não usar fotos de pacientes reais sem consentimento/adequação legal.

# 09. TIPOS DE OCORRÊNCIA E MISSÕES

A equipe de roteiro deve preparar casos adultos com diversidade de locais, informações, gravidade e evolução. Cada caso deve apresentar relato inicial, fonte das informações, valores de base, achados reveláveis, condições ocultas, intervenções disponíveis, condições de transferência/alta, alterações temporais, múltiplos caminhos plausíveis e regra de pontuação auditável.

| ID | Nome de missão | Informações iniciais (sem spoiler) | Mecânica principal | Dificuldade sugerida |
|---|---|---|---|---|
| CASE-001 | Mal-estar no terminal | Adulto com fraqueza e sudorese, testemunha preocupada | História, glicemia, reavaliação | Tutorial |
| CASE-002 | Queda em casa | Idoso após queda, queixa dolorosa, sem detalhes claros | Investigação de trauma, risco e destino | Inicial |
| CASE-003 | Falta de ar à noite | Paciente com desconforto respiratório progressivo | Respiração, SpO2, ausculta e suporte | Inicial/intermediário |
| CASE-004 | Corte na oficina | Adulto com ferimento e sangramento visível | Controle de sangramento, perfusão e transporte | Inicial |
| CASE-005 | Dor torácica no trabalho | Sintomas incompletos, colegas fornecem informações | Monitorização, histórico, prioridade e regulação | Intermediário |
| CASE-006 | Inconsciência em praça | Pessoa encontrada caída, sem testemunha confiável | Consciência, vias aéreas e causa desconhecida | Intermediário |
| CASE-007 | Acidente de motocicleta | Trauma com múltiplas queixas e sinais visuais | Exame por regiões, prioridades e destino | Intermediário |
| CASE-008 | Convulsão em residência | Família descreve episódio, duração incerta | Observação, história, segurança e reavaliação | Intermediário |
| CASE-009 | Reação aguda em restaurante | Sinais que evoluem e história incompleta | Identificação de deterioração, apoio e transporte | Avançado |
| CASE-010 | Suspeita de intoxicação | Materiais no ambiente e relato contraditório | Segurança, investigação e decisão cuidadosa | Avançado |
| CASE-011 | Parada cardiorrespiratória | Paciente sem resposta com sinais críticos | RCP, ritmo, desfibrilação se indicada, equipe | Avançado |
| CASE-012 | Múltiplas vítimas | Ocorrência com prioridades competitivas | Triagem, comunicação, alocação de recursos | Expansão |

**Casos jogáveis obrigatórios na PARTE 1:** CASE-001 (estável com investigação e desfecho), CASE-003 (respiratório com evolução), CASE-004 (trauma com ferida visual e sangramento) e CASE-011 (crítico com RCP e desfibrilador contextual). A complexidade clínica exata será ajustada após validação; se a revisão de CASE-011 não estiver disponível, usar um **caso crítico de treino explicitamente fictício** sem afirmar fidelidade técnica.

## 09.1 Gerador de variações

Cada missão tem roteiro-base fixo e parâmetros com aleatoriedade controlada: nome, aparência, idade em faixa apropriada, horário, locais fictícios, intensidade inicial, achados de testemunha e evolução temporal. O gerador **não muda arbitrariamente a condição oculta só para surpreender**. Cada caso recebe `seed` armazenada, garantindo que recarregar ou reproduzir o mesmo atendimento repita os eventos relevantes. O jogador nunca deve deduzir um diagnóstico apenas da etnia, sexo ou aparência do avatar.

## 09.2 Rejogabilidade e progressão

Carreira com níveis: Observador → Socorrista em Treinamento → Integrante de Equipe de Suporte Básico → Especialista Simulado → Unidade Avançada Simulada → Supervisor de Plantão. Esses títulos são **progressão de jogo**, não credenciais legais. Desbloqueios condicionados a treinamento, aprovação de módulos e função simulada, e não simplesmente a gastar XP. Missões mais complexas com eventos concorrentes, múltiplas fontes e solicitações de reforço.

# 10. SISTEMA DE DIAGNÓSTICO, ALTA E TRANSPORTE

## 10.1 Botão CASA / ALTA

O jogador escolhe **hipótese de atendimento** a partir de opções plausíveis (sem exigir um diagnóstico definitivo impossível no atendimento pré-hospitalar), indica principais achados e justifica por que não existe critério simulado para transporte. O sistema mostra as informações conhecidas e solicita confirmação. Em situações que exijam avaliação hospitalar, regulação, recusa documentada ou suporte avançado, não permitir 'dispensar' de forma leviana. Ao finalizar, avaliar raciocínio e segurança da decisão; o caso pode ser reaberto no histórico para estudo.

**Exemplo de tela:** 'Qual a principal hipótese?', 'Quais achados sustentam sua decisão?', 'Quais sinais de alarme foram excluídos?', 'A regulação autorizou este desfecho?', 'Confirmar alta/encaminhamento?' — as opções derivam do roteiro e da função do jogador.

## 10.2 Botão AMBULÂNCIA / HOSPITAL

O jogador escolhe prioridade de remoção, tipo de unidade receptora e relato de transferência (motivo, achados, intervenções, evolução, alergias conhecidas, riscos em curso). Durante transporte, o tempo avança, os sinais vitais continuam evoluindo e podem surgir eventos; há opção de reavaliação, comunicação com a central e apoio. O encerramento mostra relatório de passagem de caso e avaliação da decisão; **não** exigir diagnóstico definitivo para transportar.

## 10.3 Encerramentos possíveis

- Alta/encaminhamento sem remoção adequadamente documentado em caso compatível.
- Transporte apropriado com quadro estabilizado, estável ou ainda grave.
- Transferência para equipe de competência superior.
- Agravamento por atraso/decisão inadequada (com explicação educativa).
- Desfecho crítico desfavorável possível e respeitoso, sem punições humilhantes.

# 11. PONTUAÇÃO, RANKING E ECONOMIA DE CARREIRA

**Pontuação máxima por ocorrência = 1000 pontos**, divididos por dimensões e auditável em relatório:

| Dimensão | Teto | Exemplos observáveis |
|---|---:|---|
| Avaliação e investigação | 200 | Reconhecer sinais de alarme, coletar dados relevantes, identificar informação contraditória |
| Segurança e competência | 200 | Ações dentro da função, checagens, alergias, não realizar procedimento inadequado |
| Decisão e priorização | 250 | Selecionar intervenções coerentes, pedir reforço quando necessário, administrar tempo |
| Reavaliação e monitorização | 150 | Repetir medidas quando quadro muda, observar tendência, reconhecer deterioração |
| Destino e documentação | 150 | Alta/transporte justificado, relatório de passagem e comunicação |
| Eficiência e trabalho em equipe | 50 | Custo de tempo, uso responsável de materiais, comunicação eficiente |

**Fórmula:** `scoreFinal = clamp(somaDimensoes - penalidadesSeguranca, 0, 1000)`. Os objetivos possuem pesos específicos por cenário; não dar pontos por intervenções desnecessárias. Penalidades graves superam bônus cosméticos. **Sem penalizar automaticamente decisão clinicamente plausível** quando o caso tem incerteza; admitir múltiplos caminhos aceitos por revisão clínica.

- **XP** para nível de carreira, medalhas por qualidade de raciocínio e estabilidade ao longo de vários casos.
- **Reputação** por segurança e documentação; descartar ideia de 'mais procedimentos = mais pontos'.
- **Créditos de jogo** apenas para personalização e infraestrutura ficcional, jamais para 'comprar' competência médica real.
- **Ranking local** por total, média de 10 casos, missão e taxa de segurança, persistido em IndexedDB. Permitir múltiplos perfis locais, exportar/importar save e reiniciar carreira.
- **Ranking online futuro** exige backend, autenticação e verificação antifraude; GitHub Pages isoladamente não fornece isso.

# 12. DIREÇÃO DE SOM, ANIMAÇÃO E FEEDBACK

**Sons:** batimento do monitor condicionado ao pulso, alarmes graduais, ventilação, cliques do desfibrilador, rádio da central, tráfego ao fundo, porta da ambulância, chuva leve em missões específicas, comandos de equipe, vocalizações sutis de dor/respiração quando previstas. Volume separado por efeitos, voz, monitor e música. Nenhum som precisa ser usado para transmitir informação exclusiva: fornecer equivalentes visuais.

**Animações:** respiração torácica ligada à frequência e condição, olho/piscar/olhar, expressão facial, sinal de dor, pequeno movimento da maca, compressão do tórax somente quando há ação, curativo/aplicação de equipamento, luz do desfibrilador, movimentação de formas de onda. Toda ação possui feedback de início, duração, conclusão, risco e possível bloqueio. Não usar animações que distorçam anatomia.

**Narrativa:** rádio objetivo; mensagens de testemunhas curtas; opção de texto sem dublagem; detalhes ficcionais localizados ao Brasil. Evitar nomes e marcas reais de hospitais/SAMU como identificação oficial do jogo.

# 13. TECNOLOGIA, HOSPEDAGEM E ARQUITETURA

## 13.1 Stack recomendada (sem mensalidade obrigatória na Parte 1)

- **Front-end:** Vite + React + TypeScript.
- **Estado de interface:** Zustand ou equivalente simples; **separado** do estado clínico determinístico.
- **Render 3D:** Three.js + React Three Fiber + Drei com modelos glTF/GLB quando disponíveis.
- **Fallback 2,5D:** canvas/SVG/React sobre fundo original, com posicionamento responsivo dos hotspots do paciente.
- **UI:** CSS moderno/Tailwind e componentes acessíveis; gráficos do monitor em Canvas/SVG customizado; não usar bibliotecas pesadas se reduzirem FPS.
- **Dados:** JSON versionado de cenários, medicamentos, intervenções, roteiros e resultados, validados com Zod ou esquema equivalente.
- **Salvamento:** IndexedDB (preferencialmente Dexie) para perfis, progresso, histórico, seeds e preferências; `localStorage` apenas para ajustes leves.
- **Testes:** Vitest (motor e regras), React Testing Library (controles), Playwright (fluxos ponta a ponta).
- **Deploy:** GitHub Actions -> GitHub Pages usando `base` do Vite relativo ao nome do repositório; SPA com roteamento de hash ou solução de fallback documentada.
- **PWA e offline:** service worker apenas após estabilizar cache e versionamento; lógica local continua funcionando sem rede, exceto recursos futuros explicitamente online.

**Limite explícito:** GitHub Pages publica arquivos estáticos, não executa PHP/Python/servidor de partidas. Portanto, não prometer multiplayer e ranking global real enquanto não houver serviço separado. React Three Fiber renderiza cenas Three.js no React, mas a qualidade fotorrealista depende de **assets** criados e otimizados; a biblioteca não gera automaticamente pacientes cinematográficos.

## 13.2 Separação de domínios

```text
UI React ──────────► comandos de jogo
     │                    │
     ▼                    ▼
Render 3D/2,5D      CommandValidator
Monitor/Audio             │
     ▲                    ▼
     └── VisibleState ◄ ClinicalEngine (tick, apply, events)
                              │
                         CaseCatalog JSON
                              │
                         ScoringEngine
                              │
                       Persistence/Replay
```

**Não fazer:** lógica clínica escondida em handlers de botão, atualização aleatória de sinais em componente React, `setInterval` independente para cada parâmetro, valores médicos hardcoded na arte, duplicação de prontuário e cenário ou dependência de internet para caso básico.

## 13.3 Tipos de dados de referência

```ts
type Rhythm = 'sinus' | 'tachycardia' | 'bradycardia' | 'vf' | 'pulseless_vt' | 'pea' | 'asystole' | 'other';
type Destination = 'discharge' | 'hospital' | 'advanced_team';
type BodyRegion = 'head' | 'face' | 'chest' | 'abdomen' | 'arm_left' | 'arm_right' | 'leg_left' | 'leg_right';

type VitalState = {
  heartRate: number | null;
  systolicBP: number | null;
  diastolicBP: number | null;
  spo2: number | null;
  respiratoryRate: number | null;
  temperatureC: number | null;
  glucoseMgDl: number | null;
  rhythm: Rhythm;
  pulsePresent: boolean;
  consciousness: 'alert' | 'voice' | 'pain' | 'unresponsive';
  painScore: number | null;
};

type PatientState = {
  id: string; caseId: string; seed: number; elapsedSeconds: number;
  hiddenConditions: string[]; vitals: VitalState;
  observationsKnown: string[]; findings: Record<string,string>;
  wounds: Array<{ region: BodyRegion; kind: string; severity: number; treated: boolean }>;
  equipment: Record<string,boolean>;
  medicationsGiven: string[]; interventionsDone: string[];
  actionLog: Array<{ at: number; code: string; outcome: string }>;
  status: 'active' | 'transporting' | 'completed';
};

type CaseDefinition = {
  id: string; title: string; category: string; priority: string;
  dispatch: { message: string; witness?: string; scene?: string };
  patientPreset: string; baseline: Partial<VitalState>;
  hiddenConditions: string[]; investigations: string[];
  availableActions: string[]; timelineEvents: unknown[];
  safeDestinations: Destination[]; scoringRubric: Record<string,number>;
};

type GameAction =
  | { type: 'INVESTIGATE'; testId: string }
  | { type: 'INTERVENE'; interventionId: string }
  | { type: 'MEDICATE'; medicationId: string }
  | { type: 'COMPRESS'; at: number }
  | { type: 'DEFIBRILLATOR'; step: 'pads'|'charge'|'clear'|'shock' }
  | { type: 'VENTILATION'; step: 'connect'|'start'|'stop' }
  | { type: 'SET_SPEED'; value: 0|1|2|3 }
  | { type: 'FINISH_CASE'; destination: Destination; hypothesis: string; rationale: string };
```

**Cada `CaseDefinition` deve passar por validação de schema** com defaults sensatos e testes. A função de motor recebe um comando, consulta políticas de competência e o cenário, avança o tempo de maneira determinística e produz eventos. Os rótulos clínicos e faixas numéricas específicos só entram após revisão do material técnico.

## 13.4 Estrutura recomendada de repositório

```text
vale-rescue-ambulancia/
├── README.md
├── LICENSE
├── package.json
├── vite.config.ts
├── index.html
├── .github/workflows/deploy.yml
├── docs/
│   ├── BIBLIA_MESTRE.md
│   ├── PROMPT_CODEX_PARTE_01.md
│   ├── ROADMAP.md
│   ├── PROTOCOLOS_E_REVISOES.md
│   ├── ASSET_MANIFEST.md
│   ├── GAME_RULES.md
│   └── TEST_PLAN.md
├── public/assets/
│   ├── backgrounds/
│   ├── models/
│   ├── patient-overlays/
│   ├── equipment/
│   ├── audio/
│   └── icons/
├── src/
│   ├── app/ (navegação, rotas, stores)
│   ├── components/hud/
│   ├── components/patient/
│   ├── components/monitor/
│   ├── components/ambulance/
│   ├── components/modals/
│   ├── engine/ (clinical, command, clock, rng, scoring)
│   ├── content/cases/
│   ├── content/catalogs/
│   ├── services/persistence/
│   ├── types/
│   ├── styles/
│   └── tests/
└── e2e/
```

## 13.5 Performance e integridade

- Alvo de desenvolvimento: 60 FPS em desktop intermediário, mínimo aceitável de 30 FPS em celular compatível; reduzir sombras, reflexos, resolução e qualidade em dispositivos fracos.
- Use modelos LOD, texturas comprimidas quando possível, carregamento progressivo e ocultação de elementos fora da vista.
- Evitar assets que violem licença; criar manifesto com autor, licença, dimensão, formato e hashes na entrega.
- A execução do motor de casos não depende da taxa de quadros nem do monitor; testes automatizados validam reprodutibilidade com seed.
- Salves devem ter `schemaVersion` e migrações; não perder progresso ao atualizar o site.
- Nada de API keys ou senhas no front-end público; não registrar dados médicos reais de usuários.

# 14. TELAS COMPLEMENTARES

**Home premium:** enquadramento original de paciente e equipe no interior de ambulância, luzes azul/vermelha refletidas, logomarca própria VALE GAMES, título provisório, botões Começar Plantão, Continuar, Carreira, Treinamento, Configurações. Layout horizontal, com versão mobile; evitar imagem fixa inacessível.

**Central de Regulação:** lista de chamados (prioridade, setor, relato resumido), relógio de plantão, equipe e veículo, mapa estilizado ficcional, botão Atender e histórico.

**Carreira:** avatar profissional, patente/nivel, XP, reputação, avaliação média, histórico de casos, fichas de estudo, desbloqueios de funções, ambulâncias disponíveis, personalização cosmética.

**Garagem:** inicialmente uma ambulância padrão operável. Futuramente: suporte básico, avançado, unidade de resposta rápida e variantes de interiores; toda variante precisa ter inventário/competência plausíveis.

**Relatório:** exportação/impressão opcional em versão futura com fatos simulados, linha do tempo, ações, resultados, rubrica e justificativas (sem dados pessoais reais).

**Treinamento:** tutoriais contextuais curtos; opção de repetir missão sem penalidade; glossário de nomes de equipamentos e disclaimer médico.

# 15. PLANO DE IMAGENS, ASSETS E MODELOS

## 15.1 Pacote inicial — produzir individualmente

| Ordem | Asset | Formato/uso | Direção visual |
|---|---|---|---|
| VIS-01 | Capa da Home | PNG/WebP 16:9, conceito 1920×1080 ou superior | Ambulância realista; paciente e equipamento; texto será renderizado pelo jogo |
| VIS-02 | Interior da ambulância **sem HUD** | PNG/WebP 16:9 de fallback; também referência de modelagem | Vista frontal/lateral da maca, iluminação realista, espaço para paciente |
| VIS-03 | Painel/monitor | Asset gráfico sem números sobrepostos | Carcaça premium; a tela/cifras/curvas são desenhadas dinamicamente |
| VIS-04 | Paciente adulto masculino neutro | PNG em camadas para 2,5D ou referência para GLB | Pose supina, cabeça, braços e pernas visíveis, anatomia coerente |
| VIS-05 | Paciente adulto feminino neutro | Igual, com identidade visual distinta | Corpo com roupas hospitalares adequadas; câmera e iluminação compatíveis |
| VIS-06 | Ferimentos/cortes e sangue | PNGs alpha + atlas ou decals | Variantes por região/gravidade, sem fazer outro corpo inteiro |
| VIS-07 | Curativos e materiais | PNG/GLB por item | Itens de ambulância realistas, integração ao corpo |
| VIS-08 | Desfibrilador e eletrodos | GLB ou sprites do painel | Equipamento genérico sem marca, estados de uso |
| VIS-09 | Ventilador, bolsa de ventilação e oxigênio | GLB ou sprites | Equipamento em posição crível, conexão visual |
| VIS-10 | Central de atendimento | BG 16:9 | Sala de regulação original, estética profissional |
| VIS-11 | Garagem/seleção de viatura | BG 16:9 | Ambiência de base de ambulâncias, sem marcas oficiais |
| VIS-12 | Ícones originais | SVG | Casa, transporte, paciente, pesquisa, ações, medicações, choque, ventilação, pausa |

**Importante:** todos os assets serão gerados/adquiridos com direitos adequados e exportados individualmente. Uma cena com paciente embutido **não permite** troca convincente de rosto, movimentação, ferimento e curativos; precisa de camadas separadas ou de geometria 3D própria.

## 15.2 Pipeline 3D futuro

1. Criar/obter malhas originais de ambulância, equipamento e personagens com licença compatível.
2. Aplicar PBR, UV, texturas e rig; posicionar pontos de ancoragem para ferimentos/medicações.
3. Exportar `.glb`, otimizar malha e textura, gerar LOD e testar memória em Android.
4. Gerar catálogo de personagens por ID com combinações de pele, cabeça, cabelo, idade visual e biotipo.
5. Trocar o renderer 2,5D por 3D preservando `PatientState`, `VisibleState`, coordenadas anatômicas e eventos.

# 16. ROADMAP OBRIGATÓRIO EM LOTES

## LOTE 0 — Preparação do repositório

Criar projeto Vite/React/TS, estrutura acima, documentação, scripts, lint/tests, CI e GitHub Pages, GitHub Actions e tema visual inicial. Configurar HTML de orientação, fonts, responsividade, dados fictícios, sem backend. **Aceite:** site publicado, navegação Home/Chamados/Atendimento/Resultado, projeto compila e testes rodam.

## LOTE 1 — VERTICAL SLICE JOGÁVEL [ENTREGA MAIS IMPORTANTE]

Implementar, de ponta a ponta:
1. Home funcional com Começar/Continuar, 1 perfil, modo treino/carreira e escolha entre **4 ocorrências**.
2. Tela de ambulância responsiva, visual premium com paciente visível e HUD consistente com a referência **mas original**.
3. Monitor simulado real alimentado por motor; ao menos ECG, FC, SpO2, PA e FR, com variações coerentes por missão e intervenção.
4. Botão prontuário: relato da central, testemunha/paciente quando cabível, idade e histórico do caso.
5. Pesquisa: pelo menos observação, consciência, aferição de pressão, temperatura, SpO2, glicemia e investigação por 3 regiões; exames dependem de equipamento e tempo.
6. Ações: pelo menos 6 intervenções contextualizadas, com validação, duração e efeito/feedback observável; incluir controle de hemorragia e uma ação respiratória.
7. Medicações: **catálogo visível com no mínimo 6 itens ilustrativos**; somente os itens liberados em cada caso podem ser aplicados; sem doses. Confirmar antes da aplicação. Efeitos/limites vinculados ao motor.
8. RCP: clique conta compressão, feedback de cadência e evolução condicionada. Desfibrilador: ligar/eletrodos/carregar/afastar/choque, respeitando ritmos; ventilação: estados conectar/iniciar/parar. Essas funções devem operar pelo menos no caso crítico.
9. Botões Casa e Ambulância: confirmação com hipótese, justificativa, relatório e **pontuação diferente de acordo com a decisão**, não mera navegação.
10. Pausa/1x/2x/3x, registro de eventos, avaliação final 0–1000 XP, histórico e salvamento local, reinício e nova missão com seed.
11. Áudio básico e configurações de volume; tutoriais simples e aviso médico.
12. Testes automatizados e tutorial de build/deploy.

**Barreira de entrega:** este lote **não estará concluído** se alguma das funções acima for apenas uma tela mockada. Se faltar arte 3D, concluir o jogo com fallback 2,5D visualmente cuidado, sem bloquear jogabilidade. Substituir assets depois, sem deixar o app com tela branca.

## LOTE 2 — REALISMO DE PACIENTES E AMBIENTE

Adotar modelos GLB progressivamente, animação torácica, expressões, ferimentos em decals e curativos visíveis, câmeras por região, interior com luz dinâmica, sons mais completos, qualidade adaptativa e testes de desempenho. Ampliar biblioteca para 8 pacientes visualmente distintos.

## LOTE 3 — CONTEÚDO E CLÍNICA

Chegar a 12 missões revisadas; ampliar investigações, intervenções, sintomas, comorbidades, degradação, fontes contraditórias, regulação e relatórios. Validar condutas e textos com profissional da área. Desenvolver glossário, explicações e replays detalhados.

## LOTE 4 — CARREIRA, VIATURAS E CIDADE

Sistema de carreira completo, garagem de veículos, inventários por equipe, plantões com ocorrências sequenciais, reputação, ciclos de abastecimento/manutenção, ambiente noturno/chuva, eventos simultâneos e módulos educacionais.

## LOTE 5 — EXPANSÃO ONLINE (OPCIONAL)

Autenticação, backup em nuvem, rankings antifraude, compartilhamento de replays e eventos colaborativos somente após escolha consciente de backend, custo, LGPD e segurança. Nunca expor chaves secretas no Pages.

# 17. CRITÉRIOS DE ACEITE E TESTES AUTOMATIZADOS

**Teste funcional mínimo, reproduzível:**
1. Home abre em PC/celular, botão Começar inicia jogo e nenhum recurso essencial está oculto sob a barra inferior.
2. Caso `CASE-001`: prontuário permite ver informações de central e investigar; há pelo menos um achado relevante; hipótese e destino determinam relatório e XP.
3. Caso `CASE-003`: sem intervenção pertinente, estado respiratório tem evolução coerente; intervenção válida altera resultado; monitor visual reflete alteração.
4. Caso `CASE-004`: ferida fica na região correta do corpo; ação de controle muda visivelmente o estado da ferida e o evento clínico, não apenas um toast.
5. Caso crítico: compressões só contam após interação, ritmo e pulso são coerentes, o desfibrilador recusa choque não indicado, e a escolha correta não garante retorno instantâneo.
6. Prontuário não mostra queixa verbal de vítima inconsciente sem testemunha.
7. Medicamento bloqueado por falta de competência/equipamento/alergia não é aplicado; log explica o motivo.
8. Dar alta indevida gera avaliação de risco e perda de pontuação; transportar de forma adequada é avaliado sem exigir 'cura'.
9. Pausar congela o relógio e evolução; retomar e 2x/3x preservam consistência. A tela nunca mede 3x em FPS de render.
10. Salvar/recarregar restaura cenário, seed, tempo, equipamentos, medidas e log, sem duplicar efeitos.
11. Reiniciar missão com a mesma seed reproduz estado inicial e eventos; nova seed varia detalhes permitidos.
12. Jogar offline depois de carregar recursos cacheados (quando PWA ativada) não faz requisições obrigatórias para simular.
13. Controles principais funcionam por teclado, toque e mouse; alto contraste e texto legível no celular paisagem.
14. `npm run build`, `npm run test` e a publicação GitHub Actions concluem sem falha; não há `TODO` nos caminhos críticos de missão.
15. O monitor não exibe valores onde ainda não houve sensor ou avaliação; sinais dados pelo renderer e pelos painéis são consistentes.
16. Teste de regressão verifica que alterar um asset ou HUD não modifica resultado clínico nem scoring.

**Definition of Done do Codex:** entregar URLs, commit e resumo do que está implementado; listar lacunas sem tratá-las como prontas; evidência de testes (captura da tela e saída dos testes quando possível); matriz Botão → Comportamento → Evento → Resultado. Resolver erros de build antes de declarar conclusão.

# 18. CONTROLE DE QUALIDADE CLÍNICA E FONTES

A equipe de desenvolvimento deve manter `docs/PROTOCOLOS_E_REVISOES.md` com data/edição das fontes, avaliação por profissional habilitado, casos revisados, pontos com incerteza, limitações didáticas e política de atualização. O motor não deve se apresentar como treinamento formal. Documentar escopo profissional local e diferença entre equipe básica, avançada e serviços especializados.

**Referências oficiais para consulta e revisão (links públicos, não substituem avaliação profissional):**
- Ministério da Saúde / SAMU 192 — publicações: https://www.gov.br/saude/pt-br/composicao/saes/samu-192/publicacoes
- Ministério da Saúde — Protocolo de Suporte Básico de Vida: https://www.gov.br/saude/pt-br/composicao/saes/samu-192/publicacoes/protocolo-de-suporte-basico-de-vida-1-2.pdf/view
- Ministério da Saúde — Protocolo de Suporte Avançado de Vida: https://www.gov.br/saude/pt-br/composicao/saes/samu-192/publicacoes/protocolo-de-suporte-avancado-de-vida-1.pdf/view
- American Heart Association — Diretrizes 2025 de RCP e Emergências Cardiovasculares: https://professional.heart.org/en/science-news/2025-aha-guidelines-for-cpr-and-ecc
- American Heart Association — Highlights 2025: https://professional.heart.org/en/science-news/2025-aha-guidelines-for-cpr-and-ecc/top-things-to-know
- GitHub Pages — criação e limites: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- React Three Fiber — documentação: https://r3f.docs.pmnd.rs/

**Notas editoriais:** os protocolos podem divergir por localidade, função, serviço e ano. Não hardcodar uma única sequência como universal. Caso a clínica ainda não tenha sido revisada, usar cenário intencionalmente fictício, sem detalhes de dose, configuração de ventilador ou instrução invasiva real.

# 19. INSTRUÇÃO FINAL OBRIGATÓRIA PARA O CODEX

1. Leia esta Bíblia integralmente e transforme-a em checklist rastreável no `docs/ROADMAP.md`.
2. Crie o projeto no repositório indicado pelo proprietário (ou prepare repositório sem supor que já exista). Não apague material existente sem necessidade.
3. Implemente primeiramente **LOTE 1** como aplicativo funcional; não tente fazer 16 pacientes 3D antes de concluir os quatro casos completos.
4. Use identidade visual autoral de padrão internacional. As screenshots fornecidas são referência de conceito, não são assets licenciados.
5. Todo botão deve gerar estado, feedback, evento e consequência testáveis. Nada de `alert('em breve')` para funções da Parte 1.
6. Não alterar o quadro médico por matemática aleatória desconectada da condição do caso; preservar coerência com monitor e lesões.
7. Mantenha o conteúdo clínico passível de revisão; não fornecer doses nem apresentar o jogo como ferramenta médica real.
8. Faça commits por marcos, rode testes, build e corrija falhas. Configure deploy GitHub Pages e informe a URL verificável ao final.
9. Documente o que realmente funciona, o que é fallback visual e o que ainda depende de asset/revisão clínica.
10. Após a primeira versão estar jogável, evolua em lotes sem reescrever o núcleo.

**VISÃO FINAL:** o jogador deve sentir que está dentro de uma ambulância real, avaliando uma pessoa convincente, acompanhando sinais vitais que respondem ao que acontece e tomando decisões cujas consequências podem ser explicadas — tudo em um jogo acessível, visualmente impressionante e tecnicamente sustentável.
