import { Command, prompt, Input, Logger } from '../deps.ts'
interface loginPrompt {
  instance: string
}

export default new Command()
  .description("Login the agent on your Lagoon.")
  .action(async () => {
    const result: loginPrompt = await prompt([{
      name: "instance",
      message: "Enter your Lagoon's instance url",
      hint: "Don't forget to add protocol like https (ex: https://studio.mylagoon.app)",
      minLength: 1,
      type: Input
      }])

    const { instance } = result
    const url = new URL('#/hardware/agent?login', instance)
    Logger.log(`Open this url : ${url.toString()}`)
  })
