export interface RegistryOption {
  type: string
}

export interface RegistryProvider<T extends RegistryOption> {
  type: string
  check(url: string): boolean
  parse(url: string): T
  parseMod(mod: string): T
  generate(opt: T): string
  versions(opt: T): string[] | Promise<string[]>
}
