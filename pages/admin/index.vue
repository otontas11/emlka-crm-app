<script setup>
definePageMeta({
  layout: 'admin'
})

const stats = ref([
  { title: 'Toplam Gayrimenkul', value: '234', icon: '🏢', color: '#3498db' },
  { title: 'Aktif Müşteri', value: '156', icon: '👥', color: '#2ecc71' },
  { title: 'Bekleyen Lead', value: '42', icon: '📋', color: '#f39c12' },
  { title: 'Aylık Satış', value: '12', icon: '💰', color: '#e74c3c' }
])

const recentActivities = ref([
  { action: 'Yeni gayrimenkul eklendi', time: '5 dakika önce', type: 'property' },
  { action: 'Müşteri bilgileri güncellendi', time: '15 dakika önce', type: 'customer' },
  { action: 'Yeni lead kaydedildi', time: '1 saat önce', type: 'lead' },
  { action: 'Satış tamamlandı', time: '2 saat önce', type: 'sale' }
])
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Genel Bakış ve İstatistikler</p>
    </div>

    <div class="stats-grid">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="stat-card"
        :style="{ borderLeft: `4px solid ${stat.color}` }"
      >
        <div class="stat-icon">{{ stat.icon }}</div>
        <div class="stat-content">
          <h3>{{ stat.value }}</h3>
          <p>{{ stat.title }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="activity-section">
        <h2>Son Aktiviteler</h2>
        <div class="activity-list">
          <div
            v-for="(activity, index) in recentActivities"
            :key="index"
            class="activity-item"
          >
            <div class="activity-dot"></div>
            <div class="activity-details">
              <p class="activity-action">{{ activity.action }}</p>
              <p class="activity-time">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Hızlı İşlemler</h2>
        <div class="action-buttons">
          <NuxtLink to="/admin/properties/new" class="action-btn">
            <span class="action-icon">➕</span>
            <span>Yeni Gayrimenkul</span>
          </NuxtLink>
          <NuxtLink to="/admin/customers/new" class="action-btn">
            <span class="action-icon">👤</span>
            <span>Yeni Müşteri</span>
          </NuxtLink>
          <NuxtLink to="/admin/leads/new" class="action-btn">
            <span class="action-icon">📝</span>
            <span>Yeni Lead</span>
          </NuxtLink>
          <NuxtLink to="/admin/reports" class="action-btn">
            <span class="action-icon">📊</span>
            <span>Raporlar</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 2rem;
}

.dashboard-header p {
  margin: 0;
  color: #7f8c8d;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  color: #2c3e50;
}

.stat-content p {
  margin: 0.25rem 0 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.activity-section,
.quick-actions {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.activity-section h2,
.quick-actions h2 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.3rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 6px;
  transition: background 0.3s;
}

.activity-item:hover {
  background: #f8f9fa;
}

.activity-dot {
  width: 10px;
  height: 10px;
  background: #3498db;
  border-radius: 50%;
  margin-top: 0.4rem;
  flex-shrink: 0;
}

.activity-details {
  flex: 1;
}

.activity-action {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-weight: 500;
}

.activity-time {
  margin: 0;
  color: #95a5a6;
  font-size: 0.85rem;
}

.action-buttons {
  display: grid;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 6px;
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: all 0.3s;
}

.action-btn:hover {
  background: white;
  border-color: #3498db;
  transform: translateX(5px);
}

.action-icon {
  font-size: 1.5rem;
}

@media (max-width: 968px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
