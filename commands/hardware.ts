import { Command, Logger } from '../deps.ts'
import { Hardware } from '../models/hardware.ts'

export default new Command()
  .description("Manage your hardware on Lagoon.")
  .command("push", "Push your hardware on Lagoon.")
  .option('-l, --location <hardwareKey:string>', 'specify an hardware category', {
    action: (options) => {
      const location = options.location
      if (location) Deno.env.set('LAGOON_HARDWARE_KEY', location)
    }
  })
  .action(async () => {
    const hardware = await Hardware.init()
    await hardware.push()
    Logger.success("Hardware successfully pushed.")
  })
  .command("show", "Show hardware metadata")
  .action(async () => {
    const hardware = await Hardware.init()
    const data = hardware.log()
    console.log(data)
  })
  .command("unlink", "Unlink hardware from Lagoon database")
  .action(async () => {
    const hardware = await Hardware.init()
    await hardware.unlink()
    Logger.success('Hardware unlinked')
  })