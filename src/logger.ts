import { createLogger, format, transports } from 'winston'
import config from './config'

export default createLogger({
    level: config.logs.level,
    transports: [new transports.Console()],
    format: format.combine(
        format.colorize(),
        format.splat(),
        format.simple())
})
