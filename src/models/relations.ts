import User from './user'
import Game from './game'
import Bet from './bet'

User.hasMany(Bet, { foreignKey: 'placedBy' })
User.hasMany(Game, { foreignKey: 'createdBy' })
Game.hasMany(Bet)
