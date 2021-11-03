import { RegistryProvider } from './type.ts'

const registryType = 'deno.land'

interface DenoStdParseResult {
  type: typeof registryType
  mod: string
  version: string
}

export class DenoStdProvider implements RegistryProvider<DenoStdParseResult> {
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
    const r = /^https?:\/\/deno\.land\/std@(?<version>[^/]+)\/(?<mod>[^/]+)\//

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
  parseMod(modName: string): DenoStdParseResult {
    const [mod, version] = modName.split('@')

    return {
      type: registryType,
      version,
      mod,
    }
  }

  generate(opt: DenoStdParseResult): string {
    const { version, mod } = opt

    return `https://deno.land/std@${version}/${mod}/`
  }

  async versions(opt: DenoStdParseResult): Promise<string[]> {
    const res = await fetch(
      `https://cdn.deno.land/${opt.mod}/meta/versions.json`,
    )

    const r = await res.json()

    return r.versions
  }
}
