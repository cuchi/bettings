import Bet from '../models/bet'

export const place = (userId: number, gameId: number, value: any) =>
    Bet.create({ value, placedBy: userId, game: gameId })

export const findAllFromGame = (gameId: number) =>
    Bet.findAll({ where: { game: gameId } })
