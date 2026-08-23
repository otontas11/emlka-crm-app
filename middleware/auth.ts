/**
 * Global auth.global.js zaten panel bazlı yetki kontrolü yapıyor. Bu middleware
 * yalnızca "giriş yapılmış olmalı" diyen sayfalar için sade bir kapı.
 */
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const { user, initAuth } = useAuth()
  initAuth()

  if (!user.value) {
    return navigateTo('/login', { replace: true })
  }
})
