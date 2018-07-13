
// @flow

const localhost = '127.0.0.1'

module.exports = {
    cookieSecret: process.env.COOKIE_SECRET || 'foo',

    postgres: {
        host: process.env.POSTGRES_HOST || localhost,
        database: process.env.POSTGRES_DATABASE || 'postgres',
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || '123456',
        forceClean: process.env.POSTGRES_FORCE_CLEAN === 'true'
    }
}
