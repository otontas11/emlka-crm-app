export const useOfficeAuthorizedListings = () => {
  const storageKey = 'emlak-crm-office-authorized-listings'

  const defaultListings = [
    {
      id: 1,
      consultantId: 1,
      consultantName: 'Sinan Tontaş',
      title: 'Yenişehir Gıda Çarşısı Satılık Dükkan',
      propertyType: 'Ticari Dükkan',
      location: 'İzmir / Konak / Yenişehir',
      ownerName: 'Ahmet Yılmaz',
      ownerPhone: '0532 000 00 00',
      authorizationType: 'Tek Yetki',
      startDate: '2026-06-01',
      endDate: '2026-09-01',
      price: 12500000,
      status: 'Aktif Pazarlamada',
      stage: 'Pazarlama',
      source: 'Saha Çalışması',
      brokerNote: 'Gıda Çarşısı bölgesinde güçlü ticari portföy.',
      createdAt: '2026-06-01',
    },
    {
      id: 2,
      consultantId: 2,
      consultantName: 'Şems Bahar Çetin',
      title: 'Bayraklı Mansuroğlu Kiralık Ofis',
      propertyType: 'Ofis',
      location: 'İzmir / Bayraklı / Mansuroğlu',
      ownerName: 'Mehmet Kaya',
      ownerPhone: '0544 000 00 00',
      authorizationType: 'Standart Yetki',
      startDate: '2026-06-05',
      endDate: '2026-08-05',
      price: 40000,
      status: 'Müşteri Görüşmede',
      stage: 'Talep Eşleşti',
      source: 'Referans',
      brokerNote: 'Kurumsal kiracı için uygun.',
      createdAt: '2026-06-05',
    },
    {
      id: 3,
      consultantId: 3,
      consultantName: 'Ali Rızahan Ülger',
      title: 'Bornova Sarnıç Satılık Arsa',
      propertyType: 'Arsa',
      location: 'İzmir / Bornova / Sarnıç',
      ownerName: 'Hasan Demir',
      ownerPhone: '0555 000 00 00',
      authorizationType: 'Tek Yetki',
      startDate: '2026-05-20',
      endDate: '2026-07-20',
      price: 8500000,
      status: 'Yetki Süresi Yaklaşıyor',
      stage: 'Fiyat Güncelleme',
      source: 'Bölge Çalışması',
      brokerNote: 'Yetki süresi yaklaştı, malik ile yenileme görüşmesi yapılmalı.',
      createdAt: '2026-05-20',
    },
  ]

  const listings = useState('office-authorized-listings', () => defaultListings)

  const hydrateListings = () => {
    if (!process.client) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        listings.value = JSON.parse(saved)
      } catch (error) {
        listings.value = defaultListings
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(listings.value))
    }
  }

  const persistListings = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(listings.value))
  }

  const createAuthorizedListing = (payload) => {
    const newListing = {
      id: Date.now(),
      consultantId: payload.consultantId,
      consultantName: payload.consultantName,
      title: payload.title,
      propertyType: payload.propertyType,
      location: payload.location,
      ownerName: payload.ownerName,
      ownerPhone: payload.ownerPhone,
      authorizationType: payload.authorizationType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      price: Number(payload.price || 0),
      status: payload.status || 'Aktif Pazarlamada',
      stage: payload.stage || 'Portföy Alındı',
      source: payload.source || 'Ofis Kaydı',
      brokerNote: payload.brokerNote || '',
      createdAt: new Date().toISOString().slice(0, 10),
    }

    listings.value.unshift(newListing)
    persistListings()

    return newListing
  }

  const updateAuthorizedListing = (id, field, value) => {
    const listing = listings.value.find(item => String(item.id) === String(id))
    if (!listing) return

    listing[field] = field === 'price' ? Number(value || 0) : value
    persistListings()
  }

  const deleteAuthorizedListing = (id) => {
    listings.value = listings.value.filter(item => String(item.id) !== String(id))
    persistListings()
  }

  const today = () => new Date().toISOString().slice(0, 10)

  const daysUntilEnd = (endDate) => {
    if (!endDate) return null

    const now = new Date(today())
    const end = new Date(endDate)

    return Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  }

  const listingStats = computed(() => {
    const total = listings.value.length
    const active = listings.value.filter(item => item.status === 'Aktif Pazarlamada').length
    const inProcess = listings.value.filter(item => item.status === 'Müşteri Görüşmede' || item.stage === 'Talep Eşleşti').length
    const singleAuthority = listings.value.filter(item => item.authorizationType === 'Tek Yetki').length
    const expiringSoon = listings.value.filter(item => {
      const days = daysUntilEnd(item.endDate)
      return days !== null && days <= 15 && days >= 0
    }).length

    return {
      total,
      active,
      inProcess,
      singleAuthority,
      expiringSoon,
    }
  })

  const formatPrice = (value) => {
    return new Intl.NumberFormat('tr-TR').format(Number(value || 0)) + ' ₺'
  }

  return {
    listings,
    hydrateListings,
    persistListings,
    createAuthorizedListing,
    updateAuthorizedListing,
    deleteAuthorizedListing,
    daysUntilEnd,
    listingStats,
    formatPrice,
  }
}
