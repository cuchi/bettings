
// @flow

const Bet = require('../models/bet')

const place = (userId: number, gameId: number, value: *) =>
    Bet.create({ value, placedBy: userId, game: gameId })

const findAllFromGame = (gameId: number) =>
    Bet.findAll({ where: { game: gameId } })

module.exports = { findAllFromGame, place }
