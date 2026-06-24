<script setup>
const props = defineProps({
  model: {
    type: Object,
    required: true,
  },
})

const yesNoOptions = ['', 'Evet', 'Hayır']
const fanOptions = ['', '1', '2', '3', '4', '5']

const customerTypeOptions = [
  'Alıcı',
  'Satıcı',
  'Kiracı',
  'Mal Sahibi',
  'Yatırımcı',
  'Referans',
  'Eski Müşteri',
  'Sıcak Müşteri',
  'Aday Müşteri',
  'Kişisel Rehber',
]

const statusOptions = [
  'Aktif',
  'Pasif',
  'Takipte',
  'Sıcak',
  'Soğuk',
  'İşlemde',
  'Kapandı',
]

const fieldGroups = [
  {
    title: 'Temel Bilgiler',
    description: 'Müşteri kimlik, iletişim ve ilk takip bilgileri.',
    fields: [
      { key: 'fullName', label: 'İsim Soyisim' },
      { key: 'phone', label: 'Telefon' },
      { key: 'whatsapp', label: 'WhatsApp' },
      { key: 'email', label: 'E-Posta', type: 'email' },
      { key: 'hometown', label: 'Memleket' },
      { key: 'hometownLiberationDate', label: 'Memleket Kurtuluş Günü', type: 'date' },
      { key: 'hometownLiberationTitle', label: 'Kurtuluş Günü Başlığı' },
      { key: 'birthDate', label: 'Doğum Tarihi', type: 'date' },
      { key: 'age', label: 'Yaş' },
      { key: 'customerType', label: 'Müşteri Tipi', type: 'select', options: customerTypeOptions },
      { key: 'status', label: 'Durum', type: 'select', options: statusOptions },
      { key: 'relationToMe', label: 'Benim Neyim' },
      { key: 'metThrough', label: 'Tanışma Vesilemiz' },
      { key: 'mutualFriend1', label: 'Bariz Ortak Arkadaş 1' },
      { key: 'mutualFriend2', label: 'Bariz Ortak Arkadaş 2' },
      { key: 'hometownNotes', label: 'Memleket Notları', type: 'textarea', span: 2 },
    ],
  },
  {
    title: 'Meslek Bilgileri',
    description: 'Ana meslek, yan meslek ve eski meslek detayları.',
    fields: [
      { key: 'mainProfession', label: 'Ana Mesleği' },
      { key: 'mainProfessionInstitution', label: 'Ana Meslek Kurumu' },
      { key: 'mainProfessionSubInstitution', label: 'Ana Meslek Alt Kurumu' },
      { key: 'mainProfessionNotes', label: 'Ana Mesleği Notları', type: 'textarea' },
      { key: 'sideProfession', label: 'Yan Mesleği' },
      { key: 'sideProfessionInstitution', label: 'Yan Mesleği Kurumu' },
      { key: 'sideProfessionSubInstitution', label: 'Yan Meslek Alt Kurumu' },
      { key: 'sideProfessionNotes', label: 'Yan Mesleği Notları', type: 'textarea' },
      { key: 'oldProfession', label: 'Eski Mesleği' },
      { key: 'oldProfessionInstitution', label: 'Eski Mesleği Kurumu' },
      { key: 'oldProfessionSubInstitution', label: 'Eski Meslek Alt Kurumu' },
      { key: 'oldProfessionNotes', label: 'Eski Mesleği Notları', type: 'textarea' },
    ],
  },
  {
    title: 'Yaşadığı Yer',
    description: 'Adres ve yaşam alanı detayları.',
    fields: [
      { key: 'livingCity', label: 'Yaşadığı Şehir' },
      { key: 'livingDistrict', label: 'Yaşadığı İlçe' },
      { key: 'livingNeighborhood', label: 'Yaşadığı Mahalle' },
      { key: 'livingSite', label: 'Yaşadığı Site' },
      { key: 'livingBlock', label: 'Yaşadığı Blok' },
      { key: 'livingApartment', label: 'Yaşadığı Daire' },
      { key: 'livingPlaceNotes', label: 'Yaşadığı Yer Notları', type: 'textarea', span: 2 },
    ],
  },
  {
    title: 'Sosyal Medya',
    description: 'Sosyal medya hesapları ve karşılıklı takip bilgileri.',
    fields: [
      { key: 'facebookName', label: 'Facebook İsmi' },
      { key: 'facebookMutualFollow', label: 'Facebook Karş. Takip', type: 'select', options: yesNoOptions },
      { key: 'facebookPageName', label: 'Facebook Sayfa İsmi' },
      { key: 'facebookPageMutualFollow', label: 'Facebook Sayfa Karş. Takip', type: 'select', options: yesNoOptions },
      { key: 'instagramName', label: 'Instagram İsmi' },
      { key: 'instagramMutualFollow', label: 'Instagram Karş. Takip', type: 'select', options: yesNoOptions },
      { key: 'instagramPageFollow', label: 'Instagram Sayfa Takip', type: 'select', options: yesNoOptions },
      { key: 'instagramPageMutualFollow', label: 'Instagram Sayfa Karş. Takip', type: 'select', options: yesNoOptions },
      { key: 'linkedinName', label: 'Linkedin İsmi' },
      { key: 'linkedinMutualFollow', label: 'Linkedin Karş. Takip', type: 'select', options: yesNoOptions },
      { key: 'youtubeChannelName', label: 'Youtube Kanal İsmi' },
      { key: 'youtubeChannelMutualFollow', label: 'Youtube Kanal Karş. Takip', type: 'select', options: yesNoOptions },
      { key: 'twitterName', label: 'Twitter İsmi' },
      { key: 'twitterMutualFollow', label: 'Twitter Karş. Takip', type: 'select', options: yesNoOptions },
    ],
  },
  {
    title: 'Eş ve Aile Bilgileri',
    description: 'Eş bilgileri ve özel gün hatırlatmaları.',
    fields: [
      { key: 'maritalStatus', label: 'Medeni Durumu' },
      { key: 'spouseName', label: 'Eşinin Adı' },
      { key: 'spouseBirthDate', label: 'Eşinin Doğum Tarihi', type: 'date' },
      { key: 'weddingAnniversary', label: 'Evlilik Yıldönümü', type: 'date' },
      { key: 'spouseProfession', label: 'Eşinin Mesleği' },
      { key: 'spouseWorkplace', label: 'Eşi Mesleği / Kurumu' },
      { key: 'spouseHometown', label: 'Eşi Memleket' },
      { key: 'spouseNotes', label: 'Eşi Notları', type: 'textarea' },
    ],
  },
  {
    title: 'Mülk Bilgileri',
    description: 'Müşterinin mülk, kira ve işyeri bilgileri.',
    fields: [
      { key: 'propertyNotes', label: 'Mülkleri ile İlgili Notlar', type: 'textarea', span: 2 },
      { key: 'houseOwnership', label: 'Oturduğu Ev Kendi/Kiracı' },
      { key: 'landlordHouseRent', label: 'Mülk Sahibi Ev Kirası' },
      { key: 'shopOwnership', label: 'Dükkanı Kendi/Kiracı' },
      { key: 'shopName', label: 'Dükkan İsmi' },
      { key: 'landlordShopRent', label: 'Mülk Sahibi Dükkan Kirası' },
    ],
  },
  {
    title: 'İlgi Alanları ve Kişisel Detaylar',
    description: 'Takım, araç, tekne, evcil hayvan, hobi ve özel notlar.',
    fields: [
      { key: 'favoriteTeam', label: 'Tuttuğu Takım' },
      { key: 'teamFanLevel', label: 'Takım Fanatiklik Seviyesi', type: 'select', options: fanOptions },
      { key: 'teamSpecialDate', label: 'Takım Özel Tarih', type: 'date' },
      { key: 'politicalView', label: 'Siyasi Görüşü' },
      { key: 'politicalFanLevel', label: 'Siyasi Fanatiklik Seviyesi', type: 'select', options: fanOptions },
      { key: 'carBrand', label: 'Araç Markası' },
      { key: 'carModel', label: 'Araç Modeli' },
      { key: 'carFanLevel', label: 'Araç Fanatiklik Seviyesi', type: 'select', options: fanOptions },
      { key: 'carNotes', label: 'Araç Notları', type: 'textarea' },
      { key: 'boatBrand', label: 'Tekne Markası' },
      { key: 'boatModel', label: 'Tekne Modeli' },
      { key: 'boatFanLevel', label: 'Tekne Fanatiklik Seviyesi', type: 'select', options: fanOptions },
      { key: 'boatNotes', label: 'Tekne Notları', type: 'textarea' },
      { key: 'petName', label: 'Evcil Hayvan İsmi' },
      { key: 'petAge', label: 'Evcil Hayvan Yaşı' },
      { key: 'petNotes', label: 'Evcil Hayvan Notları', type: 'textarea' },
      { key: 'mainHobby', label: 'En Bariz Hobisi' },
      { key: 'mainHobbyNotes', label: 'En Bariz Hobisi Notları', type: 'textarea' },
      { key: 'additionalNotes', label: 'İlave Not Alanı', type: 'textarea', span: 2 },
    ],
  },
  {
    title: 'Anne / Baba Bilgileri',
    description: 'Aile özel günleri ve notları.',
    fields: [
      { key: 'motherName', label: 'Anne Adı' },
      { key: 'motherProfession', label: 'Anne Mesleği' },
      { key: 'motherBirthDate', label: 'Anne Doğum Tarihi', type: 'date' },
      { key: 'motherDeathDate', label: 'Anne Ölüm Tarihi', type: 'date' },
      { key: 'motherNotes', label: 'Anne Notları', type: 'textarea' },
      { key: 'fatherName', label: 'Baba Adı' },
      { key: 'fatherProfession', label: 'Baba Mesleği' },
      { key: 'fatherBirthDate', label: 'Baba Doğum Tarihi', type: 'date' },
      { key: 'fatherDeathDate', label: 'Baba Ölüm Tarihi', type: 'date' },
      { key: 'fatherNotes', label: 'Baba Notları', type: 'textarea' },
    ],
  },
  {
    title: 'Takip ve Genel Not',
    description: 'Müşteri takip tarihi ve genel notlar.',
    fields: [
      { key: 'lastContactDate', label: 'Son Görüşme Tarihi', type: 'date' },
      { key: 'nextFollowDate', label: 'Sonraki Takip Tarihi', type: 'date' },
      { key: 'specialDaysNote', label: 'Özel Gün Mesaj Notları', type: 'textarea' },
      { key: 'note', label: 'Genel Not', type: 'textarea' },
    ],
  },
]

