import { Router } from 'express'
import uuid from 'uuid/v4'
import { HttpError, NotFoundError, resolveError } from './control/errors'
import log from './logger'
import * as user from './control/user'
import * as bet from './control/bet'
import * as game from './control/game'

const handleRoute = fn =>
    async (req, res) => {
        try {
            res.json(await fn(req))
        } catch (rawError) {
            const error = resolveError(rawError)

            if (error instanceof HttpError) {
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

const login = async req => {
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

export const apiRouter = () => {
    const api = Router()

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
    api.get('/games', handleRoute(req =>
        game.findAll()))

    api.post('/games', handleRoute(req =>
        game.create(req.userId, req.body)))

    api.delete('/games/:id', handleRoute(req =>
        game.remove(req.userId, req.params.id)))

    // Bets
    api.post('/games/:id/bets', handleRoute(req =>
        bet.place(req.userId, req.params.id, req.body.value)))

    api.get('/games/:id/bets', handleRoute(req =>
        bet.findAllFromGame(req.params.id)))

    // Sessions
    api.delete('/sessions/current', handleRoute(logout))

    return api
}
