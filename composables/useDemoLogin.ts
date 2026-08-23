/**
 * GEÇİCİ — backend auth uçları (POST /api/auth/login, /api/auth/select-tenant) devreye
 * girdiğinde bu dosya bütünüyle silinecek. Amacı, prototipin demo giriş ekranlarını
 * useAuth'un gerçek AuthUser şekliyle beslemek.
 */
import type { AuthUser } from '~/composables/useAuth'

const DEMO_TENANT = {
  id: '0193f2b4-0000-7000-8000-00000000a001',
  slug: 'demo-ofis',
  name: 'Demo Gayrimenkul Ofisi',
  packageType: 'Office' as const,
}

export const useDemoLogin = () => {
  const { setUser } = useAuth()

  const loginAsBroker = (input: { email: string; fullName?: string }) => {
    const nowIso = new Date().toISOString()

    setUser({
      identityId: '0193f2b4-0000-7000-8000-00000000b001',
      email: input.email,
      fullName: input.fullName || 'Ofis Brokeri',
      title: 'Broker / Ofis Yöneticisi',
      tenant: DEMO_TENANT,
      membership: {
        id: '0193f2b4-0000-7000-8000-00000000c001',
        isCompanyAdmin: true,
        isConsultant: false,
        isOwner: true,
      },
      consultant: null,
      loggedAt: nowIso,
    } satisfies AuthUser)
  }

  const loginAsConsultant = (consultant: {
    id: string | number
    fullName: string
    email?: string
    workType?: string
  }) => {
    const nowIso = new Date().toISOString()
    const consultantId = String(consultant.id)

    setUser({
      identityId: `0193f2b4-0000-7000-8000-0000000b${consultantId.padStart(4, '0')}`,
      email: consultant.email || '',
      fullName: consultant.fullName,
      title: consultant.workType || 'Gayrimenkul Danışmanı',
      tenant: DEMO_TENANT,
      membership: {
        id: `0193f2b4-0000-7000-8000-0000000c${consultantId.padStart(4, '0')}`,
        isCompanyAdmin: false,
        isConsultant: true,
        isOwner: false,
      },
      consultant: {
        id: consultantId,
        fullName: consultant.fullName,
        workType: consultant.workType || '',
      },
      loggedAt: nowIso,
    } satisfies AuthUser)
  }

  return { loginAsBroker, loginAsConsultant }
}
