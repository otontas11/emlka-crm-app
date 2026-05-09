// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Directory structure
  dir: {
    pages: 'pages',
    layouts: 'layouts',
    middleware: 'middleware'
  },

  // App config
  app: {
    head: {
      title: 'Emlak CRM',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Gayrimenkul yönetiminde yeni nesil çözüm' }
      ]
    }
  }
})
