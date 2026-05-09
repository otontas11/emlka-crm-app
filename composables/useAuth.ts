export const useAuth = () => {
  const user = useState('user', () => {
    // Check localStorage for auth
    if (process.client) {
      const stored = localStorage.getItem('auth')
      if (stored) {
        return JSON.parse(stored)
      }
    }
    return null
  })

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isDanisman = computed(() => user.value?.role === 'danisman' || user.value?.role === 'admin')

  const login = async (email: string, password: string, role: string, name: string) => {
    user.value = {
      email,
      name,
      role
    }

    if (process.client) {
      localStorage.setItem('auth', JSON.stringify(user.value))
    }
  }

  const logout = () => {
    user.value = null
    if (process.client) {
      localStorage.removeItem('auth')
    }
    navigateTo('/')
  }

  const checkAuth = () => {
    if (process.client) {
      const stored = localStorage.getItem('auth')
      if (stored) {
        user.value = JSON.parse(stored)
      }
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
