<script setup>
definePageMeta({
  layout: false,
})

</script>

<template>
  <div class="min-h-screen bg-slate-100 p-6">
    <div class="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
      <section class="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div class="text-center">
          <p class="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Emlak CRM
          </p>
          <h1 class="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Giriş Türünü Seçin
          </h1>
          <p class="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Broker ve danışman girişleri ayrı çalışır. Broker ofis yönetimini, danışman ise sadece kendisine ait görev, bildirim, eğitim ve nöbet ekranlarını görür.
          </p>
        </div>

        <div class="mt-8 grid gap-5 md:grid-cols-2">
          <NuxtLink
            to="/broker/login"
            class="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 transition hover:border-slate-900 hover:bg-white hover:shadow-sm"
          >
            <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-2xl text-white">
              <i class="bi bi-building-gear"></i>
            </div>

            <h2 class="mt-6 text-2xl font-bold text-slate-900">
              Broker / Ofis Girişi
            </h2>

            <p class="mt-3 text-sm leading-6 text-slate-500">
              Danışman yönetimi, ofis modülleri, duyurular, evrak, eğitim, nöbet ve rapor ekranlarına erişir.
            </p>

            <span class="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
              Broker Olarak Giriş Yap
            </span>
          </NuxtLink>

          <NuxtLink
            to="/consultant/login"
            class="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 transition hover:border-slate-900 hover:bg-white hover:shadow-sm"
          >
            <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-2xl text-white">
              <i class="bi bi-person-badge"></i>
            </div>

            <h2 class="mt-6 text-2xl font-bold text-slate-900">
              Danışman Girişi
            </h2>

            <p class="mt-3 text-sm leading-6 text-slate-500">
              Kendisine gelen duyuruları, eğitimleri, nöbetleri ve görev bildirimlerini takip eder.
            </p>

            <span class="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
              Danışman Olarak Giriş Yap
            </span>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>



