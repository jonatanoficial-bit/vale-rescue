import type { CaseDefinition, CaseId } from '../engine/types'

export const INVESTIGATIONS = [
  { id: 'observation', label: 'Observação inicial', icon: '◉' },
  { id: 'consciousness', label: 'Consciência', icon: '◌' },
  { id: 'bp', label: 'Pressão arterial', icon: '▥' },
  { id: 'temperature', label: 'Temperatura', icon: '◒' },
  { id: 'spo2', label: 'Oximetria', icon: '⌁' },
  { id: 'glucose', label: 'Glicemia capilar', icon: '◫' },
  { id: 'chest', label: 'Avaliar tórax', icon: '◇' },
  { id: 'arm_left', label: 'Avaliar membro esquerdo', icon: '◇' },
] as const

export const INTERVENTIONS = [
  { id: 'monitor', label: 'Conectar monitor', hint: 'Ativa leituras contínuas no painel.' },
  { id: 'position', label: 'Posicionamento seguro', hint: 'Reposiciona com conforto e observação.' },
  { id: 'oxygen', label: 'Suporte de oxigenação', hint: 'Resposta fictícia, condicionada ao cenário.' },
  { id: 'airway', label: 'Verificar via aérea', hint: 'Reavalia a via aérea simulada.' },
  { id: 'control_bleeding', label: 'Controle de sangramento', hint: 'Torna a ferida visivelmente tratada.' },
  { id: 'iv_access', label: 'Acesso para infusão', hint: 'Libera a infusão prevista no roteiro.' },
  { id: 'call_support', label: 'Acionar regulação', hint: 'Registra comunicação e pedido de apoio.' },
] as const

export const MEDICATIONS = [
  { id: 'glucose-gel', label: 'Glicose — item de cenário', category: 'Metabólico' },
  { id: 'bronchodilator', label: 'Broncodilatador — item de cenário', category: 'Respiratório' },
  { id: 'analgesic', label: 'Analgésico — item de cenário', category: 'Conforto' },
  { id: 'hydration', label: 'Solução de hidratação — item de cenário', category: 'Suporte' },
  { id: 'reversal', label: 'Agente de reversão — item de cenário', category: 'Especial' },
  { id: 'emergency-adjunct', label: 'Adjuvante de emergência — item de cenário', category: 'Especial' },
] as const

