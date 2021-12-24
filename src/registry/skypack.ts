import { RegistryProvider } from './RegistryProvider.ts'
import { RegistryOption } from './type.ts'

const registryType = 'skypack'

interface SkypackParseResult extends RegistryOption {
  type: typeof registryType
}

export class SkypackProvider extends RegistryProvider<SkypackParseResult> {
  readonly type = registryType

  check(url: string): boolean {
    return /^https?:\/\/cdn\.skypack\.dev\//.test(url)
  }

  /**
   *
   * @param url ex. https://cdn.skypack.dev/@vue/reactivity@3.2.1?dts
   * @returns
   */
  parse(url: string): SkypackParseResult {
    const u = new URL(url)
    const result: SkypackParseResult = {
      mod: '',
      version: '',
      entry: '',
      type: registryType,
    }

    const [_, ...segments] = u.pathname.split('/')

    const isScoped = segments[0].startsWith('@')

    if (isScoped) {
      const [scope, modAndVersion, ...entries] = segments

      const [mod, version = ''] = modAndVersion.split('@')
      result.mod = `${scope}/${mod}`
      result.version = version
      result.entry = entries.join('/')
    } else {
      const [modAndVersion, ...entries] = segments

      const [mod, version = ''] = modAndVersion.split('@')
      result.mod = mod
      result.version = version
      result.entry = entries.join('/')
    }

    result.entry += u.search

    if (!result.mod) {
      throw new Error(`Parse error: ${url}`)
    }

    return result
  }

  generate(opt: SkypackParseResult): string {
    const { version, mod, entry } = opt

    return [`https://cdn.skypack.dev/${mod}@${version}`, entry]
      .filter(Boolean)
      .join('/')
  }

  /**
   *
   * @param opt
   * @returns
   */
  async versions(opt: SkypackParseResult): Promise<string[]> {
    const queryTagsUrl = `https://api.skypack.dev/v1/package/${opt.mod}`
    const res = await fetch(queryTagsUrl)

    if (res.status !== 200) {
      throw new Error(`Can not find mod ${opt.mod} at ${queryTagsUrl}`)
    }

    const r: SkypackFetchTag = await res.json()

    return Object.keys(r.versions)
  }
}

interface SkypackFetchTag {
  /**
   * version => publish date
   */
  versions: Record<string, string>
}
