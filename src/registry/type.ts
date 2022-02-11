export interface RegistryOption {
  type: string
  version: string
  mod: string
  entry: string
}

export type MayPromise<T> = T | Promise<T>

export interface ModVersions {
  latest: string
  versions: string[]
}
