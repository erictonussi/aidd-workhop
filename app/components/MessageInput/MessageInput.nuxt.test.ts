// @vitest-environment nuxt
import { describe, it, expect, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import MessageInput from "./MessageInput.vue";

describe("MessageInput", () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = await mountSuspended(MessageInput, {
      props: {
        isLoading: false,
        placeholder: "Type a message...",
        maxFiles: 5,
      },
    });
  });

  it("renders correctly", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("displays placeholder text", () => {
    const textarea = wrapper.find("textarea");
    expect(textarea.attributes("placeholder")).toBe("Type a message...");
  });

  // Add more tests here
  // make sure to handle edge cases
});
