import { useOffice } from '~/composables/useOffice'

export const useOfficeDocuments = () => {
  const { consultants } = useOffice()

  const records = useState('office-document-records', () => [])
  const isHydrated = useState('office-document-records-hydrated', () => false)

  const storageKey = 'emlak-crm-office-document-records'

  const templates = [
    {
      key: 'danisman-is-sozlesmesi',
      title: 'Danışman İş Sözleşmesi',
      group: 'Sözleşmeler',
      requiredFor: ['SGK’lı Danışman'],
    },
    {
      key: 'is-birligi-sozlesmesi',
      title: 'İş Birliği Sözleşmesi',
      group: 'Sözleşmeler',
      requiredFor: ['Bağ-Kur’lu Danışman'],
    },
    {
      key: 'gizlilik-sozlesmesi',
      title: 'Gizlilik Sözleşmesi',
      group: 'Sözleşmeler',
      requiredFor: ['SGK’lı Danışman', 'Bağ-Kur’lu Danışman'],
    },
    {
      key: 'kvkk-onayi',
      title: 'KVKK Onayı',
      group: 'Sözleşmeler',
      requiredFor: ['SGK’lı Danışman', 'Bağ-Kur’lu Danışman'],
    },
    {
      key: 'ofis-ic-yonetmelik',
      title: 'Ofis İç Yönetmelik Onayı',
      group: 'Sözleşmeler',
      requiredFor: ['SGK’lı Danışman', 'Bağ-Kur’lu Danışman'],
    },
    {
      key: 'ekipman-teslim',
      title: 'Ekipman Teslim Tutanağı',
      group: 'Sözleşmeler',
      requiredFor: ['SGK’lı Danışman', 'Bağ-Kur’lu Danışman'],
    },
    {
      key: 'tc-kimlik',
      title: 'T.C. Kimlik',
      group: 'Personel Evrakları',
      requiredFor: ['SGK’lı Danışman', 'Bağ-Kur’lu Danışman'],
    },
    {
      key: 'vesikalik',
      title: 'Vesikalık Fotoğraf',
      group: 'Personel Evrakları',
      requiredFor: ['SGK’lı Danışman', 'Bağ-Kur’lu Danışman'],
    },
    {
      key: 'adres-belgesi',
      title: 'Adres Belgesi',
      group: 'Personel Evrakları',
      requiredFor: ['SGK’lı Danışman', 'Bağ-Kur’lu Danışman'],
    },
    {
      key: 'mezuniyet-belgesi',
      title: 'Mezuniyet Belgesi',
      group: 'Personel Evrakları',
      requiredFor: ['SGK’lı Danışman'],
    },
    {
      key: 'adli-sicil',
      title: 'Adli Sicil Kaydı',
      group: 'Personel Evrakları',
      requiredFor: ['SGK’lı Danışman', 'Bağ-Kur’lu Danışman'],
    },
    {
      key: 'saglik-raporu',
      title: 'Sağlık Raporu',
      group: 'SGK Evrakları',
      requiredFor: ['SGK’lı Danışman'],
    },
    {
      key: 'sgk-giris-bildirgesi',
      title: 'SGK Giriş Bildirgesi',
      group: 'SGK Evrakları',
      requiredFor: ['SGK’lı Danışman'],
    },
    {
      key: 'askerlik-belgesi',
      title: 'Askerlik Belgesi',
      group: 'SGK Evrakları',
      requiredFor: ['SGK’lı Danışman'],
    },
    {
      key: 'danismanlik-sertifikasi',
      title: 'Danışmanlık Sertifikaları',
      group: 'Mesleki Belgeler',
      requiredFor: ['SGK’lı Danışman', 'Bağ-Kur’lu Danışman'],
    },
    {
      key: 'mesleki-yeterlilik',
      title: 'Mesleki Yeterlilik Belgesi',
      group: 'Mesleki Belgeler',
      requiredFor: ['SGK’lı Danışman', 'Bağ-Kur’lu Danışman'],
    },
    {
      key: 'vergi-isletme-bilgisi',
      title: 'Vergi / İşletme Bilgi Notu',
      group: 'İşletme Bilgileri',
      requiredFor: ['Bağ-Kur’lu Danışman'],
    },
    {
      key: 'ofis-sozlesme-durumu',
      title: 'Ofisle Sözleşme Durumu',
      group: 'İşletme Bilgileri',
      requiredFor: ['Bağ-Kur’lu Danışman'],
    },
  ]

  const readStorage = () => {
    if (!process.client) return []

    try {
      const raw = localStorage.getItem(storageKey)
      return raw ? JSON.parse(raw) : []
    } catch (error) {
      return []
    }
  }

  const writeStorage = () => {
    if (!process.client) return

    try {
      localStorage.setItem(storageKey, JSON.stringify(records.value))
    } catch (error) {
      console.error('Evrak kayıt hatası:', error)
    }
  }

  const hydrate = () => {
    if (!process.client || isHydrated.value) return

    const saved = readStorage()

    if (Array.isArray(saved)) {
      records.value = saved
    }

    isHydrated.value = true
  }

  const getTemplatesForConsultant = (consultant) => {
    return templates.filter(template => {
      return template.requiredFor.includes(consultant.workType)
    })
  }

  const createRecord = (consultant, template) => {
    return {
      id: `${consultant.id}-${template.key}`,
      consultantId: consultant.id,
      consultantName: consultant.fullName,
      consultantCode: consultant.code,
      workType: consultant.workType,
      status: 'Eksik',
      docKey: template.key,
      title: template.title,
      group: template.group,
      required: true,
      fileName: '',
      fileSize: '',
      uploadedAt: '',
      expireDate: '',
      note: '',
      updatedAt: new Date().toISOString(),
    }
  }

  const ensureDocumentsForConsultants = () => {
    hydrate()

    consultants.value.forEach((consultant) => {
      const consultantTemplates = getTemplatesForConsultant(consultant)

      consultantTemplates.forEach((template) => {
        const exists = records.value.some(record => {
          return String(record.consultantId) === String(consultant.id) &&
            record.docKey === template.key
        })

        if (!exists) {
          records.value.push(createRecord(consultant, template))
        }
      })
    })

    writeStorage()
  }

  const uploadDocumentFile = (recordId, file) => {
    hydrate()

    const record = records.value.find(item => item.id === recordId)
    if (!record || !file) return

    const sizeKb = file.size / 1024
    const sizeText = sizeKb > 1024
      ? `${(sizeKb / 1024).toFixed(2)} MB`
      : `${sizeKb.toFixed(0)} KB`

    record.fileName = file.name
    record.fileSize = sizeText
    record.status = 'Tamamlandı'
    record.uploadedAt = new Date().toLocaleDateString('tr-TR')
    record.updatedAt = new Date().toISOString()

    writeStorage()
  }

  const updateDocumentStatus = (recordId, status) => {
    hydrate()

    const record = records.value.find(item => item.id === recordId)
    if (!record) return

    record.status = status
    record.updatedAt = new Date().toISOString()

    writeStorage()
  }

  const updateDocumentField = (recordId, field, value) => {
    hydrate()

    const record = records.value.find(item => item.id === recordId)
    if (!record) return

    record[field] = value
    record.updatedAt = new Date().toISOString()

    writeStorage()
  }

  const deleteDocumentFile = (recordId) => {
    hydrate()

    const record = records.value.find(item => item.id === recordId)
    if (!record) return

    record.fileName = ''
    record.fileSize = ''
    record.uploadedAt = ''
    record.status = 'Eksik'
    record.updatedAt = new Date().toISOString()

    writeStorage()
  }

  const getDocumentsByConsultant = (consultantId) => {
    ensureDocumentsForConsultants()

    return records.value.filter(item => {
      return String(item.consultantId) === String(consultantId)
    })
  }

  const completionPercent = (consultantId) => {
    const list = getDocumentsByConsultant(consultantId)

    if (!list.length) return 0

    const completed = list.filter(item => item.status === 'Tamamlandı').length

    return Math.round((completed / list.length) * 100)
  }

  const missingCount = (consultantId) => {
    return getDocumentsByConsultant(consultantId).filter(item => item.status !== 'Tamamlandı').length
  }

  const documentStats = computed(() => {
    const total = records.value.length
    const completed = records.value.filter(item => item.status === 'Tamamlandı').length
    const missing = records.value.filter(item => item.status === 'Eksik').length
    const waiting = records.value.filter(item => item.status === 'Kontrol Bekliyor').length
    const invalid = records.value.filter(item => item.status === 'Geçersiz').length

    return {
      total,
      completed,
      missing,
      waiting,
      invalid,
    }
  })

  const documentGroups = computed(() => {
    return [...new Set(records.value.map(item => item.group))]
  })

  return {
    records,
    templates,
    ensureDocumentsForConsultants,
    uploadDocumentFile,
    updateDocumentStatus,
    updateDocumentField,
    deleteDocumentFile,
    getDocumentsByConsultant,
    completionPercent,
    missingCount,
    documentStats,
    documentGroups,
  }
}


