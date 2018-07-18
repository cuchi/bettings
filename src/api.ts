import { NextFunction, Request, Response, Router } from 'express'
import { path } from 'ramda'
import uuid from 'uuid'
import * as bet from './control/bet'
import {
    HttpError, NotFoundError, resolveError, UnauthenticatedError
} from './control/errors'
import * as game from './control/game'
import * as user from './control/user'
import log from './logger'

type HandlerFn = (req: Request) => PromiseLike<any>

function handleRoute(fn: HandlerFn) {
    return async (req: Request, res: Response) => {
        try {
            res.json(await fn(req))
        } catch (rawError) {
            const error = resolveError(rawError)

            if (error instanceof HttpError) {
                const { name, message } = error
                res.status(Number(error.status)).json({ name, message })
            } else {
                log.error(error.stack || error.message)
                res.status(500).json({ name: 'Internal Server Error' })
            }
        }
    }
}

const sessions: { [token: string]: number } = {}

async function authentication(req: Request, res: Response, next: NextFunction) {
    if (!req.session) {
        return res.sendStatus(403)
    }

    const userId = sessions[req.session.token]

    if (userId) {
        req.session.userId = userId
        next()
    } else {
        res.sendStatus(403)
    }
}

const login = async (req: Request) => {
    const id = await user.authenticate(req.body.email, req.body.password)
    const token = uuid.v4()

    if (req.session) {
        req.session.token = token
        sessions[token] = id
    }
}

const logout = async (req: Request) => {
    if (req.session && req.session.token) {
        delete sessions[req.session.token]
    }
    throw new NotFoundError()
}

function getUserId(req: Request) {
    const userId = path(['session', 'userId'], req)
    if (!userId) {
        throw new UnauthenticatedError()
    }
    return Number(userId)
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
        user.update(getUserId(req), req.params.id, req.body)))

    api.delete('/users/:id', handleRoute(req =>
        user.remove(getUserId(req), req.params.id)))

    api.get('/users/:id', handleRoute(req =>
        user.find(req.params.id)))

    api.get('/users', handleRoute(user.findAll))

    // Games
    api.get('/games', handleRoute(req => game.findAll()))

    api.post('/games', handleRoute(req =>
        game.create(getUserId(req), req.body)))

    api.delete('/games/:id', handleRoute(req =>
        game.remove(getUserId(req), req.params.id)))

    api.put('/games/:id', handleRoute(req =>
        game.close(getUserId(req), req.params.id, req.body.result)))

    // Bets
    api.post('/games/:id/bets', handleRoute(req =>
        bet.place(getUserId(req), req.params.id, req.body.value)))

    api.get('/games/:id/bets', handleRoute(req =>
        bet.findAllFromGame(req.params.id)))

    // Sessions
    api.delete('/sessions/current', handleRoute(logout))

    return api
}
