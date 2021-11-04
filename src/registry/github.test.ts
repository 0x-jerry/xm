import { assertEquals } from 'testing/asserts.ts'
import { GithubProvider } from './github.ts'

const p = new GithubProvider()

Deno.test('parse', () => {
  const r = p.parse('https://raw.githubusercontent.com/0x-jerry/d-lib/v0.1.3/')

  assertEquals(r, {
    type: p.type,
    username: '0x-jerry',
    repo: 'd-lib',
    version: 'v0.1.3',
  })
})

Deno.test('parse mod', () => {
  const m = p.parseMod('0x-jerry1/testing@0.111.0')

  assertEquals(m, {
    type: p.type,
    username: '0x-jerry1',
    repo: 'testing',
    version: '0.111.0',
  })
})

Deno.test('generate', () => {
  const r = p.generate({
    type: p.type,
    username: '0x-jerry2',
    repo: 'xxx',
    version: '0.1.3',
  })

  assertEquals(r, 'https://raw.githubusercontent.com/0x-jerry2/xxx/0.1.3/')
})
