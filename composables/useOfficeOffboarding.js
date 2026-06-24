export const useOfficeOffboarding = () => {
  const storageKey = 'emlak-crm-office-offboarding-records'

  const defaultRecords = [
    {
      id: 1,
      consultantId: 4,
      consultantName: 'Gökhan Yüksel',
      leaveDate: '2026-06-20',
      reason: 'Kendi isteğiyle ayrıldı',
      status: 'Devam Ediyor',
      handoverConsultantId: 1,
      handoverConsultantName: 'Sinan Tontaş',
      accessStatus: 'Kapatılacak',
      dataStatus: 'Yedeklenecek',
      customerTransferStatus: 'Devredilecek',
      listingTransferStatus: 'Devredilecek',
      pipelineTransferStatus: 'Kontrol Edilecek',
      financeStatus: 'Hesaplaşma Bekliyor',
      documentStatus: 'Arşivlenecek',
      customerCount: 8,
      listingCount: 3,
      openProcessCount: 2,
      pendingCommissionAmount: 0,
      note: 'Açık süreçler broker kontrolünde yeni danışmana aktarılacak.',
      createdAt: '2026-06-20',
    },
  ]

  const offboardingRecords = useState('office-offboarding-records', () => defaultRecords)

  const hydrateOffboarding = () => {
    if (!process.client) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        offboardingRecords.value = JSON.parse(saved)
      } catch (error) {
        offboardingRecords.value = defaultRecords
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(offboardingRecords.value))
    }
  }

  const persistOffboarding = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(offboardingRecords.value))
  }

  const createOffboardingRecord = (payload) => {
    const newRecord = {
      id: Date.now(),
      consultantId: payload.consultantId,
      consultantName: payload.consultantName,
      leaveDate: payload.leaveDate || new Date().toISOString().slice(0, 10),
      reason: payload.reason || 'Belirtilmedi',
      status: payload.status || 'Devam Ediyor',
      handoverConsultantId: payload.handoverConsultantId || '',
      handoverConsultantName: payload.handoverConsultantName || '',
      accessStatus: payload.accessStatus || 'Kapatılacak',
      dataStatus: payload.dataStatus || 'Yedeklenecek',
      customerTransferStatus: payload.customerTransferStatus || 'Devredilecek',
      listingTransferStatus: payload.listingTransferStatus || 'Devredilecek',
      pipelineTransferStatus: payload.pipelineTransferStatus || 'Kontrol Edilecek',
      financeStatus: payload.financeStatus || 'Hesaplaşma Bekliyor',
      documentStatus: payload.documentStatus || 'Arşivlenecek',
      customerCount: Number(payload.customerCount || 0),
      listingCount: Number(payload.listingCount || 0),
      openProcessCount: Number(payload.openProcessCount || 0),
      pendingCommissionAmount: Number(payload.pendingCommissionAmount || 0),
      note: payload.note || '',
      createdAt: new Date().toISOString().slice(0, 10),
    }

    offboardingRecords.value.unshift(newRecord)
    persistOffboarding()

    return newRecord
  }

  const updateOffboardingRecord = (id, field, value) => {
    const record = offboardingRecords.value.find(item => String(item.id) === String(id))
    if (!record) return

    if (
      [
        'customerCount',
        'listingCount',
        'openProcessCount',
        'pendingCommissionAmount',
      ].includes(field)
    ) {
      record[field] = Number(value || 0)
    } else {
      record[field] = value
    }

    persistOffboarding()
  }

  const deleteOffboardingRecord = (id) => {
    offboardingRecords.value = offboardingRecords.value.filter(item => String(item.id) !== String(id))
    persistOffboarding()
  }

  const completeOffboardingRecord = (id) => {
    const record = offboardingRecords.value.find(item => String(item.id) === String(id))
    if (!record) return

    record.status = 'Tamamlandı'
    record.accessStatus = 'Kapatıldı'
    record.dataStatus = 'Yedeklendi'
    record.customerTransferStatus = 'Devredildi'
    record.listingTransferStatus = 'Devredildi'
    record.pipelineTransferStatus = 'Devredildi'
    record.financeStatus = 'Kapatıldı'
    record.documentStatus = 'Arşivlendi'

    persistOffboarding()
  }

  const offboardingStats = computed(() => {
    const total = offboardingRecords.value.length
    const active = offboardingRecords.value.filter(item => item.status === 'Devam Ediyor').length
    const completed = offboardingRecords.value.filter(item => item.status === 'Tamamlandı').length
    const accessWaiting = offboardingRecords.value.filter(item => item.accessStatus !== 'Kapatıldı').length
    const transferWaiting = offboardingRecords.value.filter(item => {
      return item.customerTransferStatus !== 'Devredildi' ||
        item.listingTransferStatus !== 'Devredildi' ||
        item.pipelineTransferStatus !== 'Devredildi'
    }).length

    return {
      total,
      active,
      completed,
      accessWaiting,
      transferWaiting,
    }
  })

  const formatPrice = (value) => {
    return new Intl.NumberFormat('tr-TR').format(Number(value || 0)) + ' ₺'
  }

  return {
    offboardingRecords,
    hydrateOffboarding,
    persistOffboarding,
    createOffboardingRecord,
    updateOffboardingRecord,
    deleteOffboardingRecord,
    completeOffboardingRecord,
    offboardingStats,
    formatPrice,
  }
}
