const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const workspaceSchema = mongoose.Schema({
    title: String,
    desc: String,
    owner: {
        _id: String,
        email: String,
    },
    workspaceId: String,
});

module.exports = mongoose.model('Workspace', workspaceSchema);