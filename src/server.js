
// @flow

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const { apiRouter } = require('./api')
const log = require('./logger')
const config = require('./config')

const server = express()

server.use(bodyParser.json())

server.use(session({
    secret: config.cookieSecret,
    name: 'app-session-id',
    resave: true,
    saveUninitialized: false
}))

server.use(apiRouter())

server.listen(3000, () => log.info('Listening on port 3000'))

