const _ = require('lodash');
const log = require('./../dev-logger.js');
const auth = require('./../auth-config/auth');
const Workspace = require('./../models/workspace');
const Group = require('./../models/group');

module.exports = function (app) {
    app.get('/workspaces', auth.required, (req, res) => {
        log('GET /workspaces')
        Workspace.find((err, result) => {
            res.status(200).json(result);
        });
    });

    app.get('/workspace/:id', auth.required, (req, res) => {
        log('GET /workspace/:id')
        const id = req.params.id;
    });

    app.get('/groups', auth.required, (req, res) => {
        log('GET /groups')
        Group.find((err, result) => {
            res.status(200).json(result);
        });
    });

    app.get('/group/:id', auth.required, (req, res) => {
        log('GET /group/:id')
        const id = req.params.id;
    });
}