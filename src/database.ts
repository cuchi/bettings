import { Pool } from 'pg'
import Sequelize from 'sequelize'
import config from './config'
import log from './logger'

const { postgres } = config

export const createPool = () => new Pool({
    host: postgres.host,
    database: postgres.database,
    user: postgres.user,
    password: postgres.password,
    max: 10,
    min: 1
})

const options: Sequelize.Options = {
    host: postgres.host,
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    logging: log.debug.bind(log)
}

const sequelize = new Sequelize(
    postgres.database,
    postgres.user,
    postgres.password,
    options)

sequelize
    .authenticate()
    .then(() => {
        log.info(`Connected to ${postgres.user}@${postgres.database}!`)
    })
    .catch(err => {
        log.error('Unable to connect to the database:', err)
    })

export default sequelize
