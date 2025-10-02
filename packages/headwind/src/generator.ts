import type { CSSRule, HeadwindConfig, ParsedClass } from './types'
import { builtInRules } from './rules'
import { parseClass } from './parser'

/**
 * Generates CSS rules from parsed utility classes
 */
export class CSSGenerator {
  private rules: Map<string, CSSRule[]> = new Map()

  constructor(private config: HeadwindConfig) {}

  /**
   * Generate CSS for a utility class
   */
  generate(className: string): void {
    const parsed = parseClass(className)

    // Check if class is blocklisted
    if (this.config.blocklist.includes(className)) {
      return
    }

    // Try built-in rules
    for (const rule of builtInRules) {
      const properties = rule(parsed, this.config)
      if (properties) {
        this.addRule(parsed, properties)
        return
      }
    }

    // Try custom rules from config
    for (const [pattern, handler] of this.config.rules) {
      const match = className.match(pattern)
      if (match) {
        const properties = handler(match)
        if (properties) {
          this.addRule(parsed, properties)
          return
        }
      }
    }

    // Check shortcuts
    const shortcut = this.config.shortcuts[className]
    if (shortcut) {
      const classes = Array.isArray(shortcut) ? shortcut : shortcut.split(/\s+/)
      for (const cls of classes) {
        this.generate(cls)
      }
    }
  }

  /**
   * Add a CSS rule with variants applied
   */
  private addRule(parsed: ParsedClass, properties: Record<string, string>): void {
    const selector = this.buildSelector(parsed)
    const mediaQuery = this.getMediaQuery(parsed)

    // Apply !important modifier
    if (parsed.important) {
      for (const key in properties) {
        properties[key] += ' !important'
      }
    }

    const key = mediaQuery || 'base'
    if (!this.rules.has(key)) {
      this.rules.set(key, [])
    }

    this.rules.get(key)!.push({
      selector,
      properties,
      mediaQuery,
    })
  }

  /**
   * Build CSS selector with pseudo-classes
   */
  private buildSelector(parsed: ParsedClass): string {
    let selector = `.${this.escapeSelector(parsed.raw)}`

    // Apply pseudo-class variants (non-responsive)
    for (const variant of parsed.variants) {
      if (variant === 'hover' && this.config.variants.hover) {
        selector += ':hover'
      }
      else if (variant === 'focus' && this.config.variants.focus) {
        selector += ':focus'
      }
      else if (variant === 'active' && this.config.variants.active) {
        selector += ':active'
      }
      else if (variant === 'disabled' && this.config.variants.disabled) {
        selector += ':disabled'
      }
      else if (variant === 'dark' && this.config.variants.dark) {
        // Dark mode variant prepends a selector
        selector = `.dark ${selector}`
      }
    }

    return selector
  }

  /**
   * Get media query for responsive variants
   */
  private getMediaQuery(parsed: ParsedClass): string | undefined {
    if (!this.config.variants.responsive) {
      return undefined
    }

    for (const variant of parsed.variants) {
      const breakpoint = this.config.theme.screens[variant]
      if (breakpoint) {
        return `@media (min-width: ${breakpoint})`
      }
    }

    return undefined
  }

  /**
   * Escape special characters in class names for CSS selectors
   */
  private escapeSelector(className: string): string {
    return className.replace(/[:.\/]/g, '\\$&')
  }

  /**
   * Generate final CSS output
   */
  toCSS(minify = false): string {
    const parts: string[] = []

    // Base rules (no media query)
    const baseRules = this.rules.get('base') || []
    if (baseRules.length > 0) {
      parts.push(this.rulesToCSS(baseRules, minify))
    }

    // Media query rules
    for (const [key, rules] of this.rules.entries()) {
      if (key !== 'base' && rules.length > 0) {
        const mediaQuery = rules[0].mediaQuery!
        const css = this.rulesToCSS(rules, minify)
        parts.push(minify ? `${mediaQuery}{${css}}` : `${mediaQuery} {\n${css}\n}`)
      }
    }

    return minify ? parts.join('') : parts.join('\n\n')
  }

  /**
   * Convert rules to CSS string
   */
  private rulesToCSS(rules: CSSRule[], minify: boolean): string {
    const grouped = this.groupRulesBySelector(rules)
    const parts: string[] = []

    for (const [selector, properties] of grouped.entries()) {
      const props = Array.from(properties.entries())
        .map(([prop, value]) => minify ? `${prop}:${value}` : `  ${prop}: ${value};`)
        .join(minify ? ';' : '\n')

      if (minify) {
        parts.push(`${selector}{${props}}`)
      }
      else {
        parts.push(`${selector} {\n${props}\n}`)
      }
    }

    return minify ? parts.join('') : parts.join('\n\n')
  }

  /**
   * Group rules by selector and merge properties
   */
  private groupRulesBySelector(rules: CSSRule[]): Map<string, Map<string, string>> {
    const grouped = new Map<string, Map<string, string>>()

    for (const rule of rules) {
      if (!grouped.has(rule.selector)) {
        grouped.set(rule.selector, new Map())
      }
      const props = grouped.get(rule.selector)!
      for (const [prop, value] of Object.entries(rule.properties)) {
        props.set(prop, value)
      }
    }

    return grouped
  }

  /**
   * Reset the generator state
   */
  reset(): void {
    this.rules.clear()
  }
}
