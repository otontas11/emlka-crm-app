export const useOfficePipeline = () => {
  const storageKey = 'emlak-crm-office-pipeline-processes'

  const defaultProcesses = [
    {
      id: 1,
      consultantId: 1,
      consultantName: 'Sinan Tontaş',
      customerName: 'Ahmet Yılmaz',
      customerPhone: '0532 000 00 00',
      processType: 'Satış',
      propertyTitle: 'Yenişehir Gıda Çarşısı Satılık Dükkan',
      location: 'İzmir / Konak / Yenişehir',
      budget: 12500000,
      offerAmount: 11800000,
      commissionPotential: 250000,
      stage: 'Teklif Alındı',
      status: 'Aktif',
      probability: 70,
      expectedCloseDate: '2026-07-15',
      source: 'Saha Çalışması',
      nextAction: 'Malik ile fiyat görüşmesi yapılacak.',
      nextActionDate: '2026-06-20',
      note: 'Alıcı ciddi, ödeme planı konuşulacak.',
      createdAt: '2026-06-10',
    },
    {
      id: 2,
      consultantId: 2,
      consultantName: 'Şems Bahar Çetin',
      customerName: 'Merve Demir',
      customerPhone: '0544 000 00 00',
      processType: 'Kiralama',
      propertyTitle: 'Bayraklı Mansuroğlu Kiralık Ofis',
      location: 'İzmir / Bayraklı / Mansuroğlu',
      budget: 40000,
      offerAmount: 38000,
      commissionPotential: 40000,
      stage: 'Sunum Yapıldı',
      status: 'Aktif',
      probability: 55,
      expectedCloseDate: '2026-06-28',
      source: 'Referans',
      nextAction: 'Kiracı adayı ile ikinci görüşme yapılacak.',
      nextActionDate: '2026-06-19',
      note: 'Kurumsal kiracı, karar süreci devam ediyor.',
      createdAt: '2026-06-12',
    },
    {
      id: 3,
      consultantId: 3,
      consultantName: 'Ali Rızahan Ülger',
      customerName: 'Hasan Kaya',
      customerPhone: '0555 000 00 00',
      processType: 'Satış',
      propertyTitle: 'Bornova Sarnıç Satılık Arsa',
      location: 'İzmir / Bornova / Sarnıç',
      budget: 8500000,
      offerAmount: 7900000,
      commissionPotential: 170000,
      stage: 'Fiyat Pazarlığı',
      status: 'Aksiyon Bekliyor',
      probability: 45,
      expectedCloseDate: '2026-07-05',
      source: 'Bölge Çalışması',
      nextAction: 'Malik ve alıcı arasında yeni teklif çalışılacak.',
      nextActionDate: '2026-06-18',
      note: 'Fiyat farkı yüksek, takip gerekiyor.',
      createdAt: '2026-06-08',
    },
  ]

  const processes = useState('office-pipeline-processes', () => defaultProcesses)

  const hydrateProcesses = () => {
    if (!process.client) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        processes.value = JSON.parse(saved)
      } catch (error) {
        processes.value = defaultProcesses
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(processes.value))
    }
  }

  const persistProcesses = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(processes.value))
  }

  const createPipelineProcess = (payload) => {
    const newProcess = {
      id: Date.now(),
      consultantId: payload.consultantId,
      consultantName: payload.consultantName,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      processType: payload.processType,
      propertyTitle: payload.propertyTitle,
      location: payload.location,
      budget: Number(payload.budget || 0),
      offerAmount: Number(payload.offerAmount || 0),
      commissionPotential: Number(payload.commissionPotential || 0),
      stage: payload.stage || 'Yeni Talep',
      status: payload.status || 'Aktif',
      probability: Number(payload.probability || 0),
      expectedCloseDate: payload.expectedCloseDate || '',
      source: payload.source || 'Ofis Kaydı',
      nextAction: payload.nextAction || '',
      nextActionDate: payload.nextActionDate || '',
      note: payload.note || '',
      createdAt: new Date().toISOString().slice(0, 10),
    }

    processes.value.unshift(newProcess)
    persistProcesses()

    return newProcess
  }

  const updatePipelineProcess = (id, field, value) => {
    const item = processes.value.find(process => String(process.id) === String(id))
    if (!item) return

    if (['budget', 'offerAmount', 'commissionPotential', 'probability'].includes(field)) {
      item[field] = Number(value || 0)
    } else {
      item[field] = value
    }

    persistProcesses()
  }

  const deletePipelineProcess = (id) => {
    processes.value = processes.value.filter(item => String(item.id) !== String(id))
    persistProcesses()
  }

  const today = () => new Date().toISOString().slice(0, 10)

  const isOverdue = (date) => {
    if (!date) return false
    return date < today()
  }

  const pipelineStats = computed(() => {
    const total = processes.value.length
    const active = processes.value.filter(item => item.status === 'Aktif').length
    const waitingAction = processes.value.filter(item => item.status === 'Aksiyon Bekliyor').length
    const offerStage = processes.value.filter(item => item.stage === 'Teklif Alındı' || item.stage === 'Fiyat Pazarlığı').length
    const closed = processes.value.filter(item => item.status === 'Kapandı').length
    const totalCommission = processes.value.reduce((sum, item) => sum + Number(item.commissionPotential || 0), 0)

    return {
      total,
      active,
      waitingAction,
      offerStage,
      closed,
      totalCommission,
    }
  })

  const formatPrice = (value) => {
    return new Intl.NumberFormat('tr-TR').format(Number(value || 0)) + ' ₺'
  }

  return {
    processes,
    hydrateProcesses,
    persistProcesses,
    createPipelineProcess,
    updatePipelineProcess,
    deletePipelineProcess,
    isOverdue,
    pipelineStats,
    formatPrice,
  }
}
