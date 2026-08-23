/**
 * Ortak işlem görünümü — kendi store'u YOK.
 *
 * "Ortak işlem", iki veya daha fazla katılımcısı olan bir Deal'dir; ayrı bir varlık
 * değil. Bu composable useDeals'i o ölçüte göre süzer ve panelin beklediği alan
 * adlarına yansıtır.
 */
export const useJointTransactions = () => {
  const {
    deals,
    updateDeal,
    deleteDeal,
    setParticipantShare,
    createFromRequestMatch,
    formatPrice,
  } = useDeals()

  const num = value => Number(value || 0)

  const toTransaction = (deal) => {
    const closer = participantByRole(deal, 'Closer')
    const portfolioTaker = participantByRole(deal, 'PortfolioTaker')

    return {
      id: deal.id,
      transactionNo: deal.dealNo,
      source: deal.source,
      requestId: deal.requestId,
      requestNo: deal.requestNo,
      requestTitle: deal.requestTitle,
      interactionId: deal.interactionId,
      propertyId: deal.propertyId,
      propertyTitle: deal.propertyTitle,
      transactionType: deal.dealType,
      customerVisibility: deal.customerVisibility,
      customerName: deal.customerName,
      customerPhone: deal.customerPhone,

      requestConsultantId: closer?.consultantId || '',
      portfolioConsultantId: portfolioTaker?.consultantId || '',
      requestConsultantSharePercent: num(closer?.sharePercent),
      portfolioConsultantSharePercent: num(portfolioTaker?.sharePercent),
      requestConsultantCommission: num(closer?.shareAmount),
      portfolioConsultantCommission: num(portfolioTaker?.shareAmount),
      requestParticipantId: closer?.id || '',
      portfolioParticipantId: portfolioTaker?.id || '',

      estimatedAmount: deal.agreedAmount,
      commissionRate: deal.commissionRate,
      totalCommission: deal.grossCommission,
      officeShare: officeShareOf(deal),

      status: deal.status,
      dealStage: deal.stage,
      paymentStatus: deal.paymentStatus,
      note: deal.note,
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt,
    }
  }

  const transactions = computed(() => deals.value.filter(isJointDeal).map(toTransaction))

  const hydrateJointTransactions = () => {}
  const persistJointTransactions = () => {}

  const findByRequestInteraction = (requestId, interactionId) =>
    transactions.value.find(item =>
      String(item.requestId) === String(requestId) &&
      String(item.interactionId) === String(interactionId)) || null

  const createJointTransactionFromRequest = createFromRequestMatch

  const SHARE_FIELDS = {
    requestConsultantSharePercent: 'requestParticipantId',
    portfolioConsultantSharePercent: 'portfolioParticipantId',
  }

  const FIELD_MAP = {
    estimatedAmount: 'agreedAmount',
    totalCommission: 'grossCommission',
    dealStage: 'stage',
    transactionType: 'dealType',
  }

  const updateJointTransaction = (id, field, value) => {
    // Pay yüzdeleri katılımcı satırında durur
    const participantKey = SHARE_FIELDS[field]
    if (participantKey) {
      const transaction = transactions.value.find(item => String(item.id) === String(id))
      if (!transaction) return null
      return setParticipantShare(id, transaction[participantKey], value)
    }

    const NUMERIC = ['estimatedAmount', 'commissionRate', 'totalCommission']
    return updateDeal(id, FIELD_MAP[field] || field, NUMERIC.includes(field) ? num(value) : value)
  }

  const deleteJointTransaction = id => deleteDeal(id)

  const jointTransactionStats = computed(() => {
    const list = transactions.value

    return {
      total: list.length,
      preparation: list.filter(item => item.dealStage === 'PortfolioMatching').length,
      active: list.filter(item => !['Won', 'Cancelled'].includes(item.status)).length,
      completed: list.filter(item => item.status === 'Won').length,
      cancelled: list.filter(item => item.status === 'Cancelled').length,
      totalCommission: list.reduce((sum, item) => sum + num(item.totalCommission), 0),
    }
  })

  return {
    transactions,
    hydrateJointTransactions,
    persistJointTransactions,
    createJointTransaction: createFromRequestMatch,
    createJointTransactionFromRequest,
    findByRequestInteraction,
    updateJointTransaction,
    deleteJointTransaction,
    jointTransactionStats,
    formatPrice,
  }
}
