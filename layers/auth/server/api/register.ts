import { myHooks } from "../../hooks";

export default defineEventHandler(async (event) => {
  const { email, password, name } = await readBody(event);
  myHooks.callHook("before:user.register", {
    event,
    data: { email, password, name },
  });

  return {
    message: "Hello from layer1",
  };
});
