export const useOfficeRegions = () => {
  const storageKey = 'emlak-crm-office-region-assignments'

  const defaultRegions = [
    {
      id: 1,
      consultantId: 1,
      consultantName: 'Sinan Tontaş',
      regionName: 'Yenişehir Gıda Çarşısı',
      city: 'İzmir',
      district: 'Konak',
      neighborhood: 'Yenişehir',
      streets: '1145/7 Sokak, Gaziler Caddesi, Hırdavatçılar Çarşısı',
      assignmentType: 'Ana Bölge',
      exclusivity: 'Tek Danışman',
      status: 'Aktif',
      startDate: '2026-06-01',
      endDate: '',
      monthlyListingTarget: 5,
      monthlyVisitTarget: 40,
      monthlyOwnerMeetingTarget: 20,
      note: 'Ticari gayrimenkul, dükkan, depo ve işyeri odaklı bölge.',
      createdAt: '2026-06-01',
    },
    {
      id: 2,
      consultantId: 2,
      consultantName: 'Şems Bahar Çetin',
      regionName: 'Bayraklı Mansuroğlu',
      city: 'İzmir',
      district: 'Bayraklı',
      neighborhood: 'Mansuroğlu',
      streets: 'Manavkuyu, Adalet Mahallesi çevresi',
      assignmentType: 'Ana Bölge',
      exclusivity: 'Ortak Çalışma',
      status: 'Aktif',
      startDate: '2026-06-05',
      endDate: '',
      monthlyListingTarget: 4,
      monthlyVisitTarget: 30,
      monthlyOwnerMeetingTarget: 15,
      note: 'Ofis, plaza katı ve küçük ticari birimler takip edilecek.',
      createdAt: '2026-06-05',
    },
    {
      id: 3,
      consultantId: 3,
      consultantName: 'Ali Rızahan Ülger',
      regionName: 'Bornova Sarnıç',
      city: 'İzmir',
      district: 'Bornova',
      neighborhood: 'Sarnıç',
      streets: 'Sarnıç Köyü ve çevresi',
      assignmentType: 'Destek Bölge',
      exclusivity: 'Ortak Çalışma',
      status: 'Aktif',
      startDate: '2026-06-10',
      endDate: '',
      monthlyListingTarget: 3,
      monthlyVisitTarget: 25,
      monthlyOwnerMeetingTarget: 12,
      note: 'Arsa ve köy çevresi saha çalışması yapılacak.',
      createdAt: '2026-06-10',
    },
  ]

  const regions = useState('office-region-assignments', () => defaultRegions)

  const hydrateRegions = () => {
    if (!process.client) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        regions.value = JSON.parse(saved)
      } catch (error) {
        regions.value = defaultRegions
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(regions.value))
    }
  }

  const persistRegions = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(regions.value))
  }

  const createRegionAssignment = (payload) => {
    const newRegion = {
      id: Date.now(),
      consultantId: payload.consultantId,
      consultantName: payload.consultantName,
      regionName: payload.regionName,
      city: payload.city || 'İzmir',
      district: payload.district,
      neighborhood: payload.neighborhood,
      streets: payload.streets,
      assignmentType: payload.assignmentType || 'Ana Bölge',
      exclusivity: payload.exclusivity || 'Tek Danışman',
      status: payload.status || 'Aktif',
      startDate: payload.startDate || new Date().toISOString().slice(0, 10),
      endDate: payload.endDate || '',
      monthlyListingTarget: Number(payload.monthlyListingTarget || 0),
      monthlyVisitTarget: Number(payload.monthlyVisitTarget || 0),
      monthlyOwnerMeetingTarget: Number(payload.monthlyOwnerMeetingTarget || 0),
      note: payload.note || '',
      createdAt: new Date().toISOString().slice(0, 10),
    }

    regions.value.unshift(newRegion)
    persistRegions()

    return newRegion
  }

  const updateRegionAssignment = (id, field, value) => {
    const region = regions.value.find(item => String(item.id) === String(id))
    if (!region) return

    if (
      [
        'monthlyListingTarget',
        'monthlyVisitTarget',
        'monthlyOwnerMeetingTarget',
      ].includes(field)
    ) {
      region[field] = Number(value || 0)
    } else {
      region[field] = value
    }

    persistRegions()
  }

  const deleteRegionAssignment = (id) => {
    regions.value = regions.value.filter(item => String(item.id) !== String(id))
    persistRegions()
  }

  const regionStats = computed(() => {
    const total = regions.value.length
    const active = regions.value.filter(item => item.status === 'Aktif').length
    const mainRegion = regions.value.filter(item => item.assignmentType === 'Ana Bölge').length
    const supportRegion = regions.value.filter(item => item.assignmentType === 'Destek Bölge').length
    const exclusive = regions.value.filter(item => item.exclusivity === 'Tek Danışman').length

    return {
      total,
      active,
      mainRegion,
      supportRegion,
      exclusive,
    }
  })

  return {
    regions,
    hydrateRegions,
    persistRegions,
    createRegionAssignment,
    updateRegionAssignment,
    deleteRegionAssignment,
    regionStats,
  }
}
