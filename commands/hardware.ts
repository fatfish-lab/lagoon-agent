import { Command, Logger } from '../deps.ts'
import { Hardware } from '../models/hardware.ts'

export default new Command()
  .description("Manage your hardware on Lagoon.")
  .command("push", "Push your hardware on Lagoon.")
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