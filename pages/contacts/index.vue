<script setup>
import { useCustomers } from '~/composables/useCustomers'
import { useOffice } from '~/composables/useOffice'

const {
  customers,
  hydrateCustomers,
  createCustomer,
  deleteCustomer,
  shareCustomerWithOffice,
  unshareCustomerFromOffice,
  customerStats,
} = useCustomers()

const { consultants } = useOffice()

hydrateCustomers()

const search = ref('')
const typeFilter = ref('')
const visibilityFilter = ref('Tümü')
const sourceFilter = ref('Tümü')
const showImportPanel = ref(false)
const selectedImportFile = ref(null)
const importFileName = ref('')
const importPreview = ref([])
const importRows = ref([])
const successMessage = ref('')

const goToNewCustomer = () => {
  navigateTo('/contacts/new')
}

const currentConsultant = computed(() => {
  return consultants.value.find(item => item.status !== 'Ayrıldı') || consultants.value[0] || {
    id: 1,
    fullName: 'Danışman',
  }
})

const customerList = computed(() => {
  return Array.isArray(customers.value) ? customers.value : []
})

const { filterOptions: enumFilterOpts, label: enumLbl } = useEnums()

const typeOptions = enumFilterOpts('CustomerType')

const filteredCustomers = computed(() => {
  let list = customerList.value

  if (typeFilter.value) {
    list = list.filter(item => item.customerType === typeFilter.value)
  }

  if (visibilityFilter.value === 'Kişisel') {
    list = list.filter(item => !item.officeShared)
  }

  if (visibilityFilter.value === 'Ofisle Paylaşıldı') {
    list = list.filter(item => item.officeShared)
  }

  if (sourceFilter.value === 'Rehberden Aktarılan') {
    list = list.filter(item => item.isFromPhonebook)
  }

  if (sourceFilter.value === 'Manuel Kayıt') {
    list = list.filter(item => !item.isFromPhonebook)
  }

  if (search.value.trim()) {
    const q = search.value.toLocaleLowerCase('tr-TR')

    list = list.filter(item => {
      return [
        item.fullName,
        item.fullName,
        item.phone,
        item.whatsapp,
        item.email,
        item.livingCity,
        enumLbl('CustomerType', item.customerType),
        item.source,
        item.note,
        item.note,
      ].join(' ').toLocaleLowerCase('tr-TR').includes(q)
    })
  }

  return list
})

const cleanPhone = (value = '') => {
  return String(value).replace(/\s+/g, '').replace(/[^\d+]/g, '')
}

const csvHeaders = [
  'Ad Soyad',
  'Telefon',
  'WhatsApp',
  'E-posta',
  'Şehir',
  'Müşteri Tipi',
  'Not',
]

const sampleRows = [
  ['Ali Demir', '0532 111 22 33', '0532 111 22 33', 'ali@mail.com', 'İzmir', 'Yatırımcı', 'Ticari gayrimenkul arıyor'],
  ['Ayşe Kaya', '0533 444 55 66', '0533 444 55 66', 'ayse@mail.com', 'İzmir', 'Kiracı', 'Dükkan kiralama talebi var'],
  ['Mehmet Yılmaz', '0534 777 88 99', '0534 777 88 99', 'mehmet@mail.com', 'Manisa', 'Mal Sahibi', 'Satılık işyeri var'],
]

