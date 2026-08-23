/**
 * Enum erişiminin tek kapısı. Bugün constants/enums.ts'i (statik) okur.
 *
 * Backend hazır olduğunda burası `GET /api/reference/enums` cevabını çekip
 * `overrides` state'ine yazacak; sayfalar bu composable üzerinden okuduğu için
 * tek satır değişiklikle tüm uygulama sunucudan beslenmeye başlar.
 */
import {
  enumRegistry,
  enumOptions,
  enumFilterOptions,
  enumLabel,
  enumValues,
  type EnumName,
  type EnumMap,
  type EnumOption,
} from '~/constants/enums'

export const useEnums = () => {
  // Sunucudan gelen enum haritaları (henüz boş). Doldukça statik kaydı gölgeler.
  const overrides = useState<Partial<Record<EnumName, EnumMap>>>('enum-overrides', () => ({}))

  const map = (name: EnumName): EnumMap => overrides.value[name] ?? (enumRegistry[name] as EnumMap)

  const options = (name: EnumName): EnumOption[] => {
    const override = overrides.value[name]
    if (!override) return enumOptions(name)
    return Object.entries(override).map(([value, label]) => ({ value, label }))
  }

  const filterOptions = (name: EnumName, allLabel = 'Tümü'): EnumOption[] => {
    const override = overrides.value[name]
    if (!override) return enumFilterOptions(name, allLabel)
    return [{ value: '', label: allLabel }, ...options(name)]
  }

  const label = (name: EnumName, value?: string | null): string => {
    const override = overrides.value[name]
    if (!override) return enumLabel(name, value)
    if (!value) return ''
    return override[value] ?? value
  }

  const values = (name: EnumName): string[] => {
    const override = overrides.value[name]
    return override ? Object.keys(override) : enumValues(name)
  }

  /** Backend devreye girince çağrılacak. */
  const hydrateFromApi = async () => {
    // const data = await $fetch<Record<EnumName, EnumMap>>('/api/reference/enums')
    // overrides.value = data
  }

  return { map, options, filterOptions, label, values, hydrateFromApi }
}
