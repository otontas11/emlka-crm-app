// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Global CSS
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css',
    '~/assets/css/tailwind.css'
  ],

  // Modules
  modules: ['@nuxtjs/tailwindcss'],

  // constants/ altındaki enum kaydı da auto-import edilsin (composables/ ve utils/ gibi)
  imports: {
    dirs: ['constants'],
  },

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
  },

  // Tailwind CSS
  tailwindcss: {
    configPath: 'tailwind.config'
  }
})
