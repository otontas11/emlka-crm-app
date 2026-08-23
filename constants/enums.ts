/**
 * Tüm domain enum'larının TEK kaynağı.
 *
 * Değerler backend enum ADLARIdır (JsonStringEnumConverter ile bu şekilde serialize edilir);
 * Türkçe karşılık yalnızca etikettir. Sayfalar artık kendi option dizisini tanımlamaz,
 * buradan `enumOptions('CustomerStatus')` ile okur.
 *
 * Backend hazır olduğunda: bu dosya `GET /api/reference/enums` cevabıyla beslenecek,
 * `useEnums()` içindeki hydrate seam'i o iş için duruyor. Etiketler tek yerde olduğu için
 * geçiş sırasında sayfalara dokunmak gerekmeyecek.
 */

export interface EnumOption {
  value: string
  label: string
}

/** value -> Türkçe etiket. Sıra, dropdown'daki sıradır. */
export type EnumMap = Record<string, string>

// ---------------------------------------------------------------- ortak
export const Visibility: EnumMap = {
  Personal: 'Kişisel',
  OfficeShared: 'Ofisle Paylaşıldı',
  Office: 'Ofis Verisi',
}

export const Priority: EnumMap = {
  Low: 'Düşük',
  Normal: 'Normal',
  High: 'Yüksek',
  Urgent: 'Acil',
}

export const Currency: EnumMap = { TRY: '₺', USD: '$', EUR: '€', GBP: '£' }

export const PackageType: EnumMap = { Solo: 'Solo', Plus: 'Plus', Office: 'Ofis' }

export const YesNo: EnumMap = { Yes: 'Evet', No: 'Hayır' }

export const DayOfWeek: EnumMap = {
  Monday: 'Pazartesi',
  Tuesday: 'Salı',
  Wednesday: 'Çarşamba',
  Thursday: 'Perşembe',
  Friday: 'Cuma',
  Saturday: 'Cumartesi',
  Sunday: 'Pazar',
}

export const PeriodType: EnumMap = {
  Monthly: 'Aylık',
  Q1: '1. Çeyrek',
  Q2: '2. Çeyrek',
  Q3: '3. Çeyrek',
  Q4: '4. Çeyrek',
  HalfYearly: '6 Aylık',
  Yearly: 'Yıllık',
}

// ---------------------------------------------------------------- müşteri
export const CustomerType: EnumMap = {
  Buyer: 'Alıcı',
  Seller: 'Satıcı',
  Tenant: 'Kiracı',
  Landlord: 'Mal Sahibi',
  Investor: 'Yatırımcı',
  Reference: 'Referans',
  Former: 'Eski Müşteri',
  Hot: 'Sıcak Müşteri',
  Prospect: 'Aday Müşteri',
  PhonebookContact: 'Kişisel Rehber',
}

export const CustomerStatus: EnumMap = {
  Active: 'Aktif',
  Passive: 'Pasif',
  Following: 'Takipte',
  Hot: 'Sıcak',
  Cold: 'Soğuk',
  InDeal: 'İşlemde',
  Closed: 'Kapandı',
}

export const CustomerSource: EnumMap = {
  Manual: 'Manuel Kayıt',
  Phonebook: 'Telefon Rehberi',
  Import: 'İçe Aktarım',
  Web: 'Web Formu',
  Referral: 'Referans',
  SocialMedia: 'Sosyal Medya',
}

export const MaritalStatus: EnumMap = {
  Single: 'Bekar',
  Married: 'Evli',
  Divorced: 'Boşanmış',
  Widowed: 'Eşi Vefat Etmiş',
}

export const InteractionChannel: EnumMap = {
  Phone: 'Telefon',
  Whatsapp: 'WhatsApp',
  Email: 'E-posta',
  FaceToFace: 'Yüz yüze',
  OfficeMeeting: 'Ofis içi görüşme',
  Showing: 'Portföy Gösterimi',
  Offer: 'Teklif Görüşmesi',
  PriceTalk: 'Fiyat Görüşmesi',
}

