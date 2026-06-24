import { useCustomers } from '~/composables/useCustomers'

export const useCustomerSpecialTasks = () => {
  const completedStorageKey = 'emlak-crm-special-task-completed'

  const {
    customers,
    hydrateCustomers,
  } = useCustomers()

  const completedIds = useState('special-task-completed-ids', () => [])

  const today = () => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }

  const toIsoDate = (date) => {
    return date.toISOString().slice(0, 10)
  }

  const hydrateSpecialTasks = () => {
    hydrateCustomers()

    if (!process.client) return

    const saved = localStorage.getItem(completedStorageKey)

    if (saved) {
      try {
        completedIds.value = JSON.parse(saved)
      } catch (error) {
        completedIds.value = []
      }
    }
  }

  const persistCompleted = () => {
    if (!process.client) return
    localStorage.setItem(completedStorageKey, JSON.stringify(completedIds.value))
  }

  const nextOccurrence = (dateValue) => {
    if (!dateValue) return null

    const parts = String(dateValue).split('-')
    if (parts.length < 3) return null

    const month = Number(parts[1])
    const day = Number(parts[2])

    if (!month || !day) return null

    const base = today()
    let next = new Date(base.getFullYear(), month - 1, day)

    if (next < base) {
      next = new Date(base.getFullYear() + 1, month - 1, day)
    }

    return next
  }

  const daysUntil = (date) => {
    if (!date) return 9999

    const diff = date.getTime() - today().getTime()
    return Math.round(diff / (1000 * 60 * 60 * 24))
  }

  const makeTask = ({
    customer,
    title,
    type,
    date,
    action,
    description,
  }) => {
    const dueDate = toIsoDate(date)
    const id = `special-${customer.id}-${type}-${action}-${dueDate}`

    return {
      id,
      customerId: customer.id,
      customerName: customer.fullName || customer.name || '',
      phone: customer.phone || '',
      whatsapp: customer.whatsapp || customer.phone || '',
      title,
      type,
      action,
      dueDate,
      daysLeft: daysUntil(date),
      description,
      done: completedIds.value.includes(id),
      source: 'Müşteri Özel Gün',
    }
  }

  const addCallAndMessageTasks = (list, customer, dateValue, titlePrefix, type, description) => {
    const date = nextOccurrence(dateValue)
    if (!date) return

    list.push(makeTask({
      customer,
      title: `${titlePrefix} - Ara`,
      type,
      date,
      action: 'Ara',
      description,
    }))

    list.push(makeTask({
      customer,
      title: `${titlePrefix} - Kutla / Mesaj Gönder`,
      type,
      date,
      action: 'Mesaj',
      description,
    }))
  }

  const buildTasks = () => {
    const list = []

    customers.value.forEach((customer) => {
      addCallAndMessageTasks(
        list,
        customer,
        customer.birthDate,
        'Doğum Günü',
        'customer-birthday',
        'Müşterinin doğum günü geldi. Arama veya özel gün mesajı için hatırlatma.'
      )

      addCallAndMessageTasks(
        list,
        customer,
        customer.hometownLiberationDate,
        customer.hometownLiberationTitle || 'Memleket Kurtuluş Günü',
        'hometown-liberation',
        'Müşterinin memleketinin düşman işgalinden kurtuluş günü. Arama veya mesaj için hatırlatma.'
      )

      addCallAndMessageTasks(
        list,
        customer,
        customer.spouseBirthDate,
        'Eş Doğum Günü',
        'spouse-birthday',
        'Müşterinin eşinin doğum günü.'
      )

      addCallAndMessageTasks(
        list,
        customer,
        customer.weddingAnniversary,
        'Evlilik Yıldönümü',
        'wedding-anniversary',
        'Müşterinin evlilik yıldönümü.'
      )

      if (Array.isArray(customer.children)) {
        customer.children.forEach((child, index) => {
          addCallAndMessageTasks(
            list,
            customer,
            child.birthDate,
            `${child.name || `${index + 1}. Çocuk`} Doğum Günü`,
            `child-${index + 1}-birthday`,
            'Müşterinin çocuğunun doğum günü.'
          )
        })
      }

      addCallAndMessageTasks(
        list,
        customer,
        customer.motherBirthDate,
        'Anne Doğum Günü',
        'mother-birthday',
        'Müşterinin annesinin doğum günü.'
      )

      addCallAndMessageTasks(
        list,
        customer,
        customer.fatherBirthDate,
        'Baba Doğum Günü',
        'father-birthday',
        'Müşterinin babasının doğum günü.'
      )
    })

    return list.sort((a, b) => {
      return a.dueDate.localeCompare(b.dueDate)
    })
  }

  const tasks = computed(() => buildTasks())

  const markDone = (taskId) => {
    if (!completedIds.value.includes(taskId)) {
      completedIds.value.push(taskId)
      persistCompleted()
    }
  }

  const undoDone = (taskId) => {
    completedIds.value = completedIds.value.filter(item => item !== taskId)
    persistCompleted()
  }

  return {
    tasks,
    completedIds,
    hydrateSpecialTasks,
    markDone,
    undoDone,
  }
}
