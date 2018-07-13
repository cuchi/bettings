
// @flow

const Sequelize = require('sequelize')
const db = require('../database')
const log = require('../logger')
const config = require('../config')

const UserModel = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

UserModel.sync({ force: config.postgres.forceClean })
    .then(() => log.info('Users table created!'))
    .catchReturn()

module.exports = UserModel
