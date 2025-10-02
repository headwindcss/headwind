import type { UtilityRule } from './rules'

// Backgrounds, Borders, Effects utilities

// Background utilities
export const backgroundAttachmentRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'bg-fixed': 'fixed',
    'bg-local': 'local',
    'bg-scroll': 'scroll',
  }
  return values[parsed.raw] ? { 'background-attachment': values[parsed.raw] } : undefined
}

export const backgroundClipRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'bg-clip-border': 'border-box',
    'bg-clip-padding': 'padding-box',
    'bg-clip-content': 'content-box',
    'bg-clip-text': 'text',
  }
  return values[parsed.raw] ? { 'background-clip': values[parsed.raw] } : undefined
}

export const backgroundImageRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'bg' && parsed.value) {
    const gradients: Record<string, string> = {
      'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
      'gradient-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
      'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      'gradient-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
      'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
      'gradient-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
    }
    if (gradients[`gradient-${parsed.value}`]) {
      return { 'background-image': gradients[`gradient-${parsed.value}`] }
    }
  }
}

export const backgroundOriginRule: UtilityRule = (parsed) => {
  const values: Record<string, string> = {
    'bg-origin-border': 'border-box',
    'bg-origin-padding': 'padding-box',
    'bg-origin-content': 'content-box',
  }
  return values[parsed.raw] ? { 'background-origin': values[parsed.raw] } : undefined
}

export const backgroundPositionRule: UtilityRule = (parsed) => {
  const positions: Record<string, string> = {
    'bg-bottom': 'bottom',
    'bg-center': 'center',
    'bg-left': 'left',
    'bg-left-bottom': 'left bottom',
    'bg-left-top': 'left top',
    'bg-right': 'right',
    'bg-right-bottom': 'right bottom',
    'bg-right-top': 'right top',
    'bg-top': 'top',
  }
  return positions[parsed.raw] ? { 'background-position': positions[parsed.raw] } : undefined
}

export const backgroundRepeatRule: UtilityRule = (parsed) => {
  const repeats: Record<string, string> = {
    'bg-repeat': 'repeat',
    'bg-no-repeat': 'no-repeat',
    'bg-repeat-x': 'repeat-x',
    'bg-repeat-y': 'repeat-y',
    'bg-repeat-round': 'round',
    'bg-repeat-space': 'space',
  }
  return repeats[parsed.raw] ? { 'background-repeat': repeats[parsed.raw] } : undefined
}

export const backgroundSizeRule: UtilityRule = (parsed) => {
  const sizes: Record<string, string> = {
    'bg-auto': 'auto',
    'bg-cover': 'cover',
    'bg-contain': 'contain',
  }
  return sizes[parsed.raw] ? { 'background-size': sizes[parsed.raw] } : undefined
}

// Border utilities
export const borderStyleRule: UtilityRule = (parsed) => {
  const styles: Record<string, string> = {
    'border-solid': 'solid',
    'border-dashed': 'dashed',
    'border-dotted': 'dotted',
    'border-double': 'double',
    'border-hidden': 'hidden',
    'border-none': 'none',
  }
  return styles[parsed.raw] ? { 'border-style': styles[parsed.raw] } : undefined
}

export const outlineRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'outline') {
    if (!parsed.value) {
      return { 'outline-width': '1px' }
    }
    const widths: Record<string, string> = {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    }
    return { 'outline-width': widths[parsed.value] || parsed.value }
  }

  const outlineStyles: Record<string, string> = {
    'outline-none': 'none',
    'outline-solid': 'solid',
    'outline-dashed': 'dashed',
    'outline-dotted': 'dotted',
    'outline-double': 'double',
  }
  if (parsed.raw.startsWith('outline-') && outlineStyles[parsed.raw]) {
    return { 'outline-style': outlineStyles[parsed.raw] }
  }
}

// Effect utilities
export const boxShadowThemeRule: UtilityRule = (parsed, config) => {
  if (parsed.utility === 'shadow' && parsed.value) {
    const shadow = config.theme.boxShadow[parsed.value]
    return shadow ? { 'box-shadow': shadow } : undefined
  }
  if (parsed.utility === 'shadow' && !parsed.value) {
    return { 'box-shadow': config.theme.boxShadow.DEFAULT }
  }
}

export const textShadowRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'text-shadow') {
    const shadows: Record<string, string> = {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
      none: 'none',
    }
    return parsed.value ? { 'text-shadow': shadows[parsed.value] || parsed.value } : undefined
  }
}

export const opacityRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'opacity' && parsed.value) {
    const opacityMap: Record<string, string> = {
      0: '0',
      5: '0.05',
      10: '0.1',
      20: '0.2',
      25: '0.25',
      30: '0.3',
      40: '0.4',
      50: '0.5',
      60: '0.6',
      70: '0.7',
      75: '0.75',
      80: '0.8',
      90: '0.9',
      95: '0.95',
      100: '1',
    }
    return { opacity: opacityMap[parsed.value] || parsed.value }
  }
}

export const mixBlendModeRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'mix-blend') {
    const modes = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
    return parsed.value && modes.includes(parsed.value) ? { 'mix-blend-mode': parsed.value } : undefined
  }
}

export const backgroundBlendModeRule: UtilityRule = (parsed) => {
  if (parsed.utility === 'bg-blend') {
    const modes = ['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity']
    return parsed.value && modes.includes(parsed.value) ? { 'background-blend-mode': parsed.value } : undefined
  }
}

export const effectsRules: UtilityRule[] = [
  backgroundAttachmentRule,
  backgroundClipRule,
  backgroundImageRule,
  backgroundOriginRule,
  backgroundPositionRule,
  backgroundRepeatRule,
  backgroundSizeRule,
  borderStyleRule,
  outlineRule,
  boxShadowThemeRule,
  textShadowRule,
  opacityRule,
  mixBlendModeRule,
  backgroundBlendModeRule,
]
