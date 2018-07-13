import Sequelize, { Instance } from 'sequelize'
import db from '../database'
import log from '../logger'
import config from '../config'

interface UserAttributes {
    id?: number,
    name?: string,
    email?: string,
    password?: string,
    score?: number,
    isAdmin?: boolean,
    createdAt?: Date,
    updatedAt?: Date
}

interface UserInstance extends UserAttributes, Instance<UserAttributes> {}

const User = db.define<UserInstance, UserAttributes>('user', {
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

User.sync({ force: config.postgres.forceClean })
    .then(() => log.info('Users table created!'))
    .catch(err => {
        console.log(err)
    })

export default User
