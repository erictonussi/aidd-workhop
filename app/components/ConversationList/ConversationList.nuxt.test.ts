// @vitest-environment nuxt
import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import ConversationList from "./ConversationList.vue";

describe("ConversationList", () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = await mountSuspended(ConversationList, {
      props: {
        conversations: [
          {
            id: "1",
            title: "Test Conversation",
            lastMessage: "Hello world",
            timestamp: new Date(),
            messageCount: 5,
          },
        ],
        activeConversationId: "1",
        isLoading: false,
      },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("Test Conversation");
  });

  it("displays New Chat button", () => {
    expect(wrapper.text()).toContain("New Chat");
  });

  // Add more tests here
  // make sure to handle edge cases
});
