const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const groupSchema = mongoose.Schema({
    title: String,
    desc: String,
    owner: {
        _id: String,
        email: String,
    },
    assignedUsers: [{
        value: String,
        display: String,
        readonly: Boolean,
        role: {
            type: String,
            required: true,
            default: 'user',
        },
    }],
    workspaceId: String,
});

module.exports = mongoose.model('Group', groupSchema);