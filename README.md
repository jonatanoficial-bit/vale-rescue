# VALE RESCUE — Plantão de Emergência

Primeira versão jogável, local e responsiva de um simulador ficcional de atendimentos em ambulância. Esta entrega é um **fallback visual 2,5D autoral**: não afirma ter modelos 3D e não reutiliza as referências fornecidas.

> Aviso: é entretenimento e experimento de interface. Não é orientação médica, treinamento certificado, dispositivo médico ou protocolo de atendimento. Não há doses nem configurações clínicas reais.

## O que já funciona

- Home, configurações, central de chamados, atendimento e relatório final.
- Quatro ocorrências: investigação estável, respiratória, ferimento/sangramento e treino crítico fictício.
- Motor TypeScript determinístico, separado da UI, com seed, evolução temporal, registro de eventos e pontuação de 0 a 1000.
- Pesquisa com oito avaliações; ações contextuais; catálogo de seis itens de cenário sem posologia; confirmação de medicação.
- Monitor com curva SVG e dados derivados do estado; ferida que muda visualmente; pausa e velocidades 1×/2×/3×.
- Compressão por toque, etapas de desfibrilador, ventilação e infusão condicionais — todos registram causa, consequência e bloqueios.
- Relatório, XP, reinício com a mesma seed e persistência local em IndexedDB.
- Acessível por mouse, toque e teclado nativo; interface compacta para telas estreitas.

## Rodar localmente

```bash
pnpm install
pnpm dev
```

Validação:

```bash
pnpm test
pnpm build
pnpm test:e2e
```

Para executar o Playwright pela primeira vez, instale um navegador compatível:

```bash
pnpm exec playwright install chromium
```

## Arquitetura

`src/engine/clinical.ts` é a única camada que altera estado clínico. A React UI envia comandos e renderiza projeções; `src/services/persistence.ts` persiste checkpoints e relatórios no IndexedDB. Os quatro cenários estão em `src/content/cases.ts`.

## Publicação

O workflow `.github/workflows/deploy.yml` gera `dist` e publica no GitHub Pages quando a branch `main` recebe alterações. A configuração do repositório deve ter Pages como **GitHub Actions**. URL esperada: `https://jonatanoficial-bit.github.io/vale-rescue/`.

## Limitações conhecidas

- O ambiente e pacientes são ilustrações CSS 2,5D autorais, não GLB/3D.
- O áudio usa bipes breves sintetizados pelo navegador; não há trilha ou voz.
- A consistência narrativa foi implementada como jogo. Todo conteúdo clínico exige revisão formal antes de alegações educacionais ou de realismo.

Consulte [docs/ROADMAP.md](docs/ROADMAP.md), [docs/TEST_PLAN.md](docs/TEST_PLAN.md) e [docs/PROTOCOLOS_E_REVISOES.md](docs/PROTOCOLOS_E_REVISOES.md) para escopo e rastreabilidade.
