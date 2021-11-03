import { RegistryProvider } from './type.ts'

const registryType = 'github'

interface GithubParseResult {
  type: typeof registryType
  /**
   * repo
   */
  mod: string
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
      mod: '',
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
      mod: repo,
    }
  }

  generate(opt: GithubParseResult): string {
    const { version, mod, username } = opt

    return `https://raw.githubusercontent.com/${username}/${mod}/${version}/`
  }

  /**
   *
   * @param opt
   * @returns
   */
  async versions(opt: GithubParseResult): Promise<string[]> {
    const res = await fetch(
      `https://api.github.com/repos/${opt.username}/${opt.mod}/tags`,
    )

    if (res.status !== 200) {
      throw new Error(
        `Can not find mod ${opt.mod} at https://github.com/${opt.username}/${opt.mod}`,
      )
    }

    const r: GithubFetchTag[] = await res.json()

    return r.map((i) => i.name)
  }
}

interface GithubFetchTag {
  name: string
  zipball_url: string
  tarball_url: string
  commit: {
    sha: string
    url: string
  }
  node_id: string
}
