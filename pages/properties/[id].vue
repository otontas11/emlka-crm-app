<script setup>
import { useProperties, deleteProperty } from '~/composables/useProperties'

const route = useRoute()
const properties = useProperties()

const property = ref(null)
const isLoading = ref(true)
const isReady = ref(false)

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('tr-TR').format(date)
}

const formatPrice = (value, currency = 'TL') => {
  const amount = Number(value || 0)

  if (currency === 'USD') {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (currency === 'EUR') {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(amount)
}

const loadProperty = () => {
  const routeId = String(route.params.id)
  property.value = null

  const fromState = properties.value.find(item => String(item.id) === routeId)
  if (fromState) {
    property.value = fromState
    return
  }

  if (import.meta.client) {
    const saved = localStorage.getItem('properties')

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const found = parsed.find(item => String(item.id) === routeId)
        property.value = found || null
      } catch (error) {
        property.value = null
      }
    }
  }
}

const initializePage = async () => {
  isLoading.value = true
  isReady.value = false

  await nextTick()
  loadProperty()

  if (!property.value && import.meta.client) {
    await new Promise(resolve => setTimeout(resolve, 150))
    loadProperty()
  }

  isLoading.value = false
  isReady.value = true
}

const handleDelete = () => {
  if (!property.value) return

  const approved = window.confirm('Bu portföyü silmek istediğine emin misin?')
  if (!approved) return

  deleteProperty(property.value.id)
  window.location.href = '/properties'
}

const goToList = () => {
  window.location.href = '/properties'
}

const goToEdit = () => {
  if (!property.value) return
  window.location.href = '/properties/edit/' + property.value.id
}
watch(
  () => route.params.id,
  async () => {
    await initializePage()
  },
  { immediate: true }
)

onMounted(async () => {
  await initializePage()
})
</script>

