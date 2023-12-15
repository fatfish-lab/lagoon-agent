import Aquarium from "https://raw.githubusercontent.com/fatfish-lab/aquarium-ts-api/main/src/index.ts"
export default class Lagoon {
  Aqua: any
  hardware: string|void

  constructor(Aqua:any, hardware?:string) {
    this.Aqua = Aqua
    this.hardware = hardware
  }

  public static async login(hardware: string | undefined = Deno.env.get('LAGOON_HARDWARE_KEY')): Promise<Lagoon> {
    const url = Deno.env.get('LAGOON_URL') ? 'http://localhost:8000' : undefined
    const domain = Deno.env.get('LAGOON_DOMAIN')
    const token = Deno.env.get('LAGOON_TOKEN')
    if (url) {
      const Aqua = new Aquarium(url, token, domain)

      if (token == undefined) {
        const _key = Deno.env.get('LAGOON_BOTKEY')
        const secret = Deno.env.get('LAGOON_BOTSECRET')
        if (!_key || !secret) throw new Error(`Can't find bot _key and/or secret. Please use environment variable LAGOON_BOTKEY and LAGOON_BOTSECRET.`)

        const bot = await Aqua.signinBot(_key, secret).catch(err => {
          throw err
        })
        if (bot) {
          if (hardware == null) {
            const query = '# <()- path.edges[*].type ALL IN ["Member"] AND $Organisation UNIQUE VIEW $view'
            const aliases = {
              view: {
                _key: 'item._key',
                type: 'item.type',
                data: 'item.data',
                updatedAt: 'item.updatedAt',
                createdAt: 'item.createdAt',
                properties: 'FIRST(# -($Child)> 0,1 $Properties VIEW item)',
                hardware: 'FIRST(# -($Child)> 0,1 item.data.name == "Hardware" VIEW item._key)',
              },
              catalogueView: {
                _key: 'item._key',
                hardware: 'FIRST(# -($Child)> 0,1 item.data.name == "Hardware" VIEW item._key)',
              },
            }
            const organisations = await Aqua.post(`items/${bot.bot._key}/traverse`, {query, aliases}) as Record<string, any>[]
            if (organisations && organisations.length > 0) {
              const organisation = organisations[0]
              hardware = organisation.hardware
            }
          }
          return new Lagoon(Aqua, hardware)
        }
      }

      return new Lagoon(Aqua, hardware)
    } else {
      throw new Error('No Lagoon url provided. Please use the environment variable LAGOON_URL.')
    }
  }

  createHardware(data: any): Promise<{ item: any, edge: any }> {
    const item = {
      type: 'Product',
      data,
    }
    return this.Aqua.post(`items/${this.hardware}/append`, { item })
  }

  updateHardware(itemKey:string|number, data: any): Promise<any> {
    return this.Aqua.patch(`items/${itemKey}`, { data })
  }

  trashHardware(itemKey:string|number): Promise<any> {
    return this.Aqua.delete(`items/${itemKey}/trash`, {})
  }

  findHardware(hostname: string): Promise<Array<any>> {
    const query = '# -($Child)> 0,1 $Product AND item.data.hostname == @hostname VIEW item'
    const aliases = {
      hostname,
    }
    return this.Aqua.post(`items/${this.hardware}/traverse`, {query, aliases})
  }
}
