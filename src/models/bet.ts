import Sequelize, { Instance } from 'sequelize'
import database from '../database'

interface BetAttributes {
    id?: number,
    value?: Date,
    placedBy?: number,
    game?: number
}

interface BetInstance extends BetAttributes, Instance<BetAttributes> {}

const Bet = database.define<BetInstance, BetAttributes>('bet', {
    value: {
        type: Sequelize.DATE,
        allowNull: false
    },
    placedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users' }
    },
    game: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'games' }
    }
})

export default Bet
