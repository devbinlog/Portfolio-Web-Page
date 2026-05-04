import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('공개 페이지', () => {
  test('랜딩 페이지 로드', async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page).toHaveTitle(/Taebin Kim/i)
    // 네비게이션 확인
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('프로젝트 목록 페이지', async ({ page }) => {
    await page.goto(`${BASE_URL}/projects`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('About 페이지', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`)
    await expect(page.getByText(/Taebin Kim/i)).toBeVisible()
  })

  test('Contact 페이지', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`)
    await expect(page.getByRole('form')).toBeVisible()
  })
})

test.describe('Contact 폼 유효성 검사', () => {
  test('빈 폼 제출 시 에러 메시지', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`)
    const submitButton = page.getByRole('button', { name: /보내기|전송|submit/i })
    await submitButton.click()
    // HTML5 validation 또는 커스텀 에러 메시지 확인
    const nameInput = page.getByLabel(/이름|name/i)
    await expect(nameInput).toBeFocused()
  })
})
