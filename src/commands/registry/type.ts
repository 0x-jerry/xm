export interface RegistryOption {
  type: string
  version: string
  mod: string
}

export interface RegistryProvider<T extends RegistryOption = RegistryOption> {
  type: string
  check(url: string): boolean
  /**
   *
   * @param url
   */
  parse(url: string): T
  /**
   *
   * @param mod
   */
  parseMod(mod: string): T

  generate(opt: T): string
  versions(opt: T): string[] | Promise<string[]>
}
