export const useOfficeCommissions = () => {
  const storageKey = 'emlak-crm-office-commissions'
  const policyStorageKey = 'emlak-crm-office-commission-policy'

  const defaultPolicy = {
    periodMode: 'Takvim Yılı',
    defaultSeniorityMode: 'Ofis Başlangıcına Göre',
    targetBase: 'Brüt Komisyon',
    allowConsultantManualStartPercent: true,
    allowPreviousOfficeExperience: true,
    startingPercent: 55,
    documentsCompletedPercent: 60,
    firstYearPercent: 65,
    secondYearPercent: 70,
    thirdYearPercent: 75,
    topPreviousYearStartPercent: 80,
    targets: [
      { id: 1, title: '1. Hedef', amount: 400000, percent: 70 },
      { id: 2, title: '2. Hedef', amount: 600000, percent: 80 },
      { id: 3, title: '3. Hedef', amount: 800000, percent: 90 },
    ],
  }

  const defaultCommissions = [
    {
      id: 1,
      consultantId: 1,
      consultantName: 'Sinan Tontaş',
      dealType: 'Satış',
      propertyTitle: 'Yenişehir Gıda Çarşısı Satılık Dükkan',
      customerName: 'Ahmet Yılmaz',
      transactionAmount: 12500000,
      grossCommission: 250000,
      consultantSharePercent: 70,
      officeSharePercent: 30,
      consultantShareAmount: 175000,
      officeShareAmount: 75000,
      externalShareAmount: 0,
      shareCalculationMode: 'Otomatik',
      autoSharePercent: 70,
      calculationReason: 'Örnek kayıt',
      periodProduction: 250000,
      paymentStatus: 'Tahsil Edildi',
      consultantPaymentStatus: 'Ödeme Bekliyor',
      invoiceStatus: 'Fatura Kesilecek',
      closeDate: '2026-06-15',
      dueDate: '2026-06-25',
      paidDate: '',
      note: 'Satış işlemi tamamlandı, danışman ödemesi yapılacak.',
      createdAt: '2026-06-15',
    },
    {
      id: 2,
      consultantId: 2,
      consultantName: 'Şems Bahar Çetin',
      dealType: 'Kiralama',
      propertyTitle: 'Bayraklı Mansuroğlu Kiralık Ofis',
      customerName: 'Merve Demir',
      transactionAmount: 40000,
      grossCommission: 40000,
      consultantSharePercent: 60,
      officeSharePercent: 40,
      consultantShareAmount: 24000,
      officeShareAmount: 16000,
      externalShareAmount: 0,
      shareCalculationMode: 'Otomatik',
      autoSharePercent: 60,
      calculationReason: 'Evrak / başlangıç seviyesi',
      periodProduction: 40000,
      paymentStatus: 'Tahsilat Bekliyor',
      consultantPaymentStatus: 'Beklemede',
      invoiceStatus: 'Beklemede',
      closeDate: '2026-06-18',
      dueDate: '2026-06-28',
      paidDate: '',
      note: 'Kiracı ödeme planı bekleniyor.',
      createdAt: '2026-06-18',
    },
  ]

  const commissions = useState('office-commissions', () => defaultCommissions)
  const commissionPolicy = useState('office-commission-policy', () => defaultPolicy)

  const hydrateCommissions = () => {
    if (!process.client) return

    const savedCommissions = localStorage.getItem(storageKey)
    const savedPolicy = localStorage.getItem(policyStorageKey)

    if (savedCommissions) {
      try {
        commissions.value = JSON.parse(savedCommissions)
      } catch (error) {
        commissions.value = defaultCommissions
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(commissions.value))
    }

    if (savedPolicy) {
      try {
        commissionPolicy.value = {
          ...defaultPolicy,
          ...JSON.parse(savedPolicy),
        }
      } catch (error) {
        commissionPolicy.value = defaultPolicy
      }
    } else {
      localStorage.setItem(policyStorageKey, JSON.stringify(commissionPolicy.value))
    }
  }

  const persistCommissions = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(commissions.value))
  }

  const persistPolicy = () => {
    if (!process.client) return
    localStorage.setItem(policyStorageKey, JSON.stringify(commissionPolicy.value))
  }

  const updatePolicyField = (field, value) => {
    const numberFields = [
      'startingPercent',
      'documentsCompletedPercent',
      'firstYearPercent',
      'secondYearPercent',
      'thirdYearPercent',
      'topPreviousYearStartPercent',
    ]

    commissionPolicy.value[field] = numberFields.includes(field)
      ? Number(value || 0)
      : value

    persistPolicy()
  }

  const updatePolicyTarget = (id, field, value) => {
    const target = commissionPolicy.value.targets.find(item => String(item.id) === String(id))
    if (!target) return

    target[field] = field === 'title' ? value : Number(value || 0)
    persistPolicy()
  }

  const normalizeDate = (value) => {
    if (!value) return new Date().toISOString().slice(0, 10)
    return String(value).slice(0, 10)
  }

  const parseDate = (value) => {
    return new Date(normalizeDate(value) + 'T00:00:00')
  }

  const toYmd = (date) => {
    return date.toISOString().slice(0, 10)
  }

  const addYears = (date, yearCount) => {
    const newDate = new Date(date)
    newDate.setFullYear(newDate.getFullYear() + yearCount)
    return newDate
  }

  const subtractOneDay = (date) => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() - 1)
    return newDate
  }

  const getPeriodRange = (dateValue, consultant) => {
    const currentDate = parseDate(dateValue)

    if (commissionPolicy.value.periodMode === 'Danışman Başlangıç Tarihi' && consultant?.startDate) {
      const startBase = parseDate(consultant.startDate)

      let periodStart = new Date(
        currentDate.getFullYear(),
        startBase.getMonth(),
        startBase.getDate()
      )

      if (periodStart > currentDate) {
        periodStart.setFullYear(periodStart.getFullYear() - 1)
      }

      const periodEnd = subtractOneDay(addYears(periodStart, 1))

      return {
        start: toYmd(periodStart),
        end: toYmd(periodEnd),
      }
    }

    const year = currentDate.getFullYear()

    return {
      start: `${year}-01-01`,
      end: `${year}-12-31`,
    }
  }

  const getPreviousPeriodRange = (dateValue, consultant) => {
    const currentRange = getPeriodRange(dateValue, consultant)
    const previousEndDate = subtractOneDay(parseDate(currentRange.start))

    return getPeriodRange(toYmd(previousEndDate), consultant)
  }

  const isInRange = (dateValue, range) => {
    const date = normalizeDate(dateValue)
    return date >= range.start && date <= range.end
  }

  const getOfficeServiceYears = (consultant, dateValue) => {
    if (!consultant?.startDate) return 0

    const startDate = parseDate(consultant.startDate)
    const currentDate = parseDate(dateValue)
    const dayDifference = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24))

    return Math.max(Math.floor(dayDifference / 365), 0)
  }

  const getRecognizedServiceYears = (consultant, dateValue) => {
    if (!consultant) return 0

    const officeYears = getOfficeServiceYears(consultant, dateValue)

    const seniorityMode =
      consultant.commissionSeniorityMode ||
      commissionPolicy.value.defaultSeniorityMode ||
      'Ofis Başlangıcına Göre'

    const previousExperienceYears = Number(
      consultant.previousOfficeExperienceYears ||
      consultant.recognizedExperienceYears ||
      consultant.experienceYear ||
      0
    )

    if (seniorityMode === 'Toplam Sektör Tecrübesine Göre') {
      return Math.max(previousExperienceYears, officeYears)
    }

    if (seniorityMode === 'Broker Tarafından Tanımlanan Tecrübe') {
      return Math.max(Number(consultant.recognizedExperienceYears || 0), officeYears)
    }

    return officeYears
  }

  const getManualStartPercent = (consultant) => {
    if (!consultant) return null

    const manualPercent = Number(consultant.manualCommissionStartPercent || 0)

    if (manualPercent > 0) {
      return manualPercent
    }

    return null
  }

  const calculateShares = ({
    grossCommission,
    consultantSharePercent,
    externalShareAmount = 0,
  }) => {
    const gross = Number(grossCommission || 0)
    const external = Number(externalShareAmount || 0)
    const remaining = Math.max(gross - external, 0)
    const consultantPercent = Number(consultantSharePercent || 0)
    const officePercent = Math.max(100 - consultantPercent, 0)

    const consultantShareAmount = Math.round((remaining * consultantPercent) / 100)
    const officeShareAmount = Math.round((remaining * officePercent) / 100)

    return {
      officeSharePercent: officePercent,
      consultantShareAmount,
      officeShareAmount,
    }
  }

  const getProductionValue = (item) => {
    if (commissionPolicy.value.targetBase === 'Ofis Payı') {
      return Number(item.officeShareAmount || 0)
    }

    return Number(item.grossCommission || 0)
  }

  const getConsultantPeriodProduction = (consultantId, range) => {
    return commissions.value
      .filter(item => String(item.consultantId) === String(consultantId))
      .filter(item => item.paymentStatus !== 'İptal')
      .filter(item => isInRange(item.closeDate || item.createdAt, range))
      .reduce((sum, item) => sum + getProductionValue(item), 0)
  }

  const getTargetPercent = (productionAmount) => {
    const sortedTargets = [...commissionPolicy.value.targets]
      .sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0))

    let matchedTarget = null

    sortedTargets.forEach(target => {
      if (Number(productionAmount || 0) >= Number(target.amount || 0)) {
        matchedTarget = target
      }
    })

    return matchedTarget
      ? {
          percent: Number(matchedTarget.percent || 0),
          title: matchedTarget.title,
          amount: Number(matchedTarget.amount || 0),
        }
      : null
  }

  const getBaseSharePercent = ({
    consultant,
    date,
    documentCompletionPercent = 0,
    authorityCompleted = false,
  }) => {
    const policy = commissionPolicy.value
    const serviceYears = getRecognizedServiceYears(consultant, date)

    let percent = getManualStartPercent(consultant) || Number(policy.startingPercent || 55)
    const reasons = [`Başlangıç oranı %${percent}`]

    if (getManualStartPercent(consultant)) {
      reasons.push(`Broker tarafından manuel başlangıç oranı tanımlandı: %${getManualStartPercent(consultant)}`)
    }

    if (Number(documentCompletionPercent || 0) >= 100 || authorityCompleted) {
      percent = Math.max(percent, Number(policy.documentsCompletedPercent || 60))
      reasons.push(`Evrak / yetki tamamlandı: %${policy.documentsCompletedPercent}`)
    }

    if (serviceYears >= 3) {
      percent = Math.max(percent, Number(policy.thirdYearPercent || 75))
      reasons.push(`3. yıl ve üzeri kıdem: %${policy.thirdYearPercent}`)
    } else if (serviceYears >= 2) {
      percent = Math.max(percent, Number(policy.secondYearPercent || 70))
      reasons.push(`2. yıl kıdem: %${policy.secondYearPercent}`)
    } else if (serviceYears >= 1) {
      percent = Math.max(percent, Number(policy.firstYearPercent || 65))
      reasons.push(`1. yıl kıdem: %${policy.firstYearPercent}`)
    }

    return {
      percent,
      serviceYears,
      reasons,
    }
  }

  const getRecommendedShare = ({
    consultant,
    date,
    documentCompletionPercent = 0,
    authorityCompleted = false,
    extraProductionAmount = 0,
  }) => {
    if (!consultant) {
      return {
        percent: Number(commissionPolicy.value.startingPercent || 55),
        basePercent: Number(commissionPolicy.value.startingPercent || 55),
        targetPercent: 0,
        serviceYears: 0,
        periodProduction: 0,
        previousPeriodProduction: 0,
        periodRange: null,
        previousPeriodRange: null,
        reason: 'Danışman seçilmedi.',
      }
    }

    const periodRange = getPeriodRange(date, consultant)
    const previousPeriodRange = getPreviousPeriodRange(date, consultant)

    const base = getBaseSharePercent({
      consultant,
      date,
      documentCompletionPercent,
      authorityCompleted,
    })

    const previousPeriodProduction = getConsultantPeriodProduction(consultant.id, previousPeriodRange)

    const topTarget = [...commissionPolicy.value.targets]
      .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))[0]

    let startingPercent = base.percent
    const reasons = [...base.reasons]

    if (topTarget && previousPeriodProduction >= Number(topTarget.amount || 0)) {
      startingPercent = Math.max(
        startingPercent,
        Number(commissionPolicy.value.topPreviousYearStartPercent || 80)
      )

      reasons.push(`Önceki dönem üst hedef yakalandı. Yeni dönem başlangıcı: %${commissionPolicy.value.topPreviousYearStartPercent}`)
    }

    const currentProduction = getConsultantPeriodProduction(consultant.id, periodRange)
    const totalProductionWithCurrent = currentProduction + Number(extraProductionAmount || 0)
    const targetResult = getTargetPercent(totalProductionWithCurrent)

    let finalPercent = startingPercent
    let targetPercent = 0

    if (targetResult) {
      targetPercent = targetResult.percent
      finalPercent = Math.max(finalPercent, targetResult.percent)
      reasons.push(`${targetResult.title} yakalandı: ${formatPrice(targetResult.amount)} üzeri üretim → %${targetResult.percent}`)
    }

    return {
      percent: finalPercent,
      basePercent: startingPercent,
      targetPercent,
      serviceYears: base.serviceYears,
      periodProduction: totalProductionWithCurrent,
      previousPeriodProduction,
      periodRange,
      previousPeriodRange,
      reason: reasons.join(' | '),
    }
  }

  const createCommission = (payload) => {
    const shares = calculateShares({
      grossCommission: payload.grossCommission,
      consultantSharePercent: payload.consultantSharePercent,
      externalShareAmount: payload.externalShareAmount,
    })

    const newCommission = {
      id: Date.now(),
      consultantId: payload.consultantId,
      consultantName: payload.consultantName,
      dealType: payload.dealType || 'Satış',
      propertyTitle: payload.propertyTitle,
      customerName: payload.customerName,
      transactionAmount: Number(payload.transactionAmount || 0),
      grossCommission: Number(payload.grossCommission || 0),
      consultantSharePercent: Number(payload.consultantSharePercent || 0),
      officeSharePercent: shares.officeSharePercent,
      consultantShareAmount: shares.consultantShareAmount,
      officeShareAmount: shares.officeShareAmount,
      externalShareAmount: Number(payload.externalShareAmount || 0),
      shareCalculationMode: payload.shareCalculationMode || 'Otomatik',
      autoSharePercent: Number(payload.autoSharePercent || payload.consultantSharePercent || 0),
      calculationReason: payload.calculationReason || '',
      periodProduction: Number(payload.periodProduction || 0),
      paymentStatus: payload.paymentStatus || 'Tahsilat Bekliyor',
      consultantPaymentStatus: payload.consultantPaymentStatus || 'Beklemede',
      invoiceStatus: payload.invoiceStatus || 'Beklemede',
      closeDate: payload.closeDate || new Date().toISOString().slice(0, 10),
      dueDate: payload.dueDate || '',
      paidDate: payload.paidDate || '',
      note: payload.note || '',
      createdAt: new Date().toISOString().slice(0, 10),
    }

    commissions.value.unshift(newCommission)
    persistCommissions()

    return newCommission
  }

  const updateCommission = (id, field, value) => {
    const item = commissions.value.find(record => String(record.id) === String(id))
    if (!item) return

    const numberFields = [
      'transactionAmount',
      'grossCommission',
      'consultantSharePercent',
      'externalShareAmount',
      'autoSharePercent',
      'periodProduction',
    ]

    if (numberFields.includes(field)) {
      item[field] = Number(value || 0)

      const shares = calculateShares({
        grossCommission: item.grossCommission,
        consultantSharePercent: item.consultantSharePercent,
        externalShareAmount: item.externalShareAmount,
      })

      item.officeSharePercent = shares.officeSharePercent
      item.consultantShareAmount = shares.consultantShareAmount
      item.officeShareAmount = shares.officeShareAmount
    } else {
      item[field] = value
    }

    persistCommissions()
  }

  const applySharePercent = (id, percent, reason = '', extra = {}) => {
    const item = commissions.value.find(record => String(record.id) === String(id))
    if (!item) return

    item.consultantSharePercent = Number(percent || 0)
    item.autoSharePercent = Number(percent || 0)
    item.shareCalculationMode = 'Otomatik'
    item.calculationReason = reason
    item.periodProduction = Number(extra.periodProduction || 0)

    const shares = calculateShares({
      grossCommission: item.grossCommission,
      consultantSharePercent: item.consultantSharePercent,
      externalShareAmount: item.externalShareAmount,
    })

    item.officeSharePercent = shares.officeSharePercent
    item.consultantShareAmount = shares.consultantShareAmount
    item.officeShareAmount = shares.officeShareAmount

    persistCommissions()
  }

  const deleteCommission = (id) => {
    commissions.value = commissions.value.filter(item => String(item.id) !== String(id))
    persistCommissions()
  }

  const today = () => new Date().toISOString().slice(0, 10)

  const isOverdue = (dueDate, paymentStatus) => {
    if (!dueDate) return false
    if (paymentStatus === 'Tahsil Edildi') return false
    return dueDate < today()
  }

  const commissionStats = computed(() => {
    const totalGrossCommission = commissions.value.reduce((sum, item) => sum + Number(item.grossCommission || 0), 0)
    const totalOfficeShare = commissions.value.reduce((sum, item) => sum + Number(item.officeShareAmount || 0), 0)
    const totalConsultantShare = commissions.value.reduce((sum, item) => sum + Number(item.consultantShareAmount || 0), 0)
    const totalExternalShare = commissions.value.reduce((sum, item) => sum + Number(item.externalShareAmount || 0), 0)

    const collected = commissions.value
      .filter(item => item.paymentStatus === 'Tahsil Edildi')
      .reduce((sum, item) => sum + Number(item.grossCommission || 0), 0)

    const waitingCollection = commissions.value
      .filter(item => item.paymentStatus !== 'Tahsil Edildi' && item.paymentStatus !== 'İptal')
      .reduce((sum, item) => sum + Number(item.grossCommission || 0), 0)

    const waitingConsultantPayment = commissions.value
      .filter(item => item.consultantPaymentStatus !== 'Ödendi' && item.consultantPaymentStatus !== 'İptal')
      .reduce((sum, item) => sum + Number(item.consultantShareAmount || 0), 0)

    return {
      totalDealCount: commissions.value.length,
      totalGrossCommission,
      totalOfficeShare,
      totalConsultantShare,
      totalExternalShare,
      collected,
      waitingCollection,
      waitingConsultantPayment,
    }
  })

  const consultantSummary = computed(() => {
    const map = {}

    commissions.value.forEach(item => {
      const key = item.consultantId

      if (!map[key]) {
        map[key] = {
          consultantId: item.consultantId,
          consultantName: item.consultantName,
          dealCount: 0,
          grossCommission: 0,
          consultantShare: 0,
          officeShare: 0,
        }
      }

      map[key].dealCount += 1
      map[key].grossCommission += Number(item.grossCommission || 0)
      map[key].consultantShare += Number(item.consultantShareAmount || 0)
      map[key].officeShare += Number(item.officeShareAmount || 0)
    })

    return Object.values(map).sort((a, b) => b.grossCommission - a.grossCommission)
  })

  const formatPrice = (value) => {
    return new Intl.NumberFormat('tr-TR').format(Number(value || 0)) + ' ₺'
  }

  return {
    commissions,
    commissionPolicy,
    hydrateCommissions,
    persistCommissions,
    persistPolicy,
    updatePolicyField,
    updatePolicyTarget,
    calculateShares,
    getRecommendedShare,
    getConsultantPeriodProduction,
    getPeriodRange,
    getPreviousPeriodRange,
    createCommission,
    updateCommission,
    applySharePercent,
    deleteCommission,
    isOverdue,
    commissionStats,
    consultantSummary,
    formatPrice,
  }
}
