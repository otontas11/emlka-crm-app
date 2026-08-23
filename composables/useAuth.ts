/**
 * Tek auth kaynağı. Daha önce üç ayrı sistem vardı (useAuth cookie, useCrmAuth
 * localStorage, useCurrentUser packageType) ve birbirinden habersiz çalışıyordu.
 *
 * Şekil, backend planındaki Identity + Membership + Tenant modeline birebir uyar:
 * bir kimlik N tenant'a üye olabilir, rol bilgisi üyelikte durur.
 */

export type PackageType = 'Solo' | 'Plus' | 'Office'
export type PanelKind = 'office' | 'consultant'

export interface AuthTenant {
  id: string
  slug: string
  name: string
  packageType: PackageType
}

export interface AuthMembership {
  id: string
  isCompanyAdmin: boolean
  isConsultant: boolean
  isOwner: boolean
}

export interface AuthConsultant {
  id: string
  fullName: string
  workType: string
}

export interface AuthUser {
  identityId: string
  email: string
  fullName: string
  phone?: string
  title?: string
  tenant: AuthTenant
  membership: AuthMembership
  consultant: AuthConsultant | null
  loggedAt: string
}

const STORAGE_KEY = 'emlak-crm-auth'
const PANEL_KEY = 'emlak-crm-active-panel'

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const authReady = useState('auth-ready', () => false)
  const activePanel = useState<PanelKind>('auth-active-panel', () => 'consultant')

  const persist = () => {
    if (!import.meta.client) return

    if (user.value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
      localStorage.setItem(PANEL_KEY, activePanel.value)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(PANEL_KEY)
    }
  }

  const initAuth = () => {
    if (!import.meta.client || authReady.value) return

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      user.value = raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      user.value = null
    }

    const savedPanel = localStorage.getItem(PANEL_KEY)
    if (savedPanel === 'office' || savedPanel === 'consultant') {
      activePanel.value = savedPanel
    } else if (user.value) {
      activePanel.value = defaultPanelFor(user.value)
    }

    authReady.value = true
  }

  const setUser = (next: AuthUser | null) => {
    user.value = next
    activePanel.value = next ? defaultPanelFor(next) : 'consultant'
    authReady.value = true
    persist()
  }

  const setActivePanel = (panel: PanelKind) => {
    activePanel.value = panel
    persist()
  }

  const logout = async (redirectTo = '/login') => {
    setUser(null)
    await navigateTo(redirectTo, { replace: true })
  }

  const isAuthenticated = computed(() => Boolean(user.value))
  const isCompanyAdmin = computed(() => user.value?.membership.isCompanyAdmin === true)
  const isConsultant = computed(() => user.value?.membership.isConsultant === true)
  const isOwner = computed(() => user.value?.membership.isOwner === true)

  const packageType = computed<PackageType | null>(() => user.value?.tenant.packageType ?? null)
  const isOfficePackage = computed(() => packageType.value === 'Office')
  const hasFinance = computed(() => packageType.value === 'Plus' || packageType.value === 'Office')

  const tenantId = computed(() => user.value?.tenant.id ?? null)
  const tenantSlug = computed(() => user.value?.tenant.slug ?? null)
  const tenantName = computed(() => user.value?.tenant.name ?? null)
  const consultantId = computed(() => user.value?.consultant?.id ?? null)

  /** Hem admin hem danışman olan kullanıcı iki panele de girebilir. */
  const canUseOfficePanel = computed(() => isCompanyAdmin.value && isOfficePackage.value)
  const canUseConsultantPanel = computed(() => isConsultant.value)

  const displayName = computed(() => user.value?.fullName || 'Kullanıcı')
  const displayTitle = computed(() => {
    if (user.value?.title) return user.value.title
    if (isCompanyAdmin.value && isConsultant.value) return 'Broker & Danışman'
    if (isCompanyAdmin.value) return 'Broker / Ofis Yöneticisi'
    return 'Gayrimenkul Danışmanı'
  })
  const avatarText = computed(() => {
    const name = user.value?.fullName?.trim()
    if (!name) return 'K'
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toLocaleUpperCase('tr-TR')
  })

  return {
    user,
    authReady,
    activePanel,
    initAuth,
    setUser,
    setActivePanel,
    logout,
    persist,
    isAuthenticated,
    isCompanyAdmin,
    isConsultant,
    isOwner,
    packageType,
    isOfficePackage,
    hasFinance,
    tenantId,
    tenantSlug,
    tenantName,
    consultantId,
    canUseOfficePanel,
    canUseConsultantPanel,
    displayName,
    displayTitle,
    avatarText,
  }
}

const defaultPanelFor = (u: AuthUser): PanelKind => {
  if (u.membership.isCompanyAdmin && u.tenant.packageType === 'Office') return 'office'
  return 'consultant'
}
