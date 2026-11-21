export type MedicationEvidenceStatus = 'modelo virtual com fonte' | 'catálogo aguardando revisão clínica'

export type MedicationEvidence = {
  id: string
  status: MedicationEvidenceStatus
  sourceLabel: string
  sourceUrl: string
  gameScope: string
}

// The effect coefficients live in the game engine. They are virtual-scenario responses,
// never dose conversion or a prediction for a real patient.
export const MEDICATION_EVIDENCE: MedicationEvidence[] = [
  { id: 'glucose-gel', status: 'modelo virtual com fonte', sourceLabel: 'American Diabetes Association — Standards of Care (2026)', sourceUrl: 'https://diabetesjournals.org/care/article/49/Supplement_1/S132/163927/6-Glycemic-Goals-Hypoglycemia-and-Hyperglycemic%E2%81%A0', gameScope: 'No cenário consciente com glicemia baixa já confirmada, aplica recuperação glicêmica virtual; não autoriza tratamento fora do jogo.' },
  { id: 'insulin', status: 'modelo virtual com fonte', sourceLabel: 'American Diabetes Association — Standards of Care (2026)', sourceUrl: 'https://diabetesjournals.org/care/article/49/Supplement_1/S132/163927/6-Glycemic-Goals-Hypoglycemia-and-Hyperglycemic%E2%81%A0', gameScope: 'No paciente virtual já hipoglicêmico, registra incompatibilidade glicêmica e risco de deterioração.' },
  { id: 'epinephrine', status: 'modelo virtual com fonte', sourceLabel: 'DailyMed — Epinephrine injection', sourceUrl: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ef556382-9d19-4f0e-9dbe-fcecc772a3e2', gameScope: 'No paciente virtual com pulso e sem indicação do roteiro, registra estímulo cardiovascular e risco de arritmia.' },
  { id: 'atropine', status: 'modelo virtual com fonte', sourceLabel: 'AHA — Adult Bradycardia Algorithm (2025)', sourceUrl: 'https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Accessible/Algorithm-ACLS-Bradycardia-LngDscrp-250725-Ed.pdf?sc_lang=en', gameScope: 'Disponível para futuro cenário de bradicardia com comprometimento; não modela assistolia como indicação.' },
  { id: 'amiodarone', status: 'modelo virtual com fonte', sourceLabel: 'AHA — Adult Advanced Life Support (2025)', sourceUrl: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-advanced-life-support/', gameScope: 'Disponível para futuro ramo de FV/TV sem pulso refratária à desfibrilação; não gera retorno automático.' },
  { id: 'bronchodilator', status: 'modelo virtual com fonte', sourceLabel: 'DailyMed — Albuterol sulfate inhalation aerosol', sourceUrl: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=17858afa-dcdf-4612-b475-3b6baadfb639', gameScope: 'No cenário respiratório autorizado, altera a resposta virtual e preserva o risco cardiovascular documentado.' },
  { id: 'morphine', status: 'modelo virtual com fonte', sourceLabel: 'DailyMed — Morphine sulfate injection', sourceUrl: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6023606c-150c-40c5-9175-598efe2a56c3', gameScope: 'Em comprometimento respiratório ou circulatório do paciente virtual, registra risco de depressão respiratória e hipotensão.' },
  { id: 'heparin', status: 'modelo virtual com fonte', sourceLabel: 'DailyMed — Heparin sodium injection', sourceUrl: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=a3041c04-0ea8-4d36-81ce-c5091c906316', gameScope: 'Em sangramento ativo virtual, agrava a janela hemorrágica do cenário.' },
  { id: 'ketorolac', status: 'modelo virtual com fonte', sourceLabel: 'DailyMed — Ketorolac tromethamine injection', sourceUrl: 'https://dailymed.nlm.nih.gov/dailymed/getFile.cfm?setid=ae6c60c0-e88a-45b2-e053-2995a90ac62f&type=pdf', gameScope: 'Em sangramento ou depleção de volume virtual, registra risco de segurança; não substitui avaliação renal ou hemorrágica real.' },
  { id: 'nitroglycerin', status: 'modelo virtual com fonte', sourceLabel: 'DailyMed — Nitroglycerin sublingual tablets', sourceUrl: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=041f127e-5166-4484-bc1a-0a373d1187ae', gameScope: 'No paciente virtual hipotenso, em choque ou com depleção de volume, aplica risco hemodinâmico.' },
  { id: 'propofol', status: 'modelo virtual com fonte', sourceLabel: 'DailyMed — Propofol injectable emulsion', sourceUrl: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=76ae0147-53ad-4192-a400-c5d1760123d0', gameScope: 'Fora de ambiente e contexto autorizados, aplica risco cardiorrespiratório no paciente virtual.' },
  { id: 'reversal', status: 'modelo virtual com fonte', sourceLabel: 'AHA — Adult Basic Life Support (2025)', sourceUrl: 'https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/adult-basic-life-support', gameScope: 'Reservado para futuro cenário de suspeita de opioide; o jogo não presume intoxicação sem achados do caso.' },
]

export const medicationEvidenceFor = (id: string) => MEDICATION_EVIDENCE.find((item) => item.id === id)
