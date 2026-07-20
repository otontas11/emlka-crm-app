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
            <UiInput v-model="form.title" label="Görev Başlığı" variant="ring" class="md:col-span-6" />

            <UiSelect v-model="form.category" label="Kategori" variant="ring" class="md:col-span-3">
              <option>Müşteri Takibi</option>
              <option>Portföy Takibi</option>
              <option>Raporlama</option>
              <option>Yetki Takibi</option>
              <option>Randevu</option>
            </UiSelect>

            <UiSelect v-model="form.priority" label="Öncelik" variant="ring" class="md:col-span-3">
              <option>Düşük</option>
              <option>Orta</option>
              <option>Yüksek</option>
            </UiSelect>

            <UiSelect v-model="form.status" label="Durum" variant="ring" class="md:col-span-3">
              <option>Bugün</option>
              <option>Planlandı</option>
              <option>Gecikmiş</option>
              <option>Tamamlandı</option>
            </UiSelect>

            <UiSelect v-model="form.relatedType" label="Bağlantı Türü" variant="ring" class="md:col-span-3">
              <option>Müşteri</option>
              <option>Portföy</option>
              <option>Genel</option>
            </UiSelect>

            <UiInput v-model="form.relatedName" label="İlgili Kayıt" variant="ring" class="md:col-span-3" />

            <UiInput v-model="form.assignedTo" label="Atanan Kişi" variant="ring" class="md:col-span-3" />

            <UiInput v-model="form.dueDate" label="Tarih" type="date" variant="ring" class="md:col-span-3" />

            <UiInput v-model="form.dueTime" label="Saat" type="time" variant="ring" class="md:col-span-3" />

            <UiTextarea v-model="form.description" label="Açıklama" :rows="4" variant="ring" class="md:col-span-12" />

            <UiTextarea v-model="form.notes" label="Notlar" :rows="4" variant="ring" class="md:col-span-12" />

            <div class="md:col-span-12">
              <UiButton icon="bi-check2-circle" @click="saveTask">Güncelle</UiButton>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

