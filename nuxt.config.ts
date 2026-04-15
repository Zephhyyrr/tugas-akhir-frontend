// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  dependencies: {
    "nuxt": "^4.2.2",
    "vue": "^3.5.26",
    "vue-router": "^4.6.4"
  },
  devtools: { enabled: true }
})
