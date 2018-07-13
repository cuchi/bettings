
// @flow

const Sequelize = require('sequelize')
const db = require('../database')
const log = require('../logger')
const config = require('../config')

const BetModel = db.define('bet', {
    value: {
        type: Sequelize.DATE,
        allowNull: false
    }
})

BetModel.sync({ force: config.postgres.forceClean })
    .then(() => log.info('Bets table created!'))
    .catch(err => {
        console.log(err)
    })

module.exports = BetModel
