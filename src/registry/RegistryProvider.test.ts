import { RegistryProvider } from './RegistryProvider.ts'
import { ModVersions, RegistryOption } from './type.ts'

import { assertEquals } from 'testing/asserts.ts'

class TestProvider extends RegistryProvider {
  type: string = ''

  check(url: string): boolean {
    throw new Error('Method not implemented.')
  }
  parse(url: string): RegistryOption {
    throw new Error('Method not implemented.')
  }
  generate(opt: RegistryOption): string {
    throw new Error('Method not implemented.')
  }
  versions(opt: RegistryOption): Promise<ModVersions> {
    throw new Error('Method not implemented.')
  }
}

const p = new TestProvider()

Deno.test('parse mod name with entry', () => {
  let r = p.parseMod('@scope/mod@version/entry.ts?dts')
  assertEquals(r, {
    type: '',
    version: 'version',
    mod: '@scope/mod',
    entry: '/entry.ts?dts',
  })

  r = p.parseMod('@scope/mod@version/xx/entry.ts?dts')
  assertEquals(r, {
    type: '',
    version: 'version',
    mod: '@scope/mod',
    entry: '/xx/entry.ts?dts',
  })

  r = p.parseMod('@scope/mod@version/?dts')
  assertEquals(r, {
    type: '',
    version: 'version',
    mod: '@scope/mod',
    entry: '/?dts',
  })

  r = p.parseMod('@scope/mod@version?dts')

  assertEquals(r, {
    type: '',
    version: 'version',
    mod: '@scope/mod',
    entry: '?dts',
  })
})

Deno.test('parse mod name without entry', () => {
  let r = p.parseMod('@scope/mod@version')

  assertEquals(r, {
    type: '',
    version: 'version',
    mod: '@scope/mod',
    entry: '',
  })

  r = p.parseMod('@scope/mod')

  assertEquals(r, {
    type: '',
    version: '',
    mod: '@scope/mod',
    entry: '',
  })

  r = p.parseMod('mod@version')

  assertEquals(r, {
    type: '',
    version: 'version',
    mod: 'mod',
    entry: '',
  })

  r = p.parseMod('mod')

  assertEquals(r, {
    type: '',
    version: '',
    mod: 'mod',
    entry: '',
  })
})
