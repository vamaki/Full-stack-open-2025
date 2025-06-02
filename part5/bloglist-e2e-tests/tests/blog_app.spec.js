const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'test user',
        username: 'test user',
        password: '123'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test user', '123')

      await page.getByRole('button', { name: 'login '}).click()

      await expect(page.getByText('test user logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'test user', 'wrong password')

      await page.getByRole('button', { name: 'login '}).click()

      const errorDiv = await page.locator('.err')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'test user', '123')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test title', 'test author', 'test-url.com')
      const successDiv = await page.locator('.success')
      await expect(successDiv).toContainText('a new blog test title by test author added')
      await expect(successDiv).toHaveCSS('border-style', 'solid')
      await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
    })

    describe('When a blog is created', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'test title', 'test author', 'test-url.com')
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 2')).toBeVisible()
      })

      test('user who created the blog can delete the blog', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('test author test title')).toBeVisible()
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('test author test title')).not.toBeVisible()
      })

      test('only users who creted a blog see its remove button', async({ page, request }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'test user 2',
            username: 'test user 2',
            password: '123'
          }
        })
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'test user 2', '123')
        await expect(page.getByText('test author test title')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })
  })
})
