<script setup>
import { useTasks } from '~/composables/useTasks'
import { useCustomerSpecialTasks } from '~/composables/useCustomerSpecialTasks'
import { useCustomers } from '~/composables/useCustomers'

const {
  tasks: manualTasks,
  hydrateTasks,
  createTask,
  updateTask,
  completeTask,
  reopenTask,
  deleteTask,
  isOverdue,
  taskStats,
} = useTasks()

const {
  tasks: specialTasks,
  hydrateSpecialTasks,
  markDone,
  undoDone,
} = useCustomerSpecialTasks()

const {
  customers,
  hydrateCustomers,
} = useCustomers()

hydrateTasks()
hydrateCustomers()
hydrateSpecialTasks()

const showForm = ref(false)
const activeFilter = ref('Bekleyen')
const categoryFilter = ref('Tümü')
const search = ref('')
const successMessage = ref('')

const form = reactive({
  title: '',
  category: 'Müşteri Arama',
  relatedCustomerName: '',
  relatedPropertyTitle: '',
  dueDate: new Date().toISOString().slice(0, 10),
  priority: 'Normal',
  description: '',
})

const categoryOptions = [
  'Müşteri Arama',
  'Mülk Bilgilendirme',
  'Malik Raporu',
  'Portföy Gösterimi',
  'Kira Artışı',
  'Yetki Yenileme',
  'Fiyat Revizyonu',
  'Sözleşme Hazırlığı',
  'Tapu Hazırlığı',
  'Ödeme Takibi',
  'Sosyal Medya İçeriği',
  'Toplantı Hazırlığı',
  'Belge Takibi',
  'Genel Görev',
]

const priorityOptions = [
  'Düşük',
  'Normal',
  'Yüksek',
  'Acil',
]

const filterOptions = [
  'Bekleyen',
  'Bugün',
  'Geciken',
  'Yaklaşan 7 Gün',
  'Özel Günler',
  'Tamamlanan',
  'Tümü',
]

const customerOptions = computed(() => {
  return customers.value.map(item => item.fullName || item.name || item.phone).filter(Boolean)
})

const today = () => new Date().toISOString().slice(0, 10)

const daysUntil = (dateValue) => {
  if (!dateValue) return 9999

  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const end = new Date(`${dateValue}T00:00:00`)
  const diff = end.getTime() - start.getTime()

  return Math.round(diff / (1000 * 60 * 60 * 24))
}

const combinedTasks = computed(() => {
  const manual = manualTasks.value.map(task => ({
    id: `manual-${task.id}`,
    rawId: task.id,
    sourceType: 'manual',
    title: task.title,
    category: task.category,
    relatedCustomerName: task.relatedCustomerName,
    relatedPropertyTitle: task.relatedPropertyTitle,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    description: task.description,
    daysLeft: daysUntil(task.dueDate),
    done: task.status === 'Tamamlandı',
    isOverdue: isOverdue(task),
  }))

  const special = specialTasks.value.map(task => ({
    id: task.id,
    rawId: task.id,
    sourceType: 'special',
    title: task.title,
    category: 'Özel Gün',
    relatedCustomerName: task.customerName,
    relatedPropertyTitle: '',
    dueDate: task.dueDate,
    priority: task.daysLeft === 0 ? 'Yüksek' : 'Normal',
    status: task.done ? 'Tamamlandı' : 'Bekliyor',
    description: task.description,
    phone: task.phone,
    whatsapp: task.whatsapp,
    customerId: task.customerId,
    daysLeft: task.daysLeft,
    done: task.done,
    isOverdue: false,
  }))

  return [...manual, ...special].sort((a, b) => {
    return String(a.dueDate || '9999-12-31').localeCompare(String(b.dueDate || '9999-12-31'))
  })
})

