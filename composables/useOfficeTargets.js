export const useOfficeTargets = () => {
  const storageKey = 'emlak-crm-office-targets'

  const defaultTargets = [
    {
      id: 1,
      consultantId: 1,
      consultantName: 'Sinan Tontaş',
      periodType: 'Aylık',
      period: '2026-06',
      revenueTarget: 150000,
      dealTarget: 2,
      authorizedListingTarget: 5,
      note: 'Ticari portföy ve işlem odaklı aylık hedef.',
      status: 'Aktif',
      createdAt: '2026-06-01',
    },
    {
      id: 2,
      consultantId: 2,
      consultantName: 'Şems Bahar Çetin',
      periodType: 'Aylık',
      period: '2026-06',
      revenueTarget: 100000,
      dealTarget: 2,
      authorizedListingTarget: 4,
      note: 'Ofis ve konut dışı ticari alanlarda takip.',
      status: 'Aktif',
      createdAt: '2026-06-01',
    },
    {
      id: 3,
      consultantId: 3,
      consultantName: 'Ali Rızahan Ülger',
      periodType: 'Aylık',
      period: '2026-06',
      revenueTarget: 75000,
      dealTarget: 1,
      authorizedListingTarget: 3,
      note: 'Aday danışman gelişim hedefi.',
      status: 'Aktif',
      createdAt: '2026-06-01',
    },
  ]

  const targets = useState('office-targets', () => defaultTargets)

  const hydrateTargets = () => {
    if (!process.client) return

    const saved = localStorage.getItem(storageKey)

    if (saved) {
      try {
        targets.value = JSON.parse(saved)
      } catch (error) {
        targets.value = defaultTargets
      }
    } else {
      localStorage.setItem(storageKey, JSON.stringify(targets.value))
    }
  }

  const persistTargets = () => {
    if (!process.client) return
    localStorage.setItem(storageKey, JSON.stringify(targets.value))
  }

  const createTarget = (payload) => {
    const newTarget = {
      id: Date.now(),
      consultantId: payload.consultantId,
      consultantName: payload.consultantName,
      periodType: payload.periodType || 'Aylık',
      period: payload.period,
      revenueTarget: Number(payload.revenueTarget || 0),
      dealTarget: Number(payload.dealTarget || 0),
      authorizedListingTarget: Number(payload.authorizedListingTarget || 0),
      note: payload.note || '',
      status: payload.status || 'Aktif',
      createdAt: new Date().toISOString().slice(0, 10),
    }

    targets.value.unshift(newTarget)
    persistTargets()

    return newTarget
  }

  const updateTarget = (id, field, value) => {
    const target = targets.value.find(item => String(item.id) === String(id))
    if (!target) return

    const numberFields = [
      'revenueTarget',
      'dealTarget',
      'authorizedListingTarget',
    ]

    if (numberFields.includes(field)) {
      target[field] = Number(value || 0)
    } else {
      target[field] = value
    }

    persistTargets()
  }

  const deleteTarget = (id) => {
    targets.value = targets.value.filter(item => String(item.id) !== String(id))
    persistTargets()
  }

  const getTargetRange = (periodType, period) => {
    if (!period) {
      const current = new Date().toISOString().slice(0, 7)

      return {
        start: `${current}-01`,
        end: `${current}-31`,
        label: current,
      }
    }

    if (periodType === 'Yıllık') {
      return {
        start: `${period}-01-01`,
        end: `${period}-12-31`,
        label: `${period} Yılı`,
      }
    }

    if (periodType === '1. Çeyrek') {
      return {
        start: `${period}-01-01`,
        end: `${period}-03-31`,
        label: `${period} 1. Çeyrek`,
      }
    }

    if (periodType === '2. Çeyrek') {
      return {
        start: `${period}-04-01`,
        end: `${period}-06-30`,
        label: `${period} 2. Çeyrek`,
      }
    }

    if (periodType === '3. Çeyrek') {
      return {
        start: `${period}-07-01`,
        end: `${period}-09-30`,
        label: `${period} 3. Çeyrek`,
      }
    }

    if (periodType === '4. Çeyrek') {
      return {
        start: `${period}-10-01`,
        end: `${period}-12-31`,
        label: `${period} 4. Çeyrek`,
      }
    }

    if (periodType === '6 Aylık') {
      return {
        start: `${period}-01-01`,
        end: `${period}-06-30`,
        label: `${period} İlk 6 Ay`,
      }
    }

    return {
      start: `${period}-01`,
      end: `${period}-31`,
      label: period,
    }
  }

  const isDateInRange = (dateValue, range) => {
    if (!dateValue) return false

    const date = String(dateValue).slice(0, 10)

    return date >= range.start && date <= range.end
  }

  const percent = (actual, target) => {
    if (!Number(target || 0)) return 0

    return Math.min(Math.round((Number(actual || 0) / Number(target || 0)) * 100), 999)
  }

  const targetStats = computed(() => {
    const total = targets.value.length
    const active = targets.value.filter(item => item.status === 'Aktif').length
    const monthly = targets.value.filter(item => item.periodType === 'Aylık').length
    const yearly = targets.value.filter(item => item.periodType === 'Yıllık').length

    const totalRevenueTarget = targets.value
      .filter(item => item.status === 'Aktif')
      .reduce((sum, item) => sum + Number(item.revenueTarget || 0), 0)

    return {
      total,
      active,
      monthly,
      yearly,
      totalRevenueTarget,
    }
  })

  const formatPrice = (value) => {
    return new Intl.NumberFormat('tr-TR').format(Number(value || 0)) + ' ₺'
  }

  return {
    targets,
    hydrateTargets,
    persistTargets,
    createTarget,
    updateTarget,
    deleteTarget,
    getTargetRange,
    isDateInRange,
    percent,
    targetStats,
    formatPrice,
  }
}