<template>
  <div class="container-fluid">
    <div v-if="isLoading || !isReady" class="card hero-card border-0 shadow-sm rounded-4">
      <div class="card-body p-5 text-center">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <h4 class="fw-bold mb-2">Portföy yükleniyor</h4>
        <p class="text-muted mb-0">Lütfen bekleyin...</p>
      </div>
    </div>

    <div v-else-if="property" class="row g-4">
      <div class="col-12">
        <div class="card hero-card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-body p-0">
            <div class="hero-top p-4 p-lg-5">
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  <div class="text-uppercase small text-white-50 mb-2">Portföy Detayı</div>
                  <h2 class="fw-bold text-white mb-2">{{ property.title }}</h2>
                  <div class="d-flex flex-wrap gap-2">
                    <span class="badge rounded-pill bg-light text-dark px-3 py-2">{{ property.listingType }}</span>
                    <span class="badge rounded-pill bg-light text-dark px-3 py-2">{{ property.propertyType }}</span>
                    <span class="badge rounded-pill bg-warning text-dark px-3 py-2">{{ property.status }}</span>
                  </div>
                </div>

                <div class="text-lg-end">
                  <div class="small text-white-50 mb-2">Güncel Fiyat</div>
                  <div class="hero-price">{{ formatPrice(property.price, property.currency) }}</div>
                </div>
              </div>
            </div>

            <div class="hero-bottom px-4 py-3">
              <div class="row g-3">
                <div class="col-md-3">
                  <div class="mini-stat">
                    <div class="mini-label">Portföy No</div>
                    <div class="mini-value">{{ property.portfolioNo || '-' }}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mini-stat">
                    <div class="mini-label">Brüt / Net</div>
                    <div class="mini-value">{{ property.grossArea || '-' }} / {{ property.netArea || '-' }} m²</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mini-stat">
                    <div class="mini-label">Konum</div>
                    <div class="mini-value">{{ property.city || '-' }} / {{ property.district || '-' }}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mini-stat">
                    <div class="mini-label">Malik</div>
                    <div class="mini-value">{{ property.ownerName || '-' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div class="col-lg-8">
        <div class="card detail-card border-0 shadow-sm rounded-4 mb-4">
          <div class="section-title-wrap">
            <h5 class="fw-bold mb-0">Genel Özellikler</h5>
          </div>
          <div class="card-body p-4">
            <div class="row g-3">
              <div class="col-md-6"><div class="info-box"><div class="info-label">Portföy No</div><div class="info-value">{{ property.portfolioNo || '-' }}</div></div></div>
              <div class="col-md-6"><div class="info-box emphasis-box"><div class="info-label">Fiyat</div><div class="info-value emphasis-value">{{ formatPrice(property.price, property.currency) }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Brüt m²</div><div class="info-value">{{ property.grossArea || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Net m²</div><div class="info-value">{{ property.netArea || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Oda Sayısı</div><div class="info-value">{{ property.roomCount || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Bina Yaşı</div><div class="info-value">{{ property.buildingAge || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Kat</div><div class="info-value">{{ property.floor || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Isıtma</div><div class="info-value">{{ property.heating || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Tapu Durumu</div><div class="info-value">{{ property.deedStatus || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Kullanım Durumu</div><div class="info-value">{{ property.usageStatus || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Takas</div><div class="info-value">{{ property.swapEligible || '-' }}</div></div></div>
            </div>
          </div>
        </div>

        <div class="card detail-card border-0 shadow-sm rounded-4 mb-4">
          <div class="section-title-wrap">
            <h5 class="fw-bold mb-0">Adres Bilgileri</h5>
          </div>
          <div class="card-body p-4">
            <div class="row g-3">
              <div class="col-md-4"><div class="info-box"><div class="info-label">İl</div><div class="info-value">{{ property.city || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">İlçe</div><div class="info-value">{{ property.district || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Mahalle</div><div class="info-value">{{ property.neighborhood || '-' }}</div></div></div>
              <div class="col-12"><div class="info-box"><div class="info-label">Adres</div><div class="info-value">{{ property.address || '-' }}</div></div></div>
            </div>
          </div>
        </div>

        <div class="card detail-card border-0 shadow-sm rounded-4 mb-4">
          <div class="section-title-wrap">
            <h5 class="fw-bold mb-0">Malik Bilgileri</h5>
          </div>
          <div class="card-body p-4">
            <div class="row g-3">
              <div class="col-md-4"><div class="info-box"><div class="info-label">Malik Adı</div><div class="info-value">{{ property.ownerName || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Telefon</div><div class="info-value">{{ property.ownerPhone || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">E-posta</div><div class="info-value">{{ property.ownerEmail || '-' }}</div></div></div>
            </div>
          </div>
        </div>

        <div class="card detail-card border-0 shadow-sm rounded-4 mb-4">
          <div class="section-title-wrap">
            <h5 class="fw-bold mb-0">Yetki ve Takip</h5>
          </div>
          <div class="card-body p-4">
            <div class="row g-3">
              <div class="col-md-4"><div class="info-box"><div class="info-label">Rapor Periyodu</div><div class="info-value">{{ property.reportFrequency || '-' }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Son Rapor</div><div class="info-value">{{ formatDate(property.lastReportDate) }}</div></div></div>
              <div class="col-md-4"><div class="info-box"><div class="info-label">Sonraki Rapor</div><div class="info-value">{{ formatDate(property.nextReportDate) }}</div></div></div>
              <div class="col-md-3"><div class="info-box"><div class="info-label">Yetki Türü</div><div class="info-value">{{ property.authorityType || '-' }}</div></div></div>
              <div class="col-md-3"><div class="info-box"><div class="info-label">Yazılı Yetki Başlangıç</div><div class="info-value">{{ formatDate(property.writtenAuthorityStart) }}</div></div></div>
              <div class="col-md-3"><div class="info-box"><div class="info-label">Yazılı Yetki Bitiş</div><div class="info-value">{{ formatDate(property.writtenAuthorityEnd) }}</div></div></div>
              <div class="col-md-3"><div class="info-box"><div class="info-label">EİDS Bitiş</div><div class="info-value">{{ formatDate(property.eidsEnd) }}</div></div></div>
            </div>
          </div>
        </div>

        <div class="card detail-card border-0 shadow-sm rounded-4 mb-4">
          <div class="section-title-wrap">
            <h5 class="fw-bold mb-0">Pazarlama Verileri</h5>
          </div>
          <div class="card-body p-4">
            <div class="row g-3">
              <div class="col-md-3">
                <div class="metric-box">
                  <div class="metric-number">{{ property.marketingPhoneCalls || 0 }}</div>
                  <div class="metric-label">Telefon Araması</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="metric-box">
                  <div class="metric-number">{{ property.marketingWhatsapp || 0 }}</div>
                  <div class="metric-label">WhatsApp</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="metric-box">
                  <div class="metric-number">{{ property.marketingShowings || 0 }}</div>
                  <div class="metric-label">Gösterim</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="metric-box">
                  <div class="metric-number">{{ property.marketingOffers || 0 }}</div>
                  <div class="metric-label">Teklif</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card detail-card border-0 shadow-sm rounded-4 mb-4">
          <div class="section-title-wrap">
            <h5 class="fw-bold mb-0">Medya ve Belgeler</h5>
          </div>
          <div class="card-body p-4">
            <div class="mb-4">
              <div class="fw-semibold mb-3">Fotoğraflar</div>
              <div v-if="property.photos && property.photos.length" class="row g-3">
                <div v-for="(photo, index) in property.photos" :key="index" class="col-md-6">
                  <div class="media-card">
                    <div class="media-card-label">Fotoğraf {{ index + 1 }}</div>
                    <div class="media-card-value">{{ photo }}</div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-soft">Fotoğraf yok.</div>
            </div>

            <div class="mb-4">
              <div class="fw-semibold mb-3">Belgeler</div>
              <div v-if="property.documents && property.documents.length" class="row g-3">
                <div v-for="(document, index) in property.documents" :key="index" class="col-md-6">
                  <div class="media-card">
                    <div class="media-card-label">Belge {{ index + 1 }}</div>
                    <div class="media-card-value">{{ document }}</div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-soft">Belge yok.</div>
            </div>

            <div>
              <div class="fw-semibold mb-3">Video</div>
              <div class="media-card">
                <div class="media-card-label">Video Linki</div>
                <div class="media-card-value">{{ property.videoUrl || '-' }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card detail-card border-0 shadow-sm rounded-4">
          <div class="section-title-wrap">
            <h5 class="fw-bold mb-0">Açıklama ve Notlar</h5>
          </div>
          <div class="card-body p-4">
            <div class="info-box mb-3">
              <div class="info-label">Açıklama</div>
              <div class="info-value">{{ property.description || '-' }}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Notlar</div>
              <div class="info-value">{{ property.notes || '-' }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card side-card border-0 shadow-sm rounded-4 mb-4">
          <div class="section-title-wrap">
            <h5 class="fw-bold mb-0">Hızlı Özet</h5>
          </div>
          <div class="card-body p-4">
            <div class="quick-item"><span>No</span><strong>{{ property.portfolioNo || property.id }}</strong></div>
            <div class="quick-item"><span>Durum</span><strong>{{ property.status || '-' }}</strong></div>
            <div class="quick-item"><span>İlan Türü</span><strong>{{ property.listingType || '-' }}</strong></div>
            <div class="quick-item"><span>Mülk Tipi</span><strong>{{ property.propertyType || '-' }}</strong></div>
            <div class="quick-item"><span>Konum</span><strong>{{ property.city || '-' }} / {{ property.district || '-' }}</strong></div>
            <div class="quick-item"><span>Kayıt Tarihi</span><strong>{{ formatDate(property.createdAt) }}</strong></div>
          </div>
        </div>

        <div class="card side-card border-0 shadow-sm rounded-4">
          <div class="section-title-wrap">
            <h5 class="fw-bold mb-0">İşlemler</h5>
          </div>
          <div class="card-body p-4">
            <div class="d-grid gap-2">
              <button type="button" class="btn btn-outline-secondary rounded-pill" @click="goToList">
                <i class="bi bi-arrow-left me-2"></i>Listeye Dön
              </button>

              <button type="button" class="btn btn-outline-primary rounded-pill" @click="goToEdit">
                <i class="bi bi-pencil-square me-2"></i>Portföyü Düzenle
              </button>

              <button type="button" class="btn btn-outline-danger rounded-pill" @click="handleDelete">
                <i class="bi bi-trash me-2"></i>Portföyü Sil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card hero-card border-0 shadow-sm rounded-4">
      <div class="card-body p-5 text-center">
        <h4 class="fw-bold mb-2">Portföy bulunamadı</h4>
        <button type="button" class="btn btn-outline-secondary rounded-pill px-4 mt-3" @click="goToList">
          Listeye Dön
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-card,
.detail-card,
.side-card {
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

.mini-stat {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 14px 16px;
}

.mini-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.mini-value {
  font-weight: 700;
  color: #111827;
}

.section-title-wrap {
  padding: 18px 22px;
  border-bottom: 1px solid #e8eef5;
  background: #f8fbff;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.info-box {
  background: #eef3f8;
  border: 1px solid #e3eaf2;
  border-radius: 16px;
  padding: 14px 16px;
  height: 100%;
}

.emphasis-box {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  border-color: #fed7aa;
}

.emphasis-value {
  font-size: 20px;
  font-weight: 800;
}

.info-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
}

.info-value {
  font-weight: 600;
  color: #111827;
  word-break: break-word;
}

.metric-box {
  background: linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%);
  border: 1px solid #dbeafe;
  border-radius: 18px;
  padding: 22px 16px;
  text-align: center;
  height: 100%;
}

.metric-number {
  font-size: 30px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 10px;
}

.metric-label {
  font-size: 13px;
  color: #475569;
  font-weight: 600;
}

.media-card {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 18px;
  padding: 16px;
  height: 100%;
}

.media-card-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: .4px;
}

.media-card-value {
  font-weight: 600;
  color: #0f172a;
  word-break: break-word;
}

.empty-soft {
  background: #f8fafc;
  border: 1px dashed #d1d5db;
  border-radius: 16px;
  padding: 18px;
  color: #6b7280;
}

.quick-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e8eef5;
}

.quick-item:last-child {
  border-bottom: none;
}
</style>

