import { Command, EnumType } from 'cliffy/command/mod.ts'
import { importMap } from '../importMap.ts'
import { registryManager, registryTypes } from '../registry/mod.ts'

const registryType = new EnumType(registryTypes)

export const installCommand = new Command()
  .alias('i')
  .description('Install module.')
  .type('registry', registryType)
  .example('Install with github', 'xm install -r github username/repo')
  .example('Install with deno.land', 'xm install mod')
  .option('-r, --registry <type:registry>', 'Registry type.', {
    default: 'deno',
  })
  .arguments('<pkgName:string>')
  .action(async (opt, pkgName) => {
    const { registry } = opt

    const m = await registryManager.install(pkgName, registry)
    importMap.set(m.name, m.url)
    console.log(importMap.mods)
    // save
  })
