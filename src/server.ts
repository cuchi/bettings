import bodyParser from 'body-parser'
import pgSessionStore from 'connect-pg-simple'
import express from 'express'
import session from 'express-session'
import morgan from 'morgan'
import { apiRouter } from './api'
import config from './config'
import { createPool } from './database'
import log from './logger'

const server = express()

server.use(morgan(config.logs.httpStyle, { stream: {
    write: message => log.info(message.trim()) } }))

server.use(bodyParser.json())

const pgStore = pgSessionStore(session)

server.use(session({
    name: 'app-session-id',
    resave: true,
    saveUninitialized: false,
    secret: config.cookieSecret,
    store: new pgStore({
        pool: createPool(),
        tableName: 'sessions'
    })
}))

server.use(apiRouter())

export const serverIsReady = new Promise(resolve => {
    server.listen(config.port , () => {
        log.info(`Listening on port ${config.port}`)
        resolve()
    })
})
