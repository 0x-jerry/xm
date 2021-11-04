import { assertEquals } from 'testing/asserts.ts'
import { DenoProvider } from './denox.ts'

const p = new DenoProvider()

Deno.test('parse', () => {
  const r = p.parse('https://deno.land/x/cliffy@v0.20.1/')

  assertEquals(r, {
    mod: 'cliffy',
    version: 'v0.20.1',
    type: p.type,
  })
})

Deno.test('parse mod', () => {
  const m = p.parseMod('testing@0.111.0')

  assertEquals(m, {
    mod: 'testing',
    version: '0.111.0',
    type: p.type,
  })
})

Deno.test('generate', () => {
  const r = p.generate({
    mod: 'cliffy1',
    version: '0.111.0',
    type: p.type,
  })

  assertEquals(r, 'https://deno.land/x/cliffy1@0.111.0/')
})
