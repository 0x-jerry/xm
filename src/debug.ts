import { config } from './config.ts'
import { cyan, red, yellow } from 'fmt/colors.ts'

export function debug(...args: unknown[]) {
  config.debug && console.log(...args)
}

debug.log = (...args: unknown[]) =>
  config.debug && console.log(...args.map((s) => cyan(String(s))))

debug.warn = (...args: unknown[]) =>
  config.debug && console.warn(...args.map((s) => yellow(String(s))))

debug.error = (...args: unknown[]) =>
  config.debug && console.error(...args.map((s) => red(String(s))))
