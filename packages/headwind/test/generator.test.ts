import { describe, expect, it } from 'bun:test'
import { CSSGenerator } from '../src/generator'
import { defaultConfig } from '../src/config'

describe('CSSGenerator', () => {
  describe('Display utilities', () => {
    it('should generate flex utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex')
      const css = gen.toCSS()
      expect(css).toContain('.flex {')
      expect(css).toContain('display: flex;')
    })

    it('should generate block utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('block')
      const css = gen.toCSS()
      expect(css).toContain('display: block;')
    })

    it('should generate hidden utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hidden')
      const css = gen.toCSS()
      expect(css).toContain('display: none;')
    })
  })

  describe('Flexbox utilities', () => {
    it('should generate flex-col utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('flex-col')
      const css = gen.toCSS()
      expect(css).toContain('flex-direction: column;')
    })

    it('should generate justify-center utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('justify-center')
      const css = gen.toCSS()
      expect(css).toContain('justify-content: center;')
    })

    it('should generate items-center utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('items-center')
      const css = gen.toCSS()
      expect(css).toContain('align-items: center;')
    })
  })

  describe('Spacing utilities', () => {
    it('should generate padding utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-4')
      const css = gen.toCSS()
      expect(css).toContain('.p-4 {')
      expect(css).toContain('padding: 1rem;')
    })

    it('should generate margin utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('m-2')
      const css = gen.toCSS()
      expect(css).toContain('margin: 0.5rem;')
    })

    it('should generate horizontal padding', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('px-4')
      const css = gen.toCSS()
      expect(css).toContain('padding-left: 1rem;')
      expect(css).toContain('padding-right: 1rem;')
    })

    it('should generate vertical margin', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('my-8')
      const css = gen.toCSS()
      expect(css).toContain('margin-top: 2rem;')
      expect(css).toContain('margin-bottom: 2rem;')
    })

    it('should generate specific side padding', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('pt-2')
      const css = gen.toCSS()
      expect(css).toContain('padding-top: 0.5rem;')
    })
  })

  describe('Sizing utilities', () => {
    it('should generate width utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('w-full')
      const css = gen.toCSS()
      expect(css).toContain('width: 100%;')
    })

    it('should generate height utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('h-screen')
      const css = gen.toCSS()
      expect(css).toContain('height: 100vh;')
    })
  })

  describe('Color utilities', () => {
    it('should generate background color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain('background-color: #6b7280;')
    })

    it('should generate text color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-gray-800')
      const css = gen.toCSS()
      expect(css).toContain('color: #1f2937;')
    })

    it('should generate border color', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border-gray-300')
      const css = gen.toCSS()
      expect(css).toContain('border-color: #d1d5db;')
    })

    it('should handle direct color names', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('bg-black')
      const css = gen.toCSS()
      expect(css).toContain('background-color: #000;')
    })
  })

  describe('Typography utilities', () => {
    it('should generate font size with line height', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-xl')
      const css = gen.toCSS()
      expect(css).toContain('font-size: 1.25rem;')
      expect(css).toContain('line-height: 1.75rem;')
    })

    it('should generate font weight', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('font-bold')
      const css = gen.toCSS()
      expect(css).toContain('font-weight: 700;')
    })

    it('should generate text alignment', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('text-center')
      const css = gen.toCSS()
      expect(css).toContain('text-align: center;')
    })
  })

  describe('Border utilities', () => {
    it('should generate border width', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('border')
      const css = gen.toCSS()
      expect(css).toContain('border-width: 1px;')
    })

    it('should generate border radius', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('rounded-lg')
      const css = gen.toCSS()
      expect(css).toContain('border-radius: 0.5rem;')
    })
  })

  describe('Pseudo-class variants', () => {
    it('should generate hover variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain('.hover\\:bg-gray-500:hover {')
      expect(css).toContain('background-color: #6b7280;')
    })

    it('should generate focus variant', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('focus:border-gray-300')
      const css = gen.toCSS()
      expect(css).toContain('.focus\\:border-gray-300:focus {')
    })

    it('should handle multiple variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('hover:focus:bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain(':hover:focus')
    })
  })

  describe('Responsive variants', () => {
    it('should generate responsive utility', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('sm:flex')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 640px)')
      expect(css).toContain('.sm\\:flex {')
      expect(css).toContain('display: flex;')
    })

    it('should generate md breakpoint', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:p-8')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 768px)')
    })

    it('should combine responsive and pseudo-class variants', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('md:hover:bg-gray-500')
      const css = gen.toCSS()
      expect(css).toContain('@media (min-width: 768px)')
      expect(css).toContain(':hover')
    })
  })

  describe('Minification', () => {
    it('should generate minified CSS', () => {
      const gen = new CSSGenerator(defaultConfig)
      gen.generate('p-4')
      gen.generate('m-2')
      const css = gen.toCSS(true)
      expect(css).not.toContain('\n')
      expect(css).not.toContain('  ')
      expect(css).toContain('.p-4{padding:1rem}')
      expect(css).toContain('.m-2{margin:0.5rem}')
    })
  })

  describe('Shortcuts', () => {
    it('should expand shortcuts', () => {
      const config = {
        ...defaultConfig,
        shortcuts: {
          btn: 'px-4 py-2 rounded bg-blue-500',
        },
      }
      const gen = new CSSGenerator(config)
      gen.generate('btn')
      const css = gen.toCSS()
      expect(css).toContain('padding-left: 1rem;')
      expect(css).toContain('padding-top: 0.5rem;')
      expect(css).toContain('border-radius: 0.25rem;')
    })
  })

  describe('Blocklist', () => {
    it('should ignore blocklisted classes', () => {
      const config = {
        ...defaultConfig,
        blocklist: ['flex'],
      }
      const gen = new CSSGenerator(config)
      gen.generate('flex')
      const css = gen.toCSS()
      expect(css).not.toContain('display: flex;')
    })
  })
})
