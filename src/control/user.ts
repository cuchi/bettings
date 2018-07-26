import bcrypt from 'bcrypt'
import { dissoc, evolve, pick, values } from 'ramda'
import { Transaction } from 'sequelize'
import User from '../models/user'
import {
    NotFoundError,
    UnauthenticatedError,
    UnauthorizedError,
    ValidationError
} from './errors'

const saltRounds = 10

const updatableFields = ['name', 'email', 'password']

export const ensureIsAdmin = async (id: number, transaction?: Transaction) => {
    const currentUser = await User.findOne({
        attributes: ['isAdmin'],
        where: { id },
        transaction })

    if (currentUser && !currentUser.isAdmin) {
        throw new UnauthorizedError('User is not an admin')
    }
}

export const create = async (inputValues: any) => {
    if (!inputValues.password) {
        throw new ValidationError('Missing password!')
    }

    const isFirstUser = (await User.count()) === 0
    const fields = pick(updatableFields, inputValues)
    const user = {
        ...fields,
        isAdmin: isFirstUser,
        password: await bcrypt.hash(inputValues.password, saltRounds) }

    const createdUser = await User.create(user)

    return dissoc('password', createdUser.toJSON())
}

export const authenticate = async (email: string, password: string) => {
    const user = await User.findOne({
        attributes: ['id', `password`],
        where: { email } })

    if (user && await bcrypt.compare(password, user.password)) {
        return user.id
    }

    throw new UnauthenticatedError()
}

export async function update(
    currentUserId: number,
    id: number,
    inputValues: any
) {
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

export const remove = async (currentUserId: number, id: number) => {
    await ensureIsAdmin(currentUserId)

    if ((await User.destroy(({ where: { id } }))) === 0) {
        throw new NotFoundError()
    }
}

export const find = async (id: number) => {
    const user = await User.findOne({ where: { id } })

    if (!user) {
        throw new NotFoundError()
    }

    return user
}

export const getCurrent = (id: number) => User.findOne({ where: { id } })

const publicAttrs = ['id', 'name', 'email', 'score', 'isAdmin', 'createdAt']

export const findAll = () => User.findAll({ attributes: publicAttrs })