export const SpecialDayKind: EnumMap = {
  CustomerBirthday: 'Müşteri Doğum Günü',
  SpouseBirthday: 'Eş Doğum Günü',
  ChildBirthday: 'Çocuk Doğum Günü',
  MotherBirthday: 'Anne Doğum Günü',
  FatherBirthday: 'Baba Doğum Günü',
  WeddingAnniversary: 'Evlilik Yıldönümü',
  HometownLiberation: 'Memleket Kurtuluş Günü',
  DeathAnniversary: 'Vefat Yıldönümü',
  BusinessAnniversary: 'İş Yeri Açılış Yıldönümü',
  ProfessionDay: 'Meslek Günü',
  Other: 'Diğer',
}

// ---------------------------------------------------------------- portföy
export const ListingType: EnumMap = {
  Sale: 'Satılık',
  Rent: 'Kiralık',
  TransferSale: 'Devren Satılık',
  TransferRent: 'Devren Kiralık',
}

export const PropertyCategory: EnumMap = {
  Residential: 'Konut',
  Commercial: 'Ticari',
  Land: 'Arsa / Arazi',
  Project: 'Proje',
}

export const PropertyType: EnumMap = {
  Apartment: 'Daire',
  Shop: 'Dükkan',
  Store: 'Mağaza',
  Office: 'Ofis',
  Warehouse: 'Depo',
  Factory: 'Fabrika',
  Land: 'Arsa',
  Residence: 'Konut',
  Workplace: 'İşyeri',
  PlazaFloor: 'Plaza Katı',
  Building: 'Bina',
  Villa: 'Villa',
  Other: 'Diğer',
}

export const PropertyStatus: EnumMap = {
  Draft: 'Taslak',
  Active: 'Aktif',
  OnHold: 'Beklemede',
  OfferStage: 'Teklif Aşamasında',
  Optioned: 'Opsiyonlu',
  Sold: 'Satıldı',
  Rented: 'Kiralandı',
  Cancelled: 'İptal Edildi',
  Expired: 'Süresi Doldu',
  Passive: 'Pasif',
}

export const OwnershipType: EnumMap = {
  ConsultantOwned: 'Danışmana Özel Portföy',
  Office: 'Ofis Portföyü',
  SharedOffice: 'Ortak Ofis Portföyü',
  Project: 'Proje Portföyü',
}

export const AuthorityType: EnumMap = {
  Exclusive: 'Tek Yetki',
  Standard: 'Standart Yetki',
  Shared: 'Ortak Yetki',
}

export const AuthorityStatus: EnumMap = {
  Active: 'Aktif',
  Expiring: 'Süresi Yaklaşıyor',
  Expired: 'Süresi Doldu',
  Renewed: 'Yenilendi',
  NotRenewed: 'Yenilenmedi',
}

/** Yetkili portföyün pazarlama aşaması (eski "yetkili-portfoyler" stageOptions). */
export const ListingStage: EnumMap = {
  PortfolioAcquired: 'Portföy Alındı',
  MediaPreparing: 'Fotoğraf / Video Hazırlanıyor',
  Published: 'İlan Yayında',
  Marketing: 'Pazarlama',
  RequestMatched: 'Talep Eşleşti',
  Presented: 'Sunum Yapıldı',
  OfferReceived: 'Teklif Alındı',
  PriceUpdate: 'Fiyat Güncelleme',
  ContractStage: 'Sözleşme Aşaması',
  Completed: 'İşlem Tamamlandı',
}

export const RentIncreaseType: EnumMap = {
  Tufe: 'TÜFE',
  Fixed: 'Sabit Tutar',
  Percent: 'Yüzde',
  Custom: 'Özel',
}

export const OwnerFeedbackKind: EnumMap = {
  PriceDecreaseRequest: 'Fiyat Düşürme Talebi',
  PriceIncreaseRequest: 'Fiyat Yükseltme Talebi',
  DescriptionChange: 'İlan Açıklama Değişikliği',
  PhotoChange: 'Fotoğraf Değişikliği Talebi',
  MarketingObjection: 'Pazarlama İtirazı',
  PauseListing: 'İlanı Durdurma Talebi',
  AuthorityNotRenewSignal: 'Yetki Yenilememe Sinyali',
}

// ---------------------------------------------------------------- talep
export const RequestType: EnumMap = {
  Buyer: 'Alıcı Talebi',
  Tenant: 'Kiracı Talebi',
  Investor: 'Yatırımcı Talebi',
  Land: 'Arsa Talebi',
  Industrial: 'Depo / Fabrika Talebi',
  Retail: 'Dükkan / Mağaza Talebi',
  Office: 'Ofis Talebi',
  BusinessTransfer: 'Devren İşyeri Talebi',
}

