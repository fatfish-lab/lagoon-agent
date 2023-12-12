import { load } from "https://deno.land/std@0.206.0/dotenv/mod.ts"

import { Command, ValidationError, EnumType } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { Input, prompt, Secret } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";
import { Table } from "https://deno.land/x/cliffy@v1.0.0-rc.3/table/mod.ts";

export const green = 0x51cf66
export const orange = 0xff922b
export const red = 0xff6b6b

export enum levels { 'INFO', 'WARNING', 'ERROR', 'DEBUG' }
export class Logger {
  public static log (message: string) {
    Logger.console(levels.INFO, message)
  }
  public static success (message: string) {
    Logger.console(levels.INFO, message, green)
  }
  public static warning (message: string) {
    Logger.console(levels.WARNING, message, orange)
  }
  public static error (message: string | Error) {
    if (message instanceof Error) message = message.message
    Logger.console(levels.ERROR, message, red)
  }
  public static debug (message: string | Error) {
    if (message instanceof Error) message = message.message
    Logger.console(levels.DEBUG, message)
  }
  public static console(level: levels, message: string, color?: typeof green | typeof orange | typeof red) {
    const debug = Number(Deno.env.get('LAGOON_DEBUG'))
    const silent = Deno.env.get('LAGOON_SILENT') === '1'
    if ((debug in levels && debug >= level) || (!silent && level <= levels.ERROR)) {
      const now = new Date().toISOString()

      const multiline = RegExp('\n')
      if (multiline.test(message)) message = `\n${message}`

      if (color) console.log(colors.bold.rgb24(message, color))
      else console.log(`${levels[level]} [${now}] ${message}`)
    }
  }
}

export function table (header: string[], body: [(string | number | undefined)[]]) {
  return new Table()
    .header(header)
    .border()
    .body(body)
    .toString()
}

export {
  load,
  Command,
  ValidationError,
  prompt,
  Input,
  Secret,
  colors,
  Table,
  EnumType
}