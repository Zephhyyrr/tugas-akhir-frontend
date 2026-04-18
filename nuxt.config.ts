// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/AuthCard.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.BACKEND_API_BASE_URL || 'http://localhost:3000/api',
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  devtools: { enabled: true }
})
