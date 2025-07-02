// @vitest-environment nuxt
import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { VueWrapper } from "@vue/test-utils";
import ChatContainer from './ChatContainer.vue'

describe('ChatContainer', () => {
  let wrapper: VueWrapper

  beforeEach(async () => {
    wrapper = await mountSuspended(ChatContainer, {
      props: {
        someProp: 'Test ChatContainer'
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.chatcontainer-component').exists()).toBe(true)
  })

  // Add more tests here
  // make sure to handle edge cases
})
