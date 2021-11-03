import { assertEquals } from 'testing/asserts.ts'
import { DenoStdProvider } from './deno.ts'

const p = new DenoStdProvider()

Deno.test('parse', () => {
  const r = p.parse('https://deno.land/std@0.113.0/fmt/')

  assertEquals(r, {
    mod: 'fmt',
    version: '0.113.0',
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
    mod: 'testing',
    version: '0.111.0',
    type: p.type,
  })

  assertEquals(r, 'https://deno.land/std@0.111.0/testing/')
})
