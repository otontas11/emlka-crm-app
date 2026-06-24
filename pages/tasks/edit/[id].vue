<script setup>
import { getTaskById, updateTask } from '~/composables/useTasks'

const route = useRoute()
const taskId = computed(() => String(route.params.id))
const isLoading = ref(true)

const form = ref({
  title: '',
  description: '',
  category: 'Müşteri Takibi',
  priority: 'Orta',
  status: 'Planlandı',
  relatedType: 'Müşteri',
  relatedName: '',
  assignedTo: 'Sinan',
  dueDate: '',
  dueTime: '',
  notes: '',
})

const loadTask = () => {
  const task = getTaskById(taskId.value)

  if (!task) {
    isLoading.value = false
    return
  }

  form.value = {
    title: task.title || '',
    description: task.description || '',
    category: task.category || 'Müşteri Takibi',
    priority: task.priority || 'Orta',
    status: task.status || 'Planlandı',
    relatedType: task.relatedType || 'Müşteri',
    relatedName: task.relatedName || '',
    assignedTo: task.assignedTo || 'Sinan',
    dueDate: task.dueDate || '',
    dueTime: task.dueTime || '',
    notes: task.notes || '',
  }

  isLoading.value = false
}

const saveTask = () => {
  const updated = updateTask(taskId.value, { ...form.value })

  if (!updated) {
    alert('Görev bulunamadı.')
    return
  }

  window.location.href = '/tasks/' + taskId.value
}

const goToDetail = () => {
  window.location.href = '/tasks/' + taskId.value
}

onMounted(() => {
  loadTask()
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700"></div>
      <h4 class="text-xl font-bold text-slate-900">Görev bilgileri yükleniyor</h4>
    </div>

    <template v-else>
      <section class="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl">
        <div class="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between lg:p-8">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Görev Düzenle
            </p>
            <h1 class="mb-3 text-3xl font-bold tracking-tight text-white lg:text-4xl">
              {{ form.title || 'Görev Düzenleme Ekranı' }}
            </h1>

            <div class="flex flex-wrap gap-2">
              <span class="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white">
                {{ form.category }}
              </span>
              <span class="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white">
                {{ form.priority }}
              </span>
              <span class="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900">
                {{ form.status }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            @click="goToDetail"
          >
            <i class="bi bi-arrow-left mr-2"></i>
            Detaya Dön
          </button>
        </div>
      </section>

      <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <h2 class="text-lg font-semibold text-slate-900">Görev Bilgileri</h2>
        </div>

        <div class="p-6">
          <div class="grid gap-5 md:grid-cols-12">
            <div class="md:col-span-6">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Görev Başlığı</label>
              <input v-model="form.title" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200" />
            </div>

            <div class="md:col-span-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
              <select v-model="form.category" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200">
                <option>Müşteri Takibi</option>
                <option>Portföy Takibi</option>
                <option>Raporlama</option>
                <option>Yetki Takibi</option>
                <option>Randevu</option>
              </select>
            </div>

            <div class="md:col-span-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Öncelik</label>
              <select v-model="form.priority" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200">
                <option>Düşük</option>
                <option>Orta</option>
                <option>Yüksek</option>
              </select>
            </div>

            <div class="md:col-span-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Durum</label>
              <select v-model="form.status" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200">
                <option>Bugün</option>
                <option>Planlandı</option>
                <option>Gecikmiş</option>
                <option>Tamamlandı</option>
              </select>
            </div>

            <div class="md:col-span-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Bağlantı Türü</label>
              <select v-model="form.relatedType" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200">
                <option>Müşteri</option>
                <option>Portföy</option>
                <option>Genel</option>
              </select>
            </div>

            <div class="md:col-span-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">İlgili Kayıt</label>
              <input v-model="form.relatedName" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200" />
            </div>

            <div class="md:col-span-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Atanan Kişi</label>
              <input v-model="form.assignedTo" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200" />
            </div>

            <div class="md:col-span-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Tarih</label>
              <input v-model="form.dueDate" type="date" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200" />
            </div>

            <div class="md:col-span-3">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Saat</label>
              <input v-model="form.dueTime" type="time" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200" />
            </div>

            <div class="md:col-span-12">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Açıklama</label>
              <textarea v-model="form.description" rows="4" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200"></textarea>
            </div>

            <div class="md:col-span-12">
              <label class="mb-2 block text-sm font-semibold text-slate-700">Notlar</label>
              <textarea v-model="form.notes" rows="4" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200"></textarea>
            </div>

            <div class="md:col-span-12">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="saveTask"
              >
                <i class="bi bi-check2-circle mr-2"></i>
                Güncelle
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

