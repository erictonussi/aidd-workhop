import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('/users API endpoints', () => {
  let _createdUserId: string

  test('GET /users - should list users', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const response = await page.request.get('/api/users')
    expect(response.status()).toBe(200)
    // TODO: Add tests for the response data
  })

  // TODO: Add tests for all the endpoints

}) 