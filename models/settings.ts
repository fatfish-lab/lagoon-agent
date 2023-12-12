import { Logger } from "../deps.ts"

export class Settings {
  kv: Deno.Kv

  private constructor(kv: Deno.Kv) {
    this.kv = kv
  }

  static async read() {
    Logger.debug(`Loading hardware settings`)

    const kv = await Deno.openKv()
    return new Settings(kv)
  }

  set(key: Deno.KvKey, value: unknown) {
    Logger.debug(`Set ${key} with ${value} in settings`)
    return this.kv.set(key, value)
  }

  async get<T>(key: Deno.KvKey) {
    const v = await this.kv.get(key)
    Logger.debug(`Getting ${key} in settings with value : ${v.value}`)
    return v.value as T
  }

  delete(key: Deno.KvKey) {
    Logger.debug(`Deleting ${key} in settings`)
    return this.kv.delete(key)
  }
}
