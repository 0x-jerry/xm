import { RegistryProvider } from './RegistryProvider.ts'
import { RegistryOption } from './type.ts'
import { GithubProvider } from './github.ts'
import { DenoStdProvider } from './deno.ts'
import { DenoProvider } from './denox.ts'
import { SkypackProvider } from './skypack.ts'
import { getLatestCompatibleVersion } from './utils.ts'

const providersMap = {
  github: new GithubProvider(),
  deno: new DenoProvider(),
  denoStd: new DenoStdProvider(),
  skypack: new SkypackProvider(),
}

const providers = Object.values(providersMap)

export const registryTypes = providers.map((n) => n.type)

type RegistryType = typeof registryTypes[number]

export interface ModConfig {
  name: string
  url: string
}

export interface UpgradeModOption {
  /**
   * @default false
   */
  latest: boolean
}

export class Registry {
  #toImportOpt(name: string, url: string) {
    if (url.endsWith('/')) {
      return {
        name: `${name}/`,
        url,
      }
    }

    return {
      name,
      url,
    }
  }

  #getProvider(type: RegistryType): RegistryProvider {
    return providersMap[type]
  }

  getType(uri: string): RegistryType | false {
    for (const p of providers) {
      if (p.check(uri)) {
        return p.type
      }
    }

    return false
  }

  parseMod(mod: string, type: RegistryType): RegistryOption {
    return this.#getProvider(type).parseMod(mod)
  }

  parse(url: string, type: RegistryType): RegistryOption {
    return this.#getProvider(type).parse(url)
  }

  async upgrade(
    opt: RegistryOption,
    cmdOpt: UpgradeModOption,
  ): Promise<ModConfig> {
    // @ts-ignore
    const provider = this.#getProvider(opt.type)

    const versions = await provider.versions(opt)

    opt.version = cmdOpt.latest
      ? versions.latest
      : getLatestCompatibleVersion(opt.version, versions.versions)

    const uri = provider.generate(opt)

    return this.#toImportOpt(opt.mod, uri)
  }

  async install(mod: string, type: RegistryType): Promise<ModConfig> {
    const provider: RegistryProvider = providersMap[type]

    const opt = provider.parseMod(mod)

    if (!opt.version) {
      const versions = await provider.versions(opt)
      opt.version = versions.latest
    }

    const url = provider.generate(opt)

    return this.#toImportOpt(opt.mod, url)
  }
}

export const registryManager = new Registry()
