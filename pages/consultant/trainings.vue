<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeTraining } from '~/composables/useOfficeTraining'

const { consultants } = useOffice()

const {
  currentUser,
  initAuth,
} = useCrmAuth()

const {
  getAssignmentsByConsultant,
  updateAssignmentStatus,
  updateAssignmentField,
  completionPercent,
} = useOfficeTraining()

initAuth()

const currentConsultantId = computed(() => {
  return currentUser.value?.consultantId || null
})

const currentConsultant = computed(() => {
  return consultants.value.find(item => String(item.id) === String(currentConsultantId.value))
})

const myTrainings = computed(() => {
  if (!currentConsultantId.value) return []
  return getAssignmentsByConsultant(currentConsultantId.value)
})

const waitingCount = computed(() => {
  return myTrainings.value.filter(item => item.status !== 'Tamamlandı').length
})

const completedCount = computed(() => {
  return myTrainings.value.filter(item => item.status === 'Tamamlandı').length
})

const inProgressCount = computed(() => {
  return myTrainings.value.filter(item => item.status === 'Devam Ediyor').length
})

const statusClass = (status) => {
  if (status === 'Tamamlandı') return 'bg-slate-900 text-white'
  if (status === 'Devam Ediyor') return 'bg-slate-200 text-slate-800'
  return 'bg-white text-slate-700 border border-slate-200'
}

const startTraining = (item) => {
  updateAssignmentStatus(item.id, 'Devam Ediyor')
}

const completeTraining = (item) => {
  updateAssignmentStatus(item.id, 'Tamamlandı')
  updateAssignmentField(item.id, 'progress', 100)
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Danışman Paneli
          </p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Bana Atanan Eğitimler
          </h1>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Ofis tarafından size atanmış eğitimleri, dokümanları ve tamamlanma durumunuzu buradan takip edebilirsiniz.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/consultant"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Danışman Paneline Dön
          </NuxtLink>

          <NuxtLink
            to="/consultant/notifications"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Bildirimlerim
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 lg:grid-cols-[1fr_220px_220px_220px]">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Giriş Yapan Danışman
          </p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">
            {{ currentConsultant?.fullName || currentUser?.name || 'Danışman' }}
          </h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ currentConsultant?.code }} · {{ currentConsultant?.workType }} · {{ currentConsultant?.expertiseRegion }}
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Tamamlanma</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            %{{ completionPercent(currentConsultantId) }}
          </p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Bekleyen Eğitim</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ waitingCount }}</p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Tamamlanan</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ completedCount }}</p>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Eğitimlerim
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ myTrainings.length }} eğitim listeleniyor · {{ inProgressCount }} eğitim devam ediyor
        </p>
      </div>

      <div v-if="!myTrainings.length" class="p-10 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-mortarboard"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Henüz eğitim ataması yok
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Broker size eğitim atadığında burada görünecek.
        </p>
      </div>

      <div v-else class="grid gap-4 p-6 xl:grid-cols-2">
        <div
          v-for="item in myTrainings"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {{ item.category }} · {{ item.format }}
              </p>

              <h3 class="mt-2 font-bold text-slate-900">
                {{ item.trainingTitle }}
              </h3>

              <p class="mt-2 text-sm leading-6 text-slate-500">
                {{ item.description }}
              </p>
            </div>

            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="statusClass(item.status)"
            >
              {{ item.status }}
            </span>
          </div>

          <div class="mt-4">
            <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span>İlerleme</span>
              <span>%{{ item.progress }}</span>
            </div>

            <div class="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                class="h-full rounded-full bg-slate-900"
                :style="{ width: Number(item.progress || 0) + '%' }"
              ></div>
            </div>
          </div>

          <div class="mt-4 grid gap-3 md:grid-cols-2">
            <div class="rounded-2xl bg-white p-3">
              <p class="text-xs text-slate-400">Atama Tarihi</p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                {{ item.assignedAt }}
              </p>
            </div>

            <div class="rounded-2xl bg-white p-3">
              <p class="text-xs text-slate-400">Son Tarih</p>
              <p class="mt-1 text-sm font-semibold text-slate-900">
                {{ item.dueDate || '-' }}
              </p>
            </div>
          </div>

          <div
            v-if="item.score"
            class="mt-4 rounded-2xl bg-white p-3"
          >
            <p class="text-xs text-slate-400">Puan</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">
              {{ item.score }}
            </p>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-if="item.status === 'Bekliyor'"
              type="button"
              class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              @click="startTraining(item)"
            >
              Eğitime Başla
            </button>

            <button
              v-if="item.status !== 'Tamamlandı'"
              type="button"
              class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              @click="completeTraining(item)"
            >
              Tamamladım
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
