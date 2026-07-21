<script setup>
import { useProperties } from '~/composables/useProperties'

const viewMode = ref('card')
const properties = useProperties()

const searchTerm = ref('')
const selectedListingType = ref('Tümü')
const selectedStatus = ref('Tümü')

const listingTypes = ['Tümü', 'Satılık', 'Kiralık']
const statuses = ['Tümü', 'Aktif', 'Beklemede', 'Pasif', 'Satıldı', 'Kiralandı']

const normalizeText = (value) => {
  return String(value || '')
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
}

const filteredProperties = computed(() => {
  const term = normalizeText(searchTerm.value.trim())

  return properties.value.filter((property) => {
    const searchableText = [
      property.title,
      property.portfolioNo,
      property.propertyType,
      property.city,
      property.district,
      property.neighborhood,
      property.ownerName
    ]
      .map(item => normalizeText(item))
      .join(' ')

    const matchesSearch = !term || searchableText.includes(term)

    const matchesListingType =
      selectedListingType.value === 'Tümü' ||
      String(property.listingType || '') === selectedListingType.value

    const matchesStatus =
      selectedStatus.value === 'Tümü' ||
      String(property.status || '') === selectedStatus.value

    return matchesSearch && matchesListingType && matchesStatus
  })
})

const goToDetail = (id) => {
  window.location.href = '/properties/' + String(id)
}

const formatPrice = (value, currency = 'TL') => {
  const amount = Number(value || 0)

  if (currency === 'USD') {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
  }

  if (currency === 'EUR') {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
  }

  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount)
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedListingType.value = 'Tümü'
  selectedStatus.value = 'Tümü'
}
</script>

