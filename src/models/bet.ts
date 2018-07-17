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
        type: Sequelize.DATE,
        allowNull: false
    },
    placedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users' },
        field: 'placed_by'
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
