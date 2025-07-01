// @vitest-environment nuxt
import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { VueWrapper } from "@vue/test-utils";
import ChatMessage from './ChatMessage.vue'

describe('ChatMessage', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    wrapper = await mountSuspended(ChatMessage, {
      props: {
        someProp: 'Test ChatMessage'
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.chatmessage-component').exists()).toBe(true)
  })

  // Add more tests here
  // make sure to handle edge cases
})
