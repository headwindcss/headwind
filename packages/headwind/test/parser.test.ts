import { describe, expect, it } from 'bun:test'
import { extractClasses, parseClass } from '../src/parser'

describe('parseClass', () => {
  it('should parse simple utility without value', () => {
    const result = parseClass('flex')
    expect(result).toEqual({
      raw: 'flex',
      variants: [],
      utility: 'flex',
      value: undefined,
      important: false,
      arbitrary: false,
    })
  })

  it('should parse utility with value', () => {
    const result = parseClass('p-4')
    expect(result).toEqual({
      raw: 'p-4',
      variants: [],
      utility: 'p',
      value: '4',
      important: false,
      arbitrary: false,
    })
  })

  it('should parse important modifier', () => {
    const result = parseClass('!p-4')
    expect(result).toEqual({
      raw: '!p-4',
      variants: [],
      utility: 'p',
      value: '4',
      important: true,
      arbitrary: false,
    })
  })

  it('should parse arbitrary value', () => {
    const result = parseClass('w-[100px]')
    expect(result).toEqual({
      raw: 'w-[100px]',
      variants: [],
      utility: 'w',
      value: '100px',
      important: false,
      arbitrary: true,
    })
  })

  it('should parse arbitrary color value', () => {
    const result = parseClass('bg-[#ff0000]')
    expect(result).toEqual({
      raw: 'bg-[#ff0000]',
      variants: [],
      utility: 'bg',
      value: '#ff0000',
      important: false,
      arbitrary: true,
    })
  })

  it('should parse arbitrary value with important', () => {
    const result = parseClass('!w-[100px]')
    expect(result).toEqual({
      raw: '!w-[100px]',
      variants: [],
      utility: 'w',
      value: '100px',
      important: true,
      arbitrary: true,
    })
  })

  it('should parse utility with compound value', () => {
    const result = parseClass('bg-blue-500')
    expect(result).toEqual({
      raw: 'bg-blue-500',
      variants: [],
      utility: 'bg',
      value: 'blue-500',
      important: false,
      arbitrary: false,
    })
  })

  it('should parse utility with single variant', () => {
    const result = parseClass('hover:bg-blue-500')
    expect(result).toEqual({
      raw: 'hover:bg-blue-500',
      variants: ['hover'],
      utility: 'bg',
      value: 'blue-500',
      important: false,
      arbitrary: false,
    })
  })

  it('should parse utility with multiple variants', () => {
    const result = parseClass('sm:hover:flex')
    expect(result).toEqual({
      raw: 'sm:hover:flex',
      variants: ['sm', 'hover'],
      utility: 'flex',
      value: undefined,
      important: false,
      arbitrary: false,
    })
  })

  it('should parse responsive variant with value', () => {
    const result = parseClass('md:p-8')
    expect(result).toEqual({
      raw: 'md:p-8',
      variants: ['md'],
      utility: 'p',
      value: '8',
      important: false,
      arbitrary: false,
    })
  })

  it('should parse complex multi-variant utility', () => {
    const result = parseClass('lg:dark:hover:text-gray-800')
    expect(result).toEqual({
      raw: 'lg:dark:hover:text-gray-800',
      variants: ['lg', 'dark', 'hover'],
      utility: 'text',
      value: 'gray-800',
      important: false,
      arbitrary: false,
    })
  })
})

describe('extractClasses', () => {
  it('should extract classes from class attribute', () => {
    const html = '<div class="flex p-4 bg-blue-500"></div>'
    const result = extractClasses(html)
    expect(result).toEqual(new Set(['flex', 'p-4', 'bg-blue-500']))
  })

  it('should extract classes from className attribute', () => {
    const jsx = '<div className="flex p-4 bg-blue-500"></div>'
    const result = extractClasses(jsx)
    expect(result).toEqual(new Set(['flex', 'p-4', 'bg-blue-500']))
  })

  it('should extract classes from className with curly braces', () => {
    const jsx = '<div className={"flex p-4"}></div>'
    const result = extractClasses(jsx)
    expect(result).toEqual(new Set(['flex', 'p-4']))
  })

  it('should extract classes from template literals', () => {
    const jsx = '<div className={`flex p-4 hover:bg-blue-500`}></div>'
    const result = extractClasses(jsx)
    expect(result).toEqual(new Set(['flex', 'p-4', 'hover:bg-blue-500']))
  })

  it('should handle multiple elements', () => {
    const html = `
      <div class="flex p-4">
        <span className="text-sm">Text</span>
      </div>
    `
    const result = extractClasses(html)
    expect(result).toEqual(new Set(['flex', 'p-4', 'text-sm']))
  })

  it('should handle variants', () => {
    const html = '<div class="sm:flex md:p-8 hover:bg-blue-500"></div>'
    const result = extractClasses(html)
    expect(result).toEqual(new Set(['sm:flex', 'md:p-8', 'hover:bg-blue-500']))
  })

  it('should ignore empty strings', () => {
    const html = '<div class="  flex   p-4  "></div>'
    const result = extractClasses(html)
    expect(result).toEqual(new Set(['flex', 'p-4']))
  })

  it('should return empty set for content without classes', () => {
    const html = '<div><p>No classes here</p></div>'
    const result = extractClasses(html)
    expect(result.size).toBe(0)
  })
})
