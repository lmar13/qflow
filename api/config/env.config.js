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
  clientUrl: process.env.CLIENT_URL.split(' '),
  consoleLoggerOn: process.env.LOG_ON,
  backupInterval: process.env.BACKUP_INTERVAL,
  sqlUser: process.env.SQL_USERNAME,
  sqlPass: process.env.SQL_PASSWORD,
  sqlServer: process.env.SQL_SERVER,
  sqlDB: process.env.SQL_DATABASE,
  sqlPort: process.env.SQL_PORT,
};