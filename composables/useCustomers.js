export const useCustomers = () => {
  const storageKey = 'emlak-crm-customers'
  const phonebookStorageKey = 'emlak-crm-private-phonebook'

  const emptyCustomer = {
    id: 1,
    fullName: '',
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    hometown: '',
    hometownLiberationDate: '',
    hometownLiberationTitle: '',
    birthDate: '',
    age: '',
    mainProfession: '',
    sideProfession: '',
    oldProfession: '',
    profession: '',
    relationToMe: '',
    metThrough: '',
    mutualFriend1: '',
    mutualFriend2: '',
    hometownNotes: '',

    mainProfessionInstitution: '',
    mainProfessionSubInstitution: '',
    mainProfessionNotes: '',
    sideProfessionInstitution: '',
    sideProfessionSubInstitution: '',
    sideProfessionNotes: '',
    oldProfessionInstitution: '',
    oldProfessionSubInstitution: '',
    oldProfessionNotes: '',

    city: '',
    livingCity: '',
    livingDistrict: '',
    livingNeighborhood: '',
    livingSite: '',
    livingBlock: '',
    livingApartment: '',
    livingPlaceNotes: '',

    facebookName: '',
    facebookMutualFollow: '',
    facebookPageName: '',
    facebookPageMutualFollow: '',
    instagramName: '',
    instagramMutualFollow: '',
    instagramPageFollow: '',
    instagramPageMutualFollow: '',
    linkedinName: '',
    linkedinMutualFollow: '',
    youtubeChannelName: '',
    youtubeChannelMutualFollow: '',
    twitterName: '',
    twitterMutualFollow: '',

    maritalStatus: '',
    spouseName: '',
    spousePhone: '',
    spouseBirthDate: '',
    weddingAnniversary: '',
    spouseProfession: '',
    spouseWorkplace: '',
    spouseHometown: '',
    spouseNotes: '',

    children: [],

    propertyNotes: '',
    houseOwnership: '',
    landlordHouseRent: '',
    shopOwnership: '',
    shopName: '',
    landlordShopRent: '',

    favoriteTeam: '',
    teamFanLevel: '',
    teamSpecialDate: '',
    politicalView: '',
    politicalFanLevel: '',

    carBrand: '',
    carModel: '',
    carFanLevel: '',
    carNotes: '',
    boatBrand: '',
    boatModel: '',
    boatFanLevel: '',
    boatNotes: '',
    petName: '',
    petAge: '',
    petNotes: '',
    mainHobby: '',
    mainHobbyNotes: '',
    hobbies: '',
    additionalNotes: '',

    motherName: '',
    motherProfession: '',
    motherBirthDate: '',
    motherDeathDate: '',
    motherNotes: '',
    fatherName: '',
    fatherProfession: '',
    fatherBirthDate: '',
    fatherDeathDate: '',
    fatherNotes: '',

    customerType: 'Aday Müşteri',
    type: 'Aday Müşteri',
    source: 'Manuel Kayıt',
    status: 'Aktif',
    visibility: 'Kişisel',
    dataOwner: 'Danışman',
    consultantId: 1,
    consultantName: '',
    officeShared: false,
    isFromPhonebook: false,
    phonebookContactId: null,
    sharedAt: '',
    lastContactDate: '',
    nextFollowDate: '',
    specialDaysNote: '',
    note: '',
    notes: '',
    createdAt: '',
  }

  const defaultCustomers = [
    {
      ...emptyCustomer,
      id: 1,
      fullName: 'Mehmet Kaya',
      name: 'Mehmet Kaya',
      phone: '0533 111 22 33',
      whatsapp: '0533 111 22 33',
      email: '',
      hometown: 'İzmir',
      birthDate: '',
      customerType: 'Mal Sahibi',
      type: 'Mal Sahibi',
      consultantName: 'Sinan Tontaş',
      source: 'Telefon Rehberi',
      isFromPhonebook: true,
      note: 'Danışman tarafından sisteme eklenmiş örnek müşteri.',
      notes: 'Danışman tarafından sisteme eklenmiş örnek müşteri.',
      createdAt: '2026-06-20',
      lastContactDate: '2026-06-19',
      nextFollowDate: '2026-07-09',
    },
  ]

  const customers = useState('customers', () => defaultCustomers)

  const cleanPhone = (value = '') => {
    return String(value).replace(/\s+/g, '').trim()
  }

  const normalizeChildren = (customer = {}) => {
    if (Array.isArray(customer.children)) {
      return customer.children.map((child, index) => ({
        id: child.id || Date.now() + index,
        name: child.name || child.childName || '',
        birthDate: child.birthDate || '',
        profession: child.profession || '',
        note: child.note || '',
      }))
    }

    const legacyChildren = []

    if (customer.child1Name || customer.child1BirthDate) {
      legacyChildren.push({
        id: Date.now() + 1,
        name: customer.child1Name || '',
        birthDate: customer.child1BirthDate || '',
        profession: '',
        note: '',
      })
    }

    if (customer.child2Name || customer.child2BirthDate) {
      legacyChildren.push({
        id: Date.now() + 2,
        name: customer.child2Name || '',
        birthDate: customer.child2BirthDate || '',
        profession: '',
        note: '',
      })
    }

    if (customer.child3Name || customer.child3BirthDate) {
      legacyChildren.push({
        id: Date.now() + 3,
        name: customer.child3Name || '',
        birthDate: customer.child3BirthDate || '',
        profession: '',
        note: '',
      })
    }

    return legacyChildren
  }

  const normalizeCustomer = (customer = {}) => {
    const normalized = {
      ...emptyCustomer,
      ...customer,
      id: customer.id || Date.now(),
      fullName: customer.fullName || customer.name || customer['İsim Soyisim'] || '',
      name: customer.name || customer.fullName || customer['İsim Soyisim'] || '',
      phone: customer.phone || customer.telefon || customer['Telefon'] || '',
      whatsapp: customer.whatsapp || customer.phone || customer.telefon || customer['Telefon'] || '',
      email: customer.email || customer['E-Posta'] || '',
      hometown: customer.hometown || customer['Memleket'] || '',
      birthDate: customer.birthDate || customer['Doğum Tarihi'] || '',
      age: customer.age || customer['Yaş'] || '',
      city: customer.city || customer.livingCity || customer['Yaşadığı Şehir'] || '',
      livingCity: customer.livingCity || customer.city || customer['Yaşadığı Şehir'] || '',
      profession: customer.profession || customer.mainProfession || customer['Ana Mesleği'] || '',
      mainProfession: customer.mainProfession || customer.profession || customer['Ana Mesleği'] || '',
      customerType: customer.customerType || customer.type || 'Aday Müşteri',
      type: customer.type || customer.customerType || 'Aday Müşteri',
      visibility: customer.officeShared ? 'Ofisle Paylaşıldı' : (customer.visibility || 'Kişisel'),
      officeShared: Boolean(customer.officeShared),
      isFromPhonebook: Boolean(customer.isFromPhonebook),
      children: normalizeChildren(customer),
      note: customer.note || customer.notes || customer.additionalNotes || '',
      notes: customer.notes || customer.note || customer.additionalNotes || '',
      createdAt: customer.createdAt || new Date().toISOString().slice(0, 10),
    }

    return normalized
  }

  const persistCustomers = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(customers.value))
  }

  const createCustomer = (payload = {}) => {
    const customer = normalizeCustomer({
      id: payload.id || Date.now(),
      ...payload,
      createdAt: payload.createdAt || new Date().toISOString().slice(0, 10),
    })

    const exists = customers.value.some(item => String(item.id) === String(customer.id))

    if (!exists) {
      customers.value.unshift(customer)
      persistCustomers()
    }

    return customer
  }

  const addCustomer = createCustomer

  const updateCustomer = (id, payloadOrField, value = null) => {
    const customer = customers.value.find(item => String(item.id) === String(id))
    if (!customer) return null

    if (typeof payloadOrField === 'string') {
      customer[payloadOrField] = value
    } else {
      Object.assign(customer, payloadOrField)
    }

    const normalized = normalizeCustomer(customer)
    Object.assign(customer, normalized)

    persistCustomers()
    return customer
  }

  const updateCustomerField = updateCustomer

  const deleteCustomer = (id) => {
    customers.value = customers.value.filter(item => String(item.id) !== String(id))
    persistCustomers()
  }

  const getCustomerById = (id) => {
    return customers.value.find(item => String(item.id) === String(id)) || null
  }

  const getCustomer = getCustomerById

  const createCustomerFromPhonebook = (contact = {}) => {
    const existing = customers.value.find(item => {
      const samePhonebookId =
        item.phonebookContactId &&
        contact.id &&
        String(item.phonebookContactId) === String(contact.id)

      const samePhone =
        item.phone &&
        contact.phone &&
        cleanPhone(item.phone) === cleanPhone(contact.phone)

      return samePhonebookId || samePhone
    })

    const payload = normalizeCustomer({
      fullName: contact.fullName || '',
      name: contact.fullName || '',
      phone: contact.phone || '',
      whatsapp: contact.whatsapp || contact.phone || '',
      email: contact.email || '',
      city: contact.city || '',
      livingCity: contact.city || '',
      customerType: contact.relationType || 'Aday Müşteri',
      type: contact.relationType || 'Aday Müşteri',
      source: 'Telefon Rehberi',
      status: 'Aktif',
      visibility: contact.officeShared ? 'Ofisle Paylaşıldı' : 'Kişisel',
      dataOwner: 'Danışman',
      consultantId: contact.consultantId || 1,
      consultantName: contact.consultantName || '',
      officeShared: Boolean(contact.officeShared),
      isFromPhonebook: true,
      phonebookContactId: contact.id || null,
      sharedAt: contact.sharedAt || '',
      lastContactDate: contact.lastContactDate || '',
      nextFollowDate: contact.nextFollowDate || '',
      note: contact.note || 'Rehberden aktarıldı.',
      notes: contact.note || 'Rehberden aktarıldı.',
      createdAt: contact.createdAt || new Date().toISOString().slice(0, 10),
    })

    if (existing) {
      Object.assign(existing, {
        ...existing,
        ...payload,
        id: existing.id,
      })

      persistCustomers()
      return existing
    }

    const customer = {
      ...payload,
      id: Date.now() + Math.floor(Math.random() * 1000),
    }

    customers.value.unshift(customer)
    persistCustomers()

    return customer
  }

  const syncPhonebookContactsToCustomers = () => {
    if (!process.client) return []

    const savedPhonebook = localStorage.getItem(phonebookStorageKey)
    if (!savedPhonebook) return []

    let phonebookContacts = []

    try {
      phonebookContacts = JSON.parse(savedPhonebook)
    } catch (error) {
      phonebookContacts = []
    }

    const synced = []

    phonebookContacts.forEach((contact) => {
      synced.push(createCustomerFromPhonebook(contact))
    })

    persistCustomers()

    return synced
  }

  const hydrateCustomers = () => {
    if (!process.client) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        customers.value = Array.isArray(parsed)
          ? parsed.map(normalizeCustomer)
          : defaultCustomers
      } catch (error) {
        customers.value = defaultCustomers
      }
    } else {
      customers.value = defaultCustomers
      persistCustomers()
    }

    syncPhonebookContactsToCustomers()
  }

  const getConsultantCustomers = (consultantId) => {
    return customers.value.filter(item => String(item.consultantId) === String(consultantId))
  }

  const getOfficeVisibleCustomers = () => {
    return customers.value.filter(item => item.officeShared || item.visibility === 'Ofisle Paylaşıldı')
  }

  const shareCustomerWithOffice = (id) => {
    const customer = getCustomerById(id)
    if (!customer) return

    customer.officeShared = true
    customer.visibility = 'Ofisle Paylaşıldı'
    customer.sharedAt = new Date().toISOString().slice(0, 10)

    persistCustomers()
  }

  const unshareCustomerFromOffice = (id) => {
    const customer = getCustomerById(id)
    if (!customer) return

    customer.officeShared = false
    customer.visibility = 'Kişisel'
    customer.sharedAt = ''

    persistCustomers()
  }

  const customerStats = computed(() => {
    return {
      total: customers.value.length,
      privateCount: customers.value.filter(item => !item.officeShared).length,
      officeSharedCount: customers.value.filter(item => item.officeShared).length,
      fromPhonebookCount: customers.value.filter(item => item.isFromPhonebook).length,
      followNeededCount: customers.value.filter(item => {
        return item.nextFollowDate &&
          item.nextFollowDate <= new Date().toISOString().slice(0, 10)
      }).length,
    }
  })

  const api = {
    customers,
    emptyCustomer,
    hydrateCustomers,
    persistCustomers,
    normalizeCustomer,
    createCustomer,
    addCustomer,
    updateCustomer,
    updateCustomerField,
    deleteCustomer,
    getCustomerById,
    getCustomer,
    createCustomerFromPhonebook,
    syncPhonebookContactsToCustomers,
    getConsultantCustomers,
    getOfficeVisibleCustomers,
    shareCustomerWithOffice,
    unshareCustomerFromOffice,
    customerStats,
  }

  return Object.assign(customers, api)
}
