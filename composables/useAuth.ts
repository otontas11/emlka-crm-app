export const useAuth = () => {
  const authCookie = useCookie('auth', {
    maxAge: 60 * 60 * 24 * 7, // 7 gün
    sameSite: 'lax'
  })

  const user = useState('user', () => authCookie.value || null)

  const isAuthenticated = computed(() => !!user.value)
  const isCompanyAdmin = computed(() => user.value?.is_company_admin === true)
  const isConsultant = computed(() => user.value?.is_consultant === true)

  const login = async (email: string, password: string, userData: any) => {
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
    isCompanyAdmin,
    isConsultant,
    login,
    logout,
    checkAuth
  }
}
