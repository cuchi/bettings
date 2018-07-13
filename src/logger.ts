import { createLogger, transports, format } from 'winston'

export default createLogger({
    transports: [new transports.Console()],
    format: format.combine(
        format.colorize(),
        format.splat(),
        format.simple())
})