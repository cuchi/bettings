
// @flow

const { Router } = require('express')
const uuid = require('uuid/v4')
const { NotFoundError, resolveError } = require('./control/errors')
const log = require('./logger')
const user = require('./control/user')
const bet = require('./control/bet')
const game = require('./control/game')

import type { $Request, $Response } from 'express'

const handleRoute = (fn: $Request => Promise<any>) =>
    async (req: $Request, res: $Response) => {
        try {
            res.json(await fn(req))
        } catch (rawError) {
            const error = resolveError(rawError)

            if (error.status) {
                const { name, message } = error
                res.status(Number(error.status)).json({ name, message })
            } else {
                log.error(error.stack)
                res.status(500).json({ name: 'Internal Server Error' })
            }
        }
    }

const sessions = {}

const authentication = async (req, res, next) => {
    req.userId = sessions[req.session.token]

    if (req.userId) {
        next()
    } else {
        res.sendStatus(403)
    }
}

const login = async (req: $Request) => {
    const id = await user.authenticate(req.body.email, req.body.password)
    const token = uuid()
    req.session.token = token
    sessions[token] = id
}

const logout = async req => {
    if (!req.session.token) {
        throw new NotFoundError()
    }

    delete sessions[req.session.token]
}

const apiRouter = () => {
    const api = new Router()

    // Users
    api.post('/users', handleRoute(req =>
        user.create(req.body)))

    // Sessions
    api.post('/sessions', handleRoute(login))

    // Authenticated area
    api.use(authentication)

    // Users
    api.patch('/users/:id', handleRoute(req =>
        user.update(req.userId, req.params.id, req.body)))

    api.delete('/users/:id', handleRoute(req =>
        user.remove(req.userId, req.params.id)))

    api.get('/users/:id', handleRoute(req =>
        user.find(req.params.id)))

    api.get('/users', handleRoute(user.findAll))

    // Games
    api.post('/games', handleRoute(req =>
        game.create(req.userId, req.body)))

    api.delete('/games/:id', handleRoute(req =>
        game.remove(req.userId, req.params.id)))

    // Bets
    api.post('/games/:id/bets', handleRoute(req =>
        bet.place(req.userId, req.body.gameId, req.body.value)))

    api.get('/games/:id/bets', handleRoute(req =>
        bet.findAllFromGame(req.params.id)))

    // Sessions
    api.delete('/sessions/current', handleRoute(logout))

    return api
}

module.exports = { handleRoute, apiRouter }
