
// @flow

const winston = require('winston')
const { format } = winston

module.exports = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: format.combine(
        format.colorize(),
        format.splat(),
        format.simple())
})
