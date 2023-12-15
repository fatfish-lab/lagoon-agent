import { Command, ValidationError, load, Logger, EnumType, levels, table } from "./deps.ts"
import Login from './commands/login.ts'
import Hardware from './commands/hardware.ts'
import Version from './version.json' assert { type: "json" }

await load({ export: true })

await new Command()
  .globalType('levels', new EnumType(levels))
  .name("lagoon-agent")
  .version(Version.version)
  .description("Lagoon's agent")
  .env("LAGOON_DEBUG=<debug:levels>", "Enable debug", { prefix: 'LAGOON_' })
  .env("LAGOON_SILENT=<silent:boolean>", "Disable all outputs", { prefix: 'LAGOON_' })
  .env("LAGOON_URL=<url:string>", "Define Lagoon instance url", { prefix: 'LAGOON_' })
  .env("LAGOON_DOMAIN=<domain:string>", "Specify the domain used for unauthenticated requests. Mainly for Lagoon Fatfish Lab dev or local Lagoon server without DNS redirection", { prefix: 'LAGOON_' })
  .env("LAGOON_TOKEN=<token:string>", "Use an existing token to authenticate Lagoon agent", { prefix: 'LAGOON_' })
  .env("LAGOON_BOTKEY=<botkey:string>", "Define the bot key used to authenticate Lagoon agent", { prefix: 'LAGOON_' })
  .env("LAGOON_BOTSECRET=<botsecret:string>", "Define the bot secret used to authenticate Lagoon agent", { prefix: 'LAGOON_' })
  .env("LAGOON_HARDWARE_KEY=<hardwareKey:string>", "Define the bot secret used to authenticate Lagoon agent", { prefix: 'LAGOON_' })
  .globalOption('-s, --silent', 'disable output', {
    conflicts: ['debug'],
    action: (options) => {
      const silent = options.silent
      if (silent == true) Deno.env.set('LAGOON_SILENT', '1')
    }
  })
  .globalOption('-d, --debug [debug:levels]', 'enable debug', {
    action: (options) => {
      const debug = options.debug as number

      if (debug != undefined) {
        let level = Number(levels.DEBUG)
        if (debug in levels) level = Number(levels[debug])

        Deno.env.set("LAGOON_DEBUG", String(level))
        Logger.debug(`Start Lagoon agent v${Version.version} (${levels[level]})`)
      }
    }
  })
  .globalOption('-c, --conf <file:string>', 'load configuration from file', {
    action: async (options) => {
      const conf = options.conf as string

      const status = await Deno.permissions.request({ name: "read", path: conf })
      if (status.state === 'granted') {
        if (conf != null) {
          const configuration = Deno.readTextFileSync(conf)
          const variables = configuration.split('\n')
          variables.forEach(variable => {
            const [env, val] = variable.split('=')

            switch (env) {
              case 'LAGOON_HARDWARE_KEY':
                if (!('location' in options)) Deno.env.set(env, val)
                break;

              default:
                Deno.env.set(env, val)
                break;
            }
          })
        }
      } else {
        const message = `Lagoon agent don't have permission to read the configuration file ${conf}`
        Logger.error(message)
        throw new Error(message)
      }
    }
  })
  .globalAction(options => {
    const configurationFile = options.conf
    const url = Deno.env.get('LAGOON_URL')
    const domain = Deno.env.get('LAGOON_DOMAIN')
    const token = Deno.env.get('LAGOON_TOKEN')
    const botkey = Deno.env.get('LAGOON_BOTKEY')
    const botsecret = Deno.env.get('LAGOON_BOTSECRET')
    const hardwareKey = Deno.env.get('LAGOON_HARDWARE_KEY')


    if (configurationFile) Logger.debug(`Using configuration file : ${configurationFile}`)
    else Logger.debug('Not using any configuration file')

    Logger.debug(table(
      ['url', 'domain', 'token', 'bot-key', 'bot-secret', 'hardware-key'],
      [[url, domain, token?.replaceAll(/\S/ig, '*').slice(0, 10) || 'Not set', botkey, botsecret?.replaceAll(/\S/ig, '*').slice(0, 10), hardwareKey]]))
  })
  .command('login', Login)
  .command('hardware', Hardware)
  .error((err, cmd) => {
    if (err instanceof ValidationError) {
      cmd.showHelp()
    }
    Logger.error(err)
    Deno.exit(err instanceof ValidationError ? err.exitCode : 1)
  })
  .parse(Deno.args)