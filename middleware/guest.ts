export default defineNuxtRouteMiddleware((to, from) => {
  // Eğer giriş yapmışsa, yetkisine göre dashboard'a yönlendir
  const authCookie = useCookie('auth')

  if (authCookie.value) {
    const user = authCookie.value
    if (user.is_company_admin) {
      return navigateTo('/admin')
    } else if (user.is_consultant) {
      return navigateTo('/danisman')
    }
  }
})
