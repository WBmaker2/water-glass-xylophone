import { expect, test } from '@playwright/test'

test('students can tune and strike the water glass xylophone', async ({
  page,
}) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: '찰랑찰랑 디지털 물컵 실로폰' }),
  ).toBeVisible()
  await expect(
    page.getByRole('slider', { name: '도 물 높이', exact: true }),
  ).toBeVisible()

  await page.getByRole('button', { name: '도 컵 치기', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('도 컵을 쳤습니다')

  await page.getByRole('slider', { name: '미 물 높이', exact: true }).focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByText('목표 음에 가까운 컵: 7/8')).toBeVisible()

  await expect(page.getByRole('heading', { name: '연주 미션' })).toBeVisible()
  await expect(page.getByText('도 도 솔 솔 라 라 솔')).toBeVisible()
})

test('layout has no page-level horizontal overflow', async ({ page }) => {
  await page.goto('/')
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  )

  expect(overflow).toBeLessThanOrEqual(1)
})
