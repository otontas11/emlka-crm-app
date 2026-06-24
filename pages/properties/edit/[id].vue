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
              <button type="button" class="btn btn-outline-secondary rounded-pill px-4" @click="goToDetail">
                <i class="bi bi-arrow-left me-2"></i>Detaya Dön
              </button>
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
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Portföy Başlığı</label>
                  <input v-model="form.title" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Portföy No</label>
                  <input v-model="form.portfolioNo" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Durum</label>
                  <select v-model="form.status" class="form-select form-select-lg rounded-3">
                    <option>Aktif</option>
                    <option>Beklemede</option>
                    <option>Pasif</option>
                    <option>Satıldı</option>
                    <option>Kiralandı</option>
                  </select>
                </div>

                <div class="col-md-3">
                  <label class="form-label fw-semibold">Kategori</label>
                  <select v-model="form.category" class="form-select form-select-lg rounded-3">
                    <option>Ticari</option>
                    <option>Konut</option>
                    <option>Arsa</option>
                    <option>Sanayi</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">İlan Türü</label>
                  <select v-model="form.listingType" class="form-select form-select-lg rounded-3">
                    <option>Satılık</option>
                    <option>Kiralık</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Mülk Tipi</label>
                  <input v-model="form.propertyType" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Tapu Durumu</label>
                  <input v-model="form.deedStatus" type="text" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-3">
                  <label class="form-label fw-semibold">Fiyat</label>
                  <input v-model="form.price" type="number" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-2">
                  <label class="form-label fw-semibold">Para Birimi</label>
                  <select v-model="form.currency" class="form-select form-select-lg rounded-3">
                    <option>TL</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <label class="form-label fw-semibold">Brüt m²</label>
                  <input v-model="form.grossArea" type="number" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-2">
                  <label class="form-label fw-semibold">Net m²</label>
                  <input v-model="form.netArea" type="number" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Oda Sayısı</label>
                  <input v-model="form.roomCount" type="text" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-3">
                  <label class="form-label fw-semibold">Bina Yaşı</label>
                  <input v-model="form.buildingAge" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Kat</label>
                  <input v-model="form.floor" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Isıtma</label>
                  <input v-model="form.heating" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Kullanım Durumu</label>
                  <input v-model="form.usageStatus" type="text" class="form-control form-control-lg rounded-3" />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Eşyalı</label>
                  <select v-model="form.furnished" class="form-select form-select-lg rounded-3">
                    <option>Evet</option>
                    <option>Hayır</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Site İçinde</label>
                  <select v-model="form.inSite" class="form-select form-select-lg rounded-3">
                    <option>Evet</option>
                    <option>Hayır</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Takas Uygunluğu</label>
                  <select v-model="form.swapEligible" class="form-select form-select-lg rounded-3">
                    <option>Evet</option>
                    <option>Hayır</option>
                  </select>
                </div>
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
                <div class="col-md-3">
                  <label class="form-label fw-semibold">İl</label>
                  <input v-model="form.city" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">İlçe</label>
                  <input v-model="form.district" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Mahalle</label>
                  <input v-model="form.neighborhood" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Harita Konumu</label>
                  <input v-model="form.mapLocation" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">Adres</label>
                  <textarea v-model="form.address" class="form-control rounded-3" rows="3"></textarea>
                </div>
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
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Malik Adı</label>
                  <input v-model="form.ownerName" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Malik Telefon</label>
                  <input v-model="form.ownerPhone" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Malik E-posta</label>
                  <input v-model="form.ownerEmail" type="email" class="form-control form-control-lg rounded-3" />
                </div>
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
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Rapor Periyodu (Gün)</label>
                  <input v-model="form.reportFrequency" type="number" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Son Rapor Tarihi</label>
                  <input v-model="form.lastReportDate" type="date" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Sonraki Rapor Tarihi</label>
                  <input v-model="form.nextReportDate" type="date" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Yetki Türü</label>
                  <select v-model="form.authorityType" class="form-select form-select-lg rounded-3">
                    <option>Tek Yetkili</option>
                    <option>Paylaşımlı Yetki</option>
                    <option>Yetkisiz</option>
                  </select>
                </div>

                <div class="col-md-3">
                  <label class="form-label fw-semibold">Yazılı Yetki Başlangıç</label>
                  <input v-model="form.writtenAuthorityStart" type="date" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Yazılı Yetki Bitiş</label>
                  <input v-model="form.writtenAuthorityEnd" type="date" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">EİDS Başlangıç</label>
                  <input v-model="form.eidsStart" type="date" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">EİDS Bitiş</label>
                  <input v-model="form.eidsEnd" type="date" class="form-control form-control-lg rounded-3" />
                </div>
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
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Kira Başlangıç Tarihi</label>
                  <input v-model="form.rentStartDate" type="date" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Mevcut Kira</label>
                  <input v-model="form.currentRent" type="number" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Artış Tarihi</label>
                  <input v-model="form.rentIncreaseDate" type="date" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Artış Tipi</label>
                  <select v-model="form.rentIncreaseType" class="form-select form-select-lg rounded-3">
                    <option>TÜFE</option>
                    <option>Sabit Oran</option>
                    <option>Özel Sözleşme</option>
                  </select>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">Sözleşme Süresi</label>
                  <input v-model="form.contractDuration" type="text" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Depozito</label>
                  <input v-model="form.deposit" type="number" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-4">
                  <label class="form-label fw-semibold">Tahliye Tarihi</label>
                  <input v-model="form.evacuationDate" type="date" class="form-control form-control-lg rounded-3" />
                </div>
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
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Telefon Araması</label>
                  <input v-model="form.marketingPhoneCalls" type="number" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">WhatsApp Talebi</label>
                  <input v-model="form.marketingWhatsapp" type="number" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Gösterim Sayısı</label>
                  <input v-model="form.marketingShowings" type="number" class="form-control form-control-lg rounded-3" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Teklif Sayısı</label>
                  <input v-model="form.marketingOffers" type="number" class="form-control form-control-lg rounded-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card form-card border-0 shadow-sm rounded-4">
            <div class="section-title-wrap d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0">Fotoğraflar</h5>
              <button type="button" class="btn btn-outline-primary rounded-pill px-3" @click="addPhoto">
                <i class="bi bi-plus-lg me-2"></i>Fotoğraf Ekle
              </button>
            </div>
            <div class="card-body p-4">
              <div v-if="form.photos.length === 0" class="empty-soft">Henüz fotoğraf eklenmedi.</div>

              <div v-for="(photo, index) in form.photos" :key="index" class="media-row mb-3">
                <div class="media-input-wrap">
                  <label class="form-label fw-semibold">Fotoğraf {{ index + 1 }}</label>
                  <input v-model="form.photos[index]" type="text" class="form-control form-control-lg rounded-3" placeholder="Fotoğraf URL veya dosya yolu" />
                </div>
                <div class="media-action-wrap">
                  <button type="button" class="btn btn-outline-danger w-100 rounded-3" @click="removePhoto(index)">Sil</button>
                </div>
              </div>

              <div class="mt-4">
                <label class="form-label fw-semibold">Video URL</label>
                <input v-model="form.videoUrl" type="text" class="form-control form-control-lg rounded-3" />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="card form-card border-0 shadow-sm rounded-4">
            <div class="section-title-wrap d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0">Belgeler</h5>
              <button type="button" class="btn btn-outline-primary rounded-pill px-3" @click="addDocument">
                <i class="bi bi-plus-lg me-2"></i>Belge Ekle
              </button>
            </div>
            <div class="card-body p-4">
              <div v-if="form.documents.length === 0" class="empty-soft">Henüz belge eklenmedi.</div>

              <div v-for="(document, index) in form.documents" :key="index" class="media-row mb-3">
                <div class="media-input-wrap">
                  <label class="form-label fw-semibold">Belge {{ index + 1 }}</label>
                  <input v-model="form.documents[index]" type="text" class="form-control form-control-lg rounded-3" placeholder="Belge adı veya dosya yolu" />
                </div>
                <div class="media-action-wrap">
                  <button type="button" class="btn btn-outline-danger w-100 rounded-3" @click="removeDocument(index)">Sil</button>
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
                <div class="col-12">
                  <label class="form-label fw-semibold">Açıklama</label>
                  <textarea v-model="form.description" class="form-control rounded-3" rows="4"></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">Notlar</label>
                  <textarea v-model="form.notes" class="form-control rounded-3" rows="4"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-primary rounded-pill px-4" @click="saveProperty">
              <i class="bi bi-check2-circle me-2"></i>Güncelle
            </button>
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

