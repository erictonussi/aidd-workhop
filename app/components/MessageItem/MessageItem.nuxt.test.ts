// @vitest-environment nuxt
import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import MessageItem from "./MessageItem.vue";

describe("MessageItem", () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = await mountSuspended(MessageItem, {
      props: {
        message: {
          id: "1",
          content: "Test message content",
          role: "user",
          timestamp: new Date(),
          images: [],
        },
        showActions: true,
      },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain("Test message content");
  });

  it("displays user avatar for user messages", () => {
    expect(wrapper.text()).toContain("You");
  });

  // Add more tests here
  // make sure to handle edge cases
});
