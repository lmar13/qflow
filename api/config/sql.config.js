const {
    sqlUser,
    sqlPass,
    sqlServer,
    sqlDB,
    sqlPort
} = require('./env.config')

module.exports = {
    user: sqlUser,
    password: sqlPass,
    server: sqlServer,
    database: sqlDB,
    port: parseInt(sqlPort),
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        // parseJSON: true,
    }
}