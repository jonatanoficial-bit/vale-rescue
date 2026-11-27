import { expect, test, type Page } from '@playwright/test'

const acknowledgeSafety = async (page: Page) => {
  await expect(page.getByRole('dialog', { name: /não use este jogo/i })).toBeVisible()
  await page.getByRole('button', { name: /entendi.*central/i }).click()
}

test('inicia uma ocorrência e gera relatório', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await acknowledgeSafety(page)
  const startMission = page.getByRole('button', { name: /iniciar plantão/i })
  await expect(startMission).toBeVisible()
  await expect(startMission).toHaveCSS('background-image', /linear-gradient/)
  await startMission.click()
  await expect(page.getByRole('dialog', { name: /ficha inicial da ocorrência/i })).toBeVisible()
  await expect(page.getByLabel(/registro de campanha/i)).toContainText(/missão 01/i)
  await page.getByRole('button', { name: /iniciar atendimento/i }).click()
  await expect(page.locator('.command-panel')).toBeVisible()
  await expect(page.getByRole('button', { name: /prontuário/i })).toBeVisible()
  await expect(page.getByRole('button', { name: /protocolos/i })).toHaveCount(0)
  await expect(page.locator('.mission-pulse')).toHaveCount(0)
  await page.getByRole('button', { name: /ampliar monitor/i }).click()
  await expect(page.getByRole('dialog', { name: /monitor ampliado/i })).toBeVisible()
  const ecg = page.getByRole('dialog', { name: /monitor ampliado/i }).getByRole('img', { name: /eletrocardiograma simulado com varredura contínua/i })
  await expect(ecg).toHaveAttribute('data-wave-mode', 'progressive-sweep')
  const firstFrame = await ecg.getAttribute('data-frame')
  await page.waitForTimeout(120)
  await expect(ecg).not.toHaveAttribute('data-frame', firstFrame ?? '')
  await page.getByRole('button', { name: /fechar monitor/i }).click()
  await expect(page.getByRole('dialog', { name: /monitor ampliado/i })).not.toBeVisible()
  await page.getByRole('button', { name: /transportar/i }).click()
  await expect(page.getByText(/deslocamento ficcional/i)).toBeVisible()
  await expect(page.getByText(/02:40 estimados/i)).toBeVisible()
  await page.getByLabel(/diagnóstico final do cenário/i).fill('Hipoglicemia no cenário')
  await page.getByLabel(/justificativa/i).fill('Achados registrados na missão.')
  await page.getByRole('button', { name: /encerrar cenário/i }).click()
  await expect(page.getByText('/ 1000')).toBeVisible()
  await expect(page.getByRole('dialog', { name: /transmissão da central/i })).toBeVisible()
  await page.getByRole('button', { name: /arquivar transmissão/i }).click()
  await expect(page.getByRole('button', { name: /continuar campanha/i })).toBeVisible()
  await expect(page.getByLabel(/continuidade da campanha/i)).toContainText(/próxima ocorrência/i)
  await page.getByRole('button', { name: /voltar à central/i }).click()
  await expect(page.getByRole('button', { name: /continuar campanha/i })).toBeVisible()
  await expect(page.getByLabel(/rota ativa da campanha/i)).toContainText(/missão 02/i)
})

test('abre a carreira e os protocolos de missão com bloqueio por XP', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await acknowledgeSafety(page)
  await page.getByRole('button', { name: /carreira e garagem/i }).click()
  await expect(page.getByRole('heading', { name: 'Cadete' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /marcos da central/i })).toBeVisible()
  await expect(page.getByText('Rota inaugurada', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: /acabamentos da garagem/i })).toBeVisible()
  await expect(page.getByText(/vale padrão/i)).toBeVisible()
  await expect(page.getByRole('heading', { name: /modelos da unidade/i })).toBeVisible()
  await expect(page.getByText(/rescue van 07/i)).toBeVisible()
  await expect(page.getByRole('heading', { name: /temporadas da central/i })).toBeVisible()
  await expect(page.locator('.season-board').getByText('Plantão Noturno', { exact: true })).toBeVisible()
  await expect(page.locator('.season-board').getByText(/operações especiais/i)).toBeVisible()
  await expect(page.getByRole('heading', { name: /histórico de plantões/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /equipe e carga da próxima missão/i })).toBeVisible()
  await page.getByRole('button', { name: /abrir protocolos/i }).click()
  await expect(page.getByRole('heading', { name: /trilhas de missão/i })).toBeVisible()
  await expect(page.getByText(/requer 500 xp/i)).toBeVisible()
})

for (const viewport of [{ name: 'retrato', width: 390, height: 844 }, { name: 'paisagem', width: 844, height: 390 }]) {
  test(`mantém a ficha inicial utilizável sem rolar a página em ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await acknowledgeSafety(page)
    await page.getByRole('button', { name: /iniciar plantão/i }).click()

    const dialog = page.getByRole('dialog', { name: /ficha inicial da ocorrência/i })
    const card = dialog.locator('.dispatch-card')
    await expect(card).toBeVisible()
    const metrics = await card.evaluate((element) => {
      const style = getComputedStyle(element)
      const before = element.scrollTop
      element.scrollTop = element.scrollHeight
      return { overflowY: style.overflowY, clientHeight: element.clientHeight, scrollHeight: element.scrollHeight, scrollTop: element.scrollTop, before }
    })
    expect(metrics.overflowY).toMatch(/auto|scroll/)
    expect(metrics.clientHeight).toBeGreaterThan(40)
    if (metrics.scrollHeight > metrics.clientHeight) expect(metrics.scrollTop).toBeGreaterThan(metrics.before)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1)).toBe(true)
    await page.getByRole('button', { name: /iniciar atendimento/i }).click()
    await expect(page.locator('.game-shell')).toBeVisible()
  })

  test(`mantém o cockpit dentro do viewport mobile em ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await acknowledgeSafety(page)
    await expect(page.getByRole('button', { name: /iniciar plantão/i })).toBeVisible()
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1)).toBe(true)
    await page.getByRole('button', { name: /iniciar plantão/i }).click()
    await page.getByRole('button', { name: /iniciar atendimento/i }).click()
    await expect(page.locator('.game-shell')).toBeVisible()
    await expect(page.locator('.scene-tool-dock')).toBeVisible()
    await expect(page.locator('.command-panel')).toBeVisible()
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight + 1)).toBe(true)
  })

  test(`mantém o prontuário utilizável no mobile em ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await acknowledgeSafety(page)
    await page.getByRole('button', { name: /iniciar plantão/i }).click()
    await page.getByRole('button', { name: /iniciar atendimento/i }).click()
    await page.getByRole('button', { name: /prontuário/i }).click()

    const record = page.locator('.panel-content.record')
    await expect(record).toBeVisible()
    await expect(record).toHaveAttribute('aria-label', /prontuário ficcional/i)
    await expect(record.getByText(/registro ficcional da missão/i)).toBeAttached()
    const metrics = await record.evaluate((element) => {
      const style = getComputedStyle(element)
      const before = element.scrollTop
      element.scrollTop = element.scrollHeight
      return { overflowY: style.overflowY, clientHeight: element.clientHeight, scrollHeight: element.scrollHeight, scrollTop: element.scrollTop, before }
    })
    expect(metrics.clientHeight).toBeGreaterThan(40)
    expect(metrics.overflowY).toMatch(/auto|scroll/)
    if (metrics.scrollHeight > metrics.clientHeight) expect(metrics.scrollTop).toBeGreaterThan(metrics.before)
  })
}
