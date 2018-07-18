import bodyParser from 'body-parser'
import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import { apiRouter } from './api'
import config from './config'
import log from './logger'

const server = express()

server.use(morgan('dev', { stream: {
    write: message => log.info(message.trim()) } }))

server.use(bodyParser.json())

server.use(session({
    name: 'app-session-id',
    resave: true,
    saveUninitialized: false,
    secret: config.cookieSecret
}))

server.use(apiRouter())

server.listen(config.port , () => log.info(`Listening on port ${config.port}`))
