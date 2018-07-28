import { Request, Response, Router } from 'express'
import { path } from 'ramda'
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
                log.warn(error.message)
                res.status(Number(error.status))
                    .json({ name, message })
            } else {
                log.error(error.stack || error.message)
                res.status(500)
                    .json({ name: 'Internal Server Error' })
            }
        }
    }
}

const login = async (req: Request) => {
    const id = await user.authenticate(req.body.email, req.body.password)

    if (req.session) {
        req.session.userId = id
    }
}

const logout = async (req: Request) => {
    if (!req.session) {
        throw new NotFoundError()
    }
    req.session.destroy(() => { /* noop */ })
}

function checkUser(req: Request) {
    const userId = path(['session', 'userId'], req)
    if (!userId) {
        throw new UnauthenticatedError()
    }

    return Number(userId)
}

export const apiRouter = () => {
    const api = Router()

    // Status
    api.get('/status', handleRoute(async req => ({ message: 'It works!' })))

    // Users
    api.post('/users', handleRoute(req =>
        user.create(req.body)))

    api.patch('/users/:id', handleRoute(req =>
        user.update(checkUser(req), req.params.id, req.body)))

    api.delete('/users/:id', handleRoute(req =>
        user.remove(checkUser(req), req.params.id)))

    api.get('/users/me', handleRoute(req =>
        user.getCurrent(checkUser(req))))

    api.get('/users/:id', handleRoute(req =>
        user.find(req.params.id)))

    api.get('/users', handleRoute(req => {
        checkUser(req)

        return user.findAll()
    }))

    // Games
    api.get('/games', handleRoute(req => {
        checkUser(req)

        return game.findAll()
    }))

    api.post('/games', handleRoute(req =>
        game.create(checkUser(req), req.body)))

    api.delete('/games/:id', handleRoute(req =>
        game.remove(checkUser(req), req.params.id)))

    api.put('/games/:id', handleRoute(req =>
        game.close(checkUser(req), req.params.id, req.body.result)))

    // Bets
    api.post('/games/:id/bets', handleRoute(req =>
        bet.place(checkUser(req), req.params.id, req.body.value)))

    api.get('/games/:id/bets', handleRoute(req =>
        bet.findAllFromGame(req.params.id)))

    // Sessions
    api.post('/sessions', handleRoute(login))
    api.delete('/sessions/current', handleRoute(logout))

    return api
}
