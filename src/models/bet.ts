import Sequelize, { Instance } from 'sequelize'
import database from '../database'

interface Bet {
    id: number,
    value: Date,
    placedBy: number,
    game: number,
    createdAt: Date,
    updatedAt: Date
}

type BetAttributes = Partial<Bet>

export interface BetInstance extends Bet, Instance<Bet> {}

const Bet = database.define<BetInstance, BetAttributes>('bet', {
    value: {
        allowNull: false,
        type: Sequelize.DATE
    },
    placedBy: {
        allowNull: false,
        field: 'placed_by',
        references: { model: 'users' },
        type: Sequelize.INTEGER
    },
    game: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'games' }
    },
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATE
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE
    }
})

export default Bet
