import { expect, test } from '@playwright/test'

test('inicia uma ocorrência e gera relatório', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: /iniciar plantão/i }).click()
  await expect(page.getByRole('dialog', { name: /ficha inicial da ocorrência/i })).toBeVisible()
  await page.getByRole('button', { name: /iniciar atendimento/i }).click()
  await expect(page.getByRole('region', { name: /roteiro simulado da missão/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /prontuário/i })).toBeVisible()
  await page.getByRole('button', { name: /ampliar monitor/i }).click()
  await expect(page.getByRole('dialog', { name: /monitor ampliado/i })).toBeVisible()
  await page.getByRole('button', { name: /fechar monitor/i }).click()
  await expect(page.getByRole('dialog', { name: /monitor ampliado/i })).not.toBeVisible()
  await page.getByRole('button', { name: /transportar/i }).click()
  await page.getByLabel(/diagnóstico final do cenário/i).fill('Hipoglicemia no cenário')
  await page.getByLabel(/justificativa/i).fill('Achados registrados na missão.')
  await page.getByRole('button', { name: /encerrar cenário/i }).click()
  await expect(page.getByText('/ 1000')).toBeVisible()
})

test('abre a carreira e os protocolos de missão com bloqueio por XP', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: /carreira e garagem/i }).click()
  await expect(page.getByRole('heading', { name: 'Cadete' })).toBeVisible()
  await page.getByRole('button', { name: /abrir protocolos/i }).click()
  await expect(page.getByRole('heading', { name: /trilhas de missão/i })).toBeVisible()
  await expect(page.getByText(/requer 500 xp/i)).toBeVisible()
})
