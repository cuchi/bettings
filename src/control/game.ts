import Game, { GameInstance } from '../models/game'
import User from '../models/user'
import Bet from '../models/bet'
import db from '../database'
import { all } from 'bluebird'
import { closestIndexTo } from 'date-fns'
import { pluck } from 'ramda'
import { ensureIsAdmin } from './user'
import { NotFoundError, UnauthorizedError, ValidationError } from './errors'
import { Transaction } from 'sequelize';

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

const updateScore = async (game: GameInstance, transaction?: Transaction) => {
    const bets
        = (await Bet.findAll({
            attributes: ['placedBy', 'value'],
            where: { game: game.id },
            transaction }))
        .map(i => i.toJSON())

    const dates = pluck('value', bets)
    const winnerIndex = closestIndexTo(game.result, dates)
    const { placedBy: winnerId } = bets[winnerIndex]

    const winner = await User.findOne({ where: { id: winnerId }, transaction })
    return User.update(
        { score: winner.score + game.score },
        { where: { id: winnerId }, transaction })
}

export const close = (userId: number, gameId: number, value: string) =>
    db.transaction({}, async transaction => {
        const game = await Game.findOne({
            attributes: ['createdBy'],
            where: { id: gameId },
            transaction })

        if (game.closedAt) {
            throw new ValidationError('The game is closed!')
        }

        if (userId !== game.createdBy) {
            await ensureIsAdmin(userId, transaction)
        }

        const updateGame = game.update(
            { closedAt: new Date(), result: value },
            { transaction })

        return all([updateGame, updateScore(game, transaction)])
    })

export const findAll = () =>
    Game.findAll({ attributes: ['id', 'name', 'timeLimit', 'createdAt'] })
