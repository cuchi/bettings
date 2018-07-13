
// @flow

const Sequelize = require('sequelize')

class HttpError extends Error {
    status: number

    constructor(status: number, message: string) {
        super()
        this.status = status
        this.message = message
    }
}

class ValidationError extends HttpError {
    constructor(err: Error | string) {
        super(400, err instanceof Error ? String(err.message) : err)
        this.name = 'ValidationError'
    }
}

class NotFoundError extends HttpError {
    constructor() {
        super(404, 'Not Found')
        this.name = 'NotFoundError'
    }
}

class UnauthenticatedError extends HttpError {
    constructor() {
        super(401, 'Not authenticated!')
        this.name = 'UnauthenticatedError'
    }
}

class UnauthorizedError extends HttpError {
    constructor(message: string) {
        super(402, message)
        this.name = 'UnauthorizedError'
    }
}

const resolveError = (error: Error) => {
    const validationFailed
        = error instanceof Sequelize.ValidationError
        || error instanceof Sequelize.DatabaseError

    if (validationFailed) {
        return new ValidationError(error)
    }

    return error
}

module.exports = {
    resolveError,
    NotFoundError,
    ValidationError,
    UnauthenticatedError,
    UnauthorizedError
}
