export const useCrmAuth = () => {
  const currentUser = useState('crm-auth-current-user', () => null)
  const authReady = useState('crm-auth-ready', () => false)

  const storageKey = 'emlak-crm-auth-user'

  const initAuth = () => {
    if (!process.client) return

    try {
      const raw = localStorage.getItem(storageKey)
      currentUser.value = raw ? JSON.parse(raw) : null
    } catch (error) {
      currentUser.value = null
    }

    authReady.value = true
  }

  const saveAuth = () => {
    if (!process.client) return

    if (currentUser.value) {
      localStorage.setItem(storageKey, JSON.stringify(currentUser.value))
    } else {
      localStorage.removeItem(storageKey)
    }
  }

  const loginBroker = (payload = {}) => {
    currentUser.value = {
      id: 'broker-1',
      role: 'broker',
      name: payload.name || 'Ofis Brokeri',
      title: 'Broker / Ofis Yöneticisi',
      email: payload.email || 'broker@emlakcrm.com',
      avatarText: 'B',
      loggedAt: new Date().toISOString(),
    }

    authReady.value = true
    saveAuth()
  }

  const loginConsultant = (consultant) => {
    currentUser.value = {
      id: consultant.id,
      role: 'consultant',
      consultantId: consultant.id,
      name: consultant.fullName,
      title: consultant.workType,
      email: consultant.email,
      avatarText: consultant.fullName?.charAt(0) || 'D',
      loggedAt: new Date().toISOString(),
    }

    authReady.value = true
    saveAuth()
  }

  const logout = () => {
    currentUser.value = null
    authReady.value = true
    saveAuth()
  }

  const isBroker = computed(() => currentUser.value?.role === 'broker')
  const isConsultant = computed(() => currentUser.value?.role === 'consultant')

  return {
    currentUser,
    authReady,
    initAuth,
    loginBroker,
    loginConsultant,
    logout,
    isBroker,
    isConsultant,
  }
}


