import Sequelize, { Instance } from 'sequelize'
import database from '../database'
import log from '../logger'

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

Bet.sync()
    .then(() => log.info('Bets table created!'))
    .catch(err => {
        console.log(err)
    })

export default Bet
