export default defineNuxtRouteMiddleware((to, from) => {
  // Eğer giriş yapmışsa, dashboard'a yönlendir
  if (process.client) {
    const auth = localStorage.getItem('auth')
    if (auth) {
      return navigateTo('/danisman')
    }
  }
})
