
module.exports = {
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    testRegex: '/test/.*',
    moduleFileExtensions: ['ts', 'js'],
    testEnvironment: 'node',
}
