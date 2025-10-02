import { Glob } from 'bun'
import { extractClasses } from './parser'

/**
 * Scans files for utility classes using Bun's fast Glob API
 */
export class Scanner {
  constructor(private patterns: string[]) {}

  /**
   * Scan all files matching the patterns and extract utility classes
   */
  async scan(): Promise<Set<string>> {
    const allClasses = new Set<string>()

    // Use Promise.all to scan all patterns concurrently for better performance
    await Promise.all(
      this.patterns.map(async (pattern) => {
        const glob = new Glob(pattern)

        // Bun's glob.scan() returns an async iterable
        for await (const file of glob.scan('.')) {
          try {
            const content = await Bun.file(file).text()
            const classes = extractClasses(content)

            for (const cls of classes) {
              allClasses.add(cls)
            }
          }
          catch (error) {
            // Silently skip files that can't be read
            // (e.g., binary files, permission issues)
            continue
          }
        }
      }),
    )

    return allClasses
  }

  /**
   * Scan a single file for utility classes
   */
  async scanFile(filePath: string): Promise<Set<string>> {
    try {
      const content = await Bun.file(filePath).text()
      return extractClasses(content)
    }
    catch (error) {
      return new Set<string>()
    }
  }

  /**
   * Scan content string for utility classes
   */
  scanContent(content: string): Set<string> {
    return extractClasses(content)
  }
}
