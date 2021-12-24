import { assertEquals } from 'testing/asserts.ts'
import { DenoProvider } from './denox.ts'

const p = new DenoProvider()

Deno.test('parse', () => {
  const r = p.parse('https://deno.land/x/cliffy@v0.20.1/')

  assertEquals(r, {
    mod: 'cliffy',
    version: 'v0.20.1',
    type: p.type,
    entry: '/',
  })
})

Deno.test('parse with entry', () => {
  const r = p.parse('https://deno.land/x/cliffy@v0.20.1/xxx/mod.ts')

  assertEquals(r, {
    mod: 'cliffy',
    version: 'v0.20.1',
    type: p.type,
    entry: '/xxx/mod.ts',
  })
})

Deno.test('parse mod', () => {
  const m = p.parseMod('testing@0.111.0')

  assertEquals(m, {
    mod: 'testing',
    version: '0.111.0',
    type: p.type,
    entry: '',
  })
})

Deno.test('parse mod without version', () => {
  const m = p.parseMod('testing/xx/mod.ts')

  assertEquals(m, {
    mod: 'testing',
    version: '',
    type: p.type,
    entry: '/xx/mod.ts',
  })
})

Deno.test('parse mod with entry', () => {
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
    mod: 'cliffy1',
    version: '0.111.0',
    type: p.type,
    entry: '',
  })

  assertEquals(r, 'https://deno.land/x/cliffy1@0.111.0')
})

Deno.test('generate with entry', () => {
  const r = p.generate({
    mod: 'cliffy1',
    version: '0.111.0',
    type: p.type,
    entry: '/x/mod.ts',
  })

  assertEquals(r, 'https://deno.land/x/cliffy1@0.111.0/x/mod.ts')
})
