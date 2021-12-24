import { assertEquals } from 'testing/asserts.ts'
import { getLatestVersion } from './utils.ts'

Deno.test('getLatestVersion', () => {
  assertEquals(getLatestVersion('0.1.0', ['0.2.0', '0.1.5']), '0.1.5')

  assertEquals(getLatestVersion('', ['0.2.0', '0.1.5']), '0.2.0')
})
