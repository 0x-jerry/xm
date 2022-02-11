import { assertEquals } from 'testing/asserts.ts'
import { getLatestCompatibleVersion } from './utils.ts'

Deno.test('getLatestVersion', () => {
  assertEquals(getLatestCompatibleVersion('0.1.0', ['0.2.0', '0.1.5']), '0.1.5')

  assertEquals(getLatestCompatibleVersion('', ['0.2.0', '0.1.5']), '0.2.0')
})
