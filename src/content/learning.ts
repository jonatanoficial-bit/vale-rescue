export type LearningQuestion = { prompt: string; choices: string[]; correct: number }

export type LearningModule = {
  id: 'stroke'
  title: string
  subtitle: string
  requiredXp: number
  unlocks: string
  summary: string[]
  sourceLabel: string
  sourceUrl: string
  questions: LearningQuestion[]
}

export const LEARNING_MODULES: LearningModule[] = [{
  id: 'stroke',
  title: 'Reconhecimento de sinais neurológicos súbitos',
  subtitle: 'Módulo de estudo para liberar a ocorrência fictícia “Sinais neurológicos súbitos”.',
  requiredXp: 500,
  unlocks: 'CASE-021 · Suspeita AVC',
  summary: [
    'Este módulo resume o reconhecimento de sinais de alerta de início súbito e o valor do horário informado por paciente ou acompanhante. No jogo, isso vira registro e comunicação; não é diagnóstico.',
    'A suspeita depende de avaliação profissional. A confirmação do tipo de evento exige estrutura de saúde e exame de imagem; a simulação não prescreve medicamentos, doses ou condutas individuais.',
    'Na vida real, sinais súbitos de fala, força, visão, equilíbrio ou alteração neurológica exigem acionar o serviço de emergência local imediatamente.',
  ],
  sourceLabel: 'Ministério da Saúde — Linha de Cuidado do AVC no Adulto',
  sourceUrl: 'https://linhasdecuidado.saude.gov.br/portal/acidente-vascular-cerebral-%28AVC%29-no-adulto/definicao-acidente-vascular-cerebral-%28AVC%29-no-Adulto',
  questions: [
    { prompt: 'No módulo, o que caracteriza o início que merece atenção no roteiro?', choices: ['Mudança gradual ao longo de meses', 'Sinal neurológico focal de início súbito', 'Apenas febre persistente', 'Somente dor muscular após esforço'], correct: 1 },
    { prompt: 'Por que o jogo pede o horário relatado do início?', choices: ['É somente decorativo', 'Ajuda a documentar a linha do tempo do cenário', 'Substitui exame de imagem', 'Define uma medicação automática'], correct: 1 },
    { prompt: 'Qual afirmação é correta sobre a confirmação diagnóstica?', choices: ['O monitor da ambulância confirma o tipo de AVC', 'A aparência do paciente basta para fechar diagnóstico', 'Avaliação profissional e imagem fazem parte da confirmação', 'A mini prova confirma o diagnóstico'], correct: 2 },
    { prompt: 'No jogo, o objetivo da ocorrência desbloqueada é:', choices: ['Prescrever livremente qualquer medicamento', 'Registrar, comunicar e definir o destino do roteiro', 'Substituir avaliação hospitalar', 'Determinar a causa com certeza'], correct: 1 },
    { prompt: 'Fora do jogo, diante de sinais súbitos compatíveis com AVC, a orientação pública é:', choices: ['Esperar para observar em casa', 'Acionar serviço de emergência local imediatamente', 'Tentar tratar com itens domésticos', 'Usar a pontuação do jogo como referência'], correct: 1 },
  ],
}]
