/**
 * İşlem (Deal) deposu — TEK kaynak.
 *
 * Önceden aynı iş üç yerde modellenmişti:
 *   - useOfficePipeline.processes      (ofis pipeline ekranı)
 *   - useJointTransactions.transactions (iki danışmanlı ortak işlem)
 *   - useOffice().pipelines             (dashboard için ayrı statik dizi)
 *
 * Üçü de "bir müşteri + bir portföy + aşama + komisyon paylaşımı" demekti. Fark
 * yalnızca kaç danışmanın pay aldığıydı; o da artık `participants` listesinde durur
 * (plan §7.4: Deal + DealParticipant).
 */
const STORAGE_KEY = 'emlak-crm-deals'

const num = value => Number(value || 0)

const newId = () =>
  import.meta.client && crypto?.randomUUID ? crypto.randomUUID() : `tmp-${Date.now()}`

const fromLabel = (map, value, fallback) => {
  if (!value) return fallback
  if (map[value]) return value
  const hit = Object.entries(map).find(([, label]) => label === value)
  return hit ? hit[0] : fallback
}

export const normalizeParticipant = (raw = {}) => ({
  id: raw.id || newId(),
  consultantId: raw.consultantId ? String(raw.consultantId) : '',
  role: fromLabel(DealParticipantRole, raw.role, 'Closer'),
  sharePercent: num(raw.sharePercent),
  shareAmount: num(raw.shareAmount),
  isExternal: Boolean(raw.isExternal),
  externalName: raw.externalName || '',
})

export const normalizeDeal = (raw = {}) => {
  const grossCommission = num(raw.grossCommission ?? raw.commission ?? raw.commissionPotential ?? raw.totalCommission)
  const participants = (Array.isArray(raw.participants) ? raw.participants : []).map(normalizeParticipant)

  // Pay yüzdesi verilmiş ama tutar boşsa brütten hesapla
  const withAmounts = participants.map(participant => ({
    ...participant,
    shareAmount: participant.shareAmount || Math.round((grossCommission * participant.sharePercent) / 100),
  }))

  return {
    id: raw.id || newId(),
    dealNo: raw.dealNo || raw.transactionNo || `ISL-${String(Date.now()).slice(-6)}`,

    dealType: fromLabel(DealType, raw.dealType || raw.processType || raw.transactionType, 'Sale'),
    stage: fromLabel(DealStage, raw.stage || raw.dealStage, 'NewRequest'),
    status: fromLabel(DealStatus, raw.status, 'Active'),
    source: fromLabel(DealSource, raw.source, 'OfficeRecord'),
    priority: fromLabel(Priority, raw.priority, 'Normal'),

    propertyId: raw.propertyId ? String(raw.propertyId) : '',
    propertyTitle: raw.propertyTitle || raw.property || '',
    location: raw.location || '',

    customerId: raw.customerId ? String(raw.customerId) : '',
    customerName: raw.customerName || raw.customer || '',
    customerPhone: raw.customerPhone || '',
    customerVisibility: fromLabel(CustomerVisibility, raw.customerVisibility, 'Open'),

    // talep eşleşmesinden doğduysa izini koru
    requestId: raw.requestId ? String(raw.requestId) : '',
    requestNo: raw.requestNo || '',
    requestTitle: raw.requestTitle || '',
    interactionId: raw.interactionId ? String(raw.interactionId) : '',

    budget: num(raw.budget),
    offerAmount: num(raw.offerAmount),
    agreedAmount: num(raw.agreedAmount ?? raw.estimatedAmount ?? raw.amount),
    currency: raw.currency || 'TRY',
    commissionRate: num(raw.commissionRate),
    grossCommission,

    probability: num(raw.probability),
    expectedCloseDate: raw.expectedCloseDate || '',
    closedAt: raw.closedAt || '',

    nextAction: raw.nextAction || '',
    nextActionDate: raw.nextActionDate || '',
    note: raw.note || '',

    ownerConsultantId: raw.ownerConsultantId ? String(raw.ownerConsultantId) : String(raw.consultantId || ''),
    visibility: fromLabel(Visibility, raw.visibility, 'Office'),
    paymentStatus: fromLabel(PaymentStatus, raw.paymentStatus, 'Pending'),

    participants: withAmounts,
    createdAt: raw.createdAt || new Date().toISOString().slice(0, 10),
    updatedAt: raw.updatedAt || new Date().toISOString().slice(0, 10),
  }
}

/** Danışmanlara dağıtılmayan kalan = ofis payı. */
export const officeShareOf = (deal) =>
  Math.max(deal.grossCommission - deal.participants.reduce((sum, p) => sum + num(p.shareAmount), 0), 0)

export const participantByRole = (deal, role) =>
  deal.participants.find(item => item.role === role) || null

export const isJointDeal = deal =>
  deal.participants.filter(item => item.consultantId || item.isExternal).length > 1

