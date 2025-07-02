import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('/conversations API endpoints', () => {
  let _createdConversationId: string

  test('GET /conversations - should list conversations', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    const response = await page.request.get('/api/conversations')
    expect(response.status()).toBe(200)
    // TODO: Add tests for the response data
  })

  // TODO: Add tests for all the endpoints

}) 