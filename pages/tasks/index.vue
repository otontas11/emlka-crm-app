<script setup>
import { useTasks } from '~/composables/useTasks'

const viewMode = ref('card')
const tasks = useTasks()

const searchTerm = ref('')
const selectedStatus = ref('Tümü')
const selectedPriority = ref('Tümü')

const statuses = ['Tümü', 'Bugün', 'Planlandı', 'Gecikmiş', 'Tamamlandı']
const priorities = ['Tümü', 'Düşük', 'Orta', 'Yüksek']

const normalizeText = (value) => {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
}

const filteredTasks = computed(() => {
  const term = normalizeText(searchTerm.value.trim())

  return tasks.value.filter((task) => {
    const searchableText = [
      task.title,
      task.description,
      task.relatedName,
      task.category,
      task.assignedTo,
    ]
      .map(item => normalizeText(item))
      .join(' ')

    const matchesSearch = !term || searchableText.includes(term)

    const matchesStatus =
      selectedStatus.value === 'Tümü' ||
      String(task.status || '') === selectedStatus.value

    const matchesPriority =
      selectedPriority.value === 'Tümü' ||
      String(task.priority || '') === selectedPriority.value

    return matchesSearch && matchesStatus && matchesPriority
  })
})

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

const clearFilters = () => {
  searchTerm.value = ''
  selectedStatus.value = 'Tümü'
  selectedPriority.value = 'Tümü'
}

const goToNew = () => {
  window.location.href = '/tasks/new'
}

const goToDetail = (id) => {
  window.location.href = '/tasks/' + String(id)
}

const goToEdit = (id) => {
  window.location.href = '/tasks/edit/' + String(id)
}
</script>

