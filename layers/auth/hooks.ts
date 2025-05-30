import { createHooks } from "hookable";
import type { H3Event } from "h3";

// Define the hooks in some importable file from the layer
export const myHooks = createHooks<{
  "after:user.register": (payload: {
    event: H3Event;
    user: {
      id: string;
      email: string;
      name: string;
    };
  }) => void;
}>();

//
// myHooks.hook("after:user.register", ({ user }) => {
//   console.log(user);
// });

// await myHooks.callHook("after:user.register", {
//   event: {} as H3Event,
//   user: {
//     id: "1",
//     email: "test@test.com",
//     name: "test",
//   },
// });
