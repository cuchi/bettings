import Sequelize, { Instance } from 'sequelize'
import database from '../database'
import log from '../logger'

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

const User = database.define<UserInstance, UserAttributes>('user', {
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

export default User
