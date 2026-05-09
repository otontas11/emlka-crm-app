export const useAuth = () => {
  const user = useState('user', () => null as User | null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const login = async (email: string, password: string) => {
    // TODO: API call
    user.value = {
      id: 1,
      email,
      name: 'Admin User',
      role: 'admin'
    }
  }

  const logout = () => {
    user.value = null
    navigateTo('/login')
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout
  }
}
