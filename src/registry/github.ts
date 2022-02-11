import { RegistryProvider } from './RegistryProvider.ts'
import { ModVersions, RegistryOption } from './type.ts'

const registryType = 'github'

interface GithubParseResult extends RegistryOption {
  type: typeof registryType
  /**
   * repo
   */
  mod: string
  username: string
}

export class GithubProvider extends RegistryProvider<GithubParseResult> {
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
      /^https?:\/\/raw\.githubusercontent\.com\/(?<username>[^/]+)\/(?<mod>[^/]+)\/(?<version>[^/]+)(?<entry>.*)/

    const group = r.exec(url)?.groups || {}

    if (!group.mod) {
      throw new Error(`Parse error: ${url}`)
    }

    return {
      mod: '',
      username: '',
      version: '',
      entry: '',
      ...group,
      type: registryType,
    }
  }

  /**
   * ex.
   *
   * - username/repo@version/mod.ts
   * - username/repo@version
   * - username/repo
   *
   * @param mod
   */
  parseMod(mod: string): GithubParseResult {
    // username/repo@version/mod.ts  => @username/repo@version/mod.ts
    const opt = super.parseMod('@' + mod)

    const [username, repo] = opt.mod.slice(1).split('/')

    return {
      ...opt,
      username,
      mod: repo,
      type: registryType,
    }
  }

  generate(opt: GithubParseResult): string {
    const { version, mod, username, entry } = opt

    return `https://raw.githubusercontent.com/${username}/${mod}/${version}${entry}`
  }

  /**
   *
   * @param opt
   * @returns
   */
  async versions(opt: GithubParseResult): Promise<ModVersions> {
    const res = await fetch(
      `https://api.github.com/repos/${opt.username}/${opt.mod}/tags`,
    )

    if (res.status !== 200) {
      throw new Error(
        `Can not find mod ${opt.mod} at https://github.com/${opt.username}/${opt.mod}`,
      )
    }

    const r: GithubFetchTag[] = await res.json()

    const versions = r.map((i) => i.name)

    return {
      latest: versions[0] || '',
      versions,
    }
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
