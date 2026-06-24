import { useOffice } from '~/composables/useOffice'
import { useOfficeNotifications } from '~/composables/useOfficeNotifications'

export const useOfficeDuties = () => {
  const { consultants } = useOffice()
  const { createOfficeAnnouncement, syncAnnouncementNotifications } = useOfficeNotifications()

  const duties = useState('office-duty-records', () => [])
  const dutyRequests = useState('office-duty-change-requests', () => [])
  const isHydrated = useState('office-duty-hydrated', () => false)

  const storageKeys = {
    duties: 'emlak-crm-office-duty-records',
    requests: 'emlak-crm-office-duty-change-requests',
  }

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
      localStorage.setItem(storageKeys.duties, JSON.stringify(duties.value))
      localStorage.setItem(storageKeys.requests, JSON.stringify(dutyRequests.value))
    } catch (error) {
      console.error('Nöbet kayıt hatası:', error)
    }
  }

  const hydrate = () => {
    if (!process.client || isHydrated.value) return

    const savedDuties = readStorage(storageKeys.duties, [])
    const savedRequests = readStorage(storageKeys.requests, [])

    duties.value = Array.isArray(savedDuties) ? savedDuties : []
    dutyRequests.value = Array.isArray(savedRequests) ? savedRequests : []

    isHydrated.value = true
  }

  hydrate()

  const formatDate = (value) => {
    if (!value) return '-'

    try {
      return new Date(value).toLocaleDateString('tr-TR')
    } catch (error) {
      return value
    }
  }

  const getDayName = (value) => {
    if (!value) return '-'

    try {
      return new Date(value).toLocaleDateString('tr-TR', { weekday: 'long' })
    } catch (error) {
      return '-'
    }
  }

  const createDutyPlan = (payload) => {
    hydrate()

    let createdCount = 0

    payload.consultantIds.forEach((consultantId) => {
      const consultant = consultants.value.find(item => String(item.id) === String(consultantId))
      if (!consultant) return

      const exists = duties.value.some(item => {
        return String(item.consultantId) === String(consultant.id) &&
          item.date === payload.date &&
          item.shiftType === payload.shiftType
      })

      if (exists) return

      const nextId = duties.value.length
        ? Math.max(...duties.value.map(item => Number(item.id || 0))) + 1
        : 1

      duties.value.unshift({
        id: nextId,
        consultantId: consultant.id,
        consultantName: consultant.fullName,
        consultantCode: consultant.code,
        workType: consultant.workType,
        status: 'Planlandı',
        date: payload.date,
        dayName: getDayName(payload.date),
        startTime: payload.startTime || '09:00',
        endTime: payload.endTime || '18:00',
        shiftType: payload.shiftType || 'Tam Gün',
        location: payload.location || 'Ofis',
        description: payload.description || '',
        brokerNote: '',
        consultantNote: '',
        notified: false,
        confirmedAt: '',
        completedAt: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      createdCount += 1
    })

    writeStorage()
    return createdCount
  }

  const updateDutyStatus = (dutyId, status) => {
    hydrate()

    const duty = duties.value.find(item => String(item.id) === String(dutyId))
    if (!duty) return

    duty.status = status
    duty.updatedAt = new Date().toISOString()

    if (status === 'Danışman Onayladı') {
      duty.confirmedAt = new Date().toLocaleDateString('tr-TR')
    }

    if (status === 'Tamamlandı') {
      duty.completedAt = new Date().toLocaleDateString('tr-TR')
    }

    writeStorage()
  }

  const updateDutyField = (dutyId, field, value) => {
    hydrate()

    const duty = duties.value.find(item => String(item.id) === String(dutyId))
    if (!duty) return

    duty[field] = value
    duty.updatedAt = new Date().toISOString()

    writeStorage()
  }

  const deleteDuty = (dutyId) => {
    hydrate()

    duties.value = duties.value.filter(item => String(item.id) !== String(dutyId))
    dutyRequests.value = dutyRequests.value.filter(item => String(item.dutyId) !== String(dutyId))

    writeStorage()
  }

  const getDutiesByConsultant = (consultantId) => {
    hydrate()

    return duties.value.filter(item => String(item.consultantId) === String(consultantId))
  }

  const notifyDuty = (dutyId) => {
    hydrate()

    const duty = duties.value.find(item => String(item.id) === String(dutyId))
    if (!duty) return ''

    createOfficeAnnouncement({
      title: `${duty.consultantName} nöbet görevi`,
      type: 'Nöbet',
      audience: 'Belirli Danışmanlar',
      date: 'Bugün',
      priority: 'Önemli',
      status: 'Yayınlandı',
      description: `Merhaba ${duty.consultantName}, size yeni bir nöbet görevi atanmıştır.

Tarih: ${formatDate(duty.date)}
Gün: ${duty.dayName}
Saat: ${duty.startTime} - ${duty.endTime}
Nöbet Türü: ${duty.shiftType}
Lokasyon: ${duty.location}

Lütfen nöbet görevinizi danışman panelinizden kontrol edip onaylayınız.`,
      channels: ['Sistem İçi', 'Mobil Bildirim'],
      requiresConfirmation: true,
      selectedConsultantIds: [duty.consultantId],
    })

    duty.notified = true
    duty.updatedAt = new Date().toISOString()

    syncAnnouncementNotifications()
    writeStorage()

    return `${duty.consultantName} için nöbet bildirimi gönderildi.`
  }

  const notifyMultipleDuties = (dutyIds) => {
    let count = 0

    dutyIds.forEach((id) => {
      const result = notifyDuty(id)
      if (result) count += 1
    })

    return count
  }

  const createDutyChangeRequest = ({ dutyId, reason, requestedDate }) => {
    hydrate()

    const duty = duties.value.find(item => String(item.id) === String(dutyId))
    if (!duty) return ''

    const nextId = dutyRequests.value.length
      ? Math.max(...dutyRequests.value.map(item => Number(item.id || 0))) + 1
      : 1

    dutyRequests.value.unshift({
      id: nextId,
      dutyId: duty.id,
      consultantId: duty.consultantId,
      consultantName: duty.consultantName,
      dutyDate: duty.date,
      dutyDayName: duty.dayName,
      dutyTime: `${duty.startTime} - ${duty.endTime}`,
      reason: reason || '',
      requestedDate: requestedDate || '',
      status: 'Talep Bekliyor',
      brokerNote: '',
      createdAt: new Date().toLocaleDateString('tr-TR'),
      updatedAt: new Date().toISOString(),
    })

    duty.status = 'Değişim Talebi'
    duty.consultantNote = reason || ''
    duty.updatedAt = new Date().toISOString()

    writeStorage()

    return 'Nöbet değişim talebiniz ofis yönetimine iletildi.'
  }

  const updateDutyRequestStatus = (requestId, status, brokerNote = '') => {
    hydrate()

    const request = dutyRequests.value.find(item => String(item.id) === String(requestId))
    if (!request) return

    request.status = status
    request.brokerNote = brokerNote
    request.updatedAt = new Date().toISOString()

    const duty = duties.value.find(item => String(item.id) === String(request.dutyId))

    if (duty) {
      duty.status = status === 'Onaylandı' ? 'Mazeretli' : 'Planlandı'
      duty.brokerNote = brokerNote
      duty.updatedAt = new Date().toISOString()
    }

    writeStorage()
  }

  const dutyStats = computed(() => {
    hydrate()

    const today = new Date().toISOString().slice(0, 10)

    return {
      total: duties.value.length,
      today: duties.value.filter(item => item.date === today).length,
      planned: duties.value.filter(item => item.status === 'Planlandı').length,
      confirmed: duties.value.filter(item => item.status === 'Danışman Onayladı').length,
      completed: duties.value.filter(item => item.status === 'Tamamlandı').length,
      absent: duties.value.filter(item => item.status === 'Gelmedi').length,
      excused: duties.value.filter(item => item.status === 'Mazeretli').length,
      requests: dutyRequests.value.filter(item => item.status === 'Talep Bekliyor').length,
    }
  })

  return {
    duties,
    dutyRequests,
    createDutyPlan,
    updateDutyStatus,
    updateDutyField,
    deleteDuty,
    getDutiesByConsultant,
    notifyDuty,
    notifyMultipleDuties,
    createDutyChangeRequest,
    updateDutyRequestStatus,
    dutyStats,
    formatDate,
  }
}