<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
      <div>
        <h2 class="fw-bold mb-1">Portföyler</h2>
        <p class="text-muted mb-0">Portföy kayıtlarını görüntüleyin, filtreleyin ve yeni portföy ekleyin.</p>
      </div>

      <div class="d-flex gap-2 flex-wrap">
        <div class="btn-group" role="group">
          <button class="btn" :class="viewMode === 'card' ? 'btn-dark' : 'btn-outline-dark'" @click="viewMode = 'card'">
            <i class="bi bi-grid me-2"></i>Kart
          </button>
          <button class="btn" :class="viewMode === 'table' ? 'btn-dark' : 'btn-outline-dark'" @click="viewMode = 'table'">
            <i class="bi bi-table me-2"></i>Tablo
          </button>
        </div>

        <NuxtLink to="/properties/new" class="btn btn-primary rounded-pill px-4">
          <i class="bi bi-plus-lg me-2"></i>Yeni Portföy
        </NuxtLink>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-6 col-xl-3">
        <div class="card summary-card border-0 shadow-sm rounded-4">
          <div class="card-body p-4 d-flex justify-content-between align-items-start">
            <div>
              <h6 class="text-muted mb-2">Toplam Portföy</h6>
              <div class="fs-2 fw-bold">{{ properties.length }}</div>
            </div>
            <div class="summary-icon bg-primary-subtle text-primary">
              <i class="bi bi-buildings"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="card summary-card border-0 shadow-sm rounded-4">
          <div class="card-body p-4 d-flex justify-content-between align-items-start">
            <div>
              <h6 class="text-muted mb-2">Aktif Portföy</h6>
              <div class="fs-2 fw-bold">{{ properties.filter(p => p.status === 'Aktif').length }}</div>
            </div>
            <div class="summary-icon bg-success-subtle text-success">
              <i class="bi bi-house-check"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="card summary-card border-0 shadow-sm rounded-4">
          <div class="card-body p-4 d-flex justify-content-between align-items-start">
            <div>
              <h6 class="text-muted mb-2">Satılık</h6>
              <div class="fs-2 fw-bold">{{ properties.filter(p => p.listingType === 'Satılık').length }}</div>
            </div>
            <div class="summary-icon bg-warning-subtle text-warning">
              <i class="bi bi-tag"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="card summary-card border-0 shadow-sm rounded-4">
          <div class="card-body p-4 d-flex justify-content-between align-items-start">
            <div>
              <h6 class="text-muted mb-2">Kiralık</h6>
              <div class="fs-2 fw-bold">{{ properties.filter(p => p.listingType === 'Kiralık').length }}</div>
            </div>
            <div class="summary-icon bg-secondary-subtle text-secondary">
              <i class="bi bi-key"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card filter-card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-4">
        <div class="row g-3">
          <UiInput
            v-model="searchTerm"
            label="Arama"
            variant="ring"
            class="col-lg-5"
            placeholder="Başlık, portföy no, mahalle, malik adı ile ara"
          />

          <UiSelect
            v-model="selectedListingType"
            label="İlan Türü"
            variant="ring"
            class="col-lg-3"
          >
            <option v-for="type in listingTypes" :key="type" :value="type">{{ type }}</option>
          </UiSelect>

          <UiSelect
            v-model="selectedStatus"
            label="Durum"
            variant="ring"
            class="col-lg-2"
          >
            <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
          </UiSelect>

          <div class="col-lg-2 d-flex align-items-end">
            <UiButton
              variant="secondary"
              block
              @click="clearFilters"
            >
              Temizle
            </UiButton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="properties.length === 0" class="card empty-card border-0 shadow-sm rounded-4">
      <div class="card-body p-5 text-center">
        <h4 class="fw-bold mb-2">Henüz portföy kaydı yok</h4>
        <p class="text-muted mb-4">Yeni portföy ekleyerek başlayabilirsiniz.</p>
        <NuxtLink to="/properties/new" class="btn btn-primary rounded-pill px-4">İlk Portföyü Ekle</NuxtLink>
      </div>
    </div>

    <div v-else-if="filteredProperties.length === 0" class="card empty-card border-0 shadow-sm rounded-4">
      <div class="card-body p-5 text-center">
        <h4 class="fw-bold mb-2">Sonuç bulunamadı</h4>
        <p class="text-muted mb-4">Filtre kriterlerini değiştirin.</p>
      </div>
    </div>

    <template v-else>
      <div v-if="viewMode === 'card'" class="row g-4">
        <div v-for="property in filteredProperties" :key="property.id" class="col-md-6 col-xl-4">
          <div class="card property-card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 class="fw-bold mb-1">{{ property.title }}</h5>
                  <p class="text-muted mb-0">{{ property.propertyType }} · {{ property.listingType }}</p>
                </div>
                <span class="badge rounded-pill bg-primary-subtle text-primary">{{ property.status }}</span>
              </div>

              <div class="small text-muted mb-2"><i class="bi bi-hash me-2"></i>{{ property.portfolioNo || '-' }}</div>
              <div class="small text-muted mb-2"><i class="bi bi-geo-alt me-2"></i>{{ property.city }} / {{ property.district }}</div>
              <div class="small text-muted mb-2"><i class="bi bi-person me-2"></i>{{ property.ownerName || '-' }}</div>
              <div class="fw-bold fs-5 mt-3">{{ formatPrice(property.price, property.currency) }}</div>
            </div>

            <div class="card-footer bg-transparent border-0 px-4 pb-4 pt-0">
              <button type="button" class="btn btn-light border rounded-pill px-3" @click="goToDetail(property.id)">
                Detay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="card table-card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="px-4 py-3">No</th>
                <th>Başlık</th>
                <th>İlan Türü</th>
                <th>Mülk Tipi</th>
                <th>Şehir</th>
                <th>Durum</th>
                <th>Fiyat</th>
                <th class="text-end pe-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="property in filteredProperties" :key="property.id">
                <td class="px-4 py-3 fw-semibold">{{ property.portfolioNo || property.id }}</td>
                <td>{{ property.title }}</td>
                <td>{{ property.listingType }}</td>
                <td>{{ property.propertyType }}</td>
                <td>{{ property.city }}</td>
                <td>{{ property.status }}</td>
                <td>{{ formatPrice(property.price, property.currency) }}</td>
                <td class="text-end pe-4">
                  <button type="button" class="btn btn-sm btn-light border rounded-pill px-3" @click="goToDetail(property.id)">
                    Detay
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.summary-card,
.property-card,
.table-card,
.empty-card,
.filter-card {
  background: #ffffff;
}

.summary-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.property-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.property-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.08) !important;
}
</style>


