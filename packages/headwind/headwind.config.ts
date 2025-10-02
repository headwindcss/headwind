import type { HeadwindConfig } from './src/types'

export default {
  content: ['./example/**/*.html'],
  output: './example/output.css',
  minify: false,
} satisfies Partial<HeadwindConfig>
