export default defineNuxtRouteMiddleware((to, from) => {
  // Eğer giriş yapmışsa, rolüne göre dashboard'a yönlendir
  const authCookie = useCookie('auth')

  if (authCookie.value) {
    const user = authCookie.value
    if (user.role === 'admin') {
      return navigateTo('/admin')
    } else {
      return navigateTo('/danisman')
    }
  }
})
