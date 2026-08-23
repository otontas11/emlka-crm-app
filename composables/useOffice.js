import { computed } from 'vue'

export const useOffice = () => {
  const consultants = useState('office-consultants', () => [
    {
      id: 1,
      fullName: 'Sinan Tontaş',
      code: 'PWA-001',
      phone: '0545 441 41 18',
      email: 'sinan_tontas@hotmail.com',
      registerDate: '2026-01-05',
      startDate: '2026-01-10',
      workType: 'Bağ-Kur’lu Danışman',
      status: 'Aktif',
      expertiseArea: 'Ticari Gayrimenkul',
      expertiseRegion: 'İzmir Gıda Çarşısı',
      fixedDutyDay: 'Pazartesi',
      experienceYear: 2,
      missingDocuments: 0,
      activeListings: 18,
      saleListings: 12,
      rentListings: 6,
      soldListings: 3,
      rentedListings: 5,
      passiveListings: 2,
      expiredListings: 1,
      revenue: 1850000,
      dealCount: 8,
      callTarget: 180,
      callDone: 146,
      listingTarget: 12,
      listingDone: 9,
      revenueTarget: 2000000,
      orientationProgress: 100,
      meetingAttendance: 92,
      openProcesses: 3,
      networkNote: 'Ticari çevresi güçlü, bölge hâkimiyeti yüksek.',
    },
    {
      id: 2,
      fullName: 'Şems Bahar Çetin',
      code: 'PWA-002',
      phone: '0531 633 67 58',
      email: 'sems@example.com',
      registerDate: '2026-02-01',
      startDate: '2026-02-05',
      workType: 'SGK’lı Danışman',
      status: 'Aktif',
      expertiseArea: 'Konut',
      expertiseRegion: 'Bayraklı',
      fixedDutyDay: 'Salı',
      experienceYear: 1,
      missingDocuments: 2,
      activeListings: 9,
      saleListings: 6,
      rentListings: 3,
      soldListings: 1,
      rentedListings: 2,
      passiveListings: 1,
      expiredListings: 0,
      revenue: 620000,
      dealCount: 3,
      callTarget: 140,
      callDone: 88,
      listingTarget: 8,
      listingDone: 5,
      revenueTarget: 900000,
      orientationProgress: 70,
      meetingAttendance: 85,
      openProcesses: 2,
      networkNote: 'Konut tarafında gelişiyor, sosyal medya kullanımı güçlü.',
    },
    {
      id: 3,
      fullName: 'Ali Rızahan Ülger',
      code: 'PWA-003',
      phone: '0555 000 00 00',
      email: 'ali@example.com',
      registerDate: '2026-03-12',
      startDate: '2026-03-15',
      workType: 'Bağ-Kur’lu Danışman',
      status: 'Aday',
      expertiseArea: 'Arsa / Arazi',
      expertiseRegion: 'Menemen',
      fixedDutyDay: 'Çarşamba',
      experienceYear: 0,
      missingDocuments: 4,
      activeListings: 3,
      saleListings: 3,
      rentListings: 0,
      soldListings: 0,
      rentedListings: 0,
      passiveListings: 0,
      expiredListings: 0,
      revenue: 0,
      dealCount: 0,
      callTarget: 100,
      callDone: 42,
      listingTarget: 5,
      listingDone: 2,
      revenueTarget: 400000,
      orientationProgress: 45,
      meetingAttendance: 78,
      openProcesses: 1,
      networkNote: 'Yeni başlayan danışman, saha planı takip edilmeli.',
    },
    {
      id: 4,
      fullName: 'Gökhan Yüksel',
      code: 'PWA-004',
      phone: '0551 512 17 19',
      email: 'gokhan@example.com',
      registerDate: '2026-04-08',
      startDate: '2026-04-10',
      workType: 'Bağ-Kur’lu Danışman',
      status: 'Aktif',
      expertiseArea: 'Bölgesel İş Birliği',
      expertiseRegion: 'Muğla / Ortaca',
      fixedDutyDay: 'Perşembe',
      experienceYear: 3,
      missingDocuments: 1,
      activeListings: 7,
      saleListings: 5,
      rentListings: 2,
      soldListings: 2,
      rentedListings: 1,
      passiveListings: 1,
      expiredListings: 1,
      revenue: 980000,
      dealCount: 4,
      callTarget: 120,
      callDone: 105,
      listingTarget: 7,
      listingDone: 6,
      revenueTarget: 1000000,
      orientationProgress: 90,
      meetingAttendance: 88,
      openProcesses: 2,
      networkNote: 'Bölge iş birlikleri ve portföy paylaşımı için uygun.',
    },
  ])

  const officeCalendar = useState('office-calendar', () => [
    {
      id: 1,
      type: 'Toplantı',
      title: 'Haftalık Ofis Toplantısı',
      date: 'Bugün',
      time: '10:00',
      owner: 'Tüm ekip',
      priority: 'Yüksek',
    },
    {
      id: 2,
      type: 'Nöbet',
      title: 'Bugünkü Nöbet',
      date: 'Bugün',
      time: '09:30 - 18:30',
      owner: 'Şems Bahar Çetin',
      priority: 'Normal',
    },
    {
      id: 3,
      type: 'Eğitim',
      title: 'Portföy Alma Eğitimi',
      date: 'Yarın',
      time: '14:00',
      owner: 'Aday danışmanlar',
      priority: 'Normal',
    },
    {
      id: 4,
      type: 'Tapu',
      title: 'Tapu Hazırlık Kontrolü',
      date: 'Bu hafta',
      time: '11:30',
      owner: 'Sinan Tontaş',
      priority: 'Yüksek',
    },
  ])

  const officeTasks = useState('office-tasks', () => [
    {
      id: 1,
      category: 'Müşteri Ziyareti',
      title: 'Gıda Çarşısı yatırımcı ziyareti',
      owner: 'Sinan Tontaş',
      due: 'Bugün',
      status: 'Bekliyor',
    },
    {
      id: 2,
      category: 'Belge İşleri',
      title: 'Eksik danışman evraklarını tamamla',
      owner: 'Ofis Yönetimi',
      due: 'Bugün',
      status: 'Gecikti',
    },
    {
      id: 3,
      category: 'Sosyal Medya',
      title: 'Haftalık portföy paylaşım planı hazırla',
      owner: 'Şems Bahar Çetin',
      due: 'Yarın',
      status: 'Devam Ediyor',
    },
    {
      id: 4,
      category: 'Malik Raporu',
      title: 'Aktif portföyler için malik raporu gönder',
      owner: 'Tüm danışmanlar',
      due: 'Bugün',
      status: 'Bekliyor',
    },
    {
      id: 5,
      category: 'Danışman Takibi',
      title: 'Aday danışman saha planı kontrolü',
      owner: 'Broker',
      due: 'Bu hafta',
      status: 'Planlandı',
    },
  ])

  const payments = useState('office-payments', () => [
    {
      id: 1,
      type: 'SGK / Maaş',
      title: 'SGK prim ödemeleri',
      amount: 78500,
      dueDate: 'Bu hafta',
      status: 'Yaklaşıyor',
    },
    {
      id: 2,
      type: 'Ofis İçi Ödeme',
      title: 'Ofis kira ödemesi',
      amount: 45000,
      dueDate: '3 gün kaldı',
      status: 'Bekliyor',
    },
    {
      id: 3,
      type: 'Ek Gider',
      title: 'İlan sitesi aboneliği',
      amount: 18500,
      dueDate: 'Bugün',
      status: 'Gecikti',
    },
    {
      id: 4,
      type: 'Vergi',
      title: 'KDV / stopaj kontrolü',
      amount: 32000,
      dueDate: 'Bu ay',
      status: 'Planlandı',
    },
  ])

  const announcements = useState('office-announcements', () => [
    {
      id: 1,
      title: 'Pazartesi toplantısı saat 10:00’da yapılacaktır.',
      type: 'Toplantı',
      date: 'Bugün',
    },
    {
      id: 2,
      title: 'Yeni portföy girişlerinde fotoğraf kalitesi kontrol edilecek.',
      type: 'Kural',
      date: 'Dün',
    },
    {
      id: 3,
      title: 'Bu hafta sosyal medya içerik planı güncellendi.',
      type: 'Duyuru',
      date: 'Bu hafta',
    },
  ])

  // Pipeline artık useDeals'in türetilmiş görünümü — ayrı statik dizi tutulmuyor.
  const { deals } = useDeals()

  const pipelines = computed(() => deals.value.map(deal => ({
    id: deal.id,
    transactionType: deal.dealType,
    consultantId: deal.ownerConsultantId,
    partnerConsultantId: participantByRole(deal, 'PortfolioTaker')?.consultantId || '',
    property: deal.propertyTitle,
    customer: deal.customerName,
    stage: deal.stage,
    amount: deal.agreedAmount,
    commission: deal.grossCommission,
    officeShare: officeShareOf(deal),
    consultantShare: deal.participants.reduce((sum, p) => sum + Number(p.shareAmount || 0), 0),
    priority: deal.priority,
  })))

  const regionAssignments = useState('office-region-assignments', () => [
    {
      id: 1,
      city: 'İzmir',
      district: 'Konak',
      neighborhood: 'Yenişehir / Gıda Çarşısı',
      expertiseArea: 'Ticari',
      primaryConsultant: 'Sinan Tontaş',
      backupConsultant: 'Şems Bahar Çetin',
    },
    {
      id: 2,
      city: 'İzmir',
      district: 'Bayraklı',
      neighborhood: 'Mansuroğlu',
      expertiseArea: 'Konut',
      primaryConsultant: 'Şems Bahar Çetin',
      backupConsultant: 'Sinan Tontaş',
    },
    {
      id: 3,
      city: 'İzmir',
      district: 'Menemen',
      neighborhood: 'Koyundere',
      expertiseArea: 'Arsa',
      primaryConsultant: 'Ali Rızahan Ülger',
      backupConsultant: 'Sinan Tontaş',
    },
  ])

  const stats = computed(() => {
    const activeConsultants = consultants.value.filter(item => item.status === 'Aktif').length
    const newConsultants = consultants.value.filter(item => item.status === 'Aday').length
    const missingDocuments = consultants.value.reduce((sum, item) => sum + Number(item.missingDocuments || 0), 0)
    const todayDuties = officeCalendar.value.filter(item => item.type === 'Nöbet' && item.date === 'Bugün').length
    const todayOwnerReports = officeTasks.value.filter(item => item.category === 'Malik Raporu' && item.due === 'Bugün').length
    const todayCalls = consultants.value.reduce((sum, item) => sum + Math.max(Number(item.callTarget || 0) - Number(item.callDone || 0), 0), 0)
    const overdueTasks = officeTasks.value.filter(item => item.status === 'Gecikti').length
    const criticalProcesses = pipelines.value.filter(item => item.priority === 'High' || item.priority === 'Urgent').length
    const monthlyRevenue = consultants.value.reduce((sum, item) => sum + Number(item.revenue || 0), 0)
    const monthlyDeals = consultants.value.reduce((sum, item) => sum + Number(item.dealCount || 0), 0)
    const activeListings = consultants.value.reduce((sum, item) => sum + Number(item.activeListings || 0), 0)
    const pendingPayments = payments.value.filter(item => item.status !== 'Ödendi').length
  const ensureConsultantCommissionFields = () => {
    consultants.value = consultants.value.map((consultant) => {
      return {
        ...consultant,
        commissionSeniorityMode: consultant.commissionSeniorityMode || 'Ofis Başlangıcına Göre',
        previousOfficeExperienceYears: Number(consultant.previousOfficeExperienceYears ?? 0),
        recognizedExperienceYears: Number(consultant.recognizedExperienceYears ?? 0),
        manualCommissionStartPercent: Number(consultant.manualCommissionStartPercent ?? 0),
      }
    })
  }

  ensureConsultantCommissionFields()


    return {
      activeConsultants,
      newConsultants,
      missingDocuments,
      todayDuties,
      todayOwnerReports,
      todayCalls,
      overdueTasks,
      expiringAuthorities: 6,
      upcomingRentIncreases: 4,
      criticalProcesses,
      monthlyRevenue,
      monthlyDeals,
      activeListings,
      pendingPayments,
    }
  })

  const revenueLeaders = computed(() => {
    return [...consultants.value]
      .sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0))
      .slice(0, 5)
  })

  const dealLeaders = computed(() => {
    return [...consultants.value]
      .sort((a, b) => Number(b.dealCount || 0) - Number(a.dealCount || 0))
      .slice(0, 5)
  })

  const behindTargetConsultants = computed(() => {
    return consultants.value
      .filter(item => Number(item.revenue || 0) < Number(item.revenueTarget || 0))
      .slice(0, 5)
  })
  const ensureConsultantCommissionFields = () => {
    consultants.value = consultants.value.map((consultant) => {
      return {
        ...consultant,
        commissionSeniorityMode: consultant.commissionSeniorityMode || 'Ofis Başlangıcına Göre',
        previousOfficeExperienceYears: Number(consultant.previousOfficeExperienceYears ?? 0),
        recognizedExperienceYears: Number(consultant.recognizedExperienceYears ?? 0),
        manualCommissionStartPercent: Number(consultant.manualCommissionStartPercent ?? 0),
      }
    })
  }

  ensureConsultantCommissionFields()


  return {
    consultants,
    officeCalendar,
    officeTasks,
    payments,
    announcements,
    pipelines,
    regionAssignments,
    stats,
    revenueLeaders,
    dealLeaders,
    behindTargetConsultants,
  }
}