let watchStarted = false

export const useDeals = () => {
  const deals = useState('deals', () => [])

  const persist = () => {
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(deals.value))
  }

  if (import.meta.client) {
    if (!deals.value.length) {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        deals.value = Array.isArray(saved) ? saved.map(normalizeDeal) : []
      } catch {
        deals.value = []
      }
    }

    if (!watchStarted) {
      watch(deals, () => persist(), { deep: true })
      watchStarted = true
    }
  }

  const createDeal = (payload = {}) => {
    const deal = normalizeDeal({ ...payload, id: payload.id || newId() })
    deals.value.unshift(deal)
    persist()
    return deal
  }

  const getDealById = id => deals.value.find(item => String(item.id) === String(id)) || null

  const updateDeal = (id, fieldOrPayload, value = null) => {
    const index = deals.value.findIndex(item => String(item.id) === String(id))
    if (index === -1) return null

    const patch = typeof fieldOrPayload === 'string' ? { [fieldOrPayload]: value } : fieldOrPayload

    deals.value[index] = normalizeDeal({
      ...deals.value[index],
      ...patch,
      id: deals.value[index].id,
      createdAt: deals.value[index].createdAt,
      updatedAt: new Date().toISOString().slice(0, 10),
    })

    persist()
    return deals.value[index]
  }

  const deleteDeal = (id) => {
    deals.value = deals.value.filter(item => String(item.id) !== String(id))
    persist()
  }

  const setParticipantShare = (dealId, participantId, sharePercent) => {
    const deal = getDealById(dealId)
    if (!deal) return null

    return updateDeal(dealId, {
      participants: deal.participants.map(item =>
        String(item.id) === String(participantId)
          ? { ...item, sharePercent: num(sharePercent), shareAmount: 0 }
          : item
      ),
    })
  }

  /** Talep eşleşmesi işleme döndüğünde iki danışmanlı işlem açar. */
  const createFromRequestMatch = (request, interaction, property = null) => {
    if (!request || !interaction) return null

    const existing = deals.value.find(item =>
      String(item.requestId) === String(request.id) &&
      String(item.interactionId) === String(interaction.id))

    if (existing) return existing

    return createDeal({
      source: 'RequestMatch',
      stage: 'PortfolioMatching',
      status: 'Active',
      requestId: request.id,
      requestNo: request.requestNo,
      requestTitle: request.title,
      interactionId: interaction.id,
      propertyId: interaction.propertyId || property?.id || '',
      propertyTitle: interaction.propertyTitle || property?.title || '',
      dealType: request.transactionType === 'Rent' ? 'Rent' : 'Sale',
      customerVisibility: request.customerVisibility,
      customerName: request.customerVisibility === 'Open' ? request.customerName : 'Gizli Müşteri',
      customerPhone: request.customerVisibility === 'Open' ? request.customerPhone : '',
      agreedAmount: property?.price || 0,
      commissionRate: 2,
      grossCommission: Math.round(((property?.price || 0) * 2) / 100),
      ownerConsultantId: interaction.requestConsultantId || '',
      note: interaction.note || 'Talep eşleşmesi işleme döndüğü için otomatik işlem kaydı açıldı.',
      participants: [
        { consultantId: interaction.requestConsultantId, role: 'Closer', sharePercent: 50 },
        { consultantId: interaction.portfolioConsultantId, role: 'PortfolioTaker', sharePercent: 50 },
      ],
    })
  }

  const dealStats = computed(() => {
    const list = deals.value
    const CLOSED = ['Won', 'Lost', 'Cancelled']

    return {
      total: list.length,
      active: list.filter(item => !CLOSED.includes(item.status)).length,
      waitingAction: list.filter(item => item.status === 'ActionRequired').length,
      offerStage: list.filter(item => ['OfferReceived', 'Negotiating'].includes(item.stage)).length,
      closed: list.filter(item => item.status === 'Won').length,
      lost: list.filter(item => item.status === 'Lost').length,
      critical: list.filter(item => item.priority === 'High' || item.priority === 'Urgent').length,
      joint: list.filter(isJointDeal).length,
      totalCommission: list.reduce((sum, item) => sum + num(item.grossCommission), 0),
      officeShare: list.reduce((sum, item) => sum + officeShareOf(item), 0),
    }
  })

  const dealsOfConsultant = consultantId =>
    deals.value.filter(item =>
      String(item.ownerConsultantId) === String(consultantId) ||
      item.participants.some(p => String(p.consultantId) === String(consultantId)))

  const formatPrice = value =>
    `${new Intl.NumberFormat('tr-TR').format(num(value))} ₺`

  return {
    deals,
    createDeal,
    getDealById,
    updateDeal,
    deleteDeal,
    setParticipantShare,
    createFromRequestMatch,
    dealsOfConsultant,
    dealStats,
    formatPrice,
  }
}
