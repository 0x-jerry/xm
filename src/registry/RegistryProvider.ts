import { RegistryOption } from './type.ts'

export abstract class RegistryProvider<
  T extends RegistryOption = RegistryOption,
> {
  abstract type: string
  abstract check(url: string): boolean
  /**
   *
   * @param url
   */
  abstract parse(url: string): T

  /**
   * ex.
   *
   * - mod@version/mod.ts
   * - mod@version
   * - mod
   *
   * @param modName
   */
  parseMod(modName: string): RegistryOption {
    const hasVersion = modName.includes('@')

    if (!hasVersion) {
      const [mod, ...entry] = modName.split('/')

      return {
        type: '',
        version: '',
        mod,
        entry: entry.join('/'),
      }
    }

    const [mod = '', suffix = ''] = modName.split('@')
    const [version = '', ...entry] = suffix.split('/')

    return {
      type: '',
      version,
      mod,
      entry: entry.join('/'),
    }
  }

  abstract generate(opt: T): string
  abstract versions(opt: T): string[] | Promise<string[]>
}
