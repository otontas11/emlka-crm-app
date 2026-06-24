export const useDocumentTemplates = () => {
  const templateStorageKey = 'emlak-crm-document-templates'
  const documentStorageKey = 'emlak-crm-consultant-documents'

  const defaultTemplates = [
    {
      id: 1,
      title: 'Danışman İş Birliği Sözleşmesi',
      category: 'Kayıt Evrakı',
      usageArea: 'Danışman Kayıt Süreci',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: true,
      approvalRequired: true,
      mobileEditable: true,
      description: 'Danışmanın ofise kabul sürecinde doldurup yüklemesi gereken iş birliği sözleşmesi.',
      content: 'Danışman İş Birliği Sözleşmesi şablonu. Gerçek belge ofis tarafından yüklenecektir.',
      createdAt: '2026-06-20',
    },
    {
      id: 2,
      title: 'KVKK Onay ve Aydınlatma Metni',
      category: 'Kayıt Evrakı',
      usageArea: 'Danışman Kayıt Süreci',
      fileType: 'PDF',
      version: '1.0',
      active: true,
      requiredForRegistration: true,
      approvalRequired: true,
      mobileEditable: false,
      description: 'Danışmanın KVKK onay sürecinde kullanacağı belge.',
      content: 'KVKK Onay ve Aydınlatma Metni şablonu. Gerçek belge ofis tarafından yüklenecektir.',
      createdAt: '2026-06-20',
    },
    {
      id: 3,
      title: 'Gizlilik Sözleşmesi',
      category: 'Kayıt Evrakı',
      usageArea: 'Danışman Kayıt Süreci',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: true,
      approvalRequired: true,
      mobileEditable: true,
      description: 'Ofis verileri, müşteri bilgileri ve portföy bilgilerinin korunmasına yönelik sözleşme.',
      content: 'Gizlilik Sözleşmesi şablonu. Gerçek belge ofis tarafından yüklenecektir.',
      createdAt: '2026-06-20',
    },
    {
      id: 4,
      title: 'Ofis İç Yönetmelik Onayı',
      category: 'Kayıt Evrakı',
      usageArea: 'Danışman Kayıt Süreci',
      fileType: 'PDF',
      version: '1.0',
      active: true,
      requiredForRegistration: true,
      approvalRequired: true,
      mobileEditable: false,
      description: 'Ofis kuralları ve çalışma prensipleri onayı.',
      content: 'Ofis İç Yönetmelik Onayı şablonu. Gerçek belge ofis tarafından yüklenecektir.',
      createdAt: '2026-06-20',
    },
    {
      id: 5,
      title: 'Konut Kira Sözleşmesi',
      category: 'Kiralama Belgeleri',
      usageArea: 'Konut Kiralama',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Konut kiralama işlemlerinde kullanılacak kira sözleşmesi.',
      content: 'Konut Kira Sözleşmesi şablonu. Taraf bilgileri, kira bedeli, depozito, tahliye ve özel şartlar alanları içerir.',
      createdAt: '2026-06-20',
    },
    {
      id: 6,
      title: 'Ticari Kira Sözleşmesi',
      category: 'Kiralama Belgeleri',
      usageArea: 'Ticari Kiralama',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Dükkan, ofis, depo, fabrika ve ticari alan kiralamalarında kullanılacak sözleşme.',
      content: 'Ticari Kira Sözleşmesi şablonu. Ticari kullanım, stopaj, aidat, depozito ve özel şartlar alanları içerir.',
      createdAt: '2026-06-20',
    },
    {
      id: 7,
      title: 'Kiralık Yetki Belgesi',
      category: 'Yetki Belgeleri',
      usageArea: 'Kiralık Portföy Alma',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Kiralık portföy için mal sahibinden alınacak yetki belgesi.',
      content: 'Kiralık Yetki Belgesi şablonu. Malik, taşınmaz, yetki süresi ve hizmet bedeli alanları içerir.',
      createdAt: '2026-06-20',
    },
    {
      id: 8,
      title: 'Satılık Yetki Belgesi',
      category: 'Yetki Belgeleri',
      usageArea: 'Satılık Portföy Alma',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Satılık portföy için mal sahibinden alınacak yetki belgesi.',
      content: 'Satılık Yetki Belgesi şablonu. Malik, taşınmaz, satış bedeli, yetki süresi ve hizmet bedeli alanları içerir.',
      createdAt: '2026-06-20',
    },
    {
      id: 9,
      title: 'Yer Gösterme Belgesi',
      category: 'Yer Gösterme / Teklif',
      usageArea: 'Müşteri Gösterimi',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Müşteriye taşınmaz gösterimi yapılırken imzalatılacak belge.',
      content: 'Yer Gösterme Belgesi şablonu. Müşteri, taşınmaz, tarih ve hizmet bedeli kabul alanları içerir.',
      createdAt: '2026-06-20',
    },
    {
      id: 10,
      title: 'Teklif Formu',
      category: 'Yer Gösterme / Teklif',
      usageArea: 'Satın Alma / Kiralama Teklifi',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Alıcı veya kiracıdan teklif almak için kullanılacak form.',
      content: 'Teklif Formu şablonu. Teklif bedeli, ödeme planı, geçerlilik süresi ve özel şartlar alanları içerir.',
      createdAt: '2026-06-20',
    },
    {
      id: 11,
      title: 'Aracılık Hizmet Belgesi',
      category: 'Hizmet Belgeleri',
      usageArea: 'Alıcı / Kiracı Hizmeti',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Alıcı veya kiracı ile danışmanlık hizmeti sürecinde kullanılacak belge.',
      content: 'Aracılık Hizmet Belgesi şablonu. Hizmet kapsamı, hizmet bedeli ve taraf bilgileri içerir.',
      createdAt: '2026-06-20',
    },
    {
      id: 12,
      title: 'Devren Kiralık Danışmanlık Belgesi',
      category: 'Devir Belgeleri',
      usageArea: 'Devren Kiralık İşletme',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Devren kiralık işletme / işyeri danışmanlık süreçleri için kullanılacak belge.',
      content: 'Devren Kiralık Danışmanlık Belgesi şablonu. Devir bedeli, kira şartları, demirbaş ve hizmet bedeli alanları içerir.',
      createdAt: '2026-06-20',
    },
    {
      id: 13,
      title: 'Devren Satılık Danışmanlık Belgesi',
      category: 'Devir Belgeleri',
      usageArea: 'Devren Satılık İşletme',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Devren satılık işletme / işyeri danışmanlık süreçleri için kullanılacak belge.',
      content: 'Devren Satılık Danışmanlık Belgesi şablonu. Devir bedeli, stok, demirbaş ve hizmet bedeli alanları içerir.',
      createdAt: '2026-06-20',
    },
    {
      id: 14,
      title: 'Kapora / Ön Ödeme Tutanağı',
      category: 'Tutanaklar',
      usageArea: 'Kapora / Ön Ödeme',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Alıcı veya kiracı tarafından yapılan kapora / ön ödeme için kullanılacak tutanak.',
      content: 'Kapora / Ön Ödeme Tutanağı şablonu. Ödeme tutarı, iade şartları ve taraf bilgileri alanları içerir.',
      createdAt: '2026-06-20',
    },
    {
      id: 15,
      title: 'Anahtar Teslim Tutanağı',
      category: 'Tutanaklar',
      usageArea: 'Teslim Süreci',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Taşınmaz teslim sürecinde kullanılacak anahtar teslim tutanağı.',
      content: 'Anahtar Teslim Tutanağı şablonu. Teslim tarihi, sayaç bilgileri ve anahtar adedi alanları içerir.',
      createdAt: '2026-06-20',
    },
    {
      id: 16,
      title: 'Tahliye Taahhütnamesi',
      category: 'Kiralama Belgeleri',
      usageArea: 'Kiralama Süreci',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Kiralama sürecinde ihtiyaç duyulabilecek tahliye taahhüt belgesi.',
      content: 'Tahliye Taahhütnamesi şablonu. Kiracı, taşınmaz ve tahliye tarihi alanları içerir.',
      createdAt: '2026-06-20',
    },
    {
      id: 17,
      title: 'Fiyat Revizyon Formu',
      category: 'Portföy Belgeleri',
      usageArea: 'Portföy Fiyat Güncelleme',
      fileType: 'DOCX',
      version: '1.0',
      active: true,
      requiredForRegistration: false,
      approvalRequired: false,
      mobileEditable: true,
      description: 'Malik ile fiyat revizyonu yapılırken kullanılacak form.',
      content: 'Fiyat Revizyon Formu şablonu. Eski fiyat, yeni fiyat, revizyon tarihi ve malik onayı alanları içerir.',
      createdAt: '2026-06-20',
    },
  ]

  const templates = useState('document-templates', () => defaultTemplates)
  const consultantDocuments = useState('consultant-registration-documents', () => [])

  const normalizeTemplate = (template) => {
    return {
      id: template.id || Date.now(),
      title: template.title || '',
      category: template.category || 'Diğer',
      usageArea: template.usageArea || '',
      fileType: template.fileType || 'DOCX',
      version: template.version || '1.0',
      active: template.active !== false,
      requiredForRegistration: Boolean(template.requiredForRegistration),
      approvalRequired: Boolean(template.approvalRequired),
      mobileEditable: template.mobileEditable !== false,
      description: template.description || '',
      content: template.content || '',
      createdAt: template.createdAt || new Date().toISOString().slice(0, 10),
    }
  }

  const hydrateDocumentTemplates = () => {
    if (!process.client) return

    const savedTemplates = localStorage.getItem(templateStorageKey)
    const savedDocuments = localStorage.getItem(documentStorageKey)

    if (savedTemplates) {
      try {
        templates.value = JSON.parse(savedTemplates).map(normalizeTemplate)
      } catch (error) {
        templates.value = defaultTemplates
      }
    } else {
      localStorage.setItem(templateStorageKey, JSON.stringify(templates.value))
    }

    if (savedDocuments) {
      try {
        consultantDocuments.value = JSON.parse(savedDocuments)
      } catch (error) {
        consultantDocuments.value = []
      }
    } else {
      localStorage.setItem(documentStorageKey, JSON.stringify(consultantDocuments.value))
    }
  }

  const persistTemplates = () => {
    if (!process.client) return
    localStorage.setItem(templateStorageKey, JSON.stringify(templates.value))
  }

  const persistConsultantDocuments = () => {
    if (!process.client) return
    localStorage.setItem(documentStorageKey, JSON.stringify(consultantDocuments.value))
  }

  const createTemplate = (payload) => {
    const newTemplate = normalizeTemplate({
      id: Date.now(),
      ...payload,
      createdAt: new Date().toISOString().slice(0, 10),
    })

    templates.value.unshift(newTemplate)
    persistTemplates()

    return newTemplate
  }

  const updateTemplate = (id, field, value) => {
    const template = templates.value.find(item => String(item.id) === String(id))
    if (!template) return

    if (['active', 'requiredForRegistration', 'approvalRequired', 'mobileEditable'].includes(field)) {
      template[field] = Boolean(value)
    } else {
      template[field] = value
    }

    persistTemplates()
  }

  const deleteTemplate = (id) => {
    templates.value = templates.value.filter(item => String(item.id) !== String(id))
    persistTemplates()
  }

  const getActiveTemplates = () => {
    return templates.value.filter(item => item.active)
  }

  const getRegistrationTemplates = () => {
    return templates.value.filter(item => item.active && item.requiredForRegistration)
  }

  const getConsultantDocuments = (consultantId) => {
    return consultantDocuments.value.filter(item => String(item.consultantId) === String(consultantId))
  }

  const getConsultantDocumentStatus = (consultantId, templateId) => {
    return consultantDocuments.value.find(item => {
      return String(item.consultantId) === String(consultantId) &&
        String(item.templateId) === String(templateId)
    }) || null
  }

  const uploadConsultantDocument = ({ consultantId, consultantName, template, fileName }) => {
    const existing = getConsultantDocumentStatus(consultantId, template.id)

    if (existing) {
      existing.fileName = fileName
      existing.status = 'Yüklendi'
      existing.uploadedAt = new Date().toISOString().slice(0, 10)
      existing.revisionNote = ''
    } else {
      consultantDocuments.value.unshift({
        id: Date.now(),
        consultantId,
        consultantName,
        templateId: template.id,
        templateTitle: template.title,
        category: template.category,
        fileName,
        status: 'Yüklendi',
        uploadedAt: new Date().toISOString().slice(0, 10),
        submittedAt: '',
        approvedAt: '',
        brokerNote: '',
        revisionNote: '',
      })
    }

    persistConsultantDocuments()
  }

  const submitConsultantDocument = (documentId) => {
    const document = consultantDocuments.value.find(item => String(item.id) === String(documentId))
    if (!document) return

    document.status = 'Onaya Gönderildi'
    document.submittedAt = new Date().toISOString().slice(0, 10)

    persistConsultantDocuments()
  }

  const approveConsultantDocument = (documentId, brokerNote = '') => {
    const document = consultantDocuments.value.find(item => String(item.id) === String(documentId))
    if (!document) return

    document.status = 'Onaylandı'
    document.approvedAt = new Date().toISOString().slice(0, 10)
    document.brokerNote = brokerNote

    persistConsultantDocuments()
  }

  const requestRevisionForDocument = (documentId, revisionNote = '') => {
    const document = consultantDocuments.value.find(item => String(item.id) === String(documentId))
    if (!document) return

    document.status = 'Revize İstendi'
    document.revisionNote = revisionNote
    document.brokerNote = revisionNote

    persistConsultantDocuments()
  }

  const getRegistrationProgress = (consultantId) => {
    const requiredTemplates = getRegistrationTemplates()
    const consultantDocs = getConsultantDocuments(consultantId)

    const approvedCount = requiredTemplates.filter(template => {
      return consultantDocs.some(document => {
        return String(document.templateId) === String(template.id) &&
          document.status === 'Onaylandı'
      })
    }).length

    const uploadedCount = requiredTemplates.filter(template => {
      return consultantDocs.some(document => String(document.templateId) === String(template.id))
    }).length

    const total = requiredTemplates.length

    return {
      total,
      uploadedCount,
      approvedCount,
      uploadedPercent: total ? Math.round((uploadedCount / total) * 100) : 0,
      approvedPercent: total ? Math.round((approvedCount / total) * 100) : 0,
      completed: total > 0 && approvedCount === total,
    }
  }

  const downloadTemplate = (template) => {
    if (!process.client) return

    const fileName = `${template.title.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')}.${template.fileType === 'PDF' ? 'txt' : 'txt'}`
    const body = [
      template.title,
      `Kategori: ${template.category}`,
      `Kullanım Alanı: ${template.usageArea}`,
      `Versiyon: ${template.version}`,
      '',
      template.content || 'Şablon içeriği ofis tarafından yüklenecektir.',
    ].join('\n')

    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = fileName
    a.click()

    URL.revokeObjectURL(url)
  }

  const templateStats = computed(() => {
    return {
      total: templates.value.length,
      active: templates.value.filter(item => item.active).length,
      registration: templates.value.filter(item => item.requiredForRegistration).length,
      business: templates.value.filter(item => !item.requiredForRegistration).length,
      waitingApproval: consultantDocuments.value.filter(item => item.status === 'Onaya Gönderildi').length,
      revised: consultantDocuments.value.filter(item => item.status === 'Revize İstendi').length,
    }
  })

  return {
    templates,
    consultantDocuments,
    hydrateDocumentTemplates,
    persistTemplates,
    persistConsultantDocuments,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getActiveTemplates,
    getRegistrationTemplates,
    getConsultantDocuments,
    getConsultantDocumentStatus,
    uploadConsultantDocument,
    submitConsultantDocument,
    approveConsultantDocument,
    requestRevisionForDocument,
    getRegistrationProgress,
    downloadTemplate,
    templateStats,
  }
}
