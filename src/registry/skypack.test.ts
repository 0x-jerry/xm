import { assertEquals } from 'testing/asserts.ts'
import { SkypackProvider } from './skypack.ts'

const p = new SkypackProvider()

Deno.test('parse', () => {
  const r = p.parse('https://cdn.skypack.dev/@vue/reactivity@3.2.1?dts')

  assertEquals(r, {
    type: p.type,
    mod: '@vue/reactivity',
    version: '3.2.1',
    entry: '?dts',
  })
})

Deno.test('parse without version', () => {
  const r = p.parse('https://cdn.skypack.dev/reactivity?dts')

  assertEquals(r, {
    type: p.type,
    mod: 'reactivity',
    version: '',
    entry: '?dts',
  })
})

Deno.test('parse with entry', () => {
  const r = p.parse('https://cdn.skypack.dev/@vue/reactivity@3.2.1/ref?dts')

  assertEquals(r, {
    type: p.type,
    mod: '@vue/reactivity',
    version: '3.2.1',
    entry: '/ref?dts',
  })
})

Deno.test('generate', () => {
  const r = p.generate({
    type: p.type,
    mod: 'xxx',
    version: '0.1.3',
    entry: '',
  })

  assertEquals(r, 'https://cdn.skypack.dev/xxx@0.1.3')
})

Deno.test('generate with entry', () => {
  const r = p.generate({
    type: p.type,
    mod: 'xxx',
    version: '0.1.3',
    entry: '/x/mod.ts?dts',
  })

  assertEquals(r, 'https://cdn.skypack.dev/xxx@0.1.3/x/mod.ts?dts')
})
