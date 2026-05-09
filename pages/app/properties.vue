<script setup>
definePageMeta({
  layout: 'default'
})

const properties = ref([
  {
    id: 1,
    title: 'Merkezi Konumda Lüks Daire',
    type: 'Satılık Daire',
    location: 'Kadıköy, İstanbul',
    price: '2.500.000 TL',
    area: '150 m²',
    rooms: '3+1',
    image: '🏢'
  },
  {
    id: 2,
    title: 'Deniz Manzaralı Villa',
    type: 'Satılık Villa',
    location: 'Bodrum, Muğla',
    price: '8.750.000 TL',
    area: '350 m²',
    rooms: '5+2',
    image: '🏡'
  },
  {
    id: 3,
    title: 'Şehir Merkezinde Ofis',
    type: 'Kiralık Ofis',
    location: 'Şişli, İstanbul',
    price: '45.000 TL/ay',
    area: '200 m²',
    rooms: 'Open Plan',
    image: '🏬'
  },
  {
    id: 4,
    title: 'Modern Residence',
    type: 'Satılık Daire',
    location: 'Çankaya, Ankara',
    price: '1.850.000 TL',
    area: '120 m²',
    rooms: '2+1',
    image: '🏢'
  }
])

const filters = ref({
  type: '',
  location: '',
  priceRange: ''
})
</script>

<template>
  <div class="properties-page">
    <div class="page-header">
      <h1>Gayrimenkuller</h1>
      <p>Sizin için en uygun gayrimenkulleri bulun</p>
    </div>

    <div class="filters">
      <select v-model="filters.type" class="filter-select">
        <option value="">Tüm Tipler</option>
        <option value="sale">Satılık</option>
        <option value="rent">Kiralık</option>
      </select>
      <select v-model="filters.location" class="filter-select">
        <option value="">Tüm Lokasyonlar</option>
        <option value="istanbul">İstanbul</option>
        <option value="ankara">Ankara</option>
        <option value="izmir">İzmir</option>
      </select>
      <select v-model="filters.priceRange" class="filter-select">
        <option value="">Fiyat Aralığı</option>
        <option value="0-1000000">0 - 1M TL</option>
        <option value="1000000-3000000">1M - 3M TL</option>
        <option value="3000000+">3M TL+</option>
      </select>
    </div>

    <div class="properties-grid">
      <div
        v-for="property in properties"
        :key="property.id"
        class="property-card"
      >
        <div class="property-image">{{ property.image }}</div>
        <div class="property-content">
          <span class="property-type">{{ property.type }}</span>
          <h3>{{ property.title }}</h3>
          <p class="location">📍 {{ property.location }}</p>
          <div class="property-details">
            <span>📏 {{ property.area }}</span>
            <span>🚪 {{ property.rooms }}</span>
          </div>
          <div class="property-footer">
            <span class="price">{{ property.price }}</span>
            <button class="btn-view">Detaylar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.properties-page {
  width: 100%;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-header h1 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 2.5rem;
}

.page-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-select {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.property-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.property-image {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
}

.property-content {
  padding: 1.5rem;
}

.property-type {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.property-content h3 {
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.location {
  color: #7f8c8d;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

.property-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.property-details span {
  color: #495057;
  font-size: 0.9rem;
}

.property-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.price {
  color: #e74c3c;
  font-size: 1.3rem;
  font-weight: 700;
}

.btn-view {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s;
}

.btn-view:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .filter-select {
    min-width: 100%;
  }

  .properties-grid {
    grid-template-columns: 1fr;
  }
}
</style>