export const Urgency: EnumMap = {
  Low: 'Düşük',
  Normal: 'Normal',
  Hot: 'Sıcak',
  Urgent: 'Acil',
}

export const RequestStatus: EnumMap = {
  Active: 'Aktif',
  Closed: 'Kapandı',
  Passive: 'Pasif',
}

export const CustomerVisibility: EnumMap = { Hidden: 'Gizli', Open: 'Açık' }

export const MatchResult: EnumMap = {
  Contacted: 'Görüşüldü',
  AppointmentSet: 'Randevu Alındı',
  NotSuitable: 'Uygun Değil',
  OfferStage: 'Teklif Aşamasında',
  ConvertedToDeal: 'İşleme Döndü',
  Pending: 'Beklemede',
}

// ---------------------------------------------------------------- işlem (Deal)
export const DealType: EnumMap = {
  Sale: 'Satış',
  Rent: 'Kiralama',
  PortfolioAcquisition: 'Portföy Alma',
  Consultancy: 'Danışmanlık',
  Valuation: 'Değerleme',
  Showing: 'Yer Gösterme',
}

export const DealStage: EnumMap = {
  NewRequest: 'Yeni Talep',
  FirstContact: 'İlk Görüşme',
  PortfolioMatching: 'Portföy Eşleştirme',
  Presented: 'Sunum Yapıldı',
  Shown: 'Yer Gösterildi',
  OfferReceived: 'Teklif Alındı',
  Negotiating: 'Fiyat Pazarlığı',
  DepositTaken: 'Kapora Alındı',
  ContractStage: 'Sözleşme Aşaması',
  DeedPending: 'Tapu Bekleniyor',
  Completed: 'İşlem Tamamlandı',
  Closed: 'Kapandı',
  Lost: 'Kaybedildi',
}

export const DealStatus: EnumMap = {
  Active: 'Aktif',
  ActionRequired: 'Aksiyon Bekliyor',
  OnHold: 'Beklemede',
  Won: 'Kapandı',
  Lost: 'Kaybedildi',
  Cancelled: 'İptal',
}

export const DealSource: EnumMap = {
  OfficeRecord: 'Ofis Kaydı',
  Field: 'Saha Çalışması',
  Referral: 'Referans',
  SocialMedia: 'Sosyal Medya',
  WebForm: 'Web Formu',
  PhoneCall: 'Telefon Araması',
  ExistingCustomer: 'Mevcut Müşteri',
  RequestMatch: 'Talep Eşleşmesi',
}

export const DealParticipantRole: EnumMap = {
  PortfolioTaker: 'Portföyü Alan Danışman',
  Closer: 'İşlemi Kapatan Danışman',
  Support: 'Destek',
  External: 'Dış Kurum / Danışman',
}

// ---------------------------------------------------------------- komisyon
export const CommissionPaymentStatus: EnumMap = {
  AwaitingCollection: 'Tahsilat Bekliyor',
  PartiallyCollected: 'Kısmi Tahsil Edildi',
  Collected: 'Tahsil Edildi',
  Cancelled: 'İptal',
}

export const ConsultantPaymentStatus: EnumMap = {
  OnHold: 'Beklemede',
  AwaitingPayment: 'Ödeme Bekliyor',
  PartiallyPaid: 'Kısmi Ödendi',
  Paid: 'Ödendi',
  Cancelled: 'İptal',
}

export const InvoiceStatus: EnumMap = {
  OnHold: 'Beklemede',
  ToBeIssued: 'Fatura Kesilecek',
  Issued: 'Fatura Kesildi',
  ReceiptTaken: 'Makbuz Alındı',
  Cancelled: 'İptal',
}

export const CommissionSeniorityMode: EnumMap = {
  OfficeStart: 'Ofis Başlangıcına Göre',
  TotalIndustry: 'Toplam Sektör Tecrübesine Göre',
  BrokerDefined: 'Broker Tarafından Tanımlanan Tecrübe',
}

// ---------------------------------------------------------------- finans
export const PaymentDirection: EnumMap = { Collection: 'Tahsilat', Payment: 'Ödeme' }

