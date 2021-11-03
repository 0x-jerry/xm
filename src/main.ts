import { Command, HelpCommand, CompletionsCommand } from 'cliffy/command/mod.ts'
import { UpgradeCommand } from 'cliffy/command/upgrade/mod.ts'
import { GithubProvider } from 'cliffy/command/upgrade/provider/github.ts'
import { version } from '../version.ts'
import { config } from './config.ts'
import { debug } from './debug.ts'
import { installCommand } from './commands/install.ts'

const xm = new Command()
  .name('xm')
  .version(version)
  .globalOption('-d, --debug', 'Enable debug mode.', (val) => {
    val = !!val

    config.debug = val

    return val
  })
  .description('Some useful command for myself.')
  .default('help')
  // help
  .command('help', new HelpCommand())

  // completion
  .command('completions', new CompletionsCommand())
  // upgrade
  .command(
    'upgrade',
    new UpgradeCommand({
      main: 'xm.ts',
      importMap: 'import_map.json',
      args: ['-A', '--no-check', '--unstable'],
      provider: new GithubProvider({
        repository: '0x-jerry/xm',
      }),
    }),
  )
  .command('install', installCommand)

// parse
try {
  const params = Deno.args

  await xm.parse(params)
} catch (e) {
  debug.error(e)
}
