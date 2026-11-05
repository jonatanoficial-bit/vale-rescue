# Roadmap rastreável

## LOTE 0 — concluído nesta entrega

- [x] Vite, React e TypeScript configurados.
- [x] Build local, testes Vitest, suite Playwright e workflow do GitHub Pages.
- [x] Documentação de escopo, plano de teste, assets e revisão clínica.
- [x] Base relativa do Vite para publicação estática.

## LOTE 1 — vertical slice jogável

- [x] Home, central, modo treino/carreira local e quatro ocorrências selecionáveis.
- [x] Ambulância 2,5D autoral responsiva com paciente visível.
- [x] Motor determinístico e estado de conhecimento separado da fisiologia simulada.
- [x] Monitor, diário, pausa/velocidades e feedback de bloqueios.
- [x] Pesquisa, sete intervenções contextuais, seis itens de medicação sem doses.
- [x] Compressão, desfibrilação em etapas, ventilação e infusão condicionais.
- [x] Destino, hipótese, justificativa, relatório, XP, pontuação e reinício por seed.
- [x] Checkpoint e histórico local em IndexedDB.

## Itens para o próximo lote

- [ ] Revisão clínica formal dos textos e das relações de causa/efeito do jogo.
- [ ] Assets originais em camadas/GLB, rig e substituição do fallback 2,5D.
- [ ] Mais variações por seed, carreira persistente completa e exportação de save.
- [ ] PWA/offline, preferências persistentes, narração e mixagem de áudio.
- [ ] Teste de desempenho e auditoria de acessibilidade em aparelhos físicos.

## Matriz de rastreabilidade

| Botão | Comportamento | Evento/estado | Resultado visível |
|---|---|---|---|
| Pesquisa | Revela um achado previsto | `knownInvestigations` + tempo | Texto do caso e dados liberados |
| Ações | Valida contexto e requisito | `completedInterventions` | Monitor, ferida ou diário mudam |
| Medicação | Exige confirmação e indicação | `medicationsGiven` | Feedback e evolução contextual |
| Compressão | Um toque registra uma entrada | `compressions` | Contador e diário |
| Desfibrilador | Eletrodos → carregar → afastar → choque | `defibrillator`, ritmo | Fluxo e reavaliação, sem cura automática |
| Ventilação | Conectar/iniciar/parar no caso crítico | `ventilation` | Cena e diário |
| Infusão | Exige acesso no caso de trauma | `infusionActive` | Estado e PA contextual |
| Destino | Avalia hipótese, justificativa e estado | `ScoreReport` | Pontuação, XP e timeline |
