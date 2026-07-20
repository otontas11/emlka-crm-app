<script setup>
import { getPropertyById, updateProperty } from '~/composables/useProperties'

const route = useRoute()

const createEmptyForm = () => ({
  title: '',
  portfolioNo: '',
  category: 'Ticari',
  listingType: 'Satılık',
  propertyType: 'Dükkan',
  status: 'Aktif',
  price: '',
  currency: 'TL',
  grossArea: '',
  netArea: '',
  roomCount: '',
  buildingAge: '',
  floor: '',
  heating: '',
  furnished: 'Hayır',
  deedStatus: '',
  usageStatus: '',
  inSite: 'Hayır',
  swapEligible: 'Hayır',

  city: '',
  district: '',
  neighborhood: '',
  address: '',
  mapLocation: '',

  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',

  description: '',
  notes: '',

  reportFrequency: '20',
  lastReportDate: '',
  nextReportDate: '',

  writtenAuthorityStart: '',
  writtenAuthorityEnd: '',
  authorityType: 'Tek Yetkili',
  eidsStart: '',
  eidsEnd: '',

  rentStartDate: '',
  currentRent: '',
  rentIncreaseDate: '',
  rentIncreaseType: 'TÜFE',
  contractDuration: '',
  deposit: '',
  evacuationDate: '',

  marketingPhoneCalls: 0,
  marketingWhatsapp: 0,
  marketingShowings: 0,
  marketingOffers: 0,

  photos: [],
  documents: [],
  videoUrl: '',
})

const form = ref(createEmptyForm())
const isLoading = ref(true)
const propertyId = computed(() => String(route.params.id))

const loadProperty = () => {
  const property = getPropertyById(propertyId.value)

  if (!property) {
    isLoading.value = false
    return
  }

  form.value = {
    title: property.title || '',
    portfolioNo: property.portfolioNo || '',
    category: property.category || 'Ticari',
    listingType: property.listingType || 'Satılık',
    propertyType: property.propertyType || 'Dükkan',
    status: property.status || 'Aktif',
    price: property.price || '',
    currency: property.currency || 'TL',
    grossArea: property.grossArea || '',
    netArea: property.netArea || '',
    roomCount: property.roomCount || '',
    buildingAge: property.buildingAge || '',
    floor: property.floor || '',
    heating: property.heating || '',
    furnished: property.furnished || 'Hayır',
    deedStatus: property.deedStatus || '',
    usageStatus: property.usageStatus || '',
    inSite: property.inSite || 'Hayır',
    swapEligible: property.swapEligible || 'Hayır',

    city: property.city || '',
    district: property.district || '',
    neighborhood: property.neighborhood || '',
    address: property.address || '',
    mapLocation: property.mapLocation || '',

    ownerName: property.ownerName || '',
    ownerPhone: property.ownerPhone || '',
    ownerEmail: property.ownerEmail || '',

    description: property.description || '',
    notes: property.notes || '',

    reportFrequency: property.reportFrequency || '20',
    lastReportDate: property.lastReportDate || '',
    nextReportDate: property.nextReportDate || '',

    writtenAuthorityStart: property.writtenAuthorityStart || '',
    writtenAuthorityEnd: property.writtenAuthorityEnd || '',
    authorityType: property.authorityType || 'Tek Yetkili',
    eidsStart: property.eidsStart || '',
    eidsEnd: property.eidsEnd || '',

    rentStartDate: property.rentStartDate || '',
    currentRent: property.currentRent || '',
    rentIncreaseDate: property.rentIncreaseDate || '',
    rentIncreaseType: property.rentIncreaseType || 'TÜFE',
    contractDuration: property.contractDuration || '',
    deposit: property.deposit || '',
    evacuationDate: property.evacuationDate || '',

    marketingPhoneCalls: property.marketingPhoneCalls || 0,
    marketingWhatsapp: property.marketingWhatsapp || 0,
    marketingShowings: property.marketingShowings || 0,
    marketingOffers: property.marketingOffers || 0,

    photos: Array.isArray(property.photos) ? [...property.photos] : [],
    documents: Array.isArray(property.documents) ? [...property.documents] : [],
    videoUrl: property.videoUrl || '',
  }

  isLoading.value = false
}

const addPhoto = () => {
  form.value.photos.push('')
}

const removePhoto = (index) => {
  form.value.photos.splice(index, 1)
}

const addDocument = () => {
  form.value.documents.push('')
}

const removeDocument = (index) => {
  form.value.documents.splice(index, 1)
}

