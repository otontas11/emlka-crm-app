<script setup>
import { useTasks, deleteTask } from '~/composables/useTasks'

const route = useRoute()
const tasks = useTasks()

const task = ref(null)
const isLoading = ref(true)
const isReady = ref(false)

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('tr-TR').format(date)
}

const getStatusClass = (status) => {
  if (status === 'Bugün') return 'bg-amber-100 text-amber-700 border border-amber-200'
  if (status === 'Tamamlandı') return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  if (status === 'Gecikmiş') return 'bg-red-100 text-red-700 border border-red-200'
  return 'bg-blue-100 text-blue-700 border border-blue-200'
}

const getPriorityClass = (priority) => {
  if (priority === 'Yüksek') return 'bg-red-100 text-red-700 border border-red-200'
  if (priority === 'Orta') return 'bg-amber-100 text-amber-700 border border-amber-200'
  return 'bg-slate-100 text-slate-700 border border-slate-200'
}

const loadTask = () => {
  const routeId = String(route.params.id)
  task.value = null

  const fromState = tasks.value.find(item => String(item.id) === routeId)
  if (fromState) {
    task.value = fromState
    return
  }

  if (import.meta.client) {
    const saved = localStorage.getItem('tasks')

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const found = parsed.find(item => String(item.id) === routeId)
        task.value = found || null
      } catch (error) {
        task.value = null
      }
    }
  }
}

const initializePage = async () => {
  isLoading.value = true
  isReady.value = false

  await nextTick()
  loadTask()

  if (!task.value && import.meta.client) {
    await new Promise(resolve => setTimeout(resolve, 150))
    loadTask()
  }

  isLoading.value = false
  isReady.value = true
}

const goToList = () => {
  window.location.href = '/tasks'
}

const goToEdit = () => {
  if (!task.value) return
  window.location.href = '/tasks/edit/' + task.value.id
}

const handleDelete = () => {
  if (!task.value) return

  const approved = window.confirm('Bu görevi silmek istediğine emin misin?')
  if (!approved) return

  deleteTask(task.value.id)
  window.location.href = '/tasks'
}

watch(
  () => route.params.id,
  async () => {
    await initializePage()
  },
  { immediate: true }
)

onMounted(async () => {
  await initializePage()
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="isLoading || !isReady" class="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"></div>
      <h4 class="text-xl font-bold text-slate-900">Görev yükleniyor</h4>
    </div>

    <template v-else-if="task">
      <section class="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl">
        <div class="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between lg:p-8">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Görev Detayı
            </p>
            <h1 class="mb-3 text-3xl font-bold tracking-tight text-white lg:text-4xl">
              {{ task.title }}
            </h1>

            <div class="flex flex-wrap gap-2">
              <span :class="getStatusClass(task.status)" class="rounded-full px-4 py-2 text-sm font-semibold">
                {{ task.status }}
              </span>
              <span :class="getPriorityClass(task.priority)" class="rounded-full px-4 py-2 text-sm font-semibold">
                {{ task.priority }}
              </span>
              <span class="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white">
                {{ task.category }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            @click="goToList"
          >
            <i class="bi bi-arrow-left mr-2"></i>
            Listeye Dön
          </button>
        </div>
      </section>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="space-y-6 lg:col-span-2">
          <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <h2 class="text-lg font-semibold text-slate-900">Görev Bilgileri</h2>
            </div>
            <div class="space-y-4 p-6">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p class="mb-2 text-sm font-semibold text-slate-500">Açıklama</p>
                <p class="leading-7 text-slate-800">{{ task.description || '-' }}</p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p class="mb-2 text-sm font-semibold text-slate-500">Notlar</p>
                <p class="leading-7 text-slate-800">{{ task.notes || '-' }}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="space-y-6">
          <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <h2 class="text-lg font-semibold text-slate-900">Hızlı Özet</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span class="text-sm text-slate-500">Kategori</span>
                  <strong class="text-right text-slate-900">{{ task.category || '-' }}</strong>
                </div>
                <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span class="text-sm text-slate-500">Öncelik</span>
                  <strong class="text-right text-slate-900">{{ task.priority || '-' }}</strong>
                </div>
                <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span class="text-sm text-slate-500">Durum</span>
                  <strong class="text-right text-slate-900">{{ task.status || '-' }}</strong>
                </div>
                <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span class="text-sm text-slate-500">Bağlantı</span>
                  <strong class="text-right text-slate-900">{{ task.relatedType || '-' }}</strong>
                </div>
                <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span class="text-sm text-slate-500">İlgili Kayıt</span>
                  <strong class="text-right text-slate-900">{{ task.relatedName || '-' }}</strong>
                </div>
                <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span class="text-sm text-slate-500">Atanan</span>
                  <strong class="text-right text-slate-900">{{ task.assignedTo || '-' }}</strong>
                </div>
                <div class="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <span class="text-sm text-slate-500">Tarih</span>
                  <strong class="text-right text-slate-900">{{ formatDate(task.dueDate) }}</strong>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm text-slate-500">Saat</span>
                  <strong class="text-right text-slate-900">{{ task.dueTime || '-' }}</strong>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
              <h2 class="text-lg font-semibold text-slate-900">İşlemler</h2>
            </div>
            <div class="space-y-3 p-6">
              <button
                type="button"
                class="flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="goToList"
              >
                <i class="bi bi-arrow-left mr-2"></i>
                Listeye Dön
              </button>

              <button
                type="button"
                class="flex w-full items-center justify-center rounded-full border border-slate-900 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="goToEdit"
              >
                <i class="bi bi-pencil-square mr-2"></i>
                Görevi Düzenle
              </button>

              <button
                type="button"
                class="flex w-full items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                @click="handleDelete"
              >
                <i class="bi bi-trash mr-2"></i>
                Görevi Sil
              </button>
            </div>
          </section>
        </div>
      </div>
    </template>

    <div v-else class="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h4 class="text-xl font-bold text-slate-900">Görev bulunamadı</h4>
      <button
        type="button"
        class="mt-4 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        @click="goToList"
      >
        Listeye Dön
      </button>
    </div>
  </div>
</template>

