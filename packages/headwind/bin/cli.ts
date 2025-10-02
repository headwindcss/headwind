#!/usr/bin/env bun
import process from 'node:process'
import { watch } from 'node:fs'
import { CAC } from 'cac'
import { buildAndWrite } from '../src/build'
import { config } from '../src/config'
import { version } from '../package.json'

const cli = new CAC('headwind')

interface BuildOptions {
  output?: string
  minify?: boolean
  watch?: boolean
}

cli
  .command('build', 'Build CSS from content files')
  .option('--output <path>', 'Output CSS file path')
  .option('--minify', 'Minify CSS output')
  .option('--watch', 'Watch for file changes')
  .example('headwind build')
  .example('headwind build --output ./dist/styles.css')
  .example('headwind build --minify')
  .example('headwind build --watch')
  .action(async (options?: BuildOptions) => {
    const buildConfig = {
      ...config,
      output: options?.output || config.output,
      minify: options?.minify ?? config.minify,
    }

    async function runBuild(): Promise<void> {
      try {
        console.log('🚀 Building CSS...')
        const result = await buildAndWrite(buildConfig)
        console.log(`✅ Built ${result.classes.size} classes in ${result.duration.toFixed(2)}ms`)
        console.log(`📝 Output: ${buildConfig.output}`)
      }
      catch (error) {
        console.error('❌ Build failed:', error)
        process.exit(1)
      }
    }

    if (options?.watch) {
      console.log('👀 Watching for changes...')
      await runBuild()

      // Watch content directories
      const watchDirs = new Set<string>()
      for (const pattern of buildConfig.content) {
        const dir = pattern.split('**')[0] || '.'
        watchDirs.add(dir)
      }

      for (const dir of watchDirs) {
        watch(dir, { recursive: true }, async (eventType, filename) => {
          if (filename && /\.(html|js|ts|jsx|tsx)$/.test(filename)) {
            console.log(`\n📝 ${filename} changed, rebuilding...`)
            await runBuild()
          }
        })
      }

      console.log(`\n👀 Watching: ${Array.from(watchDirs).join(', ')}`)
    }
    else {
      await runBuild()
    }
  })

cli
  .command('watch', 'Build and watch for changes')
  .option('--output <path>', 'Output CSS file path')
  .option('--minify', 'Minify CSS output')
  .example('headwind watch')
  .example('headwind watch --output ./dist/styles.css')
  .action(async (options?: BuildOptions) => {
    const buildConfig = {
      ...config,
      output: options?.output || config.output,
      minify: options?.minify ?? config.minify,
    }

    async function runBuild(): Promise<void> {
      try {
        console.log('🚀 Building CSS...')
        const result = await buildAndWrite(buildConfig)
        console.log(`✅ Built ${result.classes.size} classes in ${result.duration.toFixed(2)}ms`)
        console.log(`📝 Output: ${buildConfig.output}`)
      }
      catch (error) {
        console.error('❌ Build failed:', error)
        process.exit(1)
      }
    }

    console.log('👀 Watching for changes...')
    await runBuild()

    // Watch content directories
    const watchDirs = new Set<string>()
    for (const pattern of buildConfig.content) {
      const dir = pattern.split('**')[0] || '.'
      watchDirs.add(dir)
    }

    for (const dir of watchDirs) {
      watch(dir, { recursive: true }, async (eventType, filename) => {
        if (filename && /\.(html|js|ts|jsx|tsx)$/.test(filename)) {
          console.log(`\n📝 ${filename} changed, rebuilding...`)
          await runBuild()
        }
      })
    }

    console.log(`\n👀 Watching: ${Array.from(watchDirs).join(', ')}`)
  })

cli.command('version', 'Show the version of Headwind').action(() => {
  console.log(version)
})

cli.version(version)
cli.help()
cli.parse()
