import Sequelize, { Instance } from 'sequelize'
import db from '../database'
import log from '../logger'
import config from '../config'

interface BetAttributes {
    id?: number,
    value?: Date,
    placedBy?: number,
    game?: number
}

interface BetInstance extends BetAttributes, Instance<BetAttributes> {}

const Bet = db.define<BetInstance, BetAttributes>('bet', {
    value: {
        type: Sequelize.DATE,
        allowNull: false
    }
})

Bet.sync({ force: config.postgres.forceClean })
    .then(() => log.info('Bets table created!'))
    .catch(err => {
        console.log(err)
    })

export default Bet
