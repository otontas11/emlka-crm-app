export default defineNuxtRouteMiddleware((to, from) => {
  const authCookie = useCookie('auth')

  if (!authCookie.value) {
    // Giriş yapmamış, ana sayfaya yönlendir
    return navigateTo('/')
  }

  const user = authCookie.value

  // Admin route'ları - sadece admin erişebilir
  if (to.path.startsWith('/admin')) {
    if (user.role !== 'admin') {
      // Admin değilse danışman sayfasına yönlendir
      return navigateTo('/danisman')
    }
  }

  // Danışman route'ları - hem admin hem danışman erişebilir
  if (to.path.startsWith('/danisman')) {
    if (user.role !== 'admin' && user.role !== 'danisman') {
      // Ne admin ne danışman ise ana sayfaya yönlendir
      return navigateTo('/')
    }
  }
})
