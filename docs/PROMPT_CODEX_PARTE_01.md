# PROMPT PARA CODEX CLOUD — VALE RESCUE (PARTE 1)

Você está criando para VALE GAMES o jogo web **VALE RESCUE — PLANTÃO DE EMERGÊNCIA**, simulador de atendimentos em ambulância. Leia integralmente `docs/BIBLIA_MESTRE.md` (anexarei o arquivo da Bíblia Mestre) e siga a ordem do **LOTE 0 e LOTE 1**. O repositório de destino será fornecido por mim; se ainda estiver vazio, inicialize-o como `vale-rescue-ambulancia` ou no nome existente. Preserve quaisquer arquivos prévios.

## Objetivo inegociável

A primeira entrega precisa ser um **jogo jogável** em GitHub Pages, com Home premium, quatro ocorrências (estável, respiratória, ferimento/sangramento e crítico/RCP), um paciente visível na maca no interior da ambulância e uma HUD original inspirada funcionalmente nos prints de referência. Não entregue somente design, mockups, rotas vazias ou botões que não produzam consequências.

## Implementação obrigatória

1. Vite + React + TypeScript, UI responsiva e bonita, Three.js/React Three Fiber quando houver modelo 3D real; caso faltem GLBs, usar **fallback 2,5D cinematográfico original** com regiões clicáveis, pronto para receber 3D depois. Jamais chamar PNG de modelo 3D.
2. Motor clínico TypeScript puro, determinístico, com casos versionados em JSON e semente armazenada. Estado clínico separado do que jogador já descobriu; monitor multiparamétrico, curvas reais geradas a partir do estado, sinais vitais com evolução coerente e registro de eventos.
3. Controles obrigatórios operantes: Prontuário, Pesquisa, Ações, Medicação, Compressão (um toque = uma compressão), Desfibrilador com eletrodos/carregar/afastar/choque e validação de ritmo, Ventilação Mecânica condicionada, Infusão contextual, Casa/Alta com hipótese, Ambulância/Hospital com relatório, Pausa/1x/2x/3x, Monitor e Histórico.
4. Pelo menos seis avaliações e seis intervenções, medicações listadas sem posologia real e disponíveis só quando adequadas ao caso/equipe. Checar restrições, risco, inventário e consequências, com mensagens explicativas.
5. Pontuação de 0–1000 com cinco dimensões clínicas mais eficiência, XP, desempenho, relatório com timeline, histórico e save local (IndexedDB), Continuar Carreira e reinício de missão.
6. Design premium: ambulância iluminada de maneira realista, monitor à esquerda, paciente central, desfibrilador/ventilação à direita, barra de ferramentas inferior; interface original sem copiar arte ou marca de Reanimation Inc. Acessibilidade por toque, mouse e teclado.
7. Criar README completo, `docs/ROADMAP.md`, `docs/TEST_PLAN.md`, `docs/ASSET_MANIFEST.md`, tests Vitest/Playwright e GitHub Actions para publicar em Pages. Verificar base path, build e deploy.

## Critérios de conclusão

- Em cada uma das quatro ocorrências, o jogador consegue abrir relato, investigar, realizar ações pertinentes, observar sinais mudando, escolher destino e receber relatório + XP.
- Defibrilação inapropriada não é recompensada, alta prematura produz penalidade e a investigação não altera estado fisiológico diretamente.
- O salvamento recupera corretamente o atendimento e seu log; pausar realmente pausa o tempo.
- Todos os botões principais são clicáveis e funcionais; quando indisponíveis explicam o motivo.
- O build passa, os testes passam e o jogo abre no Pages, em PC e celular.
- Não invente doses clínicas nem apresente o jogo como formação médica. Documente pontos dependentes de revisão por profissional de saúde.

## Ordem de trabalho

Primeiro faça o motor, casos e testes. Depois a HUD da ambulância com todos os controles. Integre eventos clínicos e pontuação, salvamento e fim de missão. Por último aplique melhorias visuais/sonoras e publique. Se não conseguir concluir algum item, reporte com precisão no `docs/ROADMAP.md`; não marque mockup como funcional.

Ao terminar, informe: URL do repositório, URL do jogo publicado, funcionalidades verificadas, resultados dos testes e próximos itens com maior prioridade. **Não interrompa após apenas criar o esqueleto do site.**
