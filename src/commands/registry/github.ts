import { RegistryProvider } from './type.ts'

const registryType = 'github'

interface GithubParseResult {
  type: typeof registryType
  repo: string
  username: string
  version: string
}

export class GithubProvider implements RegistryProvider<GithubParseResult> {
  readonly type = registryType

  check(url: string): boolean {
    return /^https?:\/\/raw\.githubusercontent\.com\//.test(url)
  }

  /**
   *
   * @param url ex. https://raw.githubusercontent.com/0x-jerry/d-lib/v0.1.3/mod.ts
   * @returns
   */
  parse(url: string): GithubParseResult {
    const r =
      /^https?:\/\/raw\.githubusercontent\.com\/(?<username>[^/]+)\/(?<repo>[^/]+)\/(?<version>[^/]+)\//

    const group = r.exec(url)?.groups || {}

    if (!group.repo) {
      throw new Error(`Parse error: ${url}`)
    }

    return {
      repo: '',
      username: '',
      version: '',
      ...group,
      type: registryType,
    }
  }

  /**
   * ex.
   *
   * - username/repo@version
   * - username/repo
   *
   * @param mod
   */
  parseMod(mod: string): GithubParseResult {
    const [prefix, version] = mod.split('@')
    const [username, repo] = prefix.split('/')

    return {
      type: registryType,
      version,
      username,
      repo,
    }
  }

  generate(opt: GithubParseResult): string {
    const { version, repo, username } = opt

    return `https://raw.githubusercontent.com/${username}/${repo}/${version}/`
  }
}
