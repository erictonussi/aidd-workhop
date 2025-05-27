<template>
  <div>
    <div>Hello world</div>
    <Button @click="handleClick">Click Me</Button>
  </div>
</template>
<script setup>
function handleClick(e) {
  try {
    throw new Error();
  } catch (e) {
    const line = e.stack.split("\n")[1]; // usually 2nd line is useful
    console.log("Line info:", line);
    import.meta.hot?.send("dev-click-line", { line });
  }
  const el = e.target;
  const component = el.__vueParentComponent;
  const source = component;
  console.log(source);
  import.meta.hot.send("custom:my-event", { message: "Hello Vite!" });
}

if (import.meta.hot) {
  import.meta.hot.on("response", (data) => {
    console.log("Received from server:", data);
  });
}
</script>
