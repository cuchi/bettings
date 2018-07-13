
// @flow

const Sequelize = require('sequelize')
const db = require('../database')
const log = require('../logger')
const config = require('../config')

const GameModel = db.define('game', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    timeLimit: {
        type: Sequelize.DATE,
        allowNull: false
    },
    score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
})

GameModel.sync({ force: config.postgres.forceClean })
    .then(() => log.info('Games table created!'))
    .catch(err => {
        console.log(err)
    })

module.exports = GameModel
