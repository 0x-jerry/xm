import { Command, EnumType } from 'cliffy/command/mod.ts'
import { importConfig } from '../importConfig.ts'
import {
  registryManager,
  registryTypes,
  UpgradeModOption,
} from '../registry/mod.ts'

const registryType = new EnumType(registryTypes)

export const upgradeCommand = new Command()
  .alias('up')
  .description('Upgrade module.')
  .type('registry', registryType)
  .example('Upgrade with github', 'xm upgrade -r github username/repo')
  .example('Install with deno.land', 'xm upgrade mod')
  .arguments('[modName:string]')
  .option('-L, --latest', 'upgrade to latest version.')
  .action(async (opt, modName) => {
    if (modName) {
      await upgradeMod(modName, opt)
    } else {
      const mods = Object.keys(importConfig.mods)

      for (let index = 0; index < mods.length; index++) {
        const mod = mods[index]
        try {
          await upgradeMod(mod, opt)
        } catch (error) {
          console.error(error)
        }
      }
    }

    await importConfig.save()
  })

async function upgradeMod(modName: string, opt: UpgradeModOption) {
  const upgradeModOpt = getUpgradeOption(modName)

  if (!upgradeModOpt) {
    throw new Error('Can not find mod: ' + modName)
  }

  const conf = await registryManager.upgrade(upgradeModOpt.opt, opt)

  importConfig.set(upgradeModOpt.name, conf.url)
}

function getUpgradeOption(modName: string) {
  if (modName in importConfig.mods) {
    const uri = importConfig.mods[modName]
    const type = registryManager.getType(uri)

    if (!type) {
      throw new Error('Register is not support. ' + uri)
    }

    const opt = registryManager.parse(uri, type)

    console.log('upgrade mod', modName, 'success')
    return {
      name: modName,
      opt,
    }
  }

  for (const mod in importConfig.mods) {
    const uri = importConfig.mods[mod]
    const type = registryManager.getType(uri)
    if (!type) {
      // Register is not support, ignored.
      continue
    }

    const opt = registryManager.parse(uri, type)

    if (opt.mod !== modName) {
      continue
    }

    console.log('upgrade mod', modName, 'success')

    return {
      name: mod,
      opt,
    }
  }
}
