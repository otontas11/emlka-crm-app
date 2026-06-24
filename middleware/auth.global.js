export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  const {
    currentUser,
    initAuth,
  } = useCrmAuth()

  initAuth()

  const publicRoutes = [
    '/',
    '/login',
    '/broker/login',
    '/consultant/login',
    '/office/login',
  ]

  const isPublicRoute = publicRoutes.includes(to.path)
  const isPublicProfile = to.path.startsWith('/u/')

  if (isPublicRoute || isPublicProfile) {
    return
  }

  if (to.path.startsWith('/office')) {
    if (!currentUser.value) {
      return navigateTo('/broker/login', { replace: true })
    }

    if (currentUser.value.role !== 'broker') {
      return navigateTo('/consultant', { replace: true })
    }
  }

  if (to.path.startsWith('/consultant')) {
    if (!currentUser.value) {
      return navigateTo('/consultant/login', { replace: true })
    }

    if (currentUser.value.role !== 'consultant') {
      return navigateTo('/office', { replace: true })
    }
  }
})


