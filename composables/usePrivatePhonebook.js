import { useCustomers } from '~/composables/useCustomers'

export const usePrivatePhonebook = () => {
  const storageKey = 'emlak-crm-private-phonebook'

  const {
    createCustomerFromPhonebook,
    syncPhonebookContactsToCustomers,
    shareCustomerWithOffice,
    unshareCustomerFromOffice,
  } = useCustomers()

  const defaultContacts = [
    {
      id: 1,
      consultantId: 1,
      consultantName: 'Sinan Tontaş',
      fullName: 'Ahmet Yılmaz',
      phone: '0532 000 00 00',
      whatsapp: '0532 000 00 00',
      email: '',
      city: 'İzmir',
      relationType: 'Yatırımcı',
      source: 'Telefon Rehberi',
      privacy: 'Kişisel',
      officeShared: false,
      sharedAt: '',
      isCustomerConverted: true,
      lastContactDate: '',
      nextFollowDate: '',
      note: 'Kişisel rehber kaydı. Broker göremez.',
      createdAt: '2026-06-20',
    },
  ]

  const contacts = useState('private-phonebook', () => defaultContacts)

  const normalizePhone = (value = '') => {
    return String(value)
      .replace(/\s+/g, ' ')
      .trim()
  }

  const normalizeContact = (contact) => {
    return {
      id: contact.id || Date.now(),
      consultantId: contact.consultantId || 1,
      consultantName: contact.consultantName || '',
      fullName: contact.fullName || '',
      phone: normalizePhone(contact.phone || ''),
      whatsapp: normalizePhone(contact.whatsapp || contact.phone || ''),
      email: contact.email || '',
      city: contact.city || '',
      relationType: contact.relationType || 'Kişisel Rehber',
      source: contact.source || 'Telefon Rehberi',
      privacy: contact.officeShared ? 'Ofisle Paylaşıldı' : 'Kişisel',
      officeShared: Boolean(contact.officeShared),
      sharedAt: contact.sharedAt || '',
      isCustomerConverted: true,
      lastContactDate: contact.lastContactDate || '',
      nextFollowDate: contact.nextFollowDate || '',
      note: contact.note || '',
      createdAt: contact.createdAt || new Date().toISOString().slice(0, 10),
    }
  }

  const hydratePhonebook = () => {
    if (!process.client) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        contacts.value = JSON.parse(saved).map(normalizeContact)
      } catch (error) {
        contacts.value = defaultContacts
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(contacts.value))
    }

    syncPhonebookContactsToCustomers()
  }

  const persistPhonebook = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(contacts.value))
  }

  const createPhoneContact = (payload) => {
    const newContact = normalizeContact({
      id: Date.now(),
      ...payload,
      isCustomerConverted: true,
      createdAt: new Date().toISOString().slice(0, 10),
    })

    contacts.value.unshift(newContact)
    persistPhonebook()

    createCustomerFromPhonebook(newContact)

    return newContact
  }

  const updatePhoneContact = (id, field, value) => {
    const contact = contacts.value.find(item => String(item.id) === String(id))
    if (!contact) return

    if (['officeShared', 'isCustomerConverted'].includes(field)) {
      contact[field] = Boolean(value)
    } else {
      contact[field] = value
    }

    contact.privacy = contact.officeShared ? 'Ofisle Paylaşıldı' : 'Kişisel'
    contact.isCustomerConverted = true

    persistPhonebook()
    createCustomerFromPhonebook(contact)
  }

  const deletePhoneContact = (id) => {
    contacts.value = contacts.value.filter(item => String(item.id) !== String(id))
    persistPhonebook()
  }

  const shareWithOffice = (id) => {
    const contact = contacts.value.find(item => String(item.id) === String(id))
    if (!contact) return

    contact.officeShared = true
    contact.privacy = 'Ofisle Paylaşıldı'
    contact.sharedAt = new Date().toISOString().slice(0, 10)
    contact.isCustomerConverted = true

    persistPhonebook()
    createCustomerFromPhonebook(contact)

    const customer = createCustomerFromPhonebook(contact)
    if (customer?.id) {
      shareCustomerWithOffice(customer.id)
    }
  }

  const unshareFromOffice = (id) => {
    const contact = contacts.value.find(item => String(item.id) === String(id))
    if (!contact) return

    contact.officeShared = false
    contact.privacy = 'Kişisel'
    contact.sharedAt = ''
    contact.isCustomerConverted = true

    persistPhonebook()
    createCustomerFromPhonebook(contact)

    const customer = createCustomerFromPhonebook(contact)
    if (customer?.id) {
      unshareCustomerFromOffice(customer.id)
    }
  }

  const convertToCustomer = (id) => {
    const contact = contacts.value.find(item => String(item.id) === String(id))
    if (!contact) return

    contact.isCustomerConverted = true
    contact.lastContactDate = contact.lastContactDate || new Date().toISOString().slice(0, 10)

    persistPhonebook()
    createCustomerFromPhonebook(contact)
  }

  const getConsultantContacts = (consultantId) => {
    return contacts.value.filter(item => String(item.consultantId) === String(consultantId))
  }

  const getOfficeVisibleContacts = () => {
    return contacts.value.filter(item => item.officeShared)
  }

  const importContactsFromText = ({ text, consultantId, consultantName }) => {
    const rows = String(text || '')
      .split(/\r?\n/)
      .map(row => row.trim())
      .filter(Boolean)

    const imported = []

    rows.forEach((row) => {
      const parts = row.split(',').map(item => item.trim())

      const fullName = parts[0] || ''
      const phone = parts[1] || ''
      const whatsapp = parts[2] || phone
      const email = parts[3] || ''
      const city = parts[4] || ''
      const note = parts.slice(5).join(', ') || ''

      if (!fullName && !phone) return

      const contact = createPhoneContact({
        consultantId,
        consultantName,
        fullName,
        phone,
        whatsapp,
        email,
        city,
        relationType: 'Kişisel Rehber',
        source: 'İçe Aktarım',
        privacy: 'Kişisel',
        officeShared: false,
        isCustomerConverted: true,
        note,
      })

      imported.push(contact)
    })

    syncPhonebookContactsToCustomers()

    return imported
  }

  const phonebookStatsByConsultant = (consultantId) => {
    const list = getConsultantContacts(consultantId)

    return {
      total: list.length,
      privateCount: list.filter(item => !item.officeShared).length,
      sharedCount: list.filter(item => item.officeShared).length,
      convertedCount: list.length,
      followNeededCount: list.filter(item => {
        return item.nextFollowDate &&
          item.nextFollowDate <= new Date().toISOString().slice(0, 10)
      }).length,
    }
  }

  const officeSharedStats = computed(() => {
    const shared = getOfficeVisibleContacts()

    return {
      total: shared.length,
      converted: shared.length,
      consultants: [...new Set(shared.map(item => item.consultantName))].length,
    }
  })

  return {
    contacts,
    hydratePhonebook,
    persistPhonebook,
    createPhoneContact,
    updatePhoneContact,
    deletePhoneContact,
    shareWithOffice,
    unshareFromOffice,
    convertToCustomer,
    getConsultantContacts,
    getOfficeVisibleContacts,
    importContactsFromText,
    phonebookStatsByConsultant,
    officeSharedStats,
  }
}
