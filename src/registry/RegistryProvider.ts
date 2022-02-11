import { MayPromise, ModVersions, RegistryOption } from './type.ts'

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
   * - mod@version/entry.ts
   * - mod@version/entry.ts?dts
   * - mod@version
   * - mod
   * - mod/entry.ts
   * - mod/entry.ts?dts
   *
   * - @scope/mod@version
   * - @scope/mod@version/entry.ts
   * - @scope/mod@version/entry.ts?dts
   * - @scope/mod
   * - @scope/mod/entry.ts
   * - @scope/mod/entry.ts?dts
   *
   * @param modName
   */
  parseMod(modName: string): RegistryOption {
    const url = new URL(modName, 'http://xxx.com')

    const [_, ...segments] = url.pathname.split('/')

    const isScoped = segments[0].startsWith('@')

    const result: RegistryOption = {
      type: '',
      version: '',
      mod: '',
      entry: '',
    }

    if (isScoped) {
      const [scope, modAndVersion, ...entries] = segments

      const [mod, version = ''] = modAndVersion.split('@')
      result.mod = `${scope}/${mod}`
      result.version = version
      result.entry = joinEntries(entries) + url.search
    } else {
      const [modAndVersion, ...entries] = segments

      const [mod, version = ''] = modAndVersion.split('@')
      result.mod = mod
      result.version = version
      result.entry = joinEntries(entries) + url.search
    }

    return result
  }

  abstract generate(opt: T): string

  abstract versions(opt: T): MayPromise<ModVersions>
}

function joinEntries(entries: string[]) {
  return entries.reduce((pre, cur, idx) => {
    return idx === 0 ? '/' + cur : pre + '/' + cur
  }, '')
}