export const CASES: Record<CaseId, CaseDefinition> = {
  'CASE-001': {
    id: 'CASE-001', title: 'Mal-estar no terminal', shortTitle: 'Estável', category: 'Investigação', priority: 'Rotina',
    patient: { name: 'Marina Alves', age: 34, gender: 'Mulher', bodyPreset: 'marina' },
    dispatch: 'Pessoa com fraqueza e sudorese em terminal fictício. Está sentada e responsiva.',
    witness: '“Ela disse que não tinha se alimentado bem hoje.”',
    history: 'Sem alergias conhecidas no relato inicial. Informação incompleta.',
    baseline: { heartRate: 96, systolicBP: 118, diastolicBP: 76, spo2: 98, respiratoryRate: 18, temperatureC: 36.6, glucoseMgDl: 68, rhythm: 'sinus', pulsePresent: true, consciousness: 'alert' },
    findings: { observation: 'Pele úmida, fala organizada e respiração sem esforço aparente.', consciousness: 'Alerta e responde adequadamente.', bp: 'Pressão dentro da faixa ficcional do cenário.', temperature: 'Sem alteração relevante no cenário.', spo2: 'Leitura adequada após sensor.', glucose: 'Glicemia abaixo do alvo fictício do roteiro.', chest: 'Sem achado respiratório prioritário.', arm_left: 'Sem ferimento visível.' },
    investigations: ['observation', 'consciousness', 'bp', 'temperature', 'spo2', 'glucose', 'chest'],
    interventions: ['monitor', 'position', 'call_support'], medications: ['glucose-gel'], safeDestinations: ['discharge', 'hospital'], expectedActions: ['glucose', 'monitor'],
    summary: 'Caso estável de investigação. O relatório valoriza a coleta de informações e uma decisão documentada.'
  },
  'CASE-003': {
    id: 'CASE-003', title: 'Falta de ar à noite', shortTitle: 'Respiratório', category: 'Respiratório', priority: 'Prioridade',
    patient: { name: 'Caio Nunes', age: 51, gender: 'Homem', bodyPreset: 'caio' },
    dispatch: 'Desconforto respiratório progressivo em residência fictícia. Paciente consciente.',
    witness: '“A respiração ficou mais curta desde o início da noite.”',
    history: 'Histórico relatado de episódios respiratórios; alergias não informadas.',
    baseline: { heartRate: 106, systolicBP: 142, diastolicBP: 86, spo2: 89, respiratoryRate: 28, temperatureC: 37.1, glucoseMgDl: 103, rhythm: 'respiratory_stress', pulsePresent: true, consciousness: 'voice' },
    findings: { observation: 'Fala entrecortada e esforço respiratório visível.', consciousness: 'Responde à voz, com ansiedade no cenário.', bp: 'Pressão elevada no roteiro, sem leitura mágica.', temperature: 'Temperatura discretamente alterada no cenário.', spo2: 'Saturação reduzida na simulação.', glucose: 'Valor sem alteração importante no roteiro.', chest: 'Sons respiratórios sintetizados sugerem necessidade de suporte no cenário.', arm_left: 'Sem ferimentos.' },
    investigations: ['observation', 'consciousness', 'bp', 'temperature', 'spo2', 'glucose', 'chest'],
    interventions: ['monitor', 'position', 'oxygen', 'airway', 'call_support'], medications: ['bronchodilator'], safeDestinations: ['hospital', 'advanced_team'], expectedActions: ['spo2', 'oxygen', 'airway'],
    summary: 'A demora deteriora os sinais simulados. Suporte pertinente e transporte são avaliados sem prometer cura.'
  },
  'CASE-004': {
    id: 'CASE-004', title: 'Corte na oficina', shortTitle: 'Sangramento', category: 'Trauma', priority: 'Prioridade',
    patient: { name: 'Iara Campos', age: 42, gender: 'Mulher', bodyPreset: 'marina' },
    dispatch: 'Ferimento com sangramento visível após acidente em oficina fictícia.',
    witness: '“Foi rápido, mas o curativo improvisado não está segurando.”',
    history: 'Paciente comunica dor. Alergias não confirmadas.',
    baseline: { heartRate: 112, systolicBP: 104, diastolicBP: 68, spo2: 97, respiratoryRate: 22, temperatureC: 36.4, glucoseMgDl: 99, rhythm: 'blood_loss_stress', pulsePresent: true, consciousness: 'alert' },
    findings: { observation: 'Há sangramento visível no membro esquerdo e palidez leve no roteiro.', consciousness: 'Alerta, relata dor sem quantificação clínica real.', bp: 'Tendência de pressão reduzida na simulação.', temperature: 'Sem alteração relevante.', spo2: 'Leitura preservada após sensor.', glucose: 'Valor sem alteração importante.', chest: 'Sem achado prioritário no tórax.', arm_left: 'Ferida com sangramento ativo; a inspeção libera a ação contextual.' },
    investigations: ['observation', 'consciousness', 'bp', 'temperature', 'spo2', 'glucose', 'arm_left'],
    interventions: ['monitor', 'position', 'control_bleeding', 'iv_access', 'call_support'], medications: ['analgesic', 'hydration'], safeDestinations: ['hospital', 'advanced_team'], expectedActions: ['arm_left', 'control_bleeding', 'monitor'],
    wound: { region: 'arm_left', severity: 0.82, treated: false }, summary: 'O ferimento muda visualmente quando o controle contextual é concluído. Transporte seguro é esperado.'
  },
  'CASE-011': {
    id: 'CASE-011', title: 'Treino crítico de resposta', shortTitle: 'Crítico/RCP', category: 'Treino fictício', priority: 'Crítico',
    patient: { name: 'Rafael Moura', age: 58, gender: 'Homem', bodyPreset: 'caio' },
    dispatch: 'Cenário crítico explicitamente ficcional para treino de interface. Pessoa sem resposta na maca.',
    witness: 'Nenhuma declaração verbal é atribuída ao paciente inconsciente.',
    history: 'Dados clínicos ocultos no exercício. Este cenário não substitui treinamento profissional.',
    baseline: { heartRate: null, systolicBP: null, diastolicBP: null, spo2: 72, respiratoryRate: 0, temperatureC: 35.8, glucoseMgDl: null, rhythm: 'vf', pulsePresent: false, consciousness: 'unresponsive' },
    findings: { observation: 'Sem resposta observável. Cenário de treino pede suporte e reavaliação.', consciousness: 'Não responsivo. Sem fala atribuída.', bp: 'Sem leitura válida nesta condição simulada.', temperature: 'Leitura reduzida apenas como dado de cenário.', spo2: 'Leitura baixa e dependente do sensor no exercício.', glucose: 'Aferição não é a prioridade do roteiro.', chest: 'Movimento respiratório ausente no cenário fictício.', arm_left: 'Sem ferimento relevante.' },
    investigations: ['observation', 'consciousness', 'spo2', 'chest'],
    interventions: ['monitor', 'airway', 'call_support'], medications: ['emergency-adjunct'], safeDestinations: ['hospital', 'advanced_team'], expectedActions: ['monitor', 'compress', 'shock', 'ventilation'],
    summary: 'Cenário totalmente fictício: a interface registra compressões, etapas do desfibrilador e ventilação, sem ensinar protocolo real.'
  },
}

export const CASE_LIST = Object.values(CASES)
