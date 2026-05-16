export default defineNuxtRouteMiddleware((to, from) => {
  const authCookie = useCookie('auth')

  if (!authCookie.value) {
    return navigateTo('/')
  }

  const user = authCookie.value

  // Admin/Broker route'ları - sadece company admin erişebilir
  if (to.path.startsWith('/admin')) {
    if (!user.is_company_admin) {
      return navigateTo('/danisman')
    }
  }

  // Danışman route'ları - consultant yetkisi olanlar erişebilir
  if (to.path.startsWith('/danisman')) {
    if (!user.is_consultant) {
      return navigateTo('/')
    }
  }
})
