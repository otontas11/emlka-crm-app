const defaultFinanceRecords = [
  {
    id: 1,
    type: 'Gelir',
    subType: 'Satış Komisyonu',
    title: 'Bayraklı satış komisyonu',
    partyName: 'Ahmet Yılmaz',
    relatedModule: 'Portföy',
    relatedName: 'Bayraklı Satılık Dükkan',
    amount: 185000,
    currency: 'TL',
    status: 'Tahsil Edildi',
    paymentMethod: 'Havale',
    issueDate: '2026-06-01',
    dueDate: '2026-06-05',
    paymentDate: '2026-06-05',
    invoiceNo: '',
    invoiceTracked: 'Hayır',
    categoryGroup: 'Gelir',
    notes: 'Satış işlemi sonrası komisyon tahsil edildi.',
    packageLevel: 'Pro',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    type: 'Gider',
    subType: 'Ofis Kirası',
    title: 'Haziran ofis kirası',
    partyName: 'Ofis Yönetimi',
    relatedModule: 'Genel',
    relatedName: 'Merkez Ofis',
    amount: 35000,
    currency: 'TL',
    status: 'Ödenecek',
    paymentMethod: 'Banka',
    issueDate: '2026-06-01',
    dueDate: '2026-06-10',
    paymentDate: '',
    invoiceNo: 'OK-2026-06',
    invoiceTracked: 'Evet',
    categoryGroup: 'Gider',
    notes: 'Aylık sabit gider.',
    packageLevel: 'Pro',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    type: 'Fatura',
    subType: 'İnternet',
    title: 'İnternet faturası',
    partyName: 'Türk Telekom',
    relatedModule: 'Genel',
    relatedName: 'Ofis İnternet',
    amount: 1450,
    currency: 'TL',
    status: 'Gecikmiş',
    paymentMethod: 'Banka',
    issueDate: '2026-05-28',
    dueDate: '2026-06-03',
    paymentDate: '',
    invoiceNo: 'TT-5562',
    invoiceTracked: 'Evet',
    categoryGroup: 'Fatura',
    notes: 'Fatura takibinde görünecek.',
    packageLevel: 'Plus',
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    type: 'Ödeme',
    subType: 'Danışman Katkı Payı',
    title: 'Danışman katkı payı tahsilatı',
    partyName: 'Serkan Demir',
    relatedModule: 'Danışman',
    relatedName: 'Aylık katkı payı',
    amount: 7500,
    currency: 'TL',
    status: 'Bekliyor',
    paymentMethod: 'Nakit',
    issueDate: '2026-06-02',
    dueDate: '2026-06-12',
    paymentDate: '',
    invoiceNo: '',
    invoiceTracked: 'Hayır',
    categoryGroup: 'Ödeme',
    notes: 'Ay ortasında tahsil edilecek.',
    packageLevel: 'Basic',
    createdAt: new Date().toISOString(),
  },
]

let watchStarted = false

const syncFinanceToStorage = (list) => {
  if (import.meta.client) {
    localStorage.setItem('financeRecords', JSON.stringify(list))
  }
}

export const useFinance = () => {
  const records = useState('financeRecords', () => [...defaultFinanceRecords])

  if (import.meta.client) {
    const saved = localStorage.getItem('financeRecords')

    if (saved) {
      try {
        records.value = JSON.parse(saved)
      } catch (error) {
        records.value = [...defaultFinanceRecords]
        syncFinanceToStorage(records.value)
      }
    } else {
      syncFinanceToStorage(records.value)
    }

    if (!watchStarted) {
      watch(
        records,
        (newValue) => {
          syncFinanceToStorage(newValue)
        },
        { deep: true }
      )
      watchStarted = true
    }
  }

  return records
}

export const createFinanceRecord = (recordData) => {
  const records = useFinance()

  const newRecord = {
    id: Date.now(),
    ...recordData,
    createdAt: new Date().toISOString(),
  }

  records.value.unshift(newRecord)
  syncFinanceToStorage(records.value)
  return newRecord
}

export const getFinanceRecordById = (id) => {
  const records = useFinance()
  return records.value.find((item) => String(item.id) === String(id))
}

export const updateFinanceRecord = (id, updatedData) => {
  const records = useFinance()
  const index = records.value.findIndex((item) => String(item.id) === String(id))

  if (index === -1) return null

  const currentRecord = records.value[index]

  records.value[index] = {
    ...currentRecord,
    ...updatedData,
    id: currentRecord.id,
    createdAt: currentRecord.createdAt,
  }

  syncFinanceToStorage(records.value)
  return records.value[index]
}

export const deleteFinanceRecord = (id) => {
  const records = useFinance()
  records.value = records.value.filter((item) => String(item.id) !== String(id))
  syncFinanceToStorage(records.value)
}


