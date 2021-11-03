import { Command, EnumType } from 'cliffy/command/mod.ts'
import { importMap } from '../importMap.ts'

const registryType = new EnumType(['deno', 'github'])

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
  .action((opt, pkgName) => {
    const { registry } = opt

    console.log(importMap)
    console.log(registry, pkgName)
  })
