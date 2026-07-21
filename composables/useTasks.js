export const useTasks = () => {
  const storageKey = 'emlak-crm-manual-tasks'

  const defaultTasks = [
    {
      id: 1,
      title: 'Malik bilgilendirme yapılacak',
      category: 'Mülk Bilgilendirme',
      relatedCustomerName: 'Mehmet Kaya',
      relatedPropertyTitle: 'Yenişehir Gıda Çarşısı Satılık Dükkan',
      dueDate: '2026-06-24',
      priority: 'Yüksek',
      status: 'Bekliyor',
      description: 'Portföy sahibi aranacak, gelen talepler ve piyasa geri bildirimi aktarılacak.',
      createdAt: '2026-06-20',
    },
    {
      id: 2,
      title: 'Yatırımcı müşteri aranacak',
      category: 'Müşteri Arama',
      relatedCustomerName: 'Ali Demir',
      relatedPropertyTitle: '',
      dueDate: '2026-06-25',
      priority: 'Normal',
      status: 'Bekliyor',
      description: 'Ticari gayrimenkul arayışı için takip araması yapılacak.',
      createdAt: '2026-06-20',
    },
  ]

  const tasks = useState('manual-tasks', () => defaultTasks)

  const normalizeTask = (task = {}) => {
    return {
      id: task.id || Date.now(),
      title: task.title || '',
      category: task.category || 'Genel Görev',
      relatedCustomerName: task.relatedCustomerName || task.customerName || '',
      relatedPropertyTitle: task.relatedPropertyTitle || task.propertyTitle || '',
      dueDate: task.dueDate || task.date || '',
      priority: task.priority || 'Normal',
      status: task.status || 'Bekliyor',
      description: task.description || task.note || '',
      createdAt: task.createdAt || new Date().toISOString().slice(0, 10),
    }
  }

  const hydrateTasks = () => {
    if (!process.client) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        tasks.value = Array.isArray(parsed)
          ? parsed.map(normalizeTask)
          : defaultTasks
      } catch (error) {
        tasks.value = defaultTasks
      }
    } else {
      tasks.value = defaultTasks
      localStorage.setItem(storageKey, JSON.stringify(tasks.value))
    }
  }

  const persistTasks = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(tasks.value))
  }

  const createTask = (payload = {}) => {
    const newTask = normalizeTask({
      id: Date.now(),
      ...payload,
      createdAt: new Date().toISOString().slice(0, 10),
    })

    tasks.value.unshift(newTask)
    persistTasks()

    return newTask
  }

  const addTask = createTask

  const updateTask = (id, fieldOrPayload, value = null) => {
    const task = tasks.value.find(item => String(item.id) === String(id))
    if (!task) return null

    if (typeof fieldOrPayload === 'string') {
      task[fieldOrPayload] = value
    } else {
      Object.assign(task, fieldOrPayload)
    }

    const normalized = normalizeTask(task)
    Object.assign(task, normalized)

    persistTasks()
    return task
  }

  const completeTask = (id) => {
    return updateTask(id, 'status', 'Tamamlandı')
  }

  const reopenTask = (id) => {
    return updateTask(id, 'status', 'Bekliyor')
  }

  const deleteTask = (id) => {
    tasks.value = tasks.value.filter(item => String(item.id) !== String(id))
    persistTasks()
  }

  const today = () => new Date().toISOString().slice(0, 10)

  const isOverdue = (task) => {
    return task.status !== 'Tamamlandı' &&
      task.dueDate &&
      task.dueDate < today()
  }

  const taskStats = computed(() => {
    return {
      total: tasks.value.length,
      waiting: tasks.value.filter(item => item.status !== 'Tamamlandı').length,
      today: tasks.value.filter(item => item.dueDate === today() && item.status !== 'Tamamlandı').length,
      overdue: tasks.value.filter(item => isOverdue(item)).length,
      completed: tasks.value.filter(item => item.status === 'Tamamlandı').length,
    }
  })

  const api = {
    tasks,
    hydrateTasks,
    persistTasks,
    normalizeTask,
    createTask,
    addTask,
    updateTask,
    completeTask,
    reopenTask,
    deleteTask,
    isOverdue,
    taskStats,
  }

  return Object.assign(tasks, api)
}

// Sayfaların doğrudan isimli import ile kullanabilmesi için composable'a
// delege eden modül-seviyesi yardımcılar.
export const createTask = (payload = {}) => useTasks().createTask(payload)

export const updateTask = (id, fieldOrPayload, value = null) =>
  useTasks().updateTask(id, fieldOrPayload, value)

export const deleteTask = (id) => useTasks().deleteTask(id)

export const getTaskById = (id) => {
  const store = useTasks()
  return store.tasks.value.find(item => String(item.id) === String(id)) || null
}