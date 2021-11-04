import { Command, EnumType } from 'cliffy/command/mod.ts'
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

    const m = await registryManager.upgrade(pkgName, registry)
    importMap.set(m.name, m.url)
    // save
  })