export const PaymentPersonType: EnumMap = {
  Consultant: 'Danışman',
  OfficeStaff: 'Ofis Personeli',
  Institution: 'Resmi Kurum',
  Supplier: 'Tedarikçi',
  Other: 'Diğer',
}

export const PaymentStatus: EnumMap = {
  Pending: 'Bekliyor',
  Paid: 'Ödendi',
  PartiallyPaid: 'Kısmi Ödendi',
  Overdue: 'Gecikti',
  Cancelled: 'İptal',
}

export const OfficePaymentCategory: EnumMap = {
  ConsultantSskCollection: 'Danışman SSK Tahsilatı',
  SskDebtPayment: 'Danışman SSK Borç Ödemesi',
  OfficeDuesCollection: 'Danışman Ofis Aidatı Tahsilatı',
  CommissionPayment: 'Komisyon Ödemesi',
  Advance: 'Avans',
  StaffSalary: 'Ofis Personel Maaşı',
  OfficeExpense: 'Ofis Gideri',
  RentOrDues: 'Kira / Aidat Ödemesi',
  OtherCollection: 'Diğer Tahsilat',
  OtherPayment: 'Diğer Ödeme',
}

// ---------------------------------------------------------------- ofis / danışman
export const WorkType: EnumMap = {
  SgkEmployee: 'SGK’lı Danışman',
  BagKurPartner: 'Bağ-Kur’lu Danışman',
  Candidate: 'Aday Danışman',
  IndependentLinked: 'Bireysel Bağlı Danışman',
  OfficeStaff: 'Ofis Personeli',
}

export const ConsultantStatus: EnumMap = {
  Candidate: 'Aday',
  Active: 'Aktif',
  Passive: 'Pasif',
  Left: 'Ayrıldı',
}

export const RegionStatus: EnumMap = {
  Active: 'Aktif',
  Suspended: 'Askıda',
  Completed: 'Tamamlandı',
  Passive: 'Pasif',
}

export const RegionAssignmentType: EnumMap = {
  Primary: 'Ana Bölge',
  Support: 'Destek Bölge',
  Temporary: 'Geçici Bölge',
  Project: 'Proje Bölgesi',
}

export const RegionExclusivity: EnumMap = {
  SingleConsultant: 'Tek Danışman',
  Shared: 'Ortak Çalışma',
  OfficeWide: 'Ofis Geneli',
}

export const DutyStatus: EnumMap = {
  Planned: 'Planlandı',
  ConsultantConfirmed: 'Danışman Onayladı',
  Completed: 'Tamamlandı',
  Absent: 'Gelmedi',
  Excused: 'Mazeretli',
  ChangeRequested: 'Değişim Talebi',
}

export const MeetingType: EnumMap = {
  Weekly: 'Haftalık Toplantı',
  MonthlyReview: 'Aylık Değerlendirme',
  Training: 'Eğitim Toplantısı',
  Pipeline: 'Pipeline Toplantısı',
  Region: 'Bölge Toplantısı',
  Urgent: 'Acil Toplantı',
}

export const MeetingStatus: EnumMap = {
  Planned: 'Planlandı',
  InProgress: 'Devam Ediyor',
  Completed: 'Tamamlandı',
  Cancelled: 'İptal',
}

export const AttendanceStatus: EnumMap = {
  Pending: 'Bekliyor',
  Attended: 'Katıldı',
  Absent: 'Katılmadı',
  Excused: 'Mazeretli',
}

export const AnnouncementType: EnumMap = {
  General: 'Duyuru',
  Orientation: 'Oryantasyon',
  Document: 'Evrak',
  Meeting: 'Toplantı',
  Training: 'Eğitim',
  Duty: 'Nöbet',
  Success: 'Başarı',
  NewListing: 'Yeni Portföy',
  Rule: 'Kural',
  Urgent: 'Acil',
}

export const AnnouncementAudience: EnumMap = {
  AllOffice: 'Tüm Ofis',
  ActiveConsultants: 'Aktif Danışmanlar',
  CandidateConsultants: 'Aday Danışmanlar',
  SgkConsultants: 'SGK’lı Danışmanlar',
  BagKurConsultants: 'Bağ-Kur’lu Danışmanlar',
  SpecificConsultants: 'Belirli Danışmanlar',
  Management: 'Yönetim',
}

