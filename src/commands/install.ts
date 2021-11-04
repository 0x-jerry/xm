import { Command, EnumType } from 'cliffy/command/mod.ts'
import { importConfig } from '../importConfig.ts'
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
  .arguments('<modName:string>')
  .action(async (opt, modName) => {
    const { registry } = opt

    const m = await registryManager.install(modName, registry)
    importConfig.set(m.name, m.url)

    await importConfig.save()
  })
