export const useJointTransactions = () => {
  const storageKey = 'emlak-crm-joint-transactions'

  const transactions = useState('joint-transactions', () => [])

  const numberValue = (value) => Number(value || 0)

  const calculateAmounts = (transaction = {}) => {
    const estimatedAmount = numberValue(transaction.estimatedAmount)
    const commissionRate = numberValue(transaction.commissionRate)

    const totalCommission = estimatedAmount > 0 && commissionRate > 0
      ? Math.round((estimatedAmount * commissionRate) / 100)
      : numberValue(transaction.totalCommission)

    const requestShare = numberValue(transaction.requestConsultantSharePercent || 50)
    const portfolioShare = numberValue(transaction.portfolioConsultantSharePercent || 50)

    return {
      totalCommission,
      requestConsultantCommission: Math.round((totalCommission * requestShare) / 100),
      portfolioConsultantCommission: Math.round((totalCommission * portfolioShare) / 100),
    }
  }

  const normalizeTransaction = (transaction = {}) => {
    const calculated = calculateAmounts(transaction)

    return {
      id: transaction.id || Date.now(),
      transactionNo: transaction.transactionNo || `ORT-${Date.now().toString().slice(-6)}`,
      source: transaction.source || 'Talep Eşleşmesi',
      requestId: transaction.requestId || '',
      requestNo: transaction.requestNo || '',
      requestTitle: transaction.requestTitle || '',
      interactionId: transaction.interactionId || '',
      propertyId: transaction.propertyId || '',
      propertyTitle: transaction.propertyTitle || '',
      transactionType: transaction.transactionType || '',
      propertyType: transaction.propertyType || '',
      customerVisibility: transaction.customerVisibility || 'Gizli',
      customerName: transaction.customerName || '',
      customerPhone: transaction.customerPhone || '',
      requestConsultantName: transaction.requestConsultantName || '',
      requestConsultantPhone: transaction.requestConsultantPhone || '',
      portfolioConsultantName: transaction.portfolioConsultantName || '',
      portfolioConsultantPhone: transaction.portfolioConsultantPhone || '',
      estimatedAmount: numberValue(transaction.estimatedAmount),
      commissionRate: numberValue(transaction.commissionRate || 2),
      totalCommission: calculated.totalCommission,
      requestConsultantSharePercent: numberValue(transaction.requestConsultantSharePercent || 50),
      portfolioConsultantSharePercent: numberValue(transaction.portfolioConsultantSharePercent || 50),
      requestConsultantCommission: calculated.requestConsultantCommission,
      portfolioConsultantCommission: calculated.portfolioConsultantCommission,
      status: transaction.status || 'Hazırlık',
      dealStage: transaction.dealStage || 'İşleme Döndü',
      paymentStatus: transaction.paymentStatus || 'Bekliyor',
      note: transaction.note || '',
      createdAt: transaction.createdAt || new Date().toISOString().slice(0, 10),
      updatedAt: transaction.updatedAt || new Date().toISOString().slice(0, 10),
    }
  }

  const hydrateJointTransactions = () => {
    if (!process.client) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        transactions.value = Array.isArray(parsed)
          ? parsed.map(normalizeTransaction)
          : []
      } catch (error) {
        transactions.value = []
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(transactions.value))
    }
  }

  const persistJointTransactions = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(transactions.value))
  }

  const findByRequestInteraction = (requestId, interactionId) => {
    return transactions.value.find(item => {
      return String(item.requestId) === String(requestId) &&
        String(item.interactionId) === String(interactionId)
    }) || null
  }

  const createJointTransaction = (payload = {}) => {
    const existing = findByRequestInteraction(payload.requestId, payload.interactionId)

    if (existing) return existing

    const transaction = normalizeTransaction({
      id: Date.now(),
      transactionNo: `ORT-${Date.now().toString().slice(-6)}`,
      ...payload,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    })

    transactions.value.unshift(transaction)
    persistJointTransactions()

    return transaction
  }

  const createJointTransactionFromRequest = (request, interaction, property = null) => {
    if (!request || !interaction) return null

    return createJointTransaction({
      source: 'Talep Eşleşmesi',
      requestId: request.id,
      requestNo: request.requestNo,
      requestTitle: request.title,
      interactionId: interaction.id,
      propertyId: interaction.propertyId || property?.id || '',
      propertyTitle: interaction.propertyTitle || property?.title || '',
      transactionType: request.transactionType,
      propertyType: request.propertyType,
      customerVisibility: request.customerVisibility,
      customerName: request.customerVisibility === 'Açık' ? request.customerName : 'Gizli Müşteri',
      customerPhone: request.customerVisibility === 'Açık' ? request.customerPhone : '',
      requestConsultantName: interaction.requestConsultantName || request.ownerConsultantName,
      requestConsultantPhone: interaction.requestConsultantPhone || request.ownerConsultantPhone,
      portfolioConsultantName: interaction.portfolioConsultantName || property?.consultantName || '',
      portfolioConsultantPhone: interaction.portfolioConsultantPhone || property?.consultantPhone || '',
      estimatedAmount: property?.price || 0,
      commissionRate: 2,
      requestConsultantSharePercent: 50,
      portfolioConsultantSharePercent: 50,
      status: 'Hazırlık',
      dealStage: 'İşleme Döndü',
      paymentStatus: 'Bekliyor',
      note: interaction.note || 'Talep eşleşmesi işleme döndüğü için otomatik ortak işlem kaydı açıldı.',
    })
  }

  const updateJointTransaction = (id, field, value) => {
    const transaction = transactions.value.find(item => String(item.id) === String(id))
    if (!transaction) return null

    transaction[field] = value

    if ([
      'estimatedAmount',
      'commissionRate',
      'totalCommission',
      'requestConsultantSharePercent',
      'portfolioConsultantSharePercent',
    ].includes(field)) {
      transaction.estimatedAmount = numberValue(transaction.estimatedAmount)
      transaction.commissionRate = numberValue(transaction.commissionRate)
      transaction.totalCommission = numberValue(transaction.totalCommission)
      transaction.requestConsultantSharePercent = numberValue(transaction.requestConsultantSharePercent)
      transaction.portfolioConsultantSharePercent = numberValue(transaction.portfolioConsultantSharePercent)

      const calculated = calculateAmounts(transaction)

      transaction.totalCommission = calculated.totalCommission
      transaction.requestConsultantCommission = calculated.requestConsultantCommission
      transaction.portfolioConsultantCommission = calculated.portfolioConsultantCommission
    }

    transaction.updatedAt = new Date().toISOString().slice(0, 10)
    persistJointTransactions()

    return transaction
  }

  const deleteJointTransaction = (id) => {
    transactions.value = transactions.value.filter(item => String(item.id) !== String(id))
    persistJointTransactions()
  }

  const formatPrice = (value) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0,
    }).format(Number(value || 0))
  }

  const jointTransactionStats = computed(() => {
    return {
      total: transactions.value.length,
      preparation: transactions.value.filter(item => item.status === 'Hazırlık').length,
      active: transactions.value.filter(item => !['Tamamlandı', 'İptal'].includes(item.status)).length,
      completed: transactions.value.filter(item => item.status === 'Tamamlandı').length,
      cancelled: transactions.value.filter(item => item.status === 'İptal').length,
      totalCommission: transactions.value.reduce((sum, item) => {
        return sum + numberValue(item.totalCommission)
      }, 0),
    }
  })

  return {
    transactions,
    hydrateJointTransactions,
    persistJointTransactions,
    createJointTransaction,
    createJointTransactionFromRequest,
    findByRequestInteraction,
    updateJointTransaction,
    deleteJointTransaction,
    formatPrice,
    jointTransactionStats,
  }
}