
// @flow

const User = require('./user')
const Game = require('./game')
const Bet = require('./bet')

User.hasMany(Bet, { foreignKey: 'placedBy' })
User.hasMany(Game, { foreignKey: 'createdBy' })
Game.hasMany(Bet)

module.exports = { User, Game, Bet }
