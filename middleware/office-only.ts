/**
 * Sadece Office paketindeki tenant'lara açık sayfalar.
 * Önceki sürüm `user.packageType` okuyordu ama useCurrentUser bir ref döndürüyordu;
 * değer her zaman undefined olduğu için bu middleware herkesi '/' adresine atıyordu.
 */
export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const { initAuth, isOfficePackage } = useAuth()
  initAuth()

  if (!isOfficePackage.value) {
    return navigateTo('/', { replace: true })
  }
})
