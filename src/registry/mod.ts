import { RegistryProvider } from './type.ts'
import { GithubProvider } from './github.ts'
import { DenoStdProvider } from './deno.ts'
import { DenoProvider } from './denox.ts'

const providersMap = {
  github: new GithubProvider(),
  deno: new DenoProvider(),
  denoStd: new DenoStdProvider(),
}

const providers = Object.values(providersMap)

export const registryTypes = providers.map((n) => n.type)

type RegistryType = typeof registryTypes[number]

export interface ModConfig {
  name: string
  url: string
}

export class Registry {
  getProvider(type: RegistryType): RegistryProvider {
    return providersMap[type]
  }

  /**
   *
   * @param mod
   * ex.
   *
   * deno - mod@version
   *
   * github - username/repo@version
   */
  async upgrade(mod: string, type: RegistryType): Promise<ModConfig> {
    const provider = this.getProvider(type)

    const opt = provider.parseMod(mod)

    const versions = await provider.versions(opt)
    opt.version = versions[0]

    const url = provider.generate(opt)

    return {
      name: opt.mod,
      url,
    }
  }

  async install(mod: string, type: RegistryType): Promise<ModConfig> {
    const provider: RegistryProvider = providersMap[type]

    const opt = provider.parseMod(mod)

    if (!opt.version) {
      const versions = await provider.versions(opt)
      opt.version = versions[0]
    }

    const url = provider.generate(opt)

    return {
      name: opt.mod,
      url,
    }
  }
}

export const registryManager = new Registry()
