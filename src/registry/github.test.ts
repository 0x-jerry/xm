import { assertEquals } from 'testing/asserts.ts'
import { GithubProvider } from './github.ts'

const p = new GithubProvider()

Deno.test('parse', () => {
  const r = p.parse('https://raw.githubusercontent.com/0x-jerry/d-lib/v0.1.3/')

  assertEquals(r, {
    type: p.type,
    username: '0x-jerry',
    mod: 'd-lib',
    version: 'v0.1.3',
    entry: '/',
  })
})

Deno.test('parse with entry', () => {
  const r = p.parse(
    'https://raw.githubusercontent.com/0x-jerry/d-lib/v0.1.3/xxx/mod.ts',
  )

  assertEquals(r, {
    type: p.type,
    username: '0x-jerry',
    mod: 'd-lib',
    version: 'v0.1.3',
    entry: '/xxx/mod.ts',
  })
})

Deno.test('parse mod', () => {
  const m = p.parseMod('0x-jerry1/testing@0.111.0')

  assertEquals(m, {
    type: p.type,
    username: '0x-jerry1',
    mod: 'testing',
    version: '0.111.0',
    entry: '',
  })
})

Deno.test('parse mod without version', () => {
  const m = p.parseMod('0x-jerry1/testing/xx/mod.ts')

  assertEquals(m, {
    type: p.type,
    username: '0x-jerry1',
    mod: 'testing',
    version: '',
    entry: '/xx/mod.ts',
  })
})

Deno.test('parse mod with entry', () => {
  const m = p.parseMod('0x-jerry1/testing@0.111.0/xxx/mod.ts')

  assertEquals(m, {
    type: p.type,
    username: '0x-jerry1',
    mod: 'testing',
    version: '0.111.0',
    entry: '/xxx/mod.ts',
  })
})

Deno.test('generate', () => {
  const r = p.generate({
    type: p.type,
    username: '0x-jerry2',
    mod: 'xxx',
    version: '0.1.3',
    entry: '',
  })

  assertEquals(r, 'https://raw.githubusercontent.com/0x-jerry2/xxx/0.1.3')
})

Deno.test('generate with entry', () => {
  const r = p.generate({
    type: p.type,
    username: '0x-jerry2',
    mod: 'xxx',
    version: '0.1.3',
    entry: '/x/mod.ts',
  })

  assertEquals(
    r,
    'https://raw.githubusercontent.com/0x-jerry2/xxx/0.1.3/x/mod.ts',
  )
})
