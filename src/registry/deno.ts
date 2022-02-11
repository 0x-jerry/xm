import { ModVersions, RegistryOption } from './type.ts'
import { RegistryProvider } from './RegistryProvider.ts'

const registryType = 'denoStd'

interface DenoStdParseResult extends RegistryOption {
  type: typeof registryType
}

export class DenoStdProvider extends RegistryProvider<DenoStdParseResult> {
  readonly type = registryType

  check(url: string): boolean {
    return /^https:?\/\/deno\.land\/std/.test(url)
  }

  /**
   *
   * @param url ex. https://deno.land/std@0.113.0/fmt/
   * @returns
   */
  parse(url: string): DenoStdParseResult {
    const r =
      /^https?:\/\/deno\.land\/std@(?<version>[^/]+)\/(?<mod>[^/]+)(?<entry>.*)/

    const group = r.exec(url)?.groups || {}

    if (!group.mod) {
      throw new Error(`Parse error: ${url}`)
    }

    return {
      mod: '',
      version: '',
      entry: '',
      ...group,
      type: registryType,
    }
  }

  /**
   * ex.
   *
   * - mod@version/mod.ts
   * - mod@version
   * - mod
   *
   * @param modName
   */
  parseMod(modName: string): DenoStdParseResult {
    const opt = super.parseMod(modName)

    return {
      ...opt,
      type: registryType,
    }
  }

  generate(opt: DenoStdParseResult): string {
    const { version, mod, entry } = opt

    return `https://deno.land/std@${version}/${mod}${entry}`
  }

  async versions(opt: DenoStdParseResult): Promise<ModVersions> {
    const res = await fetch(`https://cdn.deno.land/std/meta/versions.json`)

    const r: DenoFetchResult = await res.json()

    return r
  }
}

interface DenoFetchResult {
  latest: string
  versions: string[]
}
