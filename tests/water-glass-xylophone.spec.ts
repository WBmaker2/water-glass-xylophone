import { expect, test } from '@playwright/test'

test('loads the classroom shell', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: '찰랑찰랑 디지털 물컵 실로폰' }),
  ).toBeVisible()
  await expect(page.getByText('3~4학년 과학 / 음악')).toBeVisible()

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
