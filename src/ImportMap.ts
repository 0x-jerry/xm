import { debug } from './debug.ts'
import { join } from 'path/mod.ts'

export class ImportMap {
  #maps: Record<string, string> = {}

  constructor(public readonly path: string) {
    this.#maps = this.#read()
  }

  #read() {
    try {
      Deno.statSync(this.path)
      const txt = Deno.readTextFileSync(this.path)
      return JSON.parse(txt).imports || {}
    } catch (error) {
      debug.warn('Parse import map', this.path, 'failed.', error)
      return {}
    }
  }

  get(name: string): string | undefined {
    return this.#maps[name]
  }

  set(name: string, url: string) {
    this.#maps[name] = url
  }

  async save() {
    const txt = JSON.stringify(
      {
        imports: this.#maps,
      },
      null,
      2,
    )

    await Deno.writeTextFile(this.path, txt)
  }
}

export const importMap = new ImportMap(join(Deno.cwd(), 'import_map.json'))
