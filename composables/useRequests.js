export const useRequests = () => {
  const storageKey = 'emlak-crm-shared-requests'

  const defaultRequests = [
    {
      id: 1,
      requestNo: 'TLP-1001',
      title: 'Gıda Çarşısı satılık dükkan arayan yatırımcı',
      requestType: 'Alıcı Talebi',
      transactionType: 'Satılık',
      propertyType: 'Dükkan',
      city: 'İzmir',
      district: 'Konak',
      neighborhood: 'Yenişehir',
      minBudget: 5000000,
      maxBudget: 12000000,
      minM2: 80,
      maxM2: 250,
      usagePurpose: 'Yatırım amaçlı ticari gayrimenkul',
      urgency: 'Sıcak',
      status: 'Aktif',
      customerVisibility: 'Gizli',
      customerName: 'Gizli Müşteri',
      customerPhone: '',
      ownerConsultantName: 'Sinan Tontaş',
      ownerConsultantPhone: '0 545 441 41 18',
      note: 'Kira getirisi güçlü, ana caddeye yakın portföyler öncelikli.',
      createdAt: '2026-06-24',
      expiresAt: '2026-07-24',
      matchInteractions: [],
    },
    {
      id: 2,
      requestNo: 'TLP-1002',
      title: 'Ayrancılar bölgesinde kiralık kurumsal mağaza talebi',
      requestType: 'Kiracı Talebi',
      transactionType: 'Kiralık',
      propertyType: 'Mağaza',
      city: 'İzmir',
      district: 'Torbalı',
      neighborhood: 'Ayrancılar',
      minBudget: 50000,
      maxBudget: 180000,
      minM2: 150,
      maxM2: 400,
      usagePurpose: 'Kurumsal perakende mağaza',
      urgency: 'Normal',
      status: 'Aktif',
      customerVisibility: 'Gizli',
      customerName: 'Kurumsal Firma',
      customerPhone: '',
      ownerConsultantName: 'Ofis Brokeri',
      ownerConsultantPhone: '',
      note: 'Çarşı merkezi, görünür cephe ve otopark avantajı aranıyor.',
      createdAt: '2026-06-24',
      expiresAt: '2026-08-24',
      matchInteractions: [],
    },
  ]

  const requests = useState('shared-requests', () => defaultRequests)

  const normalizeInteraction = (interaction = {}) => {
    return {
      id: interaction.id || Date.now(),
      requestId: interaction.requestId || '',
      propertyId: interaction.propertyId || '',
      propertyTitle: interaction.propertyTitle || '',
      matchScore: Number(interaction.matchScore || 0),
      requestConsultantName: interaction.requestConsultantName || '',
      requestConsultantPhone: interaction.requestConsultantPhone || '',
      portfolioConsultantName: interaction.portfolioConsultantName || '',
      portfolioConsultantPhone: interaction.portfolioConsultantPhone || '',
      contactMethod: interaction.contactMethod || 'Telefon',
      result: interaction.result || 'Görüşüldü',
      note: interaction.note || '',
      nextActionDate: interaction.nextActionDate || '',
      createdBy: interaction.createdBy || '',
      createdAt: interaction.createdAt || new Date().toISOString().slice(0, 10),
    }
  }

  const normalizeRequest = (request = {}) => {
    return {
      id: request.id || Date.now(),
      requestNo: request.requestNo || `TLP-${Date.now().toString().slice(-6)}`,
      title: request.title || '',
      requestType: request.requestType || 'Alıcı Talebi',
      transactionType: request.transactionType || 'Satılık',
      propertyType: request.propertyType || '',
      city: request.city || '',
      district: request.district || '',
      neighborhood: request.neighborhood || '',
      minBudget: Number(request.minBudget || 0),
      maxBudget: Number(request.maxBudget || 0),
      minM2: Number(request.minM2 || 0),
      maxM2: Number(request.maxM2 || 0),
      usagePurpose: request.usagePurpose || '',
      urgency: request.urgency || 'Normal',
      status: request.status || 'Aktif',
      customerVisibility: request.customerVisibility || 'Gizli',
      customerName: request.customerName || '',
      customerPhone: request.customerPhone || '',
      ownerConsultantName: request.ownerConsultantName || '',
      ownerConsultantPhone: request.ownerConsultantPhone || '',
      note: request.note || '',
      createdAt: request.createdAt || new Date().toISOString().slice(0, 10),
      expiresAt: request.expiresAt || '',
      matchInteractions: Array.isArray(request.matchInteractions)
        ? request.matchInteractions.map(normalizeInteraction)
        : [],
    }
  }

  const hydrateRequests = () => {
    if (!process.client) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        requests.value = Array.isArray(parsed) ? parsed.map(normalizeRequest) : defaultRequests
      } catch (error) {
        requests.value = defaultRequests
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(requests.value))
    }
  }

  const persistRequests = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(requests.value))
  }

  /**
   * Eşleştirme havuzu. Önceden beş ayrı localStorage anahtarını okuyup
   * title-city-district-price anahtarıyla dedupe ediyordu; portföy artık tek
   * store'da (useProperties) durduğu için o birleştirmeye gerek kalmadı.
   */
  const getPropertyPool = () => {
    const CLOSED = ['Sold', 'Rented', 'Cancelled', 'Passive', 'Expired']

    return useProperties().value
      .filter(item => !CLOSED.includes(item.status))
      .map(item => ({
        id: item.id,
        title: item.title,
        transactionType: item.listingType,
        propertyType: item.propertyType,
        city: item.city,
        district: item.district,
        neighborhood: item.neighborhood,
        price: Number(item.price || 0),
        m2: Number(item.netArea || item.grossArea || 0),
        consultantId: item.consultantId,
        status: item.status,
      }))
  }

  const textMatch = (a = '', b = '') => {
    if (!a || !b) return false

    return String(a).toLocaleLowerCase('tr-TR').trim() ===
      String(b).toLocaleLowerCase('tr-TR').trim()
  }

  const includesText = (a = '', b = '') => {
    if (!a || !b) return false

    return String(a).toLocaleLowerCase('tr-TR').includes(String(b).toLocaleLowerCase('tr-TR')) ||
      String(b).toLocaleLowerCase('tr-TR').includes(String(a).toLocaleLowerCase('tr-TR'))
  }

  const scoreMatch = (request, property) => {
    let score = 0
    const reasons = []

    if (textMatch(request.transactionType, property.transactionType) || includesText(property.transactionType, request.transactionType)) {
      score += 20
      reasons.push('İşlem tipi uygun')
    }

    if (textMatch(request.propertyType, property.propertyType) || includesText(property.propertyType, request.propertyType)) {
      score += 20
      reasons.push('Mülk tipi uygun')
    }

    if (textMatch(request.city, property.city)) {
      score += 15
      reasons.push('Şehir uygun')
    }

    if (textMatch(request.district, property.district)) {
      score += 20
      reasons.push('İlçe uygun')
    }

    if (textMatch(request.neighborhood, property.neighborhood) || includesText(property.neighborhood, request.neighborhood)) {
      score += 15
      reasons.push('Mahalle/bölge uygun')
    }

    if (property.price) {
      const minBudgetOk = !request.minBudget || property.price >= request.minBudget
      const maxBudgetOk = !request.maxBudget || property.price <= request.maxBudget

      if (minBudgetOk && maxBudgetOk) {
        score += 15
        reasons.push('Bütçe aralığında')
      }
    }

    if (property.m2) {
      const minM2Ok = !request.minM2 || property.m2 >= request.minM2
      const maxM2Ok = !request.maxM2 || property.m2 <= request.maxM2

      if (minM2Ok && maxM2Ok) {
        score += 10
        reasons.push('m² aralığında')
      }
    }

    return {
      score: Math.min(score, 100),
      reasons,
    }
  }

  const getMatchesForRequest = (request) => {
    return getPropertyPool()
      .map((property) => {
        const match = scoreMatch(request, property)

        return {
          ...property,
          matchScore: match.score,
          matchReasons: match.reasons,
        }
      })
      .filter(item => item.matchScore >= 40)
      .sort((a, b) => b.matchScore - a.matchScore)
  }

  const createRequest = (payload) => {
    const newRequest = normalizeRequest({
      id: Date.now(),
      requestNo: `TLP-${Date.now().toString().slice(-6)}`,
      ...payload,
      createdAt: new Date().toISOString().slice(0, 10),
      matchInteractions: [],
    })

    requests.value.unshift(newRequest)
    persistRequests()

    return newRequest
  }

  const updateRequest = (id, field, value) => {
    const request = requests.value.find(item => String(item.id) === String(id))
    if (!request) return

    if (['minBudget', 'maxBudget', 'minM2', 'maxM2'].includes(field)) {
      request[field] = Number(value || 0)
    } else {
      request[field] = value
    }

    persistRequests()
  }

  const deleteRequest = (id) => {
    requests.value = requests.value.filter(item => String(item.id) !== String(id))
    persistRequests()
  }

  const closeRequest = (id) => {
    const request = requests.value.find(item => String(item.id) === String(id))
    if (!request) return

    request.status = 'Kapandı'
    persistRequests()
  }

  const reopenRequest = (id) => {
    const request = requests.value.find(item => String(item.id) === String(id))
    if (!request) return

    request.status = 'Aktif'
    persistRequests()
  }

  const createMatchInteraction = (requestId, payload) => {
    const request = requests.value.find(item => String(item.id) === String(requestId))
    if (!request) return null

    if (!Array.isArray(request.matchInteractions)) {
      request.matchInteractions = []
    }

    const interaction = normalizeInteraction({
      id: Date.now(),
      requestId,
      ...payload,
      createdAt: new Date().toISOString().slice(0, 10),
    })

    request.matchInteractions.unshift(interaction)
    persistRequests()

    return interaction
  }

  const updateMatchInteraction = (requestId, interactionId, field, value) => {
    const request = requests.value.find(item => String(item.id) === String(requestId))
    if (!request?.matchInteractions) return

    const interaction = request.matchInteractions.find(item => String(item.id) === String(interactionId))
    if (!interaction) return

    interaction[field] = value
    persistRequests()
  }

  const deleteMatchInteraction = (requestId, interactionId) => {
    const request = requests.value.find(item => String(item.id) === String(requestId))
    if (!request?.matchInteractions) return

    request.matchInteractions = request.matchInteractions.filter(item => String(item.id) !== String(interactionId))
    persistRequests()
  }

  const getInteractionsForRequest = (requestId) => {
    const request = requests.value.find(item => String(item.id) === String(requestId))
    if (!request) return []

    return Array.isArray(request.matchInteractions)
      ? request.matchInteractions
      : []
  }

  const getInteractionStats = (requestId) => {
    const list = getInteractionsForRequest(requestId)

    return {
      total: list.length,
      contacted: list.filter(item => item.result === 'Görüşüldü').length,
      appointment: list.filter(item => item.result === 'Randevu Alındı').length,
      offer: list.filter(item => item.result === 'Teklif Aşamasında').length,
      deal: list.filter(item => item.result === 'İşleme Döndü').length,
      notSuitable: list.filter(item => item.result === 'Uygun Değil').length,
    }
  }

  const formatPrice = (value) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(Number(value || 0))
  }

  const requestStats = computed(() => {
    const allInteractions = requests.value.flatMap(item => item.matchInteractions || [])

    return {
      total: requests.value.length,
      active: requests.value.filter(item => item.status === 'Aktif').length,
      hot: requests.value.filter(item => item.urgency === 'Sıcak' || item.urgency === 'Acil').length,
      hiddenCustomer: requests.value.filter(item => item.customerVisibility === 'Gizli').length,
      closed: requests.value.filter(item => item.status === 'Kapandı').length,
      interactions: allInteractions.length,
      deals: allInteractions.filter(item => item.result === 'İşleme Döndü').length,
    }
  })

  return {
    requests,
    hydrateRequests,
    persistRequests,
    createRequest,
    updateRequest,
    deleteRequest,
    closeRequest,
    reopenRequest,
    getPropertyPool,
    getMatchesForRequest,
    scoreMatch,
    createMatchInteraction,
    updateMatchInteraction,
    deleteMatchInteraction,
    getInteractionsForRequest,
    getInteractionStats,
    formatPrice,
    requestStats,
  }
}
