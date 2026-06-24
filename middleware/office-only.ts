export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCurrentUser()

  if (user.packageType !== 'office') {
    return navigateTo('/')
  }
})
