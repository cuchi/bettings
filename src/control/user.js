
// @flow

const { evolve, pick, nAry, values } = require('ramda')
const {
    NotFoundError,
    UnauthenticatedError,
    UnauthorizedError,
    ValidationError
} = require('./errors')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const saltRounds = 10

const updatableFields = ['name', 'email', 'password']

const ensureIsAdmin = async id => {
    const currentUser = await User.findOne({
        attributes: ['isAdmin'],
        where: { id } })

    if (!currentUser.isAdmin) {
        throw new UnauthorizedError('User is not an admin')
    }
}

const create = async (inputValues: *) => {
    if (!inputValues.password) {
        throw new ValidationError('Missing password!')
    }

    const isFirstUser = (await User.count()) === 0
    const fields = pick(updatableFields, inputValues)
    const user = {
        ...fields,
        isAdmin: isFirstUser,
        password: await bcrypt.hash(inputValues.password, saltRounds) }

    return User.create(user)
}

const authenticate = async (email: string, password: string) => {
    const user = await User.findOne({
        attributes: ['id', 'password'],
        where: { email } })

    if (user && await bcrypt.compare(password, user.password)) {
        return user.id
    }

    throw new UnauthenticatedError()
}

const update = async (currentUserId: number, id: number, inputValues: any) => {
    if (currentUserId !== id) {
        await ensureIsAdmin(currentUserId)
    }

    const plainValues = pick(updatableFields, inputValues)

    if (values(plainValues).length === 0) {
        throw new ValidationError('No value to update!')
    }

    const hashPassword = evolve({
        password: p => bcrypt.hashSync(p, saltRounds) })

    const [numUpdated] = await User.update(
        hashPassword(plainValues),
        { where: { id } })

    if (numUpdated === 0) {
        throw new NotFoundError()
    }
}

const remove = async (currentUserId: number, id: number) => {
    await ensureIsAdmin(currentUserId)

    if ((await User.destroy(({ where: { id } }))) === 0) {
        throw new NotFoundError()
    }
}

const find = async (id: number) => {
    const user = await User.findOne({ where: { id } })

    if (!user) {
        throw new NotFoundError()
    }

    return user
}

const findAll = nAry(0, User.findAll.bind(User))

module.exports = { authenticate, create, update, remove, find, findAll }
