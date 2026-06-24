import { useOffice } from '~/composables/useOffice'
import { useOfficeNotifications } from '~/composables/useOfficeNotifications'

export const useOfficeOrientation = () => {
  const { consultants } = useOffice()
  const { createOfficeAnnouncement, syncAnnouncementNotifications } = useOfficeNotifications()

  const records = useState('office-orientation-records', () => [])
  const isHydrated = useState('office-orientation-records-hydrated', () => false)

  const storageKey = 'emlak-crm-office-orientation-records'

  const steps = [
    {
      key: 'danisman-kaydi',
      title: 'Danışman kaydı açıldı',
      category: 'Kayıt',
      description: 'Danışmanın temel bilgileri, çalışma türü ve ofis bağlantısı oluşturulur.',
    },
    {
      key: 'sozlesmeler',
      title: 'Sözleşmeleri tamamlandı',
      category: 'Evrak',
      description: 'İş sözleşmesi, iş birliği sözleşmesi, KVKK ve ofis iç yönetmelik onayları tamamlanır.',
    },
    {
      key: 'kullanici-hesabi',
      title: 'Kullanıcı hesabı açıldı',
      category: 'Sistem',
      description: 'Danışmanın CRM kullanıcı hesabı ve erişim yetkileri oluşturulur.',
    },
    {
      key: 'egitimler-atandi',
      title: 'Eğitimler atandı',
      category: 'Eğitim',
      description: 'Ofis başlangıç rehberi, saha çalışması, FSBO ve portföy alma eğitimleri atanır.',
    },
    {
      key: 'ofis-kurallari',
      title: 'Ofis kuralları teslim edildi',
      category: 'Ofis',
      description: 'Ofis çalışma prensipleri, etik kurallar ve iç işleyiş danışmana aktarılır.',
    },
    {
      key: 'bolge-atandi',
      title: 'Bölge atandı',
      category: 'Bölge',
      description: 'Danışmanın uzmanlık alanı, uzmanlık bölgesi ve saha sorumluluğu belirlenir.',
    },
    {
      key: 'ilk-hedef',
      title: 'İlk hedef belirlendi',
      category: 'Hedef',
      description: 'İlk ay için arama, portföy, görüşme, satış/kiralama ve ciro hedefleri oluşturulur.',
    },
    {
      key: 'ilk-saha-plani',
      title: 'İlk saha planı yapıldı',
      category: 'Saha',
      description: 'İlk saha günü, ziyaret planı, aranacak kişiler ve yapılacak çalışmalar belirlenir.',
    },
  ]

  const readStorage = () => {
    if (!process.client) return []

    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : []
    } catch (error) {
      return []
    }
  }

  const writeStorage = () => {
    if (!process.client) return

    try {
      localStorage.setItem(storageKey, JSON.stringify(records.value))
    } catch (error) {
      console.error('Oryantasyon kayıt hatası:', error)
    }
  }

  const hydrate = () => {
    if (!process.client || isHydrated.value) return

    const saved = readStorage()

    if (Array.isArray(saved)) {
      records.value = saved
    }

    isHydrated.value = true
  }

  const createRecord = (consultant, step, index, completedCount) => {
    const completed = index < completedCount

    return {
      id: `${consultant.id}-${step.key}`,
      consultantId: consultant.id,
      consultantName: consultant.fullName,
      consultantCode: consultant.code,
      workType: consultant.workType,
      consultantStatus: consultant.status,
      stepKey: step.key,
      title: step.title,
      category: step.category,
      description: step.description,
      status: completed ? 'Tamamlandı' : 'Bekliyor',
      note: '',
      completedAt: completed ? new Date().toLocaleDateString('tr-TR') : '',
      updatedAt: new Date().toISOString(),
    }
  }

  const ensureOrientationForConsultants = () => {
    hydrate()

    consultants.value.forEach((consultant) => {
      const progress = Number(consultant.orientationProgress || 0)
      const completedCount = Math.round((steps.length * progress) / 100)

      steps.forEach((step, index) => {
        const exists = records.value.some(record => {
          return String(record.consultantId) === String(consultant.id) &&
            record.stepKey === step.key
        })

        if (!exists) {
          records.value.push(createRecord(consultant, step, index, completedCount))
        }
      })
    })

    writeStorage()
  }

  const getStepsByConsultant = (consultantId) => {
    ensureOrientationForConsultants()

    return records.value.filter(item => {
      return String(item.consultantId) === String(consultantId)
    })
  }

  const updateStepStatus = (recordId, status) => {
    hydrate()

    const record = records.value.find(item => item.id === recordId)
    if (!record) return

    record.status = status
    record.completedAt = status === 'Tamamlandı'
      ? new Date().toLocaleDateString('tr-TR')
      : ''
    record.updatedAt = new Date().toISOString()

    writeStorage()
  }

  const updateStepNote = (recordId, note) => {
    hydrate()

    const record = records.value.find(item => item.id === recordId)
    if (!record) return

    record.note = note
    record.updatedAt = new Date().toISOString()

    writeStorage()
  }

  const completionPercent = (consultantId) => {
    const list = getStepsByConsultant(consultantId)

    if (!list.length) return 0

    const completed = list.filter(item => item.status === 'Tamamlandı').length

    return Math.round((completed / list.length) * 100)
  }

  const waitingCount = (consultantId) => {
    return getStepsByConsultant(consultantId).filter(item => item.status !== 'Tamamlandı').length
  }

  const sendOrientationReminder = (consultantId) => {
    const consultant = consultants.value.find(item => String(item.id) === String(consultantId))
    if (!consultant) return ''

    const waitingSteps = getStepsByConsultant(consultantId).filter(item => item.status !== 'Tamamlandı')

    if (!waitingSteps.length) {
      return 'Bu danışmanın oryantasyon süreci tamamlanmış görünüyor.'
    }

    const stepList = waitingSteps
      .map(item => `- ${item.title} (${item.status})`)
      .join('\n')

    createOfficeAnnouncement({
      title: `${consultant.fullName} oryantasyon hatırlatması`,
      type: 'Oryantasyon',
      audience: 'Belirli Danışmanlar',
      date: 'Bugün',
      priority: 'Önemli',
      status: 'Yayınlandı',
      description: `Merhaba ${consultant.fullName}, oryantasyon sürecinizde tamamlanması gereken adımlar bulunmaktadır:\n\n${stepList}\n\nLütfen ilgili adımları ofis yöneticinizle birlikte tamamlayınız.`,
      channels: ['Sistem İçi', 'Mobil Bildirim'],
      requiresConfirmation: true,
      selectedConsultantIds: [consultant.id],
    })

    syncAnnouncementNotifications()

    return `${consultant.fullName} için oryantasyon hatırlatması gönderildi.`
  }

  const orientationStats = computed(() => {
    ensureOrientationForConsultants()

    const totalConsultants = consultants.value.length
    const completedConsultants = consultants.value.filter(item => completionPercent(item.id) === 100).length
    const inProgressConsultants = consultants.value.filter(item => {
      const percent = completionPercent(item.id)
      return percent > 0 && percent < 100
    }).length
    const notStartedConsultants = consultants.value.filter(item => completionPercent(item.id) === 0).length
    const totalSteps = records.value.length
    const completedSteps = records.value.filter(item => item.status === 'Tamamlandı').length
    const waitingSteps = records.value.filter(item => item.status !== 'Tamamlandı').length

    return {
      totalConsultants,
      completedConsultants,
      inProgressConsultants,
      notStartedConsultants,
      totalSteps,
      completedSteps,
      waitingSteps,
    }
  })

  return {
    records,
    steps,
    ensureOrientationForConsultants,
    getStepsByConsultant,
    updateStepStatus,
    updateStepNote,
    completionPercent,
    waitingCount,
    sendOrientationReminder,
    orientationStats,
  }
}


