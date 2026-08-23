import {
  CustomerSource,
  CustomerStatus,
  CustomerType,
} from '~/constants/enums'

/**
 * Müşteri deposu.
 *
 * Önceki sürümde her alanın 2-3 takma adı vardı (fullName/name, note/notes/additionalNotes,
 * city/livingCity, customerType/type, profession/mainProfession) ve normalizeCustomer bunları
 * her okumada `a || b || c` zinciriyle birbirine kopyalıyordu. Hangisinin doğru olduğu belirsizdi.
 *
 * Artık her alan için TEK kanonik ad var. Eski kayıtlar ve Excel/CSV içe aktarımındaki
 * Türkçe başlıklar `migrateLegacyCustomer` ile bir kez kanonik ada çevrilir.
 */
export const useCustomers = () => {
  const storageKey = 'emlak-crm-customers'
  const phonebookStorageKey = 'emlak-crm-private-phonebook'

  const emptyCustomer = {
    id: '',

    // kimlik
    fullName: '',
    phone: '',
    whatsapp: '',
    email: '',
    birthDate: '',
    age: '',

    // sınıflandırma / sahiplik
    customerType: 'Prospect',
    status: 'Active',
    source: 'Manual',
    visibility: 'Personal',
    officeShared: false,
    sharedAt: '',
    consultantId: '',
    isFromPhonebook: false,
    phonebookContactId: null,

    // takip
    lastContactDate: '',
    nextFollowDate: '',
    followIntervalDays: '',

    // memleket
    hometown: '',
    hometownLiberationDate: '',
    hometownLiberationTitle: '',
    hometownNotes: '',

    // yaşadığı yer
    livingCity: '',
    livingDistrict: '',
    livingNeighborhood: '',
    livingSite: '',
    livingBlock: '',
    livingApartment: '',
    livingPlaceNotes: '',

    // meslek
    mainProfession: '',
    mainProfessionInstitution: '',
    mainProfessionSubInstitution: '',
    mainProfessionNotes: '',
    sideProfession: '',
    sideProfessionInstitution: '',
    sideProfessionSubInstitution: '',
    sideProfessionNotes: '',
    oldProfession: '',
    oldProfessionInstitution: '',
    oldProfessionSubInstitution: '',
    oldProfessionNotes: '',

    // ilişki
    relationToMe: '',
    metThrough: '',
    mutualFriend1: '',
    mutualFriend2: '',

    // aile
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

    // mülk durumu
    houseOwnership: '',
    landlordHouseRent: '',
    shopOwnership: '',
    shopName: '',
    landlordShopRent: '',
    propertyNotes: '',

    // sosyal medya (flat) — jsonb listeye geçiş plan §14/5'te karar bekliyor
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

    // ilgi alanları (flat) — aynı şekilde §14/5
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

    // serbest
    specialDaysNote: '',
    note: '',
    createdAt: '',
  }

  const customers = useState('customers', () => [])

  const newId = () => (import.meta.client && crypto?.randomUUID ? crypto.randomUUID() : `tmp-${Date.now()}-${customers.value.length}`)

  const cleanPhone = (value = '') => String(value).replace(/\s+/g, '').trim()

  /** Türkçe etiket -> enum değeri (eski kayıtlar ve Excel başlıkları için). */
  const valueFromLabel = (enumMap, label, fallback) => {
    if (!label) return fallback
    if (enumMap[label]) return label
    const hit = Object.entries(enumMap).find(([, l]) => l === label)
    return hit ? hit[0] : fallback
  }

  const normalizeChildren = (input) => {
    if (Array.isArray(input?.children)) {
      return input.children.map((child, index) => ({
        id: child.id || `${Date.now()}-${index}`,
        name: child.name || child.childName || '',
        birthDate: child.birthDate || '',
        profession: child.profession || '',
        note: child.note || '',
      }))
    }

    // child1Name / child2BirthDate ... biçimindeki eski alanlar
    return [1, 2, 3]
      .filter(i => input?.[`child${i}Name`] || input?.[`child${i}BirthDate`])
      .map(i => ({
        id: `${Date.now()}-${i}`,
        name: input[`child${i}Name`] || '',
        birthDate: input[`child${i}BirthDate`] || '',
        profession: '',
        note: '',
      }))
  }

  /**
   * Eski/harici bir kaydı kanonik alan adlarına çevirir. Yalnızca burada `a || b`
   * zinciri vardır; sistemin geri kalanı tek isim görür.
   */
  const migrateLegacyCustomer = (raw = {}) => ({
    ...raw,
    fullName: raw.fullName || raw.name || raw['İsim Soyisim'] || '',
    phone: raw.phone || raw.telefon || raw['Telefon'] || '',
    whatsapp: raw.whatsapp || raw.phone || raw.telefon || raw['Telefon'] || '',
    email: raw.email || raw['E-Posta'] || '',
    birthDate: raw.birthDate || raw['Doğum Tarihi'] || '',
    age: raw.age || raw['Yaş'] || '',
    hometown: raw.hometown || raw['Memleket'] || '',
    livingCity: raw.livingCity || raw.city || raw['Yaşadığı Şehir'] || '',
    mainProfession: raw.mainProfession || raw.profession || raw['Ana Mesleği'] || '',
    note: raw.note || raw.notes || raw.additionalNotes || '',
    customerType: valueFromLabel(CustomerType, raw.customerType || raw.type, 'Prospect'),
    status: valueFromLabel(CustomerStatus, raw.status, 'Active'),
    source: valueFromLabel(CustomerSource, raw.source, 'Manual'),
    children: normalizeChildren(raw),
  })

  const normalizeCustomer = (raw = {}) => {
    const migrated = migrateLegacyCustomer(raw)
    const officeShared = Boolean(migrated.officeShared)

    const normalized = {}
    for (const key of Object.keys(emptyCustomer)) {
      normalized[key] = migrated[key] !== undefined ? migrated[key] : emptyCustomer[key]
    }

    normalized.id = migrated.id || newId()
    normalized.officeShared = officeShared
    normalized.visibility = officeShared ? 'OfficeShared' : 'Personal'
    normalized.isFromPhonebook = Boolean(migrated.isFromPhonebook)
    normalized.createdAt = migrated.createdAt || new Date().toISOString().slice(0, 10)

    return normalized
  }

  const persistCustomers = () => {
    if (!import.meta.client) return
    localStorage.setItem(storageKey, JSON.stringify(customers.value))
  }

  const createCustomer = (payload = {}) => {
    const customer = normalizeCustomer({ ...payload, id: payload.id || newId() })

    if (!customers.value.some(item => String(item.id) === String(customer.id))) {
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

    Object.assign(customer, normalizeCustomer(customer))
    persistCustomers()
    return customer
  }

  const updateCustomerField = updateCustomer

  const deleteCustomer = (id) => {
    customers.value = customers.value.filter(item => String(item.id) !== String(id))
    persistCustomers()
  }

  const getCustomerById = id =>
    customers.value.find(item => String(item.id) === String(id)) || null

  const getCustomer = getCustomerById

  const createCustomerFromPhonebook = (contact = {}) => {
    const existing = customers.value.find((item) => {
      const samePhonebookId = item.phonebookContactId && contact.id &&
        String(item.phonebookContactId) === String(contact.id)
      const samePhone = item.phone && contact.phone &&
        cleanPhone(item.phone) === cleanPhone(contact.phone)
      return samePhonebookId || samePhone
    })

    const payload = normalizeCustomer({
      id: existing?.id || newId(),
      fullName: contact.fullName || '',
      phone: contact.phone || '',
      whatsapp: contact.whatsapp || contact.phone || '',
      email: contact.email || '',
      livingCity: contact.city || '',
      customerType: contact.relationType || 'Prospect',
      source: 'Phonebook',
      status: 'Active',
      consultantId: contact.consultantId || '',
      officeShared: Boolean(contact.officeShared),
      sharedAt: contact.sharedAt || '',
      isFromPhonebook: true,
      phonebookContactId: contact.id || null,
      lastContactDate: contact.lastContactDate || '',
      nextFollowDate: contact.nextFollowDate || '',
      note: contact.note || 'Rehberden aktarıldı.',
      createdAt: contact.createdAt || new Date().toISOString().slice(0, 10),
    })

    if (existing) {
      Object.assign(existing, payload, { id: existing.id })
      persistCustomers()
      return existing
    }

    customers.value.unshift(payload)
    persistCustomers()
    return payload
  }

  const syncPhonebookContactsToCustomers = () => {
    if (!import.meta.client) return []

    let phonebookContacts = []
    try {
      phonebookContacts = JSON.parse(localStorage.getItem(phonebookStorageKey) || '[]')
    } catch {
      phonebookContacts = []
    }

    if (!Array.isArray(phonebookContacts)) return []

    const synced = phonebookContacts.map(contact => createCustomerFromPhonebook(contact))
    persistCustomers()
    return synced
  }

  const hydrateCustomers = () => {
    if (!import.meta.client) return

    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]')
      customers.value = Array.isArray(parsed) ? parsed.map(normalizeCustomer) : []
    } catch {
      customers.value = []
    }

    syncPhonebookContactsToCustomers()
    persistCustomers()
  }

  const getConsultantCustomers = consultantId =>
    customers.value.filter(item => String(item.consultantId) === String(consultantId))

  const getOfficeVisibleCustomers = () =>
    customers.value.filter(item => item.visibility !== 'Personal')

  const setOfficeSharing = (id, shared) => {
    const customer = getCustomerById(id)
    if (!customer) return

    customer.officeShared = shared
    customer.visibility = shared ? 'OfficeShared' : 'Personal'
    customer.sharedAt = shared ? new Date().toISOString().slice(0, 10) : ''
    persistCustomers()
  }

  const shareCustomerWithOffice = id => setOfficeSharing(id, true)
  const unshareCustomerFromOffice = id => setOfficeSharing(id, false)

  const customerStats = computed(() => {
    const today = new Date().toISOString().slice(0, 10)

    return {
      total: customers.value.length,
      privateCount: customers.value.filter(item => item.visibility === 'Personal').length,
      officeSharedCount: customers.value.filter(item => item.visibility !== 'Personal').length,
      fromPhonebookCount: customers.value.filter(item => item.isFromPhonebook).length,
      followNeededCount: customers.value.filter(item => item.nextFollowDate && item.nextFollowDate <= today).length,
    }
  })

  const api = {
    customers,
    emptyCustomer,
    hydrateCustomers,
    persistCustomers,
    normalizeCustomer,
    migrateLegacyCustomer,
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

export const getCustomerById = id => useCustomers().getCustomerById(id)

export const updateCustomer = (id, payloadOrField, value = null) =>
  useCustomers().updateCustomer(id, payloadOrField, value)
