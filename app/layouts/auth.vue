<template>
  <div class="auth-layout min-h-screen flex items-center justify-center relative overflow-hidden bg-white">

    <!-- Content -->
    <div class="relative z-10 w-full max-w-md px-4">
      <slot />
    </div>

    <!-- Footer -->
    <p class="absolute bottom-6 text-center text-xs text-secondary/70 z-10">
      &copy; {{ new Date().getFullYear() }} Surau Zam-Zam &mdash; Sistem Peramalan Donasi
    </p>
  </div>
</template>

<style scoped>
.auth-layout {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
</style>
