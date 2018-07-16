import Game from '../models/game'
import { ensureIsAdmin } from './user'
import { NotFoundError, UnauthorizedError } from './errors'

export const create = (userId: number, fields: any) =>
    Game.create({ ...fields, createdBy: userId })

export const remove = async (userId: number, id: number) => {
    const game = await Game.findOne({ where: { id } })

    if (!game) {
        throw new NotFoundError()
    }

    if (game.createdBy !== userId) {
        throw new UnauthorizedError('This game is from other user!')
    }

    return game.destroy()
}

export const close = async (userId: number, gameId: number, value: string) => {
    const game = await Game.findOne({
        attributes: ['createdBy'],
        where: { id: gameId } })

    if (userId !== game.createdBy) {
        await ensureIsAdmin(userId)
    }

    return game.update({ closedAt: new Date() })
}


export const findAll = () =>
    Game.findAll({ attributes: ['id', 'name', 'timeLimit', 'createdAt'] })
