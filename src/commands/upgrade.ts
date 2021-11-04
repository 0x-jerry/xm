import { Command, EnumType } from 'cliffy/command/mod.ts'
import { debug } from '../debug.ts'
import { importMap } from '../importMap.ts'
import { registryManager, registryTypes } from '../registry/mod.ts'

const registryType = new EnumType(registryTypes)

export const updateCommand = new Command()
  .alias('up')
  .description('Upgrade module.')
  .type('registry', registryType)
  .example('Upgrade with github', 'xm upgrade -r github username/repo')
  .example('Install with deno.land', 'xm upgrade mod')
  .option('-r, --registry <type:registry>', 'Registry type.', {
    default: 'deno',
  })
  .arguments('<pkgName:string>')
  .action(async (opt, pkgName) => {
    const { registry } = opt

    const modOpt = registryManager.parse(pkgName, registry)

    const upgradeModOpt = getUpgradeOption(modOpt.mod)
    if (!upgradeModOpt) {
      throw new Error('Failed to parse mod:', pkgName)
    }

    const conf = await registryManager.upgrade(upgradeModOpt.opt)

    console.log(conf, upgradeModOpt)

    // importMap.set(m.name, m.url)
    // save
  })

function getUpgradeOption(modName: string) {
  for (const mod in importMap.mods) {
    if (Object.prototype.hasOwnProperty.call(importMap.mods, mod)) {
      const uri = importMap.mods[mod]
      const type = registryManager.getType(uri)
      if (!type) {
        debug.warn('Parse type failed:', uri)
        continue
      }

      const opt = registryManager.parse(uri, type)

      if (opt.mod === modName) {
        return {
          mod,
          opt,
        }
      }
    }
  }
}
