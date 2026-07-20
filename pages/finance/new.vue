<script setup>
import { createFinanceRecord } from '~/composables/useFinance'

const subtypeOptionsMap = {
  Gelir: [
    'Satış Komisyonu',
    'Kiralama Komisyonu',
    'Danışman Katkı Payı',
    'Ek Hizmet Geliri',
    'Diğer Gelirler',
  ],
  Gider: [
    'Ofis Kirası',
    'Elektrik',
    'Su',
    'Doğalgaz',
    'İnternet',
    'Telefon',
    'Personel Gideri',
    'SGK Ödemeleri',
    'Vergi Ödemeleri',
    'Reklam Gideri',
    'İlan Gideri',
    'Yakıt Gideri',
    'Yemek/İkram Gideri',
    'Yazılım Gideri',
    'Kırtasiye',
    'Diğer Giderler',
  ],
  Fatura: [
    'Elektrik',
    'Su',
    'Doğalgaz',
    'İnternet',
    'Telefon',
    'Yazılım',
    'Reklam',
    'Diğer Fatura',
  ],
  Ödeme: [
    'Tahsilat',
    'Tedarikçi Ödemesi',
    'Danışman Katkı Payı',
    'Personel Ödemesi',
    'Vergi/SGK Ödemesi',
    'Diğer Ödeme',
  ],
}

const defaultStatusMap = {
  Gelir: 'Bekliyor',
  Gider: 'Ödenecek',
  Fatura: 'Ödenecek',
  Ödeme: 'Bekliyor',
}

const defaultMethodMap = {
  Gelir: 'Havale',
  Gider: 'Banka',
  Fatura: 'Banka',
  Ödeme: 'Havale',
}

const defaultRelatedModuleMap = {
  Gelir: 'Portföy',
  Gider: 'Genel',
  Fatura: 'Genel',
  Ödeme: 'Genel',
}

const form = ref({
  type: 'Gelir',
  subType: 'Satış Komisyonu',
  title: '',
  partyName: '',
  relatedModule: 'Portföy',
  relatedName: '',
  amount: '',
  currency: 'TL',
  status: 'Bekliyor',
  paymentMethod: 'Havale',
  issueDate: '',
  dueDate: '',
  paymentDate: '',
  invoiceNo: '',
  invoiceTracked: 'Hayır',
  categoryGroup: 'Gelir',
  notes: '',
  packageLevel: 'Basic',
})

const subtypeOptions = computed(() => {
  return subtypeOptionsMap[form.value.type] || []
})

const isInvoiceType = computed(() => form.value.type === 'Fatura')
const isExpenseType = computed(() => form.value.type === 'Gider')
const isIncomeType = computed(() => form.value.type === 'Gelir')
const isPaymentType = computed(() => form.value.type === 'Ödeme')

const typeHelpText = computed(() => {
  if (form.value.type === 'Gelir') {
    return 'Satış komisyonu, kiralama komisyonu, danışman katkı payı ve benzeri gelir kayıtları için kullanılır.'
  }

  if (form.value.type === 'Gider') {
    return 'Ofis giderleri, reklam, ilan, yazılım, vergi ve benzeri gider kayıtları için kullanılır.'
  }

  if (form.value.type === 'Fatura') {
    return 'Elektrik, su, internet, telefon ve diğer fatura takip kayıtları için kullanılır.'
  }

  return 'Tahsilat ve ödeme hareketlerini ayrı bir finans kaydı olarak takip etmek için kullanılır.'
})

watch(
  () => form.value.type,
  (newType) => {
    const options = subtypeOptionsMap[newType] || []

    form.value.categoryGroup = newType
    form.value.status = defaultStatusMap[newType] || 'Bekliyor'
    form.value.paymentMethod = defaultMethodMap[newType] || 'Havale'
    form.value.relatedModule = defaultRelatedModuleMap[newType] || 'Genel'
    form.value.subType = options[0] || ''
    form.value.invoiceTracked = newType === 'Fatura' ? 'Evet' : 'Hayır'

    if (newType === 'Gelir' && !form.value.title) {
      form.value.title = ''
    }
  },
  { immediate: true }
)

const saveRecord = () => {
  const created = createFinanceRecord({
    ...form.value,
    amount: Number(form.value.amount || 0),
  })

  window.location.href = '/finance/' + created.id
}

const goToList = () => {
  window.location.href = '/finance'
}
</script>

