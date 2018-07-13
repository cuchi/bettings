import Sequelize, { Instance } from 'sequelize'
import database from '../database'

interface GameAttributes {
    id?: number,
    name?: string,
    timeLimit?: Date,
    score?: number,
    createdBy?: number,
    createdAt?: Date,
    updatedAt?: Date
}

interface GameInstance extends GameAttributes, Instance<GameAttributes> {}

const Game = database.define<GameInstance, GameAttributes>('game', {
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
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users' }
    }
})

export default Game
