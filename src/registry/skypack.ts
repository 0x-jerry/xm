import { RegistryProvider } from './RegistryProvider.ts'
import { RegistryOption, ModVersions } from './type.ts'

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
   * @param modName
   */
  parseMod(modName: string): SkypackParseResult {
    const opt = super.parseMod(modName)

    return {
      ...opt,
      type: registryType,
    }
  }

  /**
   *
   * @param url ex. https://cdn.skypack.dev/@vue/reactivity@3.2.1?dts
   * @returns
   */
  parse(url: string): SkypackParseResult {
    return this.parseMod(url)
  }

  generate(opt: SkypackParseResult): string {
    const { version, mod, entry } = opt

    return `https://cdn.skypack.dev/${mod}@${version}${entry}`
  }

  /**
   *
   * @param opt
   * @returns
   */
  async versions(opt: SkypackParseResult): Promise<ModVersions> {
    const queryTagsUrl = `https://api.skypack.dev/v1/package/${opt.mod}`
    const res = await fetch(queryTagsUrl)

    if (res.status !== 200) {
      throw new Error(`Can not find mod ${opt.mod} at ${queryTagsUrl}`)
    }

    const r: SkypackFetchTag = await res.json()

    return {
      latest: r.distTags.latest,
      versions: Object.keys(r.versions),
    }
  }
}

interface SkypackFetchTag {
  /**
   * version => publish date
   */
  versions: Record<string, string>

  distTags: {
    latest: string
  }
}
