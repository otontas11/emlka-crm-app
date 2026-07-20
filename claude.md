# Emlak CRM - Proje Talimatları

## Proje Yapısı

Bu proje, emlak danışmanları ve broker'lar için müşteri takip sistemidir. Nuxt.js framework'ü kullanılmaktadır.

### Kullanıcı Rolleri

Projede 3 rol vardır:

1. **Super Admin** - Şirket oluşturma ve sistem geneli yönetim (ilk MVP'de aktif değil)
2. **Company Admin / Broker** - Şirket sahibi, danışmanları yönetir
3. **Consultant / Danışman** - Günlük müşteri takibi yapar

**Önemli:** Bir kullanıcı hem admin hem danışman olabilir. Auth sisteminde:
- `is_company_admin: boolean` - Broker paneline erişim
- `is_consultant: boolean` - Danışman paneline erişim

### Panel Yapısı

#### 1. Admin/Broker Paneli (`/admin`)
**Amaç:** Danışmanların müşteri takip durumunu izlemek

**MVP Menüsü:**
- Dashboard
- Danışmanlar
- Şirket Ayarları

**Dashboard Metrikleri:**
- Toplam Danışman
- Bugün Aranacak (şirket geneli)
- Geciken Aramalar (şirket geneli)
- Yaklaşan Görevler (şirket geneli)
- Danışman Takip Özeti (takip disiplini odaklı)

**İlk MVP'de YOK:**
- Finans/Komisyon
- Ciro takibi
- Pipeline/İşlem yönetimi
- Nöbet sistemi
- Evrak yönetimi

#### 2. Danışman Paneli (`/danisman`)
**Amaç:** Günlük müşteri takibi

**MVP Menüsü:**
- Dashboard
- Müşteriler
- Görevler
- Raporlar

**Dashboard Metrikleri:**
- Bugün Aranacak
- Geciken Aramalar
- Yaklaşan Görevler
- Özel Günler
- Bugün aranacak müşteriler listesi
- Geciken müşteriler listesi
- Günlük görevler

**İlk MVP'de YOK:**
- Aktif İşlemler/Pipeline
- Aylık Hedefler (satış/kiralama)
- Malik Raporları
- Portföy detayları

### Dosya Yapısı

```
/pages
  /admin
    index.vue         - Broker dashboard
    /danismanlar
      index.vue       - Danışman yönetimi
    /ayarlar          - Şirket ayarları (oluşturulacak)
  /danisman
    index.vue         - Danışman dashboard
    /musteriler
      index.vue       - Müşteri listesi
    /gorevler
      index.vue       - Görevler
    /raporlar
      index.vue       - Raporlar
  index.vue           - Login sayfası

/layouts
  admin.vue           - Broker layout
  danisman.vue        - Danışman layout

/composables
  useAuth.ts          - Auth yönetimi

/middleware
  auth.ts             - Yetki kontrolü
```

### Auth Sistemi

**Kullanıcı Objesi:**
```javascript
{
  email: string,
  name: string,
  is_company_admin: boolean,
  is_consultant: boolean
}
```

**Demo Kullanıcılar:**
- `admin@emlakcrm.com` - Hem broker hem danışman
- `danisman@emlakcrm.com` - Sadece danışman

## Kod Geliştirme Kuralları

### MVP Odağı
- Sadece müşteri takibi ve hatırlatma sistemi
- Basit tut, over-engineering yapma
- Finans, komisyon, pipeline özelliklerini ekleme

### Güvenlik
- XSS, SQL injection, command injection'dan kaçın
- Sadece sistem sınırlarında validasyon yap

### Kod Stili
- Mevcut kod stiline uy
- Değişmediğin koda yorum/docstring ekleme
- Kullanılmayan kodu tamamen sil

### Ortak Component Kuralı (ZORUNLU)

Tekrar eden UI markup'ı **asla** sayfaya kopyalanmaz; `components/ui/` altındaki
ortak component'ler kullanılır. Nuxt bu klasörü otomatik import eder, ayrıca
`import` satırı yazmaya gerek yoktur — doğrudan template'te kullanılır.

**Mevcut ortak component'ler:**

| Component | Yerine geçtiği markup | Öne çıkan prop'lar |
|-----------|----------------------|--------------------|
| `<UiInput>` | `<label>` + `<input>` ikilisi | `label`, `type`, `variant`, `size`, `shadow`, `hint`, `required` + `v-model` |
| `<UiSelect>` | `<label>` + `<select>` (option'lar slot'ta) | `label`, `variant`, `size`, `shadow` + `v-model` |
| `<UiTextarea>` | `<label>` + `<textarea>` | `label`, `rows`, `variant`, `size` + `v-model` |
| `<UiButton>` | tekrar eden `<button>` stilleri | `variant`, `size`, `shape`, `icon`, `type`, `block` |
| `<UiFormField>` | özel kontrol için `<label>` sarmalayıcı | `label`, `hint`, `required` (kontrol slot'ta) |

**Ortak stil değerleri (tek kaynak):**
- Input/Select/Textarea `variant`: `default` (sade kenarlık), `ring` (odak halkası),
  `outline` (ince kenarlık + odakta koyulaşan kenarlık)
- `size`: `md` (varsayılan), `sm` (`text-sm`)
- `UiButton` `variant`: `primary` (koyu), `secondary` (outline), `danger`, `ghost`,
  `dark-ghost` (koyu zemin üstü)

**Kurallar:**
1. Yeni bir form alanı eklerken `<input>`/`<select>`/`<textarea>` markup'ını elle
   yazma; ilgili `Ui*` component'ini kullan.
2. Label metni component'e `label` prop'u ile verilir; ayrı `<label>` yazma.
3. `placeholder`, `min`, `max`, `disabled`, `accept` gibi native attribute'lar
   component'e doğrudan yazılır (fallthrough ile input'a iner).
4. Standart olmayan tek seferlik bir stil gerekiyorsa `class` prop'u ile ekle,
   markup'ı kopyalama.
5. Yeni bir tekrar eden UI parçası doğarsa (3+ yerde), onu da `components/ui/`
   altına component olarak çıkar ve bu tabloya ekle.

## Git Kuralları

- Sadece istendiğinde commit yap
- Belirli dosyaları stage'le (git add -A kullanma)
- Hook başarısız olursa YENİ commit oluştur (--amend kullanma)

**Commit Formatı:**
```
Değişikliklerin özeti

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

## Yardım

- `/help` - Claude Code yardımı
- Geri bildirim: https://github.com/anthropics/claude-code/issues
