import { test, expect } from '@playwright/test'

test('webapp deve estar online', async ({ page }) => {
    await page.goto('http://192.168.1.11:8080')
    await expect(page).toHaveTitle('Gerencie suas tarefas com Mark L')
})