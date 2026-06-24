<script setup>
import { useOffice } from '~/composables/useOffice'
import { useOfficeDuties } from '~/composables/useOfficeDuties'

const { consultants } = useOffice()

const {
  currentUser,
  initAuth,
} = useCrmAuth()

const {
  getDutiesByConsultant,
  updateDutyStatus,
  updateDutyField,
  createDutyChangeRequest,
  formatDate,
} = useOfficeDuties()

initAuth()

const successMessage = ref('')
const requestFormOpenId = ref(null)
const requestReason = ref('')
const requestedDate = ref('')

const currentConsultantId = computed(() => {
  return currentUser.value?.consultantId || null
})

const currentConsultant = computed(() => {
  return consultants.value.find(item => String(item.id) === String(currentConsultantId.value))
})

const myDuties = computed(() => {
  if (!currentConsultantId.value) return []

  return getDutiesByConsultant(currentConsultantId.value).sort((a, b) => {
    return String(a.date).localeCompare(String(b.date))
  })
})

const plannedCount = computed(() => {
  return myDuties.value.filter(item => item.status === 'Planlandı').length
})

const confirmedCount = computed(() => {
  return myDuties.value.filter(item => item.status === 'Danışman Onayladı').length
})

const completedCount = computed(() => {
  return myDuties.value.filter(item => item.status === 'Tamamlandı').length
})

const requestCount = computed(() => {
  return myDuties.value.filter(item => item.status === 'Değişim Talebi').length
})

const confirmDuty = (duty) => {
  updateDutyStatus(duty.id, 'Danışman Onayladı')

  successMessage.value = 'Nöbet göreviniz onaylandı.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const completeDuty = (duty) => {
  updateDutyStatus(duty.id, 'Tamamlandı')

  successMessage.value = 'Nöbet göreviniz tamamlandı olarak işaretlendi.'

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const openRequestForm = (duty) => {
  requestFormOpenId.value = duty.id
  requestReason.value = ''
  requestedDate.value = ''
}

const sendChangeRequest = (duty) => {
  const message = createDutyChangeRequest({
    dutyId: duty.id,
    reason: requestReason.value,
    requestedDate: requestedDate.value,
  })

  successMessage.value = message
  requestFormOpenId.value = null
  requestReason.value = ''
  requestedDate.value = ''

  setTimeout(() => {
    successMessage.value = ''
  }, 4000)
}

const statusClass = (status) => {
  if (status === 'Tamamlandı') return 'bg-slate-900 text-white'
  if (status === 'Danışman Onayladı') return 'bg-slate-800 text-white'
  if (status === 'Planlandı') return 'bg-slate-100 text-slate-700'
  if (status === 'Değişim Talebi') return 'bg-slate-200 text-slate-800'
  if (status === 'Mazeretli') return 'bg-slate-300 text-slate-800'
  if (status === 'Gelmedi') return 'bg-slate-900 text-white'
  return 'bg-slate-100 text-slate-700'
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
            Bana Atanan Nöbetler
          </h1>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Ofis tarafından size atanan nöbetleri buradan takip edebilir, onaylayabilir veya değişim talebi oluşturabilirsiniz.
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

    <div
      v-if="successMessage"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-check2-circle mr-2"></i>
      {{ successMessage }}
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 lg:grid-cols-[1fr_180px_180px_180px_180px]">
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
          <p class="text-sm font-medium text-slate-500">Planlanan</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ plannedCount }}</p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Onaylanan</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ confirmedCount }}</p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Tamamlanan</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ completedCount }}</p>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-medium text-slate-500">Değişim Talebi</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ requestCount }}</p>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Nöbetlerim
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ myDuties.length }} nöbet kaydı listeleniyor
        </p>
      </div>

      <div v-if="!myDuties.length" class="p-10 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-400">
          <i class="bi bi-calendar-check"></i>
        </div>

        <h3 class="mt-4 text-lg font-bold text-slate-900">
          Henüz nöbet ataması yok
        </h3>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          Broker size nöbet atadığında burada görünecek.
        </p>
      </div>

      <div v-else class="grid gap-4 p-6 xl:grid-cols-2">
        <div
          v-for="item in myDuties"
          :key="item.id"
          class="rounded-3xl border border-slate-200 bg-slate-50 p-5"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {{ item.shiftType }} · {{ item.location }}
              </p>

              <h3 class="mt-2 text-lg font-bold text-slate-900">
                {{ formatDate(item.date) }} · {{ item.dayName }}
              </h3>

              <p class="mt-2 text-sm text-slate-500">
                Saat: {{ item.startTime }} - {{ item.endTime }}
              </p>
            </div>

            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="statusClass(item.status)"
            >
              {{ item.status }}
            </span>
          </div>

          <p v-if="item.description" class="mt-4 text-sm leading-6 text-slate-600">
            {{ item.description }}
          </p>

          <div class="mt-4">
            <label class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Danışman Notu
            </label>
            <textarea
              :value="item.consultantNote"
              rows="3"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              placeholder="Nöbet ile ilgili notunuz..."
              @input="updateDutyField(item.id, 'consultantNote', $event.target.value)"
            ></textarea>
          </div>

          <div
            v-if="requestFormOpenId === item.id"
            class="mt-4 rounded-3xl border border-slate-200 bg-white p-4"
          >
            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Değişim / Mazeret Açıklaması
            </label>

            <textarea
              v-model="requestReason"
              rows="3"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
              placeholder="Mazeretinizi veya değişim talebinizi yazın..."
            ></textarea>

            <label class="mb-2 mt-4 block text-sm font-semibold text-slate-700">
              Talep Edilen Yeni Tarih
            </label>

            <input
              v-model="requestedDate"
              type="date"
              class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
            />

            <div class="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                @click="sendChangeRequest(item)"
              >
                Talebi Gönder
              </button>

              <button
                type="button"
                class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                @click="requestFormOpenId = null"
              >
                Vazgeç
              </button>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-if="item.status === 'Planlandı'"
              type="button"
              class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              @click="confirmDuty(item)"
            >
              Nöbeti Onayla
            </button>

            <button
              v-if="item.status !== 'Tamamlandı' && item.status !== 'Mazeretli'"
              type="button"
              class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              @click="openRequestForm(item)"
            >
              Değişim / Mazeret Talebi
            </button>

            <button
              v-if="item.status === 'Danışman Onayladı'"
              type="button"
              class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              @click="completeDuty(item)"
            >
              Tamamlandı İşaretle
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
