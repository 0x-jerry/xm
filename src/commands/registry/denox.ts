import { RegistryProvider } from './type.ts'

const registryType = 'deno'

interface DenoParseResult {
  type: typeof registryType
  mod: string
  version: string
}

export class DenoProvider implements RegistryProvider<DenoParseResult> {
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
    const r = /^https?:\/\/deno\.land\/x\/(?<mod>[^@]+)@(?<version>[^/]+)\//

    const group = r.exec(url)?.groups || {}

    if (!group.mod) {
      throw new Error(`Parse error: ${url}`)
    }

    return {
      mod: '',
      version: '',
      ...group,
      type: registryType,
    }
  }

  /**
   * ex.
   *
   * - mod@version
   * - mod
   *
   * @param modName
   */
  parseMod(modName: string): DenoParseResult {
    const [mod, version] = modName.split('@')

    return {
      type: registryType,
      version,
      mod,
    }
  }

  generate(opt: DenoParseResult): string {
    const { version, mod } = opt

    return `https://deno.land/x/${mod}@${version}/`
  }

  async versions(opt: DenoParseResult): Promise<string[]> {
    const res = await fetch(
      `https://cdn.deno.land/${opt.mod}/meta/versions.json`,
    )

    if (res.status !== 200) {
      throw new Error(
        `Can not find mod ${opt.mod} at https://deno.land/x/${opt.mod}`,
      )
    }

    const r: DenoFetchResult = await res.json()

    return r.versions
  }
}

interface DenoFetchResult {
  latest: string
  versions: string[]
}
