<template>
  <nav class="border-b mb-6">
    <div class="flex h-16 items-center px-4">
      <div class="flex items-center space-x-4">
        <h2 class="text-lg font-semibold">My Awesome Project</h2>
      </div>
      <div class="ml-auto flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Link class="h-4 w-4" />
          <span class="sr-only">GitHub</span>
        </Button>
        <Button variant="ghost" size="sm">
          <User class="h-4 w-4" />
          <span class="sr-only">Profile</span>
        </Button>
      </div>
    </div>
  </nav>
  <div>
    <slot />
  </div>
</template>
