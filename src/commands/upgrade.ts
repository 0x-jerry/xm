import { Command, EnumType } from 'cliffy/command/mod.ts'
import { debug } from '../debug.ts'
import { importConfig } from '../importConfig.ts'
import { registryManager, registryTypes } from '../registry/mod.ts'

const registryType = new EnumType(registryTypes)

export const upgradeCommand = new Command()
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

    const modOpt = registryManager.parseMod(pkgName, registry)

    const upgradeModOpt = getUpgradeOption(modOpt.mod)
    if (!upgradeModOpt) {
      throw new Error('Failed to parse mod: ' + pkgName)
    }

    const conf = await registryManager.upgrade(upgradeModOpt.opt)

    importConfig.set(upgradeModOpt.name, conf.url)

    await importConfig.save()
  })

function getUpgradeOption(modName: string) {
  for (const mod in importConfig.mods) {
    if (Object.prototype.hasOwnProperty.call(importConfig.mods, mod)) {
      const uri = importConfig.mods[mod]
      const type = registryManager.getType(uri)
      if (!type) {
        debug.warn('Parse type failed:', uri)
        continue
      }

      const opt = registryManager.parse(uri, type)

      if (opt.mod === modName) {
        return {
          name: mod,
          opt,
        }
      }
    }
  }
}
