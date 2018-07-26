import { all } from 'bluebird'
import { closestIndexTo } from 'date-fns'
import { pick, pluck } from 'ramda'
import { Transaction } from 'sequelize'
import db from '../database'
import Bet from '../models/bet'
import Game, { ClosedGame, GameInstance } from '../models/game'
import User, { UserInstance } from '../models/user'
import { NotFoundError, UnauthorizedError, ValidationError } from './errors'
import { ensureIsAdmin } from './user'

const updatableFields = ['name', 'timeLimit', 'score', 'mode']

export const create = (userId: number, fields: any) => {
    const pickedFields = pick(updatableFields, fields)
    return Game.create({ ...pickedFields, createdBy: userId })
}

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

async function updateScore(
    game: GameInstance,
    result: string,
    transaction?: Transaction
) {
    const bets
        = (await Bet.findAll({
            attributes: ['placedBy', 'value'],
            where: { game: game.id },
            transaction }))
        .map(i => i.toJSON())

    if (bets.length !== 0) {
        const dates = pluck('value', bets)
        const winnerIndex = closestIndexTo(result, dates)
        const { placedBy: winnerId } = bets[winnerIndex]

        const winner = (
            await User.findOne({ where: { id: winnerId }, transaction })
        ) as UserInstance

        return User.update(
            { score: winner.score + game.score },
            { where: { id: winnerId }, transaction })
    }
}

export const close = (userId: number, gameId: number, result: any) =>
    db.transaction(async transaction => {
        const game = await Game.findOne({
            attributes: ['id', 'createdBy', 'closedAt', 'score'],
            where: { id: gameId },
            transaction })

        if (!game) {
            throw new NotFoundError()
        }

        if ((game as ClosedGame).closedAt) {
            throw new ValidationError('The game is already closed!')
        }

        if (userId !== game.createdBy) {
            await ensureIsAdmin(userId, transaction)
        }

        const updateGame = Game.update(
            { closedAt: new Date(), result },
            { where: { id: gameId }, transaction })

        return all([updateScore(game, result, transaction), updateGame])
    })

const publicAttrs = [
    'id', 'name', 'score', 'mode', 'result', 'timeLimit', 'closedAt',
    'createdAt'
]

export const findAll = () => Game.findAll({ attributes: publicAttrs })
