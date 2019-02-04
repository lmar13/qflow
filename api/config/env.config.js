const dotenv = require('dotenv');

dotenv.config();
module.exports = {
    nodeEnv: process.env.NODE_ENV,
    serverPort: process.env.PORT,
    secretKey: process.env.SECRET_KEY,
    mongoUri: process.env.MONGO_URI,
    mongoBackupPath: process.env.MONGO_BACKUP_PATH,
    mongoUsername: process.env.MONGO_USERNAME,
    mongoPassword: process.env.MONGO_PASSWORD,
    clientUrl: process.env.CLIENT_URL,
    consoleLoggerOn: process.env.LOG_ON,
    backupInterval: process.env.BACKUP_INTERVAL,
};