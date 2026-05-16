export const useAuth = () => {
  const authCookie = useCookie('auth', {
    maxAge: 60 * 60 * 24 * 7, // 7 gün
    sameSite: 'lax'
  })

  const user = useState('user', () => authCookie.value || null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isDanisman = computed(() => user.value?.role === 'danisman' || user.value?.role === 'admin')

  const login = async (email: string, password: string, role: string, name: string) => {
    const userData = {
      email,
      name,
      role
    }

    user.value = userData
    authCookie.value = userData
  }

  const logout = () => {
    user.value = null
    authCookie.value = null
    navigateTo('/')
  }

  const checkAuth = () => {
    if (authCookie.value) {
      user.value = authCookie.value
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    isDanisman,
    login,
    logout,
    checkAuth
  }
}