const escapeCsvValue = (value = '') => {
  const text = String(value)

  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

const downloadFile = (fileName, content, type) => {
  if (!process.client) return

  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = url
  a.download = fileName
  a.click()

  URL.revokeObjectURL(url)
}

const downloadSampleCsv = () => {
  const rows = [
    csvHeaders.map(escapeCsvValue).join(','),
    ...sampleRows.map(row => row.map(escapeCsvValue).join(',')),
  ]

  downloadFile(
    'musteri-aktarim-ornek.csv',
    `\uFEFF${rows.join('\n')}`,
    'text/csv;charset=utf-8'
  )
}

const downloadExcelTemplate = () => {
  const tableRows = [
    csvHeaders,
    ...sampleRows,
  ]

  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <table border="1">
          ${tableRows.map(row => `
            <tr>
              ${row.map(cell => `<td>${String(cell).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`).join('')}
            </tr>
          `).join('')}
        </table>
      </body>
    </html>
  `

  downloadFile(
    'musteri-aktarim-excel-sablonu.xls',
    html,
    'application/vnd.ms-excel;charset=utf-8'
  )
}

const parseCsvLine = (line = '') => {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"'
      i += 1
      continue
    }

    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }

    if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  result.push(current.trim())

  return result
}

const parseCsvText = (text = '') => {
  const rows = String(text)
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map(row => row.trim())
    .filter(Boolean)

  if (!rows.length) return []

  const firstRow = rows[0].toLocaleLowerCase('tr-TR')
  const hasHeader = firstRow.includes('ad soyad') || firstRow.includes('telefon')

  const dataRows = hasHeader ? rows.slice(1) : rows

  return dataRows.map((row) => {
    const parts = parseCsvLine(row)

    return {
      fullName: parts[0] || '',
      phone: parts[1] || '',
      whatsapp: parts[2] || parts[1] || '',
      email: parts[3] || '',
      livingCity: parts[4] || '',
      customerType: parts[5] || 'Prospect',
      note: parts.slice(6).join(', ') || '',
    }
  }).filter(item => item.fullName || item.phone)
}

const handleImportFile = (event) => {
  const file = event.target.files?.[0]

  if (!file) return

  selectedImportFile.value = file
  importFileName.value = file.name

  const extension = file.name.split('.').pop()?.toLocaleLowerCase('tr-TR')

  if (!['csv', 'txt'].includes(extension)) {
    successMessage.value = 'Yükleme için CSV dosyası seçmelisiniz. Excel şablonunu doldurduktan sonra CSV olarak kaydedip yükleyin.'
    selectedImportFile.value = null
    importFileName.value = ''
    importPreview.value = []
    importRows.value = []

    setTimeout(() => {
      successMessage.value = ''
    }, 6000)

    return
  }

  const reader = new FileReader()

  reader.onload = () => {
    const parsedRows = parseCsvText(String(reader.result || ''))

    importRows.value = parsedRows
    importPreview.value = parsedRows.slice(0, 5)

    if (!parsedRows.length) {
      successMessage.value = 'Dosyada aktarılacak uygun kayıt bulunamadı.'
    }
  }

  reader.readAsText(file, 'UTF-8')
}

const runImport = () => {
  if (!importRows.value.length) {
    successMessage.value = 'Lütfen önce CSV dosyası seçin.'

    setTimeout(() => {
      successMessage.value = ''
    }, 4000)

    return
  }

  const existingPhones = new Set(
    customerList.value
      .map(item => cleanPhone(item.phone))
      .filter(Boolean)
  )

  let importedCount = 0
  let skippedCount = 0

  importRows.value.forEach((row, index) => {
    const phoneKey = cleanPhone(row.phone)

    if (phoneKey && existingPhones.has(phoneKey)) {
      skippedCount += 1
      return
    }

    createCustomer({
      fullName: row.fullName,
      name: row.fullName,
      phone: row.phone,
      whatsapp: row.whatsapp || row.phone,
      email: row.email,
      livingCity: row.city,
      customerType: row.customerType || 'Prospect',
      source: 'CSV / Excel Aktarımı',
      status: 'Aktif',
      visibility: 'Kişisel',
      dataOwner: 'Danışman',
      consultantId: currentConsultant.value.id,
      consultantName: currentConsultant.value.fullName,
      officeShared: false,
      isFromPhonebook: true,
      phonebookContactId: `csv-${Date.now()}-${index}`,
      lastContactDate: '',
      nextFollowDate: '',
      note: row.note || 'CSV / Excel aktarımı ile oluşturuldu.',
      notes: row.note || 'CSV / Excel aktarımı ile oluşturuldu.',
      createdAt: new Date().toISOString().slice(0, 10),
    })

    if (phoneKey) {
      existingPhones.add(phoneKey)
    }

    importedCount += 1
  })

  selectedImportFile.value = null
  importFileName.value = ''
  importPreview.value = []
  importRows.value = []
  showImportPanel.value = false

  successMessage.value = `${importedCount} kişi müşteriler listesine aktarıldı. ${skippedCount ? `${skippedCount} kayıt telefon numarası tekrar ettiği için atlandı. ` : ''}Aktarılan kayıtlar kişisel müşteri olarak oluşturuldu; broker göremez.`

  setTimeout(() => {
    successMessage.value = ''
  }, 7000)
}

const toggleOfficeShare = (customer) => {
  if (customer.officeShared) {
    unshareCustomerFromOffice(customer.id)
    successMessage.value = 'Müşteri kişisel olarak işaretlendi. Broker artık bu kaydı göremez.'
  } else {
    shareCustomerWithOffice(customer.id)
    successMessage.value = 'Müşteri ofisle paylaşıldı. Broker artık bu kaydı görebilir.'
  }

  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

const confirmDelete = (customer) => {
  if (confirm(`${customer.fullName || customer.phone} kaydını silmek istiyor musunuz?`)) {
    deleteCustomer(customer.id)
  }
}

const clearFilters = () => {
  search.value = ''
  typeFilter.value = ''
  visibilityFilter.value = 'Tümü'
  sourceFilter.value = 'Tümü'
}

const clearImportSelection = () => {
  selectedImportFile.value = null
  importFileName.value = ''
  importPreview.value = []
  importRows.value = []
}

const visibilityClass = (customer) => {
  return customer.officeShared
    ? 'bg-slate-900 text-white'
    : 'bg-slate-100 text-slate-700'
}

const sourceLabel = (customer) => {
  if (customer.isFromPhonebook) return 'Rehberden / Dosyadan Aktarıldı'
  return customer.source || 'Manuel Kayıt'
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Danışman Paneli
          </p>

          <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Müşteriler
          </h1>

          <p class="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
            Müşterilerinizi, kişisel rehber kayıtlarınızı ve ofisle paylaşılan müşteri kayıtlarınızı buradan yönetin. Dosya ile aktarılan kişiler varsayılan olarak kişisel kayıttır; broker göremez.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            @click="goToNewCustomer"
          >
            <i class="bi bi-plus-lg mr-2"></i>
            Yeni Müşteri
          </button>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            @click="showImportPanel = !showImportPanel"
          >
            <i class="bi bi-file-earmark-spreadsheet-fill mr-2"></i>
            Rehberden / Excel’den Aktar
          </button>
        </div>
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
        <p class="text-sm font-medium text-slate-500">Toplam Müşteri</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ customerStats.total }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Kişisel</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ customerStats.privateCount }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Ofisle Paylaşılan</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ customerStats.officeSharedCount }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Dosyadan Gelen</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ customerStats.fromPhonebookCount }}</p>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Takip Gereken</p>
        <p class="mt-3 text-3xl font-bold text-slate-900">{{ customerStats.followNeededCount }}</p>
      </div>
    </section>

    <section
      v-if="showImportPanel"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 class="text-xl font-bold text-slate-900">
            Rehberden / Excel’den Müşteri Aktar
          </h2>

          <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Örnek dosyayı indirin, Excel’de doldurun ve CSV olarak sisteme yükleyin. Aktarılan kayıtlar otomatik olarak kişisel müşteri olur; broker göremez.
          </p>
        </div>

        <button
          type="button"
          class="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          @click="showImportPanel = false"
        >
          Kapat
        </button>
      </div>

      <div class="mt-5 grid gap-4 xl:grid-cols-3">
        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-bold text-slate-900">
            1. Örnek Dosyayı İndir
          </p>

          <p class="mt-2 text-sm leading-6 text-slate-500">
            CSV dosyasını Excel’de açabilir ve kolayca doldurabilirsiniz.
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              @click="downloadSampleCsv"
            >
              Örnek CSV İndir
            </button>

            <button
              type="button"
              class="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              @click="downloadExcelTemplate"
            >
              Excel Şablonu İndir
            </button>
          </div>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-bold text-slate-900">
            2. Excel’de Doldur
          </p>

          <p class="mt-2 text-sm leading-6 text-slate-500">
            Ad soyad, telefon, WhatsApp, e-posta, şehir, müşteri tipi ve not alanlarını doldurun.
          </p>

          <div class="mt-4 rounded-2xl bg-white p-4 text-xs leading-5 text-slate-500">
            Ad Soyad · Telefon · WhatsApp · E-posta · Şehir · Müşteri Tipi · Not
          </div>
        </div>

        <div class="rounded-3xl bg-slate-50 p-5">
          <p class="text-sm font-bold text-slate-900">
            3. CSV Dosyasını Yükle
          </p>

          <p class="mt-2 text-sm leading-6 text-slate-500">
            Excel’den CSV olarak kaydedip sisteme yükleyin.
          </p>

          <label class="mt-4 inline-flex cursor-pointer items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            CSV Dosyası Seç
            <input
              type="file"
              accept=".csv,.txt"
              class="hidden"
              @change="handleImportFile"
            />
          </label>

          <p
            v-if="importFileName"
            class="mt-3 text-xs font-semibold text-slate-600"
          >
            Seçilen dosya: {{ importFileName }}
          </p>
        </div>
      </div>

      <div
        v-if="importPreview.length"
        class="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm"
      >
        <div class="border-b border-slate-200 px-5 py-4">
          <h3 class="font-bold text-slate-900">
            Ön İzleme
          </h3>

          <p class="mt-1 text-xs text-slate-500">
            İlk 5 kayıt gösteriliyor. Toplam {{ importRows.length }} kayıt bulundu.
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[900px] text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th class="px-5 py-3">Ad Soyad</th>
                <th class="px-5 py-3">Telefon</th>
                <th class="px-5 py-3">WhatsApp</th>
                <th class="px-5 py-3">E-posta</th>
                <th class="px-5 py-3">Şehir</th>
                <th class="px-5 py-3">Tip</th>
                <th class="px-5 py-3">Not</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="item in importPreview"
                :key="`${item.fullName}-${item.phone}`"
              >
                <td class="px-5 py-3 font-semibold text-slate-900">{{ item.fullName }}</td>
                <td class="px-5 py-3 text-slate-600">{{ item.phone }}</td>
                <td class="px-5 py-3 text-slate-600">{{ item.whatsapp }}</td>
                <td class="px-5 py-3 text-slate-600">{{ item.email }}</td>
                <td class="px-5 py-3 text-slate-600">{{ item.livingCity }}</td>
                <td class="px-5 py-3 text-slate-600">{{ enumLbl('CustomerType', item.customerType) }}</td>
                <td class="px-5 py-3 text-slate-600">{{ item.note }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          @click="runImport"
        >
          Dosyayı Müşterilere Aktar
        </button>

        <button
          type="button"
          class="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          @click="clearImportSelection"
        >
          Seçimi Temizle
        </button>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[1fr_220px_220px_220px_140px]">
        <UiInput
          v-model="search"
          label="Arama"
          variant="outline"
          size="sm"
          placeholder="Ad, telefon, şehir, not ara..."
        />

        <UiSelect
          v-model="typeFilter"
          label="Müşteri Tipi"
          variant="outline"
          size="sm"
        >
          <option
            v-for="option in typeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </UiSelect>

        <UiSelect
          v-model="visibilityFilter"
          label="Gizlilik"
          variant="outline"
          size="sm"
        >
          <option>Tümü</option>
          <option>Kişisel</option>
          <option>Ofisle Paylaşıldı</option>
        </UiSelect>

        <UiSelect
          v-model="sourceFilter"
          label="Kaynak"
          variant="outline"
          size="sm"
        >
          <option>Tümü</option>
          <option>Rehberden Aktarılan</option>
          <option>Manuel Kayıt</option>
        </UiSelect>

        <div class="flex items-end">
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
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-200 px-6 py-5">
        <h2 class="text-xl font-bold text-slate-900">
          Müşteri Listesi
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          {{ filteredCustomers.length }} müşteri listeleniyor.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[1300px] text-left text-sm">
          <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-6 py-4">Müşteri</th>
              <th class="px-6 py-4">İletişim</th>
              <th class="px-6 py-4">Tip / Kaynak</th>
              <th class="px-6 py-4">Takip</th>
              <th class="px-6 py-4">Gizlilik</th>
              <th class="px-6 py-4">Not</th>
              <th class="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="customer in filteredCustomers"
              :key="customer.id"
              class="align-top hover:bg-slate-50"
            >
              <td class="px-6 py-5">
                <p class="font-bold text-slate-900">
                  {{ customer.fullName || '-' }}
                </p>

                <p class="mt-1 text-xs text-slate-500">
                  {{ customer.livingCity || '-' }}
                </p>

                <p class="mt-1 text-xs text-slate-400">
                  {{ customer.consultantName || 'Danışman' }}
                </p>
              </td>

              <td class="px-6 py-5">
                <p class="font-semibold text-slate-900">
                  {{ customer.phone || '-' }}
                </p>

                <p class="mt-1 text-xs text-slate-500">
                  WhatsApp: {{ customer.whatsapp || '-' }}
                </p>

                <p class="mt-1 text-xs text-slate-500">
                  {{ customer.email || '-' }}
                </p>
              </td>

              <td class="px-6 py-5">
                <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {{ enumLbl('CustomerType', customer.customerType) }}
                </span>

                <p class="mt-2 text-xs text-slate-500">
                  {{ sourceLabel(customer) }}
                </p>
              </td>

              <td class="px-6 py-5">
                <p class="text-xs text-slate-500">
                  Son görüşme: {{ customer.lastContactDate || '-' }}
                </p>

                <p class="mt-1 text-xs text-slate-500">
                  Sonraki takip: {{ customer.nextFollowDate || '-' }}
                </p>
              </td>

              <td class="px-6 py-5">
                <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="visibilityClass(customer)"
                >
                  {{ customer.officeShared ? 'Ofisle Paylaşıldı' : 'Kişisel' }}
                </span>

                <p
                  v-if="customer.sharedAt"
                  class="mt-2 text-xs text-slate-500"
                >
                  Paylaşım: {{ customer.sharedAt }}
                </p>
              </td>

              <td class="px-6 py-5">
                <p class="max-w-xs text-xs leading-5 text-slate-600">
                  {{ customer.note || '-' }}
                </p>
              </td>

              <td class="px-6 py-5 text-right">
                <div class="flex flex-col items-end gap-2">
                  <NuxtLink
                    :to="`/contacts/${customer.id}`"
                    class="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Detay
                  </NuxtLink>
                </div>
              </td>
            </tr>

            <tr v-if="!filteredCustomers.length">
              <td
                colspan="7"
                class="px-6 py-10 text-center text-sm text-slate-500"
              >
                Müşteri kaydı bulunamadı.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>