const saveProperty = () => {
  const updated = updateProperty(propertyId.value, {
    ...form.value,
    price: Number(form.value.price || 0),
    grossArea: Number(form.value.grossArea || 0),
    netArea: Number(form.value.netArea || 0),
    marketingPhoneCalls: Number(form.value.marketingPhoneCalls || 0),
    marketingWhatsapp: Number(form.value.marketingWhatsapp || 0),
    marketingShowings: Number(form.value.marketingShowings || 0),
    marketingOffers: Number(form.value.marketingOffers || 0),
    currentRent: Number(form.value.currentRent || 0),
    deposit: Number(form.value.deposit || 0),
  })

  if (!updated) {
    alert('Portföy bulunamadı.')
    return
  }

  window.location.href = '/properties/' + propertyId.value
}

const goToDetail = () => {
  window.location.href = '/properties/' + propertyId.value
}

onMounted(() => {
  loadProperty()
})
</script>

<template>
  <div class="container-fluid">
    <div v-if="isLoading" class="card hero-card border-0 shadow-sm rounded-4">
      <div class="card-body p-5 text-center">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <h4 class="fw-bold mb-2">Portföy bilgileri yükleniyor</h4>
        <p class="text-muted mb-0">Lütfen bekleyin...</p>
      </div>
    </div>

    <template v-else>
      <div class="card hero-card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div class="card-body p-0">
          <div class="hero-top p-4 p-lg-5">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <div class="text-uppercase small text-white-50 mb-2">Portföy Düzenle</div>
                <h2 class="fw-bold text-white mb-2">{{ form.title || 'Portföy Düzenleme Ekranı' }}</h2>
                <div class="d-flex flex-wrap gap-2">
                  <span class="badge rounded-pill bg-light text-dark px-3 py-2">{{ form.listingType }}</span>
                  <span class="badge rounded-pill bg-light text-dark px-3 py-2">{{ form.propertyType }}</span>
                  <span class="badge rounded-pill bg-warning text-dark px-3 py-2">{{ form.status }}</span>
                </div>
              </div>

              <div class="text-lg-end">
                <div class="small text-white-50 mb-2">Düzenlenen Fiyat</div>
                <div class="hero-price">{{ form.price || 0 }} {{ form.currency }}</div>
              </div>
            </div>
          </div>

          <div class="hero-bottom px-4 py-3">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div class="text-muted">Kayıtlı portföy bilgilerini güncelleyebilirsiniz.</div>
              <UiButton variant="secondary" icon="bi-arrow-left" @click="goToDetail">Detaya Dön</UiButton>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-12">
          <div class="card form-card border-0 shadow-sm rounded-4">
            <div class="section-title-wrap">
              <h5 class="fw-bold mb-0">Genel Bilgiler</h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-4">
                <UiInput v-model="form.title" label="Portföy Başlığı" type="text" variant="ring" class="col-md-6" />
                <UiInput v-model="form.portfolioNo" label="Portföy No" type="text" variant="ring" class="col-md-3" />
                <UiSelect v-model="form.status" label="Durum" variant="ring" class="col-md-3">
                  <option>Aktif</option>
                  <option>Beklemede</option>
                  <option>Pasif</option>
                  <option>Satıldı</option>
                  <option>Kiralandı</option>
                </UiSelect>

                <UiSelect v-model="form.category" label="Kategori" variant="ring" class="col-md-3">
                  <option>Ticari</option>
                  <option>Konut</option>
                  <option>Arsa</option>
                  <option>Sanayi</option>
                </UiSelect>
                <UiSelect v-model="form.listingType" label="İlan Türü" variant="ring" class="col-md-3">
                  <option>Satılık</option>
                  <option>Kiralık</option>
                </UiSelect>
                <UiInput v-model="form.propertyType" label="Mülk Tipi" type="text" variant="ring" class="col-md-3" />
                <UiInput v-model="form.deedStatus" label="Tapu Durumu" type="text" variant="ring" class="col-md-3" />

                <UiInput v-model="form.price" label="Fiyat" type="number" variant="ring" class="col-md-3" />
                <UiSelect v-model="form.currency" label="Para Birimi" variant="ring" class="col-md-2">
                  <option>TL</option>
                  <option>USD</option>
                  <option>EUR</option>
                </UiSelect>
                <UiInput v-model="form.grossArea" label="Brüt m²" type="number" variant="ring" class="col-md-2" />
                <UiInput v-model="form.netArea" label="Net m²" type="number" variant="ring" class="col-md-2" />
                <UiInput v-model="form.roomCount" label="Oda Sayısı" type="text" variant="ring" class="col-md-3" />

                <UiInput v-model="form.buildingAge" label="Bina Yaşı" type="text" variant="ring" class="col-md-3" />
                <UiInput v-model="form.floor" label="Kat" type="text" variant="ring" class="col-md-3" />
                <UiInput v-model="form.heating" label="Isıtma" type="text" variant="ring" class="col-md-3" />
                <UiInput v-model="form.usageStatus" label="Kullanım Durumu" type="text" variant="ring" class="col-md-3" />

                <UiSelect v-model="form.furnished" label="Eşyalı" variant="ring" class="col-md-4">
                  <option>Evet</option>
                  <option>Hayır</option>
                </UiSelect>
                <UiSelect v-model="form.inSite" label="Site İçinde" variant="ring" class="col-md-4">
                  <option>Evet</option>
                  <option>Hayır</option>
                </UiSelect>
                <UiSelect v-model="form.swapEligible" label="Takas Uygunluğu" variant="ring" class="col-md-4">
                  <option>Evet</option>
                  <option>Hayır</option>
                </UiSelect>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card form-card border-0 shadow-sm rounded-4">
            <div class="section-title-wrap">
              <h5 class="fw-bold mb-0">Adres Bilgileri</h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-4">
                <UiInput v-model="form.city" label="İl" type="text" variant="ring" class="col-md-3" />
                <UiInput v-model="form.district" label="İlçe" type="text" variant="ring" class="col-md-3" />
                <UiInput v-model="form.neighborhood" label="Mahalle" type="text" variant="ring" class="col-md-3" />
                <UiInput v-model="form.mapLocation" label="Harita Konumu" type="text" variant="ring" class="col-md-3" />
                <UiTextarea v-model="form.address" label="Adres" :rows="3" variant="ring" class="col-12" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card form-card border-0 shadow-sm rounded-4">
            <div class="section-title-wrap">
              <h5 class="fw-bold mb-0">Malik Bilgileri</h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-4">
                <UiInput v-model="form.ownerName" label="Malik Adı" type="text" variant="ring" class="col-md-4" />
                <UiInput v-model="form.ownerPhone" label="Malik Telefon" type="text" variant="ring" class="col-md-4" />
                <UiInput v-model="form.ownerEmail" label="Malik E-posta" type="email" variant="ring" class="col-md-4" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card form-card border-0 shadow-sm rounded-4">
            <div class="section-title-wrap">
              <h5 class="fw-bold mb-0">Yetki ve Rapor Takibi</h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-4">
                <UiInput v-model="form.reportFrequency" label="Rapor Periyodu (Gün)" type="number" variant="ring" class="col-md-3" />
                <UiInput v-model="form.lastReportDate" label="Son Rapor Tarihi" type="date" variant="ring" class="col-md-3" />
                <UiInput v-model="form.nextReportDate" label="Sonraki Rapor Tarihi" type="date" variant="ring" class="col-md-3" />
                <UiSelect v-model="form.authorityType" label="Yetki Türü" variant="ring" class="col-md-3">
                  <option>Tek Yetkili</option>
                  <option>Paylaşımlı Yetki</option>
                  <option>Yetkisiz</option>
                </UiSelect>

                <UiInput v-model="form.writtenAuthorityStart" label="Yazılı Yetki Başlangıç" type="date" variant="ring" class="col-md-3" />
                <UiInput v-model="form.writtenAuthorityEnd" label="Yazılı Yetki Bitiş" type="date" variant="ring" class="col-md-3" />
                <UiInput v-model="form.eidsStart" label="EİDS Başlangıç" type="date" variant="ring" class="col-md-3" />
                <UiInput v-model="form.eidsEnd" label="EİDS Bitiş" type="date" variant="ring" class="col-md-3" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card form-card border-0 shadow-sm rounded-4">
            <div class="section-title-wrap">
              <h5 class="fw-bold mb-0">Kira Bilgileri</h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-4">
                <UiInput v-model="form.rentStartDate" label="Kira Başlangıç Tarihi" type="date" variant="ring" class="col-md-3" />
                <UiInput v-model="form.currentRent" label="Mevcut Kira" type="number" variant="ring" class="col-md-3" />
                <UiInput v-model="form.rentIncreaseDate" label="Artış Tarihi" type="date" variant="ring" class="col-md-3" />
                <UiSelect v-model="form.rentIncreaseType" label="Artış Tipi" variant="ring" class="col-md-3">
                  <option>TÜFE</option>
                  <option>Sabit Oran</option>
                  <option>Özel Sözleşme</option>
                </UiSelect>

                <UiInput v-model="form.contractDuration" label="Sözleşme Süresi" type="text" variant="ring" class="col-md-4" />
                <UiInput v-model="form.deposit" label="Depozito" type="number" variant="ring" class="col-md-4" />
                <UiInput v-model="form.evacuationDate" label="Tahliye Tarihi" type="date" variant="ring" class="col-md-4" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card form-card border-0 shadow-sm rounded-4">
            <div class="section-title-wrap">
              <h5 class="fw-bold mb-0">Pazarlama Raporu</h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-4">
                <UiInput v-model="form.marketingPhoneCalls" label="Telefon Araması" type="number" variant="ring" class="col-md-3" />
                <UiInput v-model="form.marketingWhatsapp" label="WhatsApp Talebi" type="number" variant="ring" class="col-md-3" />
                <UiInput v-model="form.marketingShowings" label="Gösterim Sayısı" type="number" variant="ring" class="col-md-3" />
                <UiInput v-model="form.marketingOffers" label="Teklif Sayısı" type="number" variant="ring" class="col-md-3" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card form-card border-0 shadow-sm rounded-4">
            <div class="section-title-wrap d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0">Fotoğraflar</h5>
              <UiButton variant="secondary" icon="bi-plus-lg" @click="addPhoto">Fotoğraf Ekle</UiButton>
            </div>
            <div class="card-body p-4">
              <div v-if="form.photos.length === 0" class="empty-soft">Henüz fotoğraf eklenmedi.</div>

              <div v-for="(photo, index) in form.photos" :key="index" class="media-row mb-3">
                <div class="media-input-wrap">
                  <UiInput v-model="form.photos[index]" :label="'Fotoğraf ' + (index + 1)" type="text" variant="ring" placeholder="Fotoğraf URL veya dosya yolu" />
                </div>
                <div class="media-action-wrap">
                  <UiButton variant="danger" shape="rounded" block @click="removePhoto(index)">Sil</UiButton>
                </div>
              </div>

              <UiInput v-model="form.videoUrl" label="Video URL" type="text" variant="ring" class="mt-4" />
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card form-card border-0 shadow-sm rounded-4">
            <div class="section-title-wrap d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0">Belgeler</h5>
              <UiButton variant="secondary" icon="bi-plus-lg" @click="addDocument">Belge Ekle</UiButton>
            </div>
            <div class="card-body p-4">
              <div v-if="form.documents.length === 0" class="empty-soft">Henüz belge eklenmedi.</div>

              <div v-for="(document, index) in form.documents" :key="index" class="media-row mb-3">
                <div class="media-input-wrap">
                  <UiInput v-model="form.documents[index]" :label="'Belge ' + (index + 1)" type="text" variant="ring" placeholder="Belge adı veya dosya yolu" />
                </div>
                <div class="media-action-wrap">
                  <UiButton variant="danger" shape="rounded" block @click="removeDocument(index)">Sil</UiButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card form-card border-0 shadow-sm rounded-4">
            <div class="section-title-wrap">
              <h5 class="fw-bold mb-0">Açıklama ve Notlar</h5>
            </div>
            <div class="card-body p-4">
              <div class="row g-4">
                <UiTextarea v-model="form.description" label="Açıklama" :rows="4" variant="ring" class="col-12" />
                <UiTextarea v-model="form.notes" label="Notlar" :rows="4" variant="ring" class="col-12" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="d-flex gap-2">
            <UiButton variant="primary" icon="bi-check2-circle" @click="saveProperty">Güncelle</UiButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.hero-card,
.form-card {
  background: #ffffff;
}

.hero-top {
  background: linear-gradient(135deg, #111827 0%, #1f2937 60%, #334155 100%);
}

.hero-bottom {
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.hero-price {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
}

.section-title-wrap {
  padding: 18px 22px;
  border-bottom: 1px solid #e8eef5;
  background: #f8fbff;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.empty-soft {
  background: #f8fafc;
  border: 1px dashed #d1d5db;
  border-radius: 16px;
  padding: 18px;
  color: #6b7280;
}

.media-row {
  display: flex;
  gap: 12px;
  align-items: end;
}

.media-input-wrap {
  flex: 1;
}

.media-action-wrap {
  width: 120px;
}

@media (max-width: 768px) {
  .media-row {
    flex-direction: column;
    align-items: stretch;
  }

  .media-action-wrap {
    width: 100%;
  }
}
</style>

