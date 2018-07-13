import winston from 'winston'
const { format } = winston

export default winston.createLogger({
    transports: [new winston.transports.Console()],
    format: format.combine(
        format.colorize(),
        format.splat(),
        format.simple())
})
