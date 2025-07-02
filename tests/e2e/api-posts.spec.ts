import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('/posts API endpoints', () => {
  let _createdPostId: string

  test('GET /posts - should list posts', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const response = await page.request.get('/api/posts')
    expect(response.status()).toBe(200)
    // TODO: Add tests for the response data
  })

  // TODO: Add tests for all the endpoints

}) 