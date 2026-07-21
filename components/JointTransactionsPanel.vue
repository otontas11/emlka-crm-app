<script setup>
import { useJointTransactions } from '~/composables/useJointTransactions'

const {
  transactions,
  hydrateJointTransactions,
  updateJointTransaction,
  deleteJointTransaction,
  formatPrice,
  jointTransactionStats,
} = useJointTransactions()

hydrateJointTransactions()

const search = ref('')
const statusFilter = ref('Tümü')
const paymentFilter = ref('Tümü')
const successMessage = ref('')

const statusOptions = [
  'Hazırlık',
  'Danışman Görüşmesi',
  'Müşteri Sunumu',
  'Randevu',
  'Teklif',
  'Kapora',
  'Sözleşme',
  'Tapu / Devir',
  'Tamamlandı',
  'İptal',
]

const paymentOptions = [
  'Bekliyor',
  'Kısmi Ödendi',
  'Ödendi',
  'İptal',
]

const filteredTransactions = computed(() => {
  let list = transactions.value

  if (statusFilter.value !== 'Tümü') {
    list = list.filter(item => item.status === statusFilter.value)
  }

  if (paymentFilter.value !== 'Tümü') {
    list = list.filter(item => item.paymentStatus === paymentFilter.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.transactionNo,
        item.requestNo,
        item.requestTitle,
        item.propertyTitle,
        item.customerName,
        item.requestConsultantName,
        item.portfolioConsultantName,
        item.status,
        item.paymentStatus,
        item.note,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  return list
})

const updateField = (transaction, field, value) => {
  updateJointTransaction(transaction.id, field, value)

  successMessage.value = 'Ortak işlem bilgisi güncellendi.'

  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const removeTransaction = (transaction) => {
  if (confirm(`${transaction.transactionNo} numaralı ortak işlem kaydını silmek istiyor musunuz?`)) {
    deleteJointTransaction(transaction.id)
  }
}

const statusClass = (status) => {
  if (status === 'Tamamlandı') return 'bg-slate-900 text-white'
  if (status === 'İptal') return 'bg-white text-slate-500 border border-slate-300'
  if (['Kapora', 'Sözleşme', 'Tapu / Devir'].includes(status)) return 'bg-slate-200 text-slate-800'
  return 'bg-slate-100 text-slate-700'
}

const paymentClass = (status) => {
  if (status === 'Ödendi') return 'bg-slate-900 text-white'
  if (status === 'Kısmi Ödendi') return 'bg-slate-200 text-slate-800'
  if (status === 'İptal') return 'bg-white text-slate-500 border border-slate-300'
  return 'bg-slate-100 text-slate-700'
}
</script>

<template>
  <div class="space-y-6">
    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Toplam</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ jointTransactionStats.total }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Hazırlık</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ jointTransactionStats.preparation }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Aktif</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ jointTransactionStats.active }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Tamamlandı</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ jointTransactionStats.completed }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">İptal</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ jointTransactionStats.cancelled }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Komisyon</p>
        <p class="mt-3 text-2xl font-bold text-slate-900">{{ formatPrice(jointTransactionStats.totalCommission) }}</p>
      </div>
    </section>

    <div
      v-if="successMessage"
      class="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm"
    >
      <i class="bi bi-info-circle mr-2"></i>
      {{ successMessage }}
    </div>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_220px]">
        <UiInput
          v-model="search"
          label="Arama"
          type="text"
          variant="outline"
          size="sm"
          placeholder="Talep, portföy, danışman, müşteri ara..."
        />

        <UiSelect
          v-model="statusFilter"
          label="İşlem Durumu"
          variant="outline"
          size="sm"
        >
          <option>Tümü</option>
          <option v-for="item in statusOptions" :key="item">{{ item }}</option>
        </UiSelect>

        <UiSelect
          v-model="paymentFilter"
          label="Ödeme Durumu"
          variant="outline"
          size="sm"
        >
          <option>Tümü</option>
          <option v-for="item in paymentOptions" :key="item">{{ item }}</option>
        </UiSelect>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Ortak İşlem Listesi
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          {{ filteredTransactions.length }} kayıt listeleniyor.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1700px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">İşlem</th>
              <th class="px-6 py-4">Talep / Portföy</th>
              <th class="px-6 py-4">Danışmanlar</th>
              <th class="px-6 py-4">İşlem Bedeli</th>
              <th class="px-6 py-4">Komisyon</th>
              <th class="px-6 py-4">Paylaşım</th>
              <th class="px-6 py-4">Durum</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="transaction in filteredTransactions"
              :key="transaction.id"
              class="align-top hover:bg-slate-50"
            >
              <td class="px-6 py-5">
                <p class="text-xs font-semibold text-slate-400">{{ transaction.transactionNo }}</p>
                <p class="mt-1 font-bold text-slate-900">{{ transaction.transactionType }} / {{ transaction.propertyType }}</p>
                <p class="mt-2 text-xs text-slate-500">Kaynak: {{ transaction.source }}</p>
                <p class="mt-1 text-xs text-slate-500">Oluşturma: {{ transaction.createdAt }}</p>
              </td>

              <td class="px-6 py-5">
                <p class="text-xs font-semibold text-slate-400">{{ transaction.requestNo }}</p>
                <p class="font-semibold text-slate-900">{{ transaction.requestTitle || '-' }}</p>

                <p class="mt-3 text-xs font-semibold text-slate-400">Portföy</p>
                <p class="font-semibold text-slate-900">{{ transaction.propertyTitle || '-' }}</p>

                <p class="mt-2 text-xs text-slate-500">Müşteri: {{ transaction.customerName || '-' }}</p>
              </td>

              <td class="px-6 py-5">
                <p class="text-xs text-slate-400">Talep Sahibi</p>
                <p class="font-semibold text-slate-900">{{ transaction.requestConsultantName || '-' }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ transaction.requestConsultantPhone || '-' }}</p>

                <p class="mt-4 text-xs text-slate-400">Portföy Sahibi</p>
                <p class="font-semibold text-slate-900">{{ transaction.portfolioConsultantName || '-' }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ transaction.portfolioConsultantPhone || '-' }}</p>
              </td>

              <td class="px-6 py-5">
                <input
                  :value="transaction.estimatedAmount"
                  type="number"
                  class="w-44 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-500"
                  @change="updateField(transaction, 'estimatedAmount', $event.target.value)"
                />
                <p class="mt-2 text-xs text-slate-500">{{ formatPrice(transaction.estimatedAmount) }}</p>
              </td>

              <td class="px-6 py-5">
                <label class="mb-1 block text-xs font-semibold text-slate-500">Komisyon %</label>
                <input
                  :value="transaction.commissionRate"
                  type="number"
                  step="0.1"
                  class="w-28 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-500"
                  @change="updateField(transaction, 'commissionRate', $event.target.value)"
                />
                <p class="mt-3 font-bold text-slate-900">{{ formatPrice(transaction.totalCommission) }}</p>
              </td>

              <td class="px-6 py-5">
                <div class="grid gap-3">
                  <div>
                    <label class="mb-1 block text-xs font-semibold text-slate-500">Talep Sahibi %</label>
                    <input
                      :value="transaction.requestConsultantSharePercent"
                      type="number"
                      class="w-28 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-500"
                      @change="updateField(transaction, 'requestConsultantSharePercent', $event.target.value)"
                    />
                    <p class="mt-1 text-xs text-slate-500">{{ formatPrice(transaction.requestConsultantCommission) }}</p>
                  </div>

                  <div>
                    <label class="mb-1 block text-xs font-semibold text-slate-500">Portföy Sahibi %</label>
                    <input
                      :value="transaction.portfolioConsultantSharePercent"
                      type="number"
                      class="w-28 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-500"
                      @change="updateField(transaction, 'portfolioConsultantSharePercent', $event.target.value)"
                    />
                    <p class="mt-1 text-xs text-slate-500">{{ formatPrice(transaction.portfolioConsultantCommission) }}</p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-5">
                <select
                  :value="transaction.status"
                  class="w-44 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-500"
                  @change="updateField(transaction, 'status', $event.target.value)"
                >
                  <option v-for="item in statusOptions" :key="item">{{ item }}</option>
                </select>

                <div class="mt-3">
                  <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClass(transaction.status)">
                    {{ transaction.status }}
                  </span>
                </div>

                <select
                  :value="transaction.paymentStatus"
                  class="mt-4 w-44 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:border-slate-500"
                  @change="updateField(transaction, 'paymentStatus', $event.target.value)"
                >
                  <option v-for="item in paymentOptions" :key="item">{{ item }}</option>
                </select>

                <div class="mt-3">
                  <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="paymentClass(transaction.paymentStatus)">
                    {{ transaction.paymentStatus }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-5 text-right">
                <UiButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  shape="rounded"
                  @click="removeTransaction(transaction)"
                >
                  Sil
                </UiButton>
              </td>
            </tr>

            <tr v-if="!filteredTransactions.length">
              <td colspan="8" class="px-6 py-10 text-center text-sm text-slate-500">
                Henüz ortak işlem kaydı yok. Talepler ekranında bir eşleşmenin sonucunu “İşleme Döndü” yapınca burada otomatik görünür.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
