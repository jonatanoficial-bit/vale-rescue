import type { CaseDefinition, CaseId } from '../engine/types'
import { EXTENDED_CASES } from './extendedCases'

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
  { id: 'glucose-gel', label: 'Glicose', category: 'Controle glicêmico', evidence: 'Catálogo real · modelo pendente' },
  { id: 'bronchodilator', label: 'Salbutamol', category: 'Respiratório', evidence: 'Catálogo real · modelo pendente' },
  { id: 'analgesic', label: 'Dipirona', category: 'Analgésico', evidence: 'Catálogo real · modelo pendente' },
  { id: 'hydration', label: 'Cloreto de sódio 0,9%', category: 'Solução para contexto de missão', evidence: 'Catálogo real · modelo pendente' },
  { id: 'reversal', label: 'Naloxona', category: 'Antagonista', evidence: 'Catálogo real · modelo pendente' },
  { id: 'epinephrine', label: 'Adrenalina (epinefrina)', category: 'Vasoativo', evidence: 'Revisão clínica obrigatória' },
  { id: 'atropine', label: 'Atropina', category: 'Bradiarritmia contextual', evidence: 'Revisão clínica obrigatória' },
  { id: 'amiodarone', label: 'Amiodarona', category: 'Antiarrítmico contextual', evidence: 'Revisão clínica obrigatória' },
  { id: 'ketorolac', label: 'Cetorolaco', category: 'Analgésico anti-inflamatório', evidence: 'Revisão clínica obrigatória' },
  { id: 'morphine', label: 'Morfina', category: 'Opioide controlado', evidence: 'Revisão clínica obrigatória' },
  { id: 'heparin', label: 'Heparina', category: 'Anticoagulante', evidence: 'Revisão clínica obrigatória' },
  { id: 'streptokinase', label: 'Estreptoquinase', category: 'Trombolítico', evidence: 'Revisão clínica obrigatória' },
  { id: 'insulin', label: 'Insulina', category: 'Controle glicêmico', evidence: 'Revisão clínica obrigatória' },
  { id: 'magnesium-sulfate', label: 'Sulfato de magnésio', category: 'Uso contextual restrito', evidence: 'Revisão clínica obrigatória' },
  { id: 'lytic-mixture', label: 'Mistura lítica', category: 'Termo não padronizado no motor', evidence: 'Revisão clínica obrigatória' },
  { id: 'aminophylline', label: 'Aminofilina (Eufilina)', category: 'Broncodilatador restrito', evidence: 'Revisão clínica obrigatória' },
  { id: 'etamsylate', label: 'Etamsilato', category: 'Hemostático contextual', evidence: 'Revisão clínica obrigatória' },
  { id: 'emoxipine', label: 'Emoxipina', category: 'Disponibilidade/protocolo regional', evidence: 'Revisão clínica obrigatória' },
  { id: 'dopamine', label: 'Dopamina', category: 'Vasoativo', evidence: 'Revisão clínica obrigatória' },
  { id: 'acizol', label: 'Acizol', category: 'Disponibilidade/protocolo regional', evidence: 'Revisão clínica obrigatória' },
  { id: 'nitroglycerin', label: 'Nitroglicerina', category: 'Vasoativo contextual', evidence: 'Revisão clínica obrigatória' },
  { id: 'activated-charcoal', label: 'Carvão ativado', category: 'Descontaminação contextual', evidence: 'Revisão clínica obrigatória' },
  { id: 'propofol', label: 'Propofol', category: 'Anestésico/sedativo controlado', evidence: 'Revisão clínica obrigatória' },
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
    interventions: ['monitor', 'position', 'call_support'], medications: ['glucose-gel'], protocolSequence: ['observation', 'glucose', 'medication:glucose-gel'], diagnosticKeywords: ['hipoglicemia', 'hipoglicêmico'], safeDestinations: ['discharge', 'hospital'], expectedActions: ['glucose', 'monitor'],
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
    interventions: ['monitor', 'position', 'oxygen', 'airway', 'call_support'], medications: ['bronchodilator'], protocolSequence: ['observation', 'spo2', 'oxygen', 'airway'], diagnosticKeywords: ['desconforto respiratório', 'crise respiratória', 'broncoespasmo'], safeDestinations: ['hospital', 'advanced_team'], expectedActions: ['spo2', 'oxygen', 'airway'],
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
    interventions: ['monitor', 'position', 'control_bleeding', 'iv_access', 'call_support'], medications: ['analgesic', 'hydration'], protocolSequence: ['arm_left', 'control_bleeding', 'iv_access', 'medication:hydration'], diagnosticKeywords: ['hemorragia', 'sangramento', 'trauma'], safeDestinations: ['hospital', 'advanced_team'], expectedActions: ['arm_left', 'control_bleeding', 'monitor'],
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
    interventions: ['monitor', 'airway', 'call_support'], medications: [], protocolSequence: ['compress', 'shock', 'ventilation'], diagnosticKeywords: ['parada cardiorrespiratória', 'parada cardíaca', 'fibrilação ventricular'], safeDestinations: ['hospital', 'advanced_team'], expectedActions: ['monitor', 'compress', 'shock', 'ventilation'],
    summary: 'Cenário totalmente fictício: a interface registra compressões, etapas do desfibrilador e ventilação, sem ensinar protocolo real.'
  },
  'CASE-014': {
    id: 'CASE-014', title: 'Queda em casa', shortTitle: 'Queda', category: 'Trauma', priority: 'Rotina', unlockXp: 120,
    patient: { name: 'Davi Rocha', age: 67, gender: 'Homem', bodyPreset: 'caio' },
    dispatch: 'Pessoa encontrada sentada após queda doméstica fictícia; relata incômodo no braço e está consciente.',
    witness: '“Ele disse que escorregou, mas não soube explicar se bateu a cabeça.”', history: 'Informações do local incompletas; sem alergias registradas no roteiro.',
    baseline: { heartRate: 98, systolicBP: 132, diastolicBP: 82, spo2: 96, respiratoryRate: 20, temperatureC: 36.5, glucoseMgDl: 101, rhythm: 'sinus', pulsePresent: true, consciousness: 'alert' },
    findings: { observation: 'Paciente acordado; relato e mecanismo da queda precisam ser registrados no cenário.', consciousness: 'Responde de forma organizada na simulação.', bp: 'Leitura disponível após avaliação.', temperature: 'Sem alteração relevante no roteiro.', spo2: 'Leitura preservada no sensor.', glucose: 'Sem alteração prioritária na simulação.', chest: 'Sem achado prioritário relatado.', arm_left: 'Queixa de incômodo no membro, sem ferida aberta visível.' },
    investigations: ['observation', 'consciousness', 'bp', 'spo2', 'arm_left'], interventions: ['monitor', 'position', 'call_support'], medications: [], protocolSequence: ['observation', 'arm_left', 'position'], diagnosticKeywords: ['queda', 'trauma'], safeDestinations: ['hospital'], expectedActions: ['observation', 'arm_left', 'position'],
    summary: 'Caso de observação e registro. A pontuação valoriza avaliação, comunicação e decisão de destino do roteiro.'
  },
  'CASE-018': {
    id: 'CASE-018', title: 'Tontura no mercado', shortTitle: 'Tontura', category: 'Investigação', priority: 'Rotina', unlockXp: 250,
    patient: { name: 'Luana Reis', age: 29, gender: 'Mulher', bodyPreset: 'marina' },
    dispatch: 'Pessoa com tontura e palidez em mercado fictício; permanece consciente e acompanhada.',
    witness: '“Ela ficou pálida e precisou sentar, mas está falando com a gente.”', history: 'Relata rotina alimentar irregular no dia; demais dados precisam ser conferidos no jogo.',
    baseline: { heartRate: 102, systolicBP: 108, diastolicBP: 70, spo2: 98, respiratoryRate: 19, temperatureC: 36.7, glucoseMgDl: 74, rhythm: 'sinus', pulsePresent: true, consciousness: 'alert' },
    findings: { observation: 'Paciente consciente, pálida e cooperativa no cenário.', consciousness: 'Alerta e orientada na simulação.', bp: 'Leitura sem instabilidade importante no roteiro.', temperature: 'Sem alteração relevante.', spo2: 'Leitura adequada no sensor.', glucose: 'Valor de cenário abaixo do alvo da missão.', chest: 'Sem achado prioritário no caso.', arm_left: 'Sem alteração visual.' },
    investigations: ['observation', 'consciousness', 'bp', 'spo2', 'glucose'], interventions: ['monitor', 'position', 'call_support'], medications: ['glucose-gel'], protocolSequence: ['observation', 'glucose', 'medication:glucose-gel'], diagnosticKeywords: ['hipoglicemia', 'tontura'], safeDestinations: ['discharge', 'hospital'], expectedActions: ['observation', 'glucose', 'monitor'],
    summary: 'Missão variável de investigação. O resultado depende da leitura registrada e da decisão documentada.'
  },
  'CASE-019': {
    id: 'CASE-019', title: 'Desconforto no tórax', shortTitle: 'Tórax', category: 'Avaliação', priority: 'Prioridade', unlockXp: 400,
    patient: { name: 'Henrique Dias', age: 54, gender: 'Homem', bodyPreset: 'caio' },
    dispatch: 'Pessoa com desconforto no tórax descrito de forma inespecífica em residência fictícia. Está consciente.',
    witness: '“Começou há pouco; ele ficou parado e pediu ajuda.”', history: 'Roteiro sem diagnóstico definido. A missão exige coleta e comunicação, não prescrição.',
    baseline: { heartRate: 108, systolicBP: 148, diastolicBP: 90, spo2: 95, respiratoryRate: 23, temperatureC: 36.6, glucoseMgDl: 108, rhythm: 'sinus', pulsePresent: true, consciousness: 'voice' },
    findings: { observation: 'Desconforto referido e ansiedade no cenário; sem diagnóstico automático.', consciousness: 'Responde à voz e à entrevista fictícia.', bp: 'Pressão alterada no roteiro, requer registro.', temperature: 'Sem alteração relevante.', spo2: 'Leitura preservada, porém exige observação.', glucose: 'Sem alteração prioritária.', chest: 'Queixa localizada; o jogo não determina uma causa.' },
    investigations: ['observation', 'consciousness', 'bp', 'spo2', 'glucose', 'chest'], interventions: ['monitor', 'position', 'call_support'], medications: [], protocolSequence: ['observation', 'chest', 'call_support'], diagnosticKeywords: ['dor torácica', 'desconforto torácico'], safeDestinations: ['hospital', 'advanced_team'], expectedActions: ['observation', 'chest', 'call_support'],
    summary: 'Cenário de comunicação e destino. O jogo não diagnostica a causa do desconforto.'
  },
  'CASE-021': {
    id: 'CASE-021', title: 'Sinais neurológicos súbitos', shortTitle: 'Suspeita AVC', category: 'Neurológico', priority: 'Crítico', unlockXp: 500, requiredCertification: 'stroke',
    patient: { name: 'Renata Farias', age: 61, gender: 'Mulher', bodyPreset: 'marina' },
    dispatch: 'Alteração súbita de fala e força relatada por acompanhante em cenário fictício. A Central pede registro do horário referido.',
    witness: '“Ela estava bem quando a vi antes; agora fala enrolado e um lado parece fraco.”', history: 'Histórico do jogo incompleto. A causa não é confirmada fora de avaliação profissional e imagem.',
    baseline: { heartRate: 92, systolicBP: 156, diastolicBP: 94, spo2: 97, respiratoryRate: 18, temperatureC: 36.8, glucoseMgDl: 106, rhythm: 'sinus', pulsePresent: true, consciousness: 'voice' },
    findings: { observation: 'Há relato de início súbito de alteração focal no roteiro; registre o horário informado.', consciousness: 'Paciente entende parcialmente as perguntas da simulação.', bp: 'Leitura elevada no cenário; sem conduta automatizada pelo jogo.', temperature: 'Sem alteração relevante.', spo2: 'Leitura preservada no sensor.', glucose: 'Dado de cenário disponível para excluir causa alternativa no roteiro.', chest: 'Sem achado respiratório prioritário.', arm_left: 'Assimetria relatada no membro, sem diagnóstico automático.' },
    investigations: ['observation', 'consciousness', 'bp', 'spo2', 'glucose', 'arm_left'], interventions: ['monitor', 'position', 'iv_access', 'call_support'], medications: [], protocolSequence: ['observation', 'consciousness', 'glucose', 'call_support'], diagnosticKeywords: ['avc', 'evento neurológico', 'sinais neurológicos'], safeDestinations: ['hospital', 'advanced_team'], expectedActions: ['observation', 'consciousness', 'call_support'],
    summary: 'Módulo de reconhecimento fictício desbloqueado após a certificação de estudo. A missão privilegia registro e destino, não medicação ou diagnóstico.'
  },
  ...EXTENDED_CASES,
}

export const CASE_LIST = Object.values(CASES)
