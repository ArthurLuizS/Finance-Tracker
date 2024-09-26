// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/supabase'],

  supabase: {
    redirect: false,
  },
  app: {
    head: {
      script: [
        {
          src: "https://accounts.google.com/gsi/client",
          async: true 
        },
        {
          src: "https://unpkg.com/jwt-decode/build/jwt-decode.js",
          async: true 
        }
      ]
    }
  }
});