<template>
  <div class="space-y-6">
    <section class="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl">
      <div class="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between lg:p-8">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Görev Yönetimi
          </p>
          <h1 class="mb-3 text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Görevler
          </h1>

          <div class="flex flex-wrap gap-2">
            <span class="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              Takip
            </span>
            <span class="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              Planlama
            </span>
            <span class="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              Raporlama
            </span>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <div class="inline-flex rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur-sm">
            <button
              class="rounded-full px-4 py-2 text-sm font-semibold transition"
              :class="viewMode === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'"
              @click="viewMode = 'card'"
            >
              <i class="bi bi-grid mr-2"></i>
              Kart
            </button>
            <button
              class="rounded-full px-4 py-2 text-sm font-semibold transition"
              :class="viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'"
              @click="viewMode = 'table'"
            >
              <i class="bi bi-table mr-2"></i>
              Tablo
            </button>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
            @click="goToNew"
          >
            <i class="bi bi-plus-lg mr-2"></i>
            Yeni Görev
          </button>
        </div>
      </div>

      <div class="grid gap-4 border-t border-white/10 bg-white/5 px-6 py-5 md:grid-cols-4 lg:px-8">
        <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Toplam Görev</p>
          <p class="mt-2 text-2xl font-bold text-white">{{ tasks.length }}</p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Bugünkü Görev</p>
          <p class="mt-2 text-2xl font-bold text-white">{{ tasks.filter(t => t.status === 'Bugün').length }}</p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Tamamlanan</p>
          <p class="mt-2 text-2xl font-bold text-white">{{ tasks.filter(t => t.status === 'Tamamlandı').length }}</p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
          <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Yüksek Öncelik</p>
          <p class="mt-2 text-2xl font-bold text-white">{{ tasks.filter(t => t.priority === 'Yüksek').length }}</p>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">Arama ve Filtre</h2>
        <p class="mt-1 text-sm text-slate-500">Görevleri durum, öncelik ve metin bazlı hızlıca süzün.</p>
      </div>

      <div class="p-6">
        <div class="grid gap-4 md:grid-cols-12">
          <UiInput
            v-model="searchTerm"
            label="Arama"
            variant="ring"
            class="md:col-span-5"
            placeholder="Görev adı, açıklama, kategori, kişi ile ara"
          />

          <UiSelect
            v-model="selectedStatus"
            label="Durum"
            variant="ring"
            class="md:col-span-3"
          >
            <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
          </UiSelect>

          <UiSelect
            v-model="selectedPriority"
            label="Öncelik"
            variant="ring"
            class="md:col-span-2"
          >
            <option v-for="priority in priorities" :key="priority" :value="priority">{{ priority }}</option>
          </UiSelect>

          <div class="flex items-end md:col-span-2">
            <UiButton
              variant="secondary"
              shape="rounded"
              block
              @click="clearFilters"
            >
              Temizle
            </UiButton>
          </div>
        </div>
      </div>
    </section>

    <section v-if="tasks.length === 0" class="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h4 class="text-xl font-bold text-slate-900">Henüz görev kaydı yok</h4>
      <p class="mt-2 text-slate-500">Yeni görev oluşturarak başlayabilirsiniz.</p>
      <button
        type="button"
        class="mt-5 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        @click="goToNew"
      >
        İlk Görevi Ekle
      </button>
    </section>

    <section v-else-if="filteredTasks.length === 0" class="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h4 class="text-xl font-bold text-slate-900">Sonuç bulunamadı</h4>
      <p class="mt-2 text-slate-500">Arama veya filtre kriterlerini değiştirin.</p>
      <button
        type="button"
        class="mt-5 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        @click="clearFilters"
      >
        Filtreleri Temizle
      </button>
    </section>

    <template v-else>
      <section v-if="viewMode === 'card'" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="task in filteredTasks"
          :key="task.id"
          class="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
        >
          <div class="flex-1 p-6">
            <div class="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-bold text-slate-900">{{ task.title }}</h3>
                <p class="mt-1 text-sm text-slate-500">{{ task.category }}</p>
              </div>

              <span :class="getStatusClass(task.status)" class="rounded-full px-3 py-2 text-xs font-semibold">
                {{ task.status }}
              </span>
            </div>

            <p class="mb-4 line-clamp-3 text-sm leading-6 text-slate-600">
              {{ task.description }}
            </p>

            <div class="mb-4 flex flex-wrap gap-2">
              <span :class="getPriorityClass(task.priority)" class="rounded-full px-3 py-2 text-xs font-semibold">
                {{ task.priority }}
              </span>

              <span class="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
                {{ task.relatedType }} · {{ task.relatedName }}
              </span>
            </div>

            <div class="space-y-2 text-sm text-slate-500">
              <div class="flex items-center">
                <i class="bi bi-person mr-2"></i>
                {{ task.assignedTo || '-' }}
              </div>
              <div class="flex items-center">
                <i class="bi bi-calendar-event mr-2"></i>
                {{ formatDate(task.dueDate) }}
              </div>
              <div class="flex items-center">
                <i class="bi bi-clock mr-2"></i>
                {{ task.dueTime || '-' }}
              </div>
            </div>
          </div>

          <div class="border-t border-slate-100 px-6 py-4">
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="goToDetail(task.id)"
              >
                Detay
              </button>

              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="goToEdit(task.id)"
              >
                Düzenle
              </button>
            </div>
          </div>
        </article>
      </section>

      <section v-else class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Görev</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Kategori</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Bağlantı</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Öncelik</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Durum</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Tarih</th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">İşlem</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="task in filteredTasks" :key="task.id" class="hover:bg-slate-50/70">
                <td class="px-6 py-4 font-semibold text-slate-900">{{ task.title }}</td>
                <td class="px-6 py-4 text-slate-600">{{ task.category }}</td>
                <td class="px-6 py-4 text-slate-600">{{ task.relatedName }}</td>
                <td class="px-6 py-4">
                  <span :class="getPriorityClass(task.priority)" class="rounded-full px-3 py-2 text-xs font-semibold">
                    {{ task.priority }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(task.status)" class="rounded-full px-3 py-2 text-xs font-semibold">
                    {{ task.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-600">{{ formatDate(task.dueDate) }} {{ task.dueTime }}</td>
                <td class="px-6 py-4 text-right">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    @click="goToDetail(task.id)"
                  >
                    Detay
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>


