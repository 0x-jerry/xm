import { RegistryOption, RegistryProvider } from './type.ts'

const registryType = 'denoStd'

interface DenoStdParseResult extends RegistryOption {
  type: typeof registryType
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
    const r =
      /^https?:\/\/deno\.land\/std@(?<version>[^/]+)\/(?<mod>[^/]+)\/(?<entry>.*)/

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
    const [mod, suffix] = modName.split('@')
    const [version, ...entry] = suffix.split('/')

    return {
      type: registryType,
      version,
      mod,
      entry: entry.join('/'),
    }
  }

  generate(opt: DenoStdParseResult): string {
    const { version, mod, entry } = opt

    return `https://deno.land/std@${version}/${mod}/${entry}`
  }

  async versions(opt: DenoStdParseResult): Promise<string[]> {
    const res = await fetch(`https://cdn.deno.land/std/meta/versions.json`)

    const r = await res.json()

    return r.versions
  }
}