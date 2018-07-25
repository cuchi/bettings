import { all } from 'bluebird'
import fs from 'fs'
import path from 'path'
import { T } from 'ramda'
import superagent from 'superagent'
import db from '../src/database'
import { serverIsReady } from '../src/server'

const agent = superagent.agent()
const loggedAgent = superagent.agent()
const api = 'http://localhost:8080'
const seedPath = path.resolve(__dirname, '../seeds/populate-tests.sql')

beforeAll(() => {
    const login = loggedAgent.post(`${api}/sessions`)
        .send({ email: 'tux@kernel.org', password: '123' })
    const populateDB = db.query(fs.readFileSync(seedPath).toString('utf8'))
    return all([serverIsReady, populateDB, login])
})

describe('Server', async () => {
    beforeEach(() => db.query('ROLLBACK; BEGIN TRANSACTION'))
    afterEach(() => db.query('ROLLBACK'))

    test('The server should be running', async () => {
        const response = await agent.get(`${api}/status`)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe('It works!')
    })

    test('Should throw an error when creating an user without email',
        async () => {
            const response = await agent
                .post(`${api}/users`)
                .send({ name: 'tux' })
                .ok(T)

            expect(response.status).toBe(400)
            expect(response.body.name).toBe('ValidationError')
        })

    test('Shouldn\'t create an email that already exists', async () => {
        const response = await agent
            .post(`${api}/users`)
            .send({
                name: 'Tux',
                email: 'tux@kernel.org',
                password: 'foobar' })
            .ok(T)

        expect(response.status).toBe(400)
    })

    test('Should create an valid user', async () => {
        const response = await agent
            .post(`${api}/users`)
            .send({
                name: 'Jessie',
                email: 'jessie@kernel.org',
                password: 'root@123456' })
            .ok(T)

        expect(response.status).toBe(200)
        expect(response.body.name).toBe('Jessie')
        expect(response.body.isAdmin).toBe(false)
    })

    test('Should not get the users list when not logged in', async () => {
        const response = await agent
            .get(`${api}/users`)
            .ok(T)

        expect(response.status).toBe(401)
    })

    test('Should get the users list', async () => {
        const response = await loggedAgent
            .get(`${api}/users`)
            .ok(T)

        expect(response.status).toBe(200)
        expect(response.body instanceof Array).toBeTruthy()
    })
})
