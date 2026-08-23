/** Giriş yapmış kullanıcıyı login ekranlarından uygun panele yönlendirir. */
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const { user, initAuth, canUseOfficePanel } = useAuth()
  initAuth()

  if (!user.value) return

  return navigateTo(canUseOfficePanel.value ? '/office' : '/consultant', { replace: true })
})
