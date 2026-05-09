<script setup>
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <h1>Emlak CRM'e Hoş Geldiniz</h1>
      <p class="subtitle">Gayrimenkul yönetiminde yeni nesil çözüm</p>
      <div class="cta-buttons">
        <NuxtLink to="/app/properties" class="btn btn-primary">Gayrimenkulleri İncele</NuxtLink>
        <NuxtLink to="/admin" class="btn btn-secondary">Admin Panel</NuxtLink>
      </div>
    </section>

    <section class="features">
      <h2>Özellikler</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="icon">🏢</div>
          <h3>Gayrimenkul Yönetimi</h3>
          <p>Tüm gayrimenkullerinizi tek platformda yönetin</p>
        </div>
        <div class="feature-card">
          <div class="icon">👥</div>
          <h3>Müşteri Takibi</h3>
          <p>Müşteri ilişkilerinizi güçlendirin</p>
        </div>
        <div class="feature-card">
          <div class="icon">📊</div>
          <h3>Detaylı Raporlar</h3>
          <p>İş süreçlerinizi analiz edin</p>
        </div>
        <div class="feature-card">
          <div class="icon">📱</div>
          <h3>Mobil Uyumlu</h3>
          <p>Her yerden erişim sağlayın</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
}

.hero {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
  margin-bottom: 3rem;
}

.hero h1 {
  font-size: 3rem;
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-weight: 700;
}

.subtitle {
  font-size: 1.3rem;
  color: #7f8c8d;
  margin: 0 0 2rem 0;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.features {
  padding: 2rem 0;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin: 0 0 3rem 0;
  color: #2c3e50;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.feature-card p {
  color: #7f8c8d;
  margin: 0;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .features h2 {
    font-size: 2rem;
  }
}
</style>
