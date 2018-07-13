
// @flow

const Game = require('../models/game')
const { NotFoundError, UnauthorizedError } = require('./errors')

const create = (userId: number, fields: *) =>
    Game.create({ ...fields, createdBy: userId })

const remove = async (userId: number, id: number) => {
    const game = await Game.findOne({ where: { id } })

    if (!game) {
        throw new NotFoundError()
    }

    if (game.createdBy !== userId) {
        throw new UnauthorizedError('This game is from other user!')
    }

    return game.destroy()
}

const findAll = () =>
    Game.findAll({ attributes: ['name', 'createdAt'] })

module.exports = { create, remove, findAll }
