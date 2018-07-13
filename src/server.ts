import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import { apiRouter } from './api'
import log from './logger'
import config from './config'

const server = express()

server.use(bodyParser.json())

server.use(session({
    secret: config.cookieSecret,
    name: 'app-session-id',
    resave: true,
    saveUninitialized: false
}))

server.use(apiRouter())

server.listen(config.port , () => log.info(`Listening on port ${config.port}`))
