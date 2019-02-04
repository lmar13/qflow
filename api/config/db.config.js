const backup = require('mongodb-backup');
const restore = require('mongodb-restore');
const schedule = require('node-schedule');
const log = require('./../src/dev-logger');
const {
    mongoUri,
    mongoBackupPath,
    backupInterval
} = require('./env.config');

const backupUrl = mongoBackupPath || __dirname + '\\mongo-backup';
const cron = backupInterval || '0 0 15 * * *'; // it will execute at 15:00:00 every day (crontab parser)

module.exports = {
    backup: () => {
        schedule.scheduleJob(cron, () =>
            backup({
                uri: mongoUri,
                root: backupUrl,
                // metadata: true,
                tar: 'dump.tar',
                callback: (err) => err ? log(err) : log(`Database has been successfully backed up. Path: ${backupUrl}`),
            })
        )
    },
    restore: () => {
        restore({
            uri: mongoUri,
            root: backupUrl,
            // metadata: true,
            tar: 'dump.tar',
            callback: (err) => err ? log(err) : log(`Database has been successfully restored. Path: ${backupUrl}`),
        });
    },
}