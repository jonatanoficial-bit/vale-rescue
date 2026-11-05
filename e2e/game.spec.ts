import { expect, test } from '@playwright/test'

test('inicia uma ocorrência e gera relatório', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /começar plantão/i }).click()
  await page.getByRole('button', { name: /atender/i }).first().click()
  await expect(page.getByRole('button', { name: /prontuário/i })).toBeVisible()
  await page.getByRole('button', { name: /destino/i }).click()
  await page.getByRole('button', { name: /confirmar destino/i }).click()
  await expect(page.getByText('/ 1000')).toBeVisible()
})
