import { assertEquals } from 'testing/asserts.ts'
import { DenoStdProvider } from './deno.ts'

const p = new DenoStdProvider()

Deno.test('parse url', () => {
  const r = p.parse('https://deno.land/std@0.113.0/fmt/')

  assertEquals(r, {
    mod: 'fmt',
    version: '0.113.0',
    type: p.type,
    entry: '/',
  })
})

Deno.test('parse url with entry', () => {
  const r = p.parse('https://deno.land/std@0.113.0/fmt/xx/mod.ts')

  assertEquals(r, {
    mod: 'fmt',
    version: '0.113.0',
    type: p.type,
    entry: '/xx/mod.ts',
  })
})

Deno.test('parse mod name', () => {
  const m = p.parseMod('testing@0.111.0')

  assertEquals(m, {
    mod: 'testing',
    version: '0.111.0',
    type: p.type,
    entry: '',
  })
})

Deno.test('parse mod name without version', () => {
  const m = p.parseMod('testing/xx/mod.ts')

  assertEquals(m, {
    mod: 'testing',
    version: '',
    type: p.type,
    entry: '/xx/mod.ts',
  })
})

Deno.test('parse mod name with entry', () => {
  const m = p.parseMod('testing@0.111.0/xx/mod.ts')

  assertEquals(m, {
    mod: 'testing',
    version: '0.111.0',
    type: p.type,
    entry: '/xx/mod.ts',
  })
})

Deno.test('generate', () => {
  const r = p.generate({
    mod: 'testing',
    version: '0.111.0',
    type: p.type,
    entry: '',
  })

  assertEquals(r, 'https://deno.land/std@0.111.0/testing')
})

Deno.test('generate with entry', () => {
  const r = p.generate({
    mod: 'testing',
    version: '0.111.0',
    type: p.type,
    entry: '/xx/mod.ts',
  })

  assertEquals(r, 'https://deno.land/std@0.111.0/testing/xx/mod.ts')
})
