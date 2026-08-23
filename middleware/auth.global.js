export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const { user, initAuth, isCompanyAdmin, isConsultant } = useAuth()

  initAuth()

  const publicRoutes = [
    '/',
    '/login',
    '/broker/login',
    '/consultant/login',
    '/office/login',
    '/reset-auth',
  ]

  if (publicRoutes.includes(to.path)) return
  if (to.path.startsWith('/u/')) return

  // Ofis / broker paneli
  if (to.path.startsWith('/office') || to.path.startsWith('/admin')) {
    if (!user.value) return navigateTo('/broker/login', { replace: true })
    if (!isCompanyAdmin.value) return navigateTo('/consultant', { replace: true })
    return
  }

  // Danışman paneli
  if (to.path.startsWith('/consultant') || to.path.startsWith('/danisman')) {
    if (!user.value) return navigateTo('/consultant/login', { replace: true })
    if (!isConsultant.value) return navigateTo('/office', { replace: true })
  }
})
