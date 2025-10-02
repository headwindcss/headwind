export interface HeadwindConfig {
  content: string[]
  output: string
  minify: boolean
  watch: boolean
  theme: Theme
  shortcuts: Record<string, string | string[]>
  rules: CustomRule[]
  variants: VariantConfig
  safelist: string[]
  blocklist: string[]
  preflights: Preflight[]
  presets: Preset[]
}

export interface Theme {
  colors: Record<string, string | Record<string, string>>
  spacing: Record<string, string>
  fontSize: Record<string, [string, { lineHeight: string }]>
  fontFamily: Record<string, string[]>
  screens: Record<string, string>
  borderRadius: Record<string, string>
  boxShadow: Record<string, string>
}

export interface VariantConfig {
  responsive: boolean
  hover: boolean
  focus: boolean
  active: boolean
  disabled: boolean
  dark: boolean
}

export interface ParsedClass {
  raw: string
  variants: string[]
  utility: string
  value?: string
  important: boolean
  arbitrary: boolean
}

export interface CSSRule {
  selector: string
  properties: Record<string, string>
  mediaQuery?: string
}

export type CustomRule = [RegExp, (match: RegExpMatchArray) => Record<string, string> | undefined]

export interface Preflight {
  getCSS: () => string
}

export interface Preset {
  name: string
  theme?: Partial<Theme>
  rules?: CustomRule[]
  shortcuts?: Record<string, string | string[]>
  variants?: Partial<VariantConfig>
  preflights?: Preflight[]
}

export type HeadwindOptions = Partial<HeadwindConfig>
