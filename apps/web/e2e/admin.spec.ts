import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('어드민 인증', () => {
  test('인증 없이 /admin 접근 시 /admin/login으로 리다이렉트', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`)
    await page.waitForURL(`**/admin/login`, { timeout: 5000 })
    expect(page.url()).toContain('/admin/login')
  })

  test('로그인 페이지 렌더링', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`)
    await expect(page.getByRole('heading', { name: /admin|관리자/i })).toBeVisible()
    await expect(page.getByLabel(/이메일|email/i)).toBeVisible()
    await expect(page.getByLabel(/비밀번호|password/i)).toBeVisible()
  })

  test('잘못된 자격증명 로그인 실패', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`)
    await page.getByLabel(/이메일|email/i).fill('wrong@email.com')
    await page.getByLabel(/비밀번호|password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /로그인|login/i }).click()
    await expect(page.getByText(/실패|오류|error|잘못/i)).toBeVisible({ timeout: 5000 })
  })
})
