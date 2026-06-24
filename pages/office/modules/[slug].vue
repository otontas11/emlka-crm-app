<script setup>
const route = useRoute()

const modules = {
  'evrak-takibi': {
    title: 'Evrak Takibi',
    description: 'Danışman sözleşmeleri, KVKK, SGK evrakları ve personel dijital dosyaları bu ekranda yönetilecektir.',
    icon: 'bi-folder2-open',
  },
  'oryantasyon': {
    title: 'Oryantasyon',
    description: 'Yeni başlayan danışmanların sözleşme, hesap açılışı, eğitim, bölge ataması ve ilk saha planı adımları takip edilecektir.',
    icon: 'bi-list-check',
  },
  'egitimler': {
    title: 'Eğitimler',
    description: 'Ofis başlangıç rehberi, saha çalışması, FSBO, portföy alma, etik kurallar ve WhatsApp iletişim rehberleri burada olacaktır.',
    icon: 'bi-mortarboard',
  },
  'nobet-yonetimi': {
    title: 'Nöbet Yönetimi',
    description: 'Günlük, haftalık ve aylık nöbet listesi hazırlanacak; danışman nöbet onayı ve geçmiş nöbet kayıtları tutulacaktır.',
    icon: 'bi-calendar-week',
  },
  'toplanti-yoklama': {
    title: 'Toplantı Yoklama',
    description: 'Toplantı oluşturma, katıldı/katılmadı işaretleme, mazeret notu ve aylık katılım raporu bu ekranda olacaktır.',
    icon: 'bi-clipboard-check',
  },
  'yetkili-portfoyler': {
    title: 'Yetkili Portföyler',
    description: 'Portföy no, malik, sorumlu danışman, yazılı yetki, EİDS bitiş tarihi ve durum takibi yapılacaktır.',
    icon: 'bi-shield-lock',
  },
  'ofis-pipeline': {
    title: 'Ofis Pipeline',
    description: 'Satış ve kiralama işlemleri; kapora, sözleşme, tapu, komisyon ve dosya kapanışı aşamalarıyla takip edilecektir.',
    icon: 'bi-diagram-3',
  },
  'komisyon-sistemi': {
    title: 'Komisyon Sistemi',
    description: 'Tek danışman, ortak işlem, ofis payı, danışman payı, prim, bonus ve kesinti hesaplamaları yapılacaktır.',
    icon: 'bi-percent',
  },
  'liderlik-tablolari': {
    title: 'Liderlik Tabloları',
    description: 'Aylık, çeyreklik ve yıllık ciro ile işlem liderlik tabloları bu alanda gösterilecektir.',
    icon: 'bi-trophy',
  },
  'bolge-atamasi': {
    title: 'Bölge Ataması',
    description: 'İl, ilçe, mahalle, uzmanlık alanı, birincil danışman ve yedek danışman tanımları yapılacaktır.',
    icon: 'bi-geo-alt',
  },
  'ayrilan-personel': {
    title: 'Ayrılan Personel',
    description: 'Ayrılış tarihi, fesih sözleşmesi, ekipman teslimi, açık işlem, veri devri ve portföy devri takip edilecektir.',
    icon: 'bi-person-dash',
  },
}

const current = computed(() => {
  return modules[String(route.params.slug)] || {
    title: 'Ofis Modülü',
    description: 'Bu modül geliştirme planına alınmıştır.',
    icon: 'bi-grid',
  }
})
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-start gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-2xl text-white">
            <i class="bi" :class="current.icon"></i>
          </div>

          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Ofis Modülü
            </p>
            <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {{ current.title }}
            </h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {{ current.description }}
            </p>
          </div>
        </div>

        <NuxtLink
          to="/office"
          class="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <i class="bi bi-arrow-left mr-2"></i>
          Ofise Dön
        </NuxtLink>
      </div>
    </section>

    <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-2xl text-slate-500 shadow-sm">
          <i class="bi bi-tools"></i>
        </div>

        <h2 class="mt-4 text-xl font-bold text-slate-900">
          Bu ekran sıradaki geliştirme adımında detaylandırılacak
        </h2>

        <p class="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Şu anda modül bağlantısı aktif hale getirildi. Bir sonraki adımda bu sayfanın gerçek kayıt, liste, detay ve raporlama ekranlarını oluşturacağız.
        </p>
      </div>
    </section>
  </div>
</template>

