export default defineNuxtRouteMiddleware((to, from) => {
  // Admin route'larını koruma
  if (to.path.startsWith('/admin')) {
    // TODO: Gerçek auth kontrolü eklenecek
    const isAuthenticated = true // Simdilik bypass
    const isAdmin = true // Simdilik bypass

    if (!isAuthenticated) {
      return navigateTo('/login')
    }

    if (!isAdmin) {
      return navigateTo('/')
    }
  }
})
