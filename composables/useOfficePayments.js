export const useOfficePayments = () => {
  const storageKey = 'emlak-crm-office-payments'

  const defaultPayments = [
    {
      id: 1,
      direction: 'Tahsilat',
      category: 'Danışman SSK Tahsilatı',
      personType: 'Danışman',
      personId: 2,
      personName: 'Şems Bahar Çetin',
      workType: 'SGK’lı Danışman',
      period: '2026-06',
      amount: 8500,
      dueDate: '2026-06-25',
      paidDate: '',
      status: 'Bekliyor',
      note: 'Danışmandan SSK bedeli tahsil edilecek.',
      createdAt: '2026-06-20',
    },
    {
      id: 2,
      direction: 'Ödeme',
      category: 'Danışman SSK Borç Ödemesi',
      personType: 'Resmi Kurum',
      personId: 2,
      personName: 'Şems Bahar Çetin',
      workType: 'SGK’lı Danışman',
      period: '2026-06',
      amount: 8500,
      dueDate: '2026-06-30',
      paidDate: '',
      status: 'Bekliyor',
      note: 'Danışmanın SSK borcu SGK’ya ödenecek.',
      createdAt: '2026-06-20',
    },
    {
      id: 3,
      direction: 'Ödeme',
      category: 'Ofis Personel Maaşı',
      personType: 'Ofis Personeli',
      personId: '',
      personName: 'Ofis Asistanı',
      workType: 'Ofis Personeli',
      period: '2026-06',
      amount: 25000,
      dueDate: '2026-06-30',
      paidDate: '',
      status: 'Bekliyor',
      note: 'Asistan, sekreter, temizlik personeli gibi gerçek ofis çalışanları için maaş takibi.',
      createdAt: '2026-06-20',
    },
    {
      id: 4,
      direction: 'Tahsilat',
      category: 'Danışman Ofis Aidatı Tahsilatı',
      personType: 'Danışman',
      personId: 1,
      personName: 'Sinan Tontaş',
      workType: 'Bağ-Kur’lu Danışman',
      period: '2026-06',
      amount: 0,
      dueDate: '2026-06-30',
      paidDate: '',
      status: 'Bekliyor',
      note: 'Bağ-Kur danışman kendi primini öder. Ofise karşı aidat / ödeme varsa burada takip edilir.',
      createdAt: '2026-06-20',
    },
  ]

  const payments = useState('office-payments', () => defaultPayments)

  const normalizePayment = (record) => {
    return {
      id: record.id || Date.now(),
      direction: record.direction || 'Tahsilat',
      category: record.category || 'Diğer Tahsilat',
      personType: record.personType || 'Diğer',
      personId: record.personId || '',
      personName: record.personName || record.consultantName || '',
      workType: record.workType || '',
      period: record.period || new Date().toISOString().slice(0, 7),
      amount: Number(record.amount || 0),
      dueDate: record.dueDate || '',
      paidDate: record.paidDate || '',
      status: record.status || 'Bekliyor',
      note: record.note || '',
      createdAt: record.createdAt || new Date().toISOString().slice(0, 10),
    }
  }

  const hydratePayments = () => {
    if (!process.client) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        payments.value = JSON.parse(saved).map(normalizePayment)
      } catch (error) {
        payments.value = defaultPayments
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(payments.value))
    }
  }

  const persistPayments = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(payments.value))
  }

  const createPayment = (payload) => {
    const newPayment = normalizePayment({
      id: Date.now(),
      ...payload,
      createdAt: new Date().toISOString().slice(0, 10),
    })

    payments.value.unshift(newPayment)
    persistPayments()

    return newPayment
  }

  const updatePayment = (id, field, value) => {
    const record = payments.value.find(item => String(item.id) === String(id))
    if (!record) return

    if (field === 'amount') {
      record[field] = Number(value || 0)
    } else {
      record[field] = value
    }

    persistPayments()
  }

  const deletePayment = (id) => {
    payments.value = payments.value.filter(item => String(item.id) !== String(id))
    persistPayments()
  }

  const markPaid = (id) => {
    const record = payments.value.find(item => String(item.id) === String(id))
    if (!record) return

    record.status = 'Ödendi'
    record.paidDate = new Date().toISOString().slice(0, 10)

    persistPayments()
  }

  const today = () => new Date().toISOString().slice(0, 10)

  const isOverdue = (record) => {
    if (!record?.dueDate) return false
    if (record.status === 'Ödendi' || record.status === 'İptal') return false

    return record.dueDate < today()
  }

  const paymentStats = computed(() => {
    const validRecords = payments.value.filter(item => item.status !== 'İptal')

    const collections = validRecords
      .filter(item => item.direction === 'Tahsilat')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const expenses = validRecords
      .filter(item => item.direction === 'Ödeme')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const waitingCollections = validRecords
      .filter(item => item.direction === 'Tahsilat')
      .filter(item => item.status !== 'Ödendi')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const waitingExpenses = validRecords
      .filter(item => item.direction === 'Ödeme')
      .filter(item => item.status !== 'Ödendi')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const paidCollections = validRecords
      .filter(item => item.direction === 'Tahsilat')
      .filter(item => item.status === 'Ödendi')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const paidExpenses = validRecords
      .filter(item => item.direction === 'Ödeme')
      .filter(item => item.status === 'Ödendi')
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const overdueCount = validRecords.filter(item => isOverdue(item)).length

    return {
      totalRecord: payments.value.length,
      collections,
      expenses,
      net: collections - expenses,
      waitingCollections,
      waitingExpenses,
      paidCollections,
      paidExpenses,
      overdueCount,
    }
  })

  const getSskSummary = (consultantId, period) => {
    const consultantRecords = payments.value.filter(item => {
      return String(item.personId) === String(consultantId) && item.period === period
    })

    const collection = consultantRecords.find(item => item.category === 'Danışman SSK Tahsilatı')
    const debtPayment = consultantRecords.find(item => item.category === 'Danışman SSK Borç Ödemesi')

    return {
      collection,
      debtPayment,
      collectionAmount: Number(collection?.amount || 0),
      debtAmount: Number(debtPayment?.amount || 0),
      collectionStatus: collection?.status || 'Kayıt Yok',
      debtStatus: debtPayment?.status || 'Kayıt Yok',
    }
  }

  const paymentPersonSummary = computed(() => {
    const map = {}

    payments.value.forEach(item => {
      const key = `${item.personType}-${item.personId || item.personName}`

      if (!map[key]) {
        map[key] = {
          personName: item.personName,
          personType: item.personType,
          workType: item.workType,
          collectionAmount: 0,
          expenseAmount: 0,
          waitingAmount: 0,
          recordCount: 0,
        }
      }

      map[key].recordCount += 1

      if (item.direction === 'Tahsilat') {
        map[key].collectionAmount += Number(item.amount || 0)
      }

      if (item.direction === 'Ödeme') {
        map[key].expenseAmount += Number(item.amount || 0)
      }

      if (item.status !== 'Ödendi' && item.status !== 'İptal') {
        map[key].waitingAmount += Number(item.amount || 0)
      }
    })

    return Object.values(map).sort((a, b) => b.waitingAmount - a.waitingAmount)
  })

  const formatPrice = (value) => {
    return new Intl.NumberFormat('tr-TR').format(Number(value || 0)) + ' ₺'
  }

  return {
    payments,
    hydratePayments,
    persistPayments,
    createPayment,
    updatePayment,
    deletePayment,
    markPaid,
    isOverdue,
    paymentStats,
    getSskSummary,
    paymentPersonSummary,
    formatPrice,
  }
}
