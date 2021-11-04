import { debug } from './debug.ts'
import { join } from 'path/mod.ts'
import { exists } from 'fs/mod.ts'
import { Confirm } from 'cliffy/prompt/confirm.ts'

export class ImportConfig {
  #mods: Record<string, string> = {}

  get mods() {
    return this.#mods
  }

  constructor(public readonly path: string) {
    this.#mods = this.#read()
  }

  #read() {
    try {
      const txt = Deno.readTextFileSync(this.path)
      return JSON.parse(txt).imports || {}
    } catch (error) {
      debug.warn('Parse import map', this.path, 'failed.', error)
      return {}
    }
  }

  toString() {
    return JSON.stringify(
      {
        imports: this.#mods,
      },
      null,
      2,
    )
  }

  get(name: string): string | undefined {
    return this.#mods[name]
  }

  set(name: string, url: string) {
    this.#mods[name] = url
  }

  async save() {
    if (!(await exists(this.path))) {
      const confirmed: boolean = await Confirm.prompt({
        message: `Not found ${this.path}, create a new one?`,
        default: true,
      })

      if (!confirmed) return
    }

    await Deno.writeTextFile(this.path, this.toString())
  }
}

export const importConfig = new ImportConfig(
  join(Deno.cwd(), 'import_map.json'),
)