export const AnnouncementPriority: EnumMap = {
  Normal: 'Normal',
  Important: 'Önemli',
  Urgent: 'Acil',
}

export const AnnouncementStatus: EnumMap = { Published: 'Yayınlandı', Draft: 'Taslak' }

export const NotificationChannel: EnumMap = {
  InApp: 'Sistem İçi',
  MobilePush: 'Mobil Bildirim',
  WhatsappDraft: 'WhatsApp Mesajı Hazırla',
}

export const TrainingCategory: EnumMap = {
  Orientation: 'Oryantasyon',
  Portfolio: 'Portföy',
  Field: 'Saha',
  Commercial: 'Ticari Gayrimenkul',
  Marketing: 'Pazarlama',
  Ethics: 'Etik',
  SocialMedia: 'Sosyal Medya',
  Communication: 'İletişim',
  General: 'Genel',
}

export const TrainingLevel: EnumMap = {
  Beginner: 'Başlangıç',
  Intermediate: 'Orta',
  Advanced: 'İleri',
}

export const TrainingFormat: EnumMap = {
  Document: 'Doküman',
  Video: 'Video',
  Presentation: 'Sunum',
  Mixed: 'Doküman + Video',
}

export const TrainingAssignmentStatus: EnumMap = {
  Assigned: 'Atandı',
  InProgress: 'Devam Ediyor',
  Completed: 'Tamamlandı',
  Skipped: 'Atlandı',
}

export const OrientationStepStatus: EnumMap = {
  Pending: 'Bekliyor',
  InProgress: 'Devam Ediyor',
  Completed: 'Tamamlandı',
  NotApplicable: 'Uygulanmaz',
}

// ---------------------------------------------------------------- belge
export const DocumentTemplateCategory: EnumMap = {
  RegistrationDoc: 'Kayıt Evrakı',
  LeasingDocs: 'Kiralama Belgeleri',
  AuthorityDocs: 'Yetki Belgeleri',
  ShowingAndOffer: 'Yer Gösterme / Teklif',
  ServiceDocs: 'Hizmet Belgeleri',
  TransferDocs: 'Devir Belgeleri',
  PortfolioDocs: 'Portföy Belgeleri',
  Minutes: 'Tutanaklar',
  Kvkk: 'KVKK Belgeleri',
  Other: 'Diğer',
}

export const DocumentFileType: EnumMap = {
  Docx: 'DOCX',
  Pdf: 'PDF',
  Xlsx: 'XLSX',
  Txt: 'TXT',
}

export const DocumentSubmissionStatus: EnumMap = {
  Uploaded: 'Yüklendi',
  SentForApproval: 'Onaya Gönderildi',
  Approved: 'Onaylandı',
  RevisionRequested: 'Revize İstendi',
}

export const ConsultantDocumentStatus: EnumMap = {
  Missing: 'Eksik',
  Completed: 'Tamamlandı',
  AwaitingReview: 'Kontrol Bekliyor',
  Expiring: 'Süresi Yaklaşıyor',
  Invalid: 'Geçersiz',
}

// ---------------------------------------------------------------- görev
export const TaskCategory: EnumMap = {
  CustomerCall: 'Müşteri Arama',
  PropertyInfo: 'Mülk Bilgilendirme',
  OwnerReport: 'Malik Raporu',
  Showing: 'Portföy Gösterimi',
  RentIncrease: 'Kira Artışı',
  AuthorityRenewal: 'Yetki Yenileme',
  PriceRevision: 'Fiyat Revizyonu',
  ContractPrep: 'Sözleşme Hazırlığı',
  DeedPrep: 'Tapu Hazırlığı',
  PaymentFollowUp: 'Ödeme Takibi',
  SocialMediaContent: 'Sosyal Medya İçeriği',
  MeetingPrep: 'Toplantı Hazırlığı',
  DocumentFollowUp: 'Belge Takibi',
  General: 'Genel Görev',
}

export const TaskStatus: EnumMap = {
  Pending: 'Bekliyor',
  InProgress: 'Devam Ediyor',
  Completed: 'Tamamlandı',
  Cancelled: 'İptal',
}

