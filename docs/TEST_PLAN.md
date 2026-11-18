# Plano de testes

## Automatizados

- `pnpm test`: regras do motor em `src/engine/clinical.test.ts`.
- `pnpm test:e2e`: fluxo de Home → central → ocorrência → relatório em `e2e/game.spec.ts`.
- `pnpm build`: verificação de TypeScript e bundle Vite.

## Cenários cobertos pelo motor

1. CASE-001: investigar e aplicar item contextual não altera estado antes da avaliação exigida.
2. CASE-003: sinais respiratórios deterioram sem suporte e melhoram apenas no modelo de cenário.
3. Monitor: ECG e pletismografia derivam sua cadência da FC do estado; oxigenação, frequência e curva mudam depois das ações e da passagem de tempo.
4. CASE-004: controle exige inspeção, trata a ferida visual e interrompe a tendência de sangramento simulada.
5. CASE-011: compressão conta por toque; desfibrilador exige etapas; choque não dá recuperação automática.
6. Choque fora do caso crítico é registrado como bloqueio/penalidade e piora o estado de jogo.
7. Destino compatível pontua mais que escolha incompatível; a seed é preservada no reinício.

## Regressão manual antes de publicar

- Validar a Home, cards de casos e toolbar em largura de 360 px e desktop.
- Pausar por 10 segundos e confirmar que o cronômetro e sinais não avançam.
- Tentar ações/medicações indisponíveis e conferir feedback explicativo.
- Abrir a ocorrência novamente após recarregar a página e conferir checkpoint/diário.
- Conferir que o caso crítico não atribui fala ao paciente inconsciente.
- Verificar que não há dosagens, promessas de treinamento ou referências gráficas de terceiros.
