import Sequelize, { Instance } from 'sequelize'
import db from '../database'
import log from '../logger'
import config from '../config'

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

const Game = db.define<GameInstance, GameAttributes>('game', {
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

Game.findOne()

Game.sync({ force: config.postgres.forceClean })
    .then(() => log.info('Games table created!'))
    .catch(err => {
        console.log(err)
    })

export default Game
