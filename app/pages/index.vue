<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Ini Landing Page
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Sistem Peramalan Donasi Masjid Surau Zam-Zam
        </p>
        <div class="mt-8 flex justify-center gap-4">
          <NuxtLink to="/auth/login" class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition">Login Sistem</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});
</script>
