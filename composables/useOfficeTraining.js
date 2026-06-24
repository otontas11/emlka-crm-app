import { useOffice } from '~/composables/useOffice'
import { useOfficeNotifications } from '~/composables/useOfficeNotifications'

export const useOfficeTraining = () => {
  const { consultants } = useOffice()
  const { createOfficeAnnouncement, syncAnnouncementNotifications } = useOfficeNotifications()

  const trainings = useState('office-training-library', () => [])
  const assignments = useState('office-training-assignments', () => [])
  const isHydrated = useState('office-training-hydrated', () => false)

  const storageKeys = {
    trainings: 'emlak-crm-office-training-library',
    assignments: 'emlak-crm-office-training-assignments',
  }

  const defaultTrainings = [
    {
      id: 1,
      title: 'Ofis Başlangıç Rehberi',
      category: 'Oryantasyon',
      level: 'Başlangıç',
      duration: '45 dk',
      format: 'Doküman + Video',
      description: 'Ofis çalışma sistemi, temel kurallar, CRM kullanımı ve danışman sorumluluklarını kapsar.',
      documentUrl: '',
      videoUrl: '',
      isRequired: true,
    },
    {
      id: 2,
      title: 'Portföy Alma ve Malik Görüşmesi',
      category: 'Portföy',
      level: 'Orta',
      duration: '60 dk',
      format: 'Video',
      description: 'Malik randevusu, güven oluşturma, yetki alma ve portföy giriş sürecini anlatır.',
      documentUrl: '',
      videoUrl: '',
      isRequired: true,
    },
    {
      id: 3,
      title: 'FSBO Arama ve Takip Sistemi',
      category: 'Saha',
      level: 'Orta',
      duration: '50 dk',
      format: 'Doküman',
      description: 'Sahibinden ilan sahipleriyle profesyonel iletişim, takip planı ve randevu alma sürecini kapsar.',
      documentUrl: '',
      videoUrl: '',
      isRequired: true,
    },
    {
      id: 4,
      title: 'Ticari Gayrimenkul Değerleme Temelleri',
      category: 'Ticari Gayrimenkul',
      level: 'İleri',
      duration: '90 dk',
      format: 'Sunum',
      description: 'Emsal, gelir ve maliyet yöntemiyle ticari gayrimenkul değerleme yaklaşımını anlatır.',
      documentUrl: '',
      videoUrl: '',
      isRequired: false,
    },
    {
      id: 5,
      title: 'İlan Girişi ve Pazarlama Standartları',
      category: 'Pazarlama',
      level: 'Başlangıç',
      duration: '40 dk',
      format: 'Doküman',
      description: 'İlan açıklaması, fotoğraf seçimi, başlık, fiyat ve yayın standardı süreçlerini kapsar.',
      documentUrl: '',
      videoUrl: '',
      isRequired: true,
    },
  ]

  const readStorage = (key, fallback = []) => {
    if (!process.client) return fallback

    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch (error) {
      return fallback
    }
  }

  const writeStorage = () => {
    if (!process.client) return

    try {
      localStorage.setItem(storageKeys.trainings, JSON.stringify(trainings.value))
      localStorage.setItem(storageKeys.assignments, JSON.stringify(assignments.value))
    } catch (error) {
      console.error('Eğitim kayıt hatası:', error)
    }
  }

  const hydrate = () => {
    if (!process.client || isHydrated.value) return

    const savedTrainings = readStorage(storageKeys.trainings, null)
    const savedAssignments = readStorage(storageKeys.assignments, null)

    trainings.value = Array.isArray(savedTrainings) && savedTrainings.length
      ? savedTrainings
      : defaultTrainings

    assignments.value = Array.isArray(savedAssignments)
      ? savedAssignments
      : []

    isHydrated.value = true
    writeStorage()
  }

  hydrate()

  const createTraining = (payload) => {
    hydrate()

    const nextId = trainings.value.length
      ? Math.max(...trainings.value.map(item => Number(item.id || 0))) + 1
      : 1

    trainings.value.unshift({
      id: nextId,
      title: payload.title,
      category: payload.category || 'Genel',
      level: payload.level || 'Başlangıç',
      duration: payload.duration || '',
      format: payload.format || 'Doküman',
      description: payload.description || '',
      documentUrl: payload.documentUrl || '',
      videoUrl: payload.videoUrl || '',
      isRequired: Boolean(payload.isRequired),
      createdAt: new Date().toISOString(),
    })

    writeStorage()
  }

  const assignTraining = ({ trainingId, consultantIds, dueDate }) => {
    hydrate()

    const training = trainings.value.find(item => String(item.id) === String(trainingId))
    if (!training) return 0

    let createdCount = 0

    consultantIds.forEach((consultantId) => {
      const consultant = consultants.value.find(item => String(item.id) === String(consultantId))
      if (!consultant) return

      const exists = assignments.value.some(item => {
        return String(item.trainingId) === String(training.id) &&
          String(item.consultantId) === String(consultant.id)
      })

      if (exists) return

      const nextId = assignments.value.length
        ? Math.max(...assignments.value.map(item => Number(item.id || 0))) + 1
        : 1

      assignments.value.unshift({
        id: nextId,
        trainingId: training.id,
        trainingTitle: training.title,
        category: training.category,
        level: training.level,
        format: training.format,
        duration: training.duration,
        description: training.description,
        consultantId: consultant.id,
        consultantName: consultant.fullName,
        consultantCode: consultant.code,
        status: 'Bekliyor',
        progress: 0,
        dueDate: dueDate || '',
        score: '',
        note: '',
        assignedAt: new Date().toLocaleDateString('tr-TR'),
        completedAt: '',
        updatedAt: new Date().toISOString(),
      })

      createdCount += 1
    })

    writeStorage()
    return createdCount
  }

  const updateAssignmentStatus = (assignmentId, status) => {
    hydrate()

    const item = assignments.value.find(record => String(record.id) === String(assignmentId))
    if (!item) return

    item.status = status

    if (status === 'Tamamlandı') {
      item.progress = 100
      item.completedAt = new Date().toLocaleDateString('tr-TR')
    }

    if (status === 'Devam Ediyor' && Number(item.progress) === 0) {
      item.progress = 50
      item.completedAt = ''
    }

    if (status === 'Bekliyor') {
      item.progress = 0
      item.completedAt = ''
    }

    item.updatedAt = new Date().toISOString()

    writeStorage()
  }

  const updateAssignmentField = (assignmentId, field, value) => {
    hydrate()

    const item = assignments.value.find(record => String(record.id) === String(assignmentId))
    if (!item) return

    item[field] = value
    item.updatedAt = new Date().toISOString()

    writeStorage()
  }

  const deleteAssignment = (assignmentId) => {
    hydrate()
    assignments.value = assignments.value.filter(item => String(item.id) !== String(assignmentId))
    writeStorage()
  }

  const getAssignmentsByConsultant = (consultantId) => {
    hydrate()
    return assignments.value.filter(item => String(item.consultantId) === String(consultantId))
  }

  const completionPercent = (consultantId) => {
    const list = getAssignmentsByConsultant(consultantId)

    if (!list.length) return 0

    const completed = list.filter(item => item.status === 'Tamamlandı').length

    return Math.round((completed / list.length) * 100)
  }

  const waitingCount = (consultantId) => {
    return getAssignmentsByConsultant(consultantId).filter(item => item.status !== 'Tamamlandı').length
  }

  const sendTrainingReminder = (consultantId) => {
    hydrate()

    const consultant = consultants.value.find(item => String(item.id) === String(consultantId))
    if (!consultant) return ''

    const waitingAssignments = getAssignmentsByConsultant(consultantId).filter(item => {
      return item.status !== 'Tamamlandı'
    })

    if (!waitingAssignments.length) {
      return 'Bu danışmanın bekleyen eğitimi bulunmuyor.'
    }

    const listText = waitingAssignments
      .map(item => `- ${item.trainingTitle} (${item.status})`)
      .join('\n')

    createOfficeAnnouncement({
      title: `${consultant.fullName} eğitim hatırlatması`,
      type: 'Eğitim',
      audience: 'Belirli Danışmanlar',
      date: 'Bugün',
      priority: 'Önemli',
      status: 'Yayınlandı',
      description: `Merhaba ${consultant.fullName}, size atanmış ve tamamlanması gereken eğitimler bulunmaktadır:\n\n${listText}\n\nLütfen eğitimlerinizi en kısa sürede tamamlayınız.`,
      channels: ['Sistem İçi', 'Mobil Bildirim'],
      requiresConfirmation: true,
      selectedConsultantIds: [consultant.id],
    })

    syncAnnouncementNotifications()

    return `${consultant.fullName} için eğitim hatırlatması gönderildi.`
  }

  const trainingStats = computed(() => {
    hydrate()

    const totalTrainings = trainings.value.length
    const totalAssignments = assignments.value.length
    const completed = assignments.value.filter(item => item.status === 'Tamamlandı').length
    const inProgress = assignments.value.filter(item => item.status === 'Devam Ediyor').length
    const waiting = assignments.value.filter(item => item.status === 'Bekliyor').length

    return {
      totalTrainings,
      totalAssignments,
      completed,
      inProgress,
      waiting,
    }
  })

  return {
    trainings,
    assignments,
    createTraining,
    assignTraining,
    updateAssignmentStatus,
    updateAssignmentField,
    deleteAssignment,
    getAssignmentsByConsultant,
    completionPercent,
    waitingCount,
    sendTrainingReminder,
    trainingStats,
  }
}


