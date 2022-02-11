import { RegistryProvider } from './RegistryProvider.ts'
import { ModVersions, RegistryOption } from './type.ts'

const registryType = 'deno'

interface DenoParseResult extends RegistryOption {
  type: typeof registryType
}

export class DenoProvider extends RegistryProvider<DenoParseResult> {
  readonly type = registryType

  check(url: string): boolean {
    return /^https:?\/\/deno\.land\/x\//.test(url)
  }

  /**
   *
   * @param url ex. https://deno.land/x/cliffy@v0.20.1/
   * @returns
   */
  parse(url: string): DenoParseResult {
    const r =
      /^https?:\/\/deno\.land\/x\/(?<mod>[^@]+)@(?<version>[^/]+)(?<entry>.*)/

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
  parseMod(modName: string): DenoParseResult {
    const opt = super.parseMod(modName)

    return {
      ...opt,
      type: registryType,
    }
  }

  generate(opt: DenoParseResult): string {
    const { version, mod, entry } = opt

    return `https://deno.land/x/${mod}@${version}${entry}`
  }

  async versions(opt: DenoParseResult): Promise<ModVersions> {
    const res = await fetch(
      `https://cdn.deno.land/${opt.mod}/meta/versions.json`,
    )

    if (res.status !== 200) {
      throw new Error(
        `Can not find mod ${opt.mod} at https://deno.land/x/${opt.mod}`,
      )
    }

    const r: DenoXFetchResult = await res.json()

    return r
  }
}

interface DenoXFetchResult {
  latest: string
  versions: string[]
}
