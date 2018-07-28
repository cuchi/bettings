const localhost = '127.0.0.1'

type Config = {
    port: number,
    cookieSecret: string,
    postgres: {
        host: string,
        database: string,
        user: string,
        password: string
    }
    logs: {
        level: 'error' | 'warning' | 'info' | 'debug',
        httpStyle: 'combined' | 'common' | 'dev' | 'short' | 'tiny'
    }
}

const defaults: Config = {
    port: Number(process.env.PORT) || 8080,
    cookieSecret: process.env.COOKIE_SECRET || 'foo',

    postgres: {
        host: process.env.POSTGRES_HOST || localhost,
        database: process.env.POSTGRES_DATABASE || 'postgres',
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || '123456'
    },

    logs: {
        level: 'debug',
        httpStyle: 'dev'
    }
}

const test: Partial<Config> = {
    logs: {
        level: 'error',
        httpStyle: 'combined'
    }
}

const production: Partial<Config> = {
    logs: {
        level: 'info',
        httpStyle: 'short'
    }
}

const configFromEnv = () => {
    switch (process.env.NODE_ENV) {
        case 'test':
            return test
        case 'production':
            return production
        default:
            return {}
    }
}

const overwrites: Partial<Config> = configFromEnv()

const resultConfig: Config = { ...defaults, ...overwrites }

export default resultConfig
