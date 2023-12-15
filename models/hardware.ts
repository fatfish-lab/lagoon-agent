import { Logger, table } from '../deps.ts'
import { Settings } from './settings.ts'
import Lagoon from '../services/lagoon.ts'

interface networkInterface {
  name: string
  address: string
}
export class Hardware {
  private _key: string
  private settings: Settings
  hostname: string
  arch: string
  platform: string
  release: string
  uptime: number
  networkInterfaces: networkInterface[]
  memory: number

  private constructor(_key: string, settings: Settings) {
    this.settings = settings
    this._key = _key

    this.hostname = Deno.hostname()
    this.arch = Deno.build.arch
    this.platform = Deno.build.os
    this.release = Deno.osRelease()
    this.uptime = Deno.osUptime()
    this.memory = Deno.systemMemoryInfo().total

    const networkInterfaces = Deno.networkInterfaces().map(networkInterface => {
      return { name: networkInterface.name, address: networkInterface.address }
    })
    this.networkInterfaces = networkInterfaces
    Logger.debug('Hardware data')
    Logger.debug(table(
      ['_key', 'hostname', 'arch', 'platform', 'release', 'uptime', 'memory', 'networkInterfaces'],
      [[this._key, this.hostname, this.arch, this.platform, this.release, this.uptime, this.memory, this.networkInterfaces.map(i => `- ${i.name}: ${i.address}`).join('\n')]]
    ))
  }

  static async init() {
    const settings = await Settings.read()
    const _key = await settings.get<string>(['_key'])

    return new Hardware(_key, settings)
  }

  // deno-lint-ignore no-explicit-any
  data(): Record<string, any> {
    const {
      hostname,
      arch,
      platform,
      release,
      networkInterfaces,
      uptime,
      memory
    } = this

    return {
      name: hostname,
      hostname,
      arch,
      platform,
      release,
      networkInterfaces,
      uptime,
      memory,
      syncedAt: new Date().toISOString(),
      withAgent: true
    }
  }

  log() {
    const data = {
      _key: this._key || 'No _key',
      ...this.data()
    }

    return data
  }

  async push(): Promise<void> {
    const lagoon = await Lagoon.login()
    const exist = await this.exist()

    if (exist === true) {
      if (this._key) {
        await lagoon.updateHardware(this._key, this.data())
      } else {
        const hardware = await lagoon.findHardware(this.hostname)
        if (hardware && hardware.length > 0) {
          await lagoon.updateHardware(hardware[0]._key, this.data())
          this.settings.set(['_key'], hardware[0]._key)
        }
      }
    } else {
      const { item } = await lagoon.createHardware(this.data())
      if (item) {
        this._key = item._key
        this.settings.set(['_key'], item._key)
      }
    }
  }

  exist(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Lagoon.login().then(async lagoon => {
        if (this._key) {
          const hardware = await lagoon.Aqua.get(`items/${this._key}`).catch(() => resolve(false))
          if (hardware) resolve(true)
          else resolve(false)
        } else {
          const hardware = await lagoon.findHardware(this.hostname)
          if (hardware && hardware.length > 0) resolve(true)

          resolve(false)
        }
      }).catch(reject)
    })
  }

  get(): Promise<any> {
    return new Promise((resolve, reject) => {
      Lagoon.login().then(async lagoon => {
        if (this._key) {
          const hardware = lagoon.Aqua.getItem(this._key).catch(reject)
          if (hardware) resolve(hardware)
          else reject(new Error('Hardware not found'))
        } else {
          const hardware = await lagoon.findHardware(this.hostname).catch(reject)
          if (hardware && hardware.length > 0) resolve(hardware[0])
          else reject(new Error('Hardware not found'))
        }
      }).catch(reject)
    })
  }

  async trash(): Promise<void> {
    const hardware = await this.get().catch((e) => {
      throw e
    })
    if (hardware) {
      const lagoon = await Lagoon.login()
      return lagoon.trashHardware(hardware._key)
    }

    if (this._key) {
      await this.unlink()
    }
  }

  async unlink(): Promise<void> {
    if (this._key) {
      await this.settings.delete(['_key'])
    }
  }
}
