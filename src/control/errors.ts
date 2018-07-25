import Sequelize from 'sequelize'

export class HttpError extends Error {
    public status: number

    constructor(status: number, message: string) {
        super()
        this.status = status
        this.message = message
    }
}

export class ValidationError extends HttpError {
    constructor(err: Error | string) {
        super(400, err instanceof Error ? String(err.message) : err)
        this.name = 'ValidationError'
    }
}

export class NotFoundError extends HttpError {
    constructor() {
        super(404, 'Not Found')
        this.name = 'NotFoundError'
    }
}

export class UnauthenticatedError extends HttpError {
    constructor() {
        super(401, 'Not authenticated!')
        this.name = 'UnauthenticatedError'
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message: string) {
        super(402, message)
        this.name = 'UnauthorizedError'
    }
}

export const resolveError = (error: Error) => {
    const validationFailed = error instanceof Sequelize.Error

    if (validationFailed) {
        return new ValidationError(error)
    }

    return error
}