const addChild = () => {
  if (!Array.isArray(props.model.children)) {
    props.model.children = []
  }

  props.model.children.push({
    id: Date.now(),
    name: '',
    birthDate: '',
    profession: '',
    note: '',
  })
}

const removeChild = (index) => {
  props.model.children.splice(index, 1)
}
</script>

<template>
  <div class="space-y-6">
    <section
      v-for="group in fieldGroups"
      :key="group.title"
      class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 class="text-xl font-bold text-slate-900">
        {{ group.title }}
      </h2>

      <p class="mt-1 text-sm text-slate-500">
        {{ group.description }}
      </p>

      <div class="mt-6 grid gap-4 xl:grid-cols-4">
        <div
          v-for="field in group.fields"
          :key="field.key"
          :class="field.span === 2 ? 'xl:col-span-2' : ''"
        >
          <label class="mb-2 block text-sm font-semibold text-slate-700">
            {{ field.label }}
          </label>

          <textarea
            v-if="field.type === 'textarea'"
            v-model="model[field.key]"
            rows="4"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          ></textarea>

          <select
            v-else-if="field.type === 'select'"
            v-model="model[field.key]"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option
              v-for="option in field.options"
              :key="option"
              :value="option"
            >
              {{ option || 'Seçiniz' }}
            </option>
          </select>

          <input
            v-else
            v-model="model[field.key]"
            :type="field.type || 'text'"
            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-xl font-bold text-slate-900">
            Çocuk Bilgileri
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Çocuk sayısı müşteriden müşteriye değişeceği için + butonu ile istediğiniz kadar çocuk ekleyebilirsiniz.
          </p>
        </div>

        <button
          type="button"
          class="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          @click="addChild"
        >
          + Çocuk Ekle
        </button>
      </div>

      <div
        v-if="!model.children?.length"
        class="mt-6 rounded-3xl bg-slate-50 p-5 text-sm text-slate-500"
      >
        Henüz çocuk bilgisi eklenmedi.
      </div>

      <div class="mt-6 space-y-4">
        <div
          v-for="(child, index) in model.children"
          :key="child.id || index"
          class="rounded-3xl bg-slate-50 p-5"
        >
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-bold text-slate-900">
              {{ index + 1 }}. Çocuk
            </h3>

            <button
              type="button"
              class="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              @click="removeChild(index)"
            >
              Kaldır
            </button>
          </div>

          <div class="grid gap-4 xl:grid-cols-4">
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Çocuk Adı</label>
              <input v-model="child.name" type="text" class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500" />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Çocuk Doğum Tarihi</label>
              <input v-model="child.birthDate" type="date" class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500" />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Çocuk Mesleği</label>
              <input v-model="child.profession" type="text" class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500" />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700">Çocuk Notları</label>
              <input v-model="child.note" type="text" class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