<template>
  <div class="space-y-6">
    <section class="overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 shadow-2xl">
      <div class="flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between lg:p-8">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Finans Yönetimi
          </p>
          <h1 class="mb-3 text-3xl font-bold tracking-tight text-white lg:text-4xl">
            {{ form.title || 'Yeni Finans Kaydı' }}
          </h1>
          <p class="max-w-3xl text-sm leading-7 text-slate-300">
            Gelir, gider, fatura veya ödeme kaydı oluşturarak finans hareketlerini sisteme ekleyin.
          </p>
        </div>

        <UiButton variant="dark-ghost" icon="bi-arrow-left" @click="goToList">Listeye Dön</UiButton>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <h2 class="text-lg font-semibold text-slate-900">Kayıt Bilgileri</h2>
        <p class="mt-1 text-sm text-slate-500">{{ typeHelpText }}</p>
      </div>

      <div class="p-6">
        <div class="grid gap-5 md:grid-cols-12">
          <UiSelect v-model="form.type" label="Tür" class="md:col-span-3">
            <option>Gelir</option>
            <option>Gider</option>
            <option>Fatura</option>
            <option>Ödeme</option>
          </UiSelect>

          <UiSelect v-model="form.subType" label="Alt Tür" class="md:col-span-3">
            <option v-for="option in subtypeOptions" :key="option" :value="option">{{ option }}</option>
          </UiSelect>

          <UiInput v-model="form.title" label="Başlık" class="md:col-span-6" />

          <UiInput v-model="form.partyName" label="Kişi / Kurum" class="md:col-span-4" />

          <UiSelect v-model="form.relatedModule" label="Bağlı Modül" class="md:col-span-4">
            <option>Genel</option>
            <option>Portföy</option>
            <option>Müşteri</option>
            <option>Danışman</option>
            <option>Ofis</option>
          </UiSelect>

          <UiInput v-model="form.relatedName" label="Bağlı Kayıt" class="md:col-span-4" />

          <UiInput v-model="form.amount" label="Tutar" type="number" class="md:col-span-3" />

          <UiSelect v-model="form.currency" label="Para Birimi" class="md:col-span-2">
            <option>TL</option>
            <option>USD</option>
            <option>EUR</option>
          </UiSelect>

          <UiSelect v-model="form.status" label="Durum" class="md:col-span-3">
            <option>Tahsil Edildi</option>
            <option>Ödendi</option>
            <option>Bekliyor</option>
            <option>Ödenecek</option>
            <option>Gecikmiş</option>
            <option>Kısmi Ödendi</option>
          </UiSelect>

          <UiSelect v-model="form.paymentMethod" label="Ödeme Yöntemi" class="md:col-span-4">
            <option>Havale</option>
            <option>Banka</option>
            <option>Nakit</option>
            <option>Kredi Kartı</option>
            <option>EFT</option>
          </UiSelect>

          <UiInput v-model="form.issueDate" label="Kayıt Tarihi" type="date" class="md:col-span-3" />

          <UiInput v-model="form.dueDate" label="Vade Tarihi" type="date" class="md:col-span-3" />

          <UiInput v-model="form.paymentDate" label="Ödeme Tarihi" type="date" class="md:col-span-3" />

          <UiInput v-if="isInvoiceType" v-model="form.invoiceNo" label="Fatura No" class="md:col-span-3" />

          <UiSelect v-if="isInvoiceType" v-model="form.invoiceTracked" label="Fatura Takibi" class="md:col-span-3">
            <option>Evet</option>
            <option>Hayır</option>
          </UiSelect>

          <UiSelect v-if="!isInvoiceType" v-model="form.invoiceTracked" label="Fatura Takibi" class="md:col-span-3">
            <option>Evet</option>
            <option>Hayır</option>
          </UiSelect>

          <UiSelect v-model="form.packageLevel" label="Paket Seviyesi" class="md:col-span-3">
            <option>Basic</option>
            <option>Plus</option>
            <option>Pro</option>
          </UiSelect>

          <div class="md:col-span-12">
            <div
              class="rounded-2xl border px-4 py-4 text-sm"
              :class="[
                isIncomeType ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : '',
                isExpenseType ? 'border-red-200 bg-red-50 text-red-700' : '',
                isInvoiceType ? 'border-amber-200 bg-amber-50 text-amber-700' : '',
                isPaymentType ? 'border-blue-200 bg-blue-50 text-blue-700' : ''
              ]"
            >
              <strong>Bilgi:</strong>
              <span v-if="isIncomeType">Bu kayıt gelir tarafında raporlanacaktır.</span>
              <span v-else-if="isExpenseType">Bu kayıt gider tarafında raporlanacaktır.</span>
              <span v-else-if="isInvoiceType">Bu kayıt fatura takibinde öne çıkacaktır.</span>
              <span v-else>Bu kayıt ödeme / tahsilat hareketi olarak izlenecektir.</span>
            </div>
          </div>

          <UiTextarea v-model="form.notes" label="Notlar" :rows="4" class="md:col-span-12" />

          <div class="md:col-span-12">
            <div class="flex flex-wrap gap-3">
              <UiButton icon="bi-check2-circle" @click="saveRecord">Kaydet</UiButton>
              <UiButton variant="secondary" @click="goToList">Vazgeç</UiButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


