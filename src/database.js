
// @flow

const Sequelize = require('sequelize')
const log = require('./logger')
const { postgres: { host, database, user, password } } = require('./config')

const options = {
    host: host,
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

const sequelize = new Sequelize(database, user, password, options)

sequelize
    .authenticate()
    .then(() => {
        log.info('Connection has been established successfully.')
    })
    .catch(err => {
        log.error('Unable to connect to the database:', err)
    })

module.exports = sequelize
