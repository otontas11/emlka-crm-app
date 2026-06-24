import { useOffice } from '~/composables/useOffice'

export const useOfficeNotifications = () => {
  const { consultants, announcements } = useOffice()

  const notifications = useState('office-notifications', () => [])
  const announcementReads = useState('office-announcement-reads', () => [])
  const announcementConfirmations = useState('office-announcement-confirmations', () => [])
  const isHydrated = useState('office-notifications-hydrated', () => false)

  const storageKeys = {
    announcements: 'emlak-crm-office-announcements',
    notifications: 'emlak-crm-office-notifications',
    reads: 'emlak-crm-office-announcement-reads',
    confirmations: 'emlak-crm-office-announcement-confirmations',
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

  const writeStorage = (key, value) => {
    if (!process.client) return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Storage kayıt hatası:', error)
    }
  }

  const hydrate = () => {
    if (!process.client || isHydrated.value) return

    const savedAnnouncements = readStorage(storageKeys.announcements, null)
    const savedNotifications = readStorage(storageKeys.notifications, null)
    const savedReads = readStorage(storageKeys.reads, null)
    const savedConfirmations = readStorage(storageKeys.confirmations, null)

    if (Array.isArray(savedAnnouncements)) {
      announcements.value = savedAnnouncements
    }

    if (Array.isArray(savedNotifications)) {
      notifications.value = savedNotifications
    }

    if (Array.isArray(savedReads)) {
      announcementReads.value = savedReads
    }

    if (Array.isArray(savedConfirmations)) {
      announcementConfirmations.value = savedConfirmations
    }

    isHydrated.value = true
  }

  const persist = () => {
    writeStorage(storageKeys.announcements, announcements.value)
    writeStorage(storageKeys.notifications, notifications.value)
    writeStorage(storageKeys.reads, announcementReads.value)
    writeStorage(storageKeys.confirmations, announcementConfirmations.value)
  }

  hydrate()

  const resolveRecipients = (audience = 'Tüm Ofis', selectedConsultantIds = []) => {
    const selectedIds = selectedConsultantIds.map(String)

    if (audience === 'Belirli Danışmanlar') {
      return consultants.value.filter(item => selectedIds.includes(String(item.id)))
    }

    if (audience === 'Aktif Danışmanlar') {
      return consultants.value.filter(item => item.status === 'Aktif')
    }

    if (audience === 'Aday Danışmanlar') {
      return consultants.value.filter(item => item.status === 'Aday')
    }

    if (audience === 'SGK’lı Danışmanlar') {
      return consultants.value.filter(item => item.workType === 'SGK’lı Danışman')
    }

    if (audience === 'Bağ-Kur’lu Danışmanlar') {
      return consultants.value.filter(item => item.workType === 'Bağ-Kur’lu Danışman')
    }

    if (audience === 'Yönetim') {
      return consultants.value.filter(item => item.code === 'PWA-001')
    }

    return consultants.value
  }

  const createNotificationsForAnnouncement = (announcement) => {
    if (!announcement) return

    const status = announcement.status || 'Yayınlandı'
    if (status !== 'Yayınlandı') return

    const recipients = resolveRecipients(
      announcement.audience || 'Tüm Ofis',
      announcement.selectedConsultantIds || []
    )

    let createdCount = 0

    recipients.forEach((consultant) => {
      const alreadyExists = notifications.value.some(item => {
        return String(item.announcementId) === String(announcement.id) &&
          String(item.consultantId) === String(consultant.id)
      })

      if (alreadyExists) return

      const nextId = notifications.value.length
        ? Math.max(...notifications.value.map(item => Number(item.id || 0))) + 1
        : 1

      const channels = Array.isArray(announcement.channels) && announcement.channels.length
        ? announcement.channels
        : ['Sistem İçi']

      notifications.value.unshift({
        id: nextId,
        announcementId: announcement.id,
        consultantId: consultant.id,
        consultantName: consultant.fullName,
        title: announcement.title,
        description: announcement.description || '',
        type: announcement.type || 'Duyuru',
        priority: announcement.priority || 'Normal',
        audience: announcement.audience || 'Tüm Ofis',
        channels,
        requiresConfirmation: Boolean(announcement.requiresConfirmation),
        isRead: false,
        isConfirmed: false,
        createdAt: announcement.createdAt || new Date().toISOString(),
        systemStatus: channels.includes('Sistem İçi') ? 'Bildirim oluşturuldu' : 'Pasif',
        mobileStatus: channels.includes('Mobil Bildirim') ? 'Gönderim kuyruğuna alındı' : 'Pasif',
        whatsappStatus: channels.includes('WhatsApp Mesajı Hazırla') ? 'WhatsApp mesaj taslağı hazırlandı' : 'Pasif',
      })

      createdCount += 1
    })

    if (createdCount > 0) {
      persist()
    }
  }

  const syncAnnouncementNotifications = () => {
    hydrate()

    announcements.value.forEach((announcement) => {
      createNotificationsForAnnouncement(announcement)
    })

    persist()
  }

  const createOfficeAnnouncement = (form) => {
    hydrate()

    const nextId = announcements.value.length
      ? Math.max(...announcements.value.map(item => Number(item.id || 0))) + 1
      : 1

    const announcement = {
      id: nextId,
      title: form.title,
      type: form.type || 'Duyuru',
      date: form.date || 'Bugün',
      audience: form.audience || 'Tüm Ofis',
      priority: form.priority || 'Normal',
      description: form.description || '',
      status: form.status || 'Yayınlandı',
      channels: Array.isArray(form.channels) && form.channels.length ? [...form.channels] : ['Sistem İçi'],
      requiresConfirmation: Boolean(form.requiresConfirmation),
      selectedConsultantIds: Array.isArray(form.selectedConsultantIds) ? [...form.selectedConsultantIds] : [],
      createdAt: new Date().toISOString(),
    }

    announcements.value.unshift(announcement)
    createNotificationsForAnnouncement(announcement)
    persist()

    return announcement
  }

  const deleteAnnouncementWithNotifications = (announcementId) => {
    hydrate()

    announcements.value = announcements.value.filter(item => String(item.id) !== String(announcementId))
    notifications.value = notifications.value.filter(item => String(item.announcementId) !== String(announcementId))
    announcementReads.value = announcementReads.value.filter(item => String(item.announcementId) !== String(announcementId))
    announcementConfirmations.value = announcementConfirmations.value.filter(item => String(item.announcementId) !== String(announcementId))

    persist()
  }

  const markNotificationRead = (notificationId) => {
    hydrate()

    const notification = notifications.value.find(item => String(item.id) === String(notificationId))
    if (!notification) return

    notification.isRead = true
    notification.readAt = new Date().toISOString()

    const exists = announcementReads.value.some(item => {
      return String(item.announcementId) === String(notification.announcementId) &&
        String(item.consultantId) === String(notification.consultantId)
    })

    if (!exists) {
      announcementReads.value.unshift({
        id: Date.now(),
        announcementId: notification.announcementId,
        consultantId: notification.consultantId,
        consultantName: notification.consultantName,
        readAt: notification.readAt,
      })
    }

    persist()
  }

  const confirmNotification = (notificationId) => {
    hydrate()

    const notification = notifications.value.find(item => String(item.id) === String(notificationId))
    if (!notification) return

    notification.isRead = true
    notification.isConfirmed = true
    notification.readAt = notification.readAt || new Date().toISOString()
    notification.confirmedAt = new Date().toISOString()

    const readExists = announcementReads.value.some(item => {
      return String(item.announcementId) === String(notification.announcementId) &&
        String(item.consultantId) === String(notification.consultantId)
    })

    if (!readExists) {
      announcementReads.value.unshift({
        id: Date.now(),
        announcementId: notification.announcementId,
        consultantId: notification.consultantId,
        consultantName: notification.consultantName,
        readAt: notification.readAt,
      })
    }

    const confirmExists = announcementConfirmations.value.some(item => {
      return String(item.announcementId) === String(notification.announcementId) &&
        String(item.consultantId) === String(notification.consultantId)
    })

    if (!confirmExists) {
      announcementConfirmations.value.unshift({
        id: Date.now() + 1,
        announcementId: notification.announcementId,
        consultantId: notification.consultantId,
        consultantName: notification.consultantName,
        confirmedAt: notification.confirmedAt,
      })
    }

    persist()
  }

  const recipientSummary = (announcementId) => {
    hydrate()

    const list = notifications.value.filter(item => String(item.announcementId) === String(announcementId))
    const total = list.length
    const read = list.filter(item => item.isRead).length
    const confirmed = list.filter(item => item.isConfirmed).length
    const unread = total - read

    return {
      total,
      read,
      unread,
      confirmed,
    }
  }

  const recipientList = (announcementId) => {
    hydrate()
    return notifications.value.filter(item => String(item.announcementId) === String(announcementId))
  }

  const getConsultantNotifications = (consultantId) => {
    hydrate()
    syncAnnouncementNotifications()

    return notifications.value.filter(item => String(item.consultantId) === String(consultantId))
  }

  const unreadNotificationCount = computed(() => {
    hydrate()
    return notifications.value.filter(item => !item.isRead).length
  })

  return {
    notifications,
    announcementReads,
    announcementConfirmations,
    createOfficeAnnouncement,
    createNotificationsForAnnouncement,
    syncAnnouncementNotifications,
    deleteAnnouncementWithNotifications,
    markNotificationRead,
    confirmNotification,
    recipientSummary,
    recipientList,
    getConsultantNotifications,
    unreadNotificationCount,
  }
}


