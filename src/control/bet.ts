import Bet from '../models/bet'
import Game from '../models/game'
import { NotFoundError, ValidationError } from './errors'
import { isClosed } from './game'

export const place = (userId: number, gameId: number, value: any) =>
    Bet.create({ value, placedBy: userId, game: gameId })

export async function findAllFromGame(gameId: number) {
    const game = await Game.findOne({ where: { id: gameId } })

    if (!game) {
        throw new NotFoundError()
    }

    if (game.mode === 'secret') {
        throw new ValidationError('Bets are secret!')
    }

    if (!isClosed(game) && game.mode === 'secret-till-end') {
        throw new ValidationError('Bets are secret till the game ends!')
    }

    return Bet.findAll({ where: { game: gameId } })
}