// ---------------------------------------------------------------- ayrılış
export const OffboardingReason: EnumMap = {
  Voluntary: 'Kendi isteğiyle ayrıldı',
  Performance: 'Performans nedeniyle ayrıldı',
  OfficeChange: 'Ofis değişikliği',
  LeftIndustry: 'Sektörden ayrıldı',
  ContractEnded: 'Sözleşme sona erdi',
  Other: 'Diğer',
}

export const OffboardingStatus: EnumMap = {
  InProgress: 'Devam Ediyor',
  Completed: 'Tamamlandı',
  OnHold: 'Beklemede',
}

export const AccessStatus: EnumMap = {
  ToBeClosed: 'Kapatılacak',
  Closed: 'Kapatıldı',
  TemporarilyOpen: 'Geçici Açık',
}

export const DataStatus: EnumMap = {
  ToBeBackedUp: 'Yedeklenecek',
  BackedUp: 'Yedeklendi',
  ToBeChecked: 'Kontrol Edilecek',
}

export const TransferStatus: EnumMap = {
  ToBeTransferred: 'Devredilecek',
  Transferred: 'Devredildi',
  ToBeChecked: 'Kontrol Edilecek',
  WithBroker: 'Broker Üzerinde',
}

export const OffboardingFinanceStatus: EnumMap = {
  AwaitingSettlement: 'Hesaplaşma Bekliyor',
  PartiallyClosed: 'Kısmi Kapatıldı',
  Closed: 'Kapatıldı',
  NoPayment: 'Ödeme Yok',
}

export const OffboardingDocumentStatus: EnumMap = {
  ToBeArchived: 'Arşivlenecek',
  Archived: 'Arşivlendi',
  MissingDocuments: 'Eksik Evrak Var',
}

// ---------------------------------------------------------------- kayıt
export const enumRegistry = {
  Visibility, Priority, Currency, PackageType, YesNo, DayOfWeek, PeriodType,
  CustomerType, CustomerStatus, CustomerSource, MaritalStatus, InteractionChannel, SpecialDayKind,
  ListingType, PropertyCategory, PropertyType, PropertyStatus, OwnershipType,
  AuthorityType, AuthorityStatus, ListingStage, RentIncreaseType, OwnerFeedbackKind,
  RequestType, Urgency, RequestStatus, CustomerVisibility, MatchResult,
  DealType, DealStage, DealStatus, DealSource, DealParticipantRole,
  CommissionPaymentStatus, ConsultantPaymentStatus, InvoiceStatus, CommissionSeniorityMode,
  PaymentDirection, PaymentPersonType, PaymentStatus, OfficePaymentCategory,
  WorkType, ConsultantStatus, RegionStatus, RegionAssignmentType, RegionExclusivity,
  DutyStatus, MeetingType, MeetingStatus, AttendanceStatus,
  AnnouncementType, AnnouncementAudience, AnnouncementPriority, AnnouncementStatus, NotificationChannel,
  TrainingCategory, TrainingLevel, TrainingFormat, TrainingAssignmentStatus, OrientationStepStatus,
  DocumentTemplateCategory, DocumentFileType, DocumentSubmissionStatus, ConsultantDocumentStatus,
  TaskCategory, TaskStatus,
  OffboardingReason, OffboardingStatus, AccessStatus, DataStatus, TransferStatus,
  OffboardingFinanceStatus, OffboardingDocumentStatus,
} as const

export type EnumName = keyof typeof enumRegistry

/** Dropdown için sıralı {value,label} listesi. */
export const enumOptions = (name: EnumName): EnumOption[] =>
  Object.entries(enumRegistry[name] as EnumMap).map(([value, label]) => ({ value, label }))

/** Tek değerin Türkçe etiketi. Bilinmeyen değer olduğu gibi döner (veri kaybı olmasın). */
export const enumLabel = (name: EnumName, value?: string | null): string => {
  if (!value) return ''
  return (enumRegistry[name] as EnumMap)[value] ?? value
}

/** Filtre dropdown'ları için başa "Tümü" ekler. */
export const enumFilterOptions = (name: EnumName, allLabel = 'Tümü'): EnumOption[] =>
  [{ value: '', label: allLabel }, ...enumOptions(name)]

/** Enum değerlerinin ham listesi. */
export const enumValues = (name: EnumName): string[] => Object.keys(enumRegistry[name] as EnumMap)