const filteredTasks = computed(() => {
  let list = combinedTasks.value

  if (activeFilter.value === 'Bekleyen') {
    list = list.filter(item => !item.done)
  }

  if (activeFilter.value === 'Bugün') {
    list = list.filter(item => item.dueDate === today() && !item.done)
  }

  if (activeFilter.value === 'Geciken') {
    list = list.filter(item => item.isOverdue && !item.done)
  }

  if (activeFilter.value === 'Yaklaşan 7 Gün') {
    list = list.filter(item => item.daysLeft >= 0 && item.daysLeft <= 7 && !item.done)
  }

  if (activeFilter.value === 'Özel Günler') {
    list = list.filter(item => item.sourceType === 'special' && !item.done)
  }

  if (activeFilter.value === 'Tamamlanan') {
    list = list.filter(item => item.done)
  }

  if (categoryFilter.value !== 'Tümü') {
    list = list.filter(item => item.category === categoryFilter.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.title,
        item.category,
        item.relatedCustomerName,
        item.relatedPropertyTitle,
        item.description,
        item.phone,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  return list
})

const stats = computed(() => {
  return {
    waiting: combinedTasks.value.filter(item => !item.done).length,
    today: combinedTasks.value.filter(item => item.dueDate === today() && !item.done).length,
    overdue: combinedTasks.value.filter(item => item.isOverdue && !item.done).length,
    special: combinedTasks.value.filter(item => item.sourceType === 'special' && !item.done).length,
    completed: combinedTasks.value.filter(item => item.done).length,
  }
})

const saveTask = () => {
  if (!form.title) {
    successMessage.value = 'Görev başlığı zorunludur.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  createTask({ ...form })

  form.title = ''
  form.category = 'Müşteri Arama'
  form.relatedCustomerName = ''
  form.relatedPropertyTitle = ''
  form.dueDate = new Date().toISOString().slice(0, 10)
  form.priority = 'Normal'
  form.description = ''

  showForm.value = false
  successMessage.value = 'Görev oluşturuldu.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const completeCombinedTask = (task) => {
  if (task.sourceType === 'special') {
    markDone(task.rawId)
  } else {
    completeTask(task.rawId)
  }
}

const reopenCombinedTask = (task) => {
  if (task.sourceType === 'special') {
    undoDone(task.rawId)
  } else {
    reopenTask(task.rawId)
  }
}

const deleteCombinedTask = (task) => {
  if (task.sourceType === 'special') {
    markDone(task.rawId)
    return
  }

  if (confirm(`${task.title} görevini silmek istiyor musunuz?`)) {
    deleteTask(task.rawId)
  }
}

const daysLabel = (task) => {
  if (!task.dueDate) return '-'
  if (task.done) return 'Tamamlandı'
  if (task.daysLeft < 0) return `${Math.abs(task.daysLeft)} gün gecikti`
  if (task.daysLeft === 0) return 'Bugün'
  if (task.daysLeft === 1) return 'Yarın'
  return `${task.daysLeft} gün kaldı`
}

const badgeClass = (task) => {
  if (task.done) return 'bg-slate-100 text-slate-500'
  if (task.isOverdue) return 'bg-slate-900 text-white'
  if (task.daysLeft === 0) return 'bg-slate-900 text-white'
  if (task.priority === 'Acil') return 'bg-slate-900 text-white'
  if (task.priority === 'Yüksek') return 'bg-slate-200 text-slate-800'
  return 'bg-slate-100 text-slate-700'
}

const clearFilters = () => {
  search.value = ''
  activeFilter.value = 'Bekleyen'
  categoryFilter.value = 'Tümü'
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Görevler
          </p>

          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Görev ve Hatırlatma Merkezi
          </h1>

          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Manuel görevlerinizi, mülk bilgilendirmelerinizi, müşteri aramalarınızı ve otomatik özel gün hatırlatmalarını tek ekrandan takip edin.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          @click="showForm = !showForm"
        >
          <i class="bi bi-plus-lg mr-2"></i>
          Görev Ekle
        </button>
      </div>
    </section>

    <div
      v-if="successMessage"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-info-circle mr-2"></i>
      {{ successMessage }}
    </div>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Bekleyen</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ stats.waiting }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Bugün</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ stats.today }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Geciken</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ stats.overdue }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Özel Gün</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ stats.special }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tamamlanan</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ stats.completed }}</p>
      </div>
    </section>

    <section
      v-if="showForm"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 class="text-xl font-bold text-slate-900">
        Yeni Görev Ekle
      </h2>

      <div class="mt-6 grid gap-4 xl:grid-cols-4">
        <div class="xl:col-span-2">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Görev Başlığı</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Örn: Malik bilgilendirme yapılacak"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
          <select
            v-model="form.category"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in categoryOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Öncelik</label>
          <select
            v-model="form.priority"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in priorityOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Müşteri</label>
          <input
            v-model="form.relatedCustomerName"
            list="customer-list"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Müşteri adı"
          />

          <datalist id="customer-list">
            <option
              v-for="customer in customerOptions"
              :key="customer"
              :value="customer"
            />
          </datalist>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Mülk / Portföy</label>
          <input
            v-model="form.relatedPropertyTitle"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Portföy adı"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Tarih</label>
          <input
            v-model="form.dueDate"
            type="date"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div class="xl:col-span-4">
          <label class="mb-2 block text-sm font-semibold text-slate-700">Açıklama</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Görev açıklaması..."
          ></textarea>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          @click="saveTask"
        >
          Görevi Kaydet
        </button>

        <button
          type="button"
          class="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          @click="showForm = false"
        >
          Vazgeç
        </button>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_220px_140px]">
        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Arama</label>
          <input
            v-model="search"
            type="text"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            placeholder="Görev, müşteri, mülk ara..."
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Durum</label>
          <select
            v-model="activeFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="item in filterOptions"
              :key="item"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
          <select
            v-model="categoryFilter"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option>Tümü</option>
            <option
              v-for="item in categoryOptions"
              :key="item"
            >
              {{ item }}
            </option>
            <option>Özel Gün</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            type="button"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="clearFilters"
          >
            Temizle
          </button>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Görev Listesi
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          {{ filteredTasks.length }} görev listeleniyor.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1350px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Görev</th>
              <th class="px-6 py-4">Kategori</th>
              <th class="px-6 py-4">Müşteri</th>
              <th class="px-6 py-4">Mülk / Portföy</th>
              <th class="px-6 py-4">Tarih</th>
              <th class="px-6 py-4">Durum</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="task in filteredTasks"
              :key="task.id"
              class="align-top hover:bg-slate-50"
            >
              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">{{ task.title }}</p>
                <p class="mt-1 max-w-md text-xs leading-5 text-slate-500">{{ task.description || '-' }}</p>

                <p class="mt-2 text-xs text-slate-400">
                  {{ task.sourceType === 'special' ? 'Otomatik özel gün hatırlatması' : 'Manuel görev' }}
                </p>
              </td>

              <td class="px-6 py-5">
                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {{ task.category }}
                </span>

                <p class="mt-2 text-xs text-slate-500">
                  Öncelik: {{ task.priority }}
                </p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ task.relatedCustomerName || '-' }}</p>

                <NuxtLink
                  v-if="task.customerId"
                  :to="`/contacts/${task.customerId}`"
                  class="mt-1 inline-flex text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  Müşteri detayına git
                </NuxtLink>

                <p
                  v-if="task.phone"
                  class="mt-1 text-xs text-slate-500"
                >
                  {{ task.phone }}
                </p>
              </td>

              <td class="px-6 py-5 text-slate-600">
                {{ task.relatedPropertyTitle || '-' }}
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">{{ task.dueDate || '-' }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ daysLabel(task) }}</p>
              </td>

              <td class="px-6 py-5">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="badgeClass(task)"
                >
                  {{ task.done ? 'Tamamlandı' : daysLabel(task) }}
                </span>
              </td>

              <td class="px-6 py-5 text-right">
                <div class="flex flex-col items-end gap-2">
                  <button
                    v-if="!task.done"
                    type="button"
                    class="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                    @click="completeCombinedTask(task)"
                  >
                    Tamamlandı
                  </button>

                  <button
                    v-else
                    type="button"
                    class="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                    @click="reopenCombinedTask(task)"
                  >
                    Geri Al
                  </button>

                  <button
                    type="button"
                    class="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
                    @click="deleteCombinedTask(task)"
                  >
                    {{ task.sourceType === 'special' ? 'Gizle' : 'Sil' }}
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!filteredTasks.length">
              <td
                colspan="7"
                class="px-6 py-10 text-center text-sm text-slate-500"
              >
                Bu filtreye uygun görev bulunamadı.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
