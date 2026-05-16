export default defineNuxtRouteMiddleware((to, from) => {
  // Eğer giriş yapmışsa, rolüne göre dashboard'a yönlendir
  if (process.client) {
    const auth = localStorage.getItem('auth')
    if (auth) {
      const user = JSON.parse(auth)
      if (user.role === 'admin') {
        return navigateTo('/admin')
      } else {
        return navigateTo('/danisman')
      }
    }
  }
})
