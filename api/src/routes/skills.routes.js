const _ = require('lodash');
const log = require('./../dev-logger');
const auth = require('./../auth-config/auth');
const sql = require('mssql');
const Card = require('./../models/card');
const Skill = require('./../models/skill');
const User = require('./../models/user');

module.exports = (app) => {
  app.get('/skills', auth.required, (req, res) => {
    log('GET /skills');
    Skill.find().exec((err, data) => res.status(200).json(data))
  });

  app.get('/usersForSkills', auth.required, (req, res) => {
    User.find()
      .exec((err, data) => {
        Card.aggregate([{
          $match: {
            'assignedUsers._id': {
              $in: data.map(user => user._id)
            }
          }
        }]).exec((err, result) => {
          return res.status(200).json(data.map(d => ({
            ...d._doc,
            cards: result.length,
          })));
        });
      });
  });

  app.get('/usersForSkills/:skillId', auth.required, (req, res) => {
    User.find({'skills._id': req.params.skillId})
      .exec((err, users) => {
        Card.aggregate([
          {$project: { _id: 0, assignedUsers: 1 } },
          {$unwind: "$assignedUsers" },
          {$group: { _id: "$assignedUsers", cards: { $sum: 1 } }},
          {$project: { _id: 0,assignedUsers: "$_id", cards: 1 } },
        ]).exec((err, cards) =>  
          res.status(200).json(users.map(user => {
            const cardsCount = cards.filter(card => card.assignedUsers._id == user._id)[0]
            return {
              ...user._doc,
              cards: cardsCount ? cardsCount.cards : 0
            }
          }))
        );
      });
  });

  app.get('/usersForSkillsCardCount', auth.required, (req, res) => {
    Card.aggregate([
        {$project: { _id: 0, assignedUsers: 1 } },
        {$unwind: "$assignedUsers" },
        {$group: { _id: "$assignedUsers", cards: { $sum: 1 } }},
        {$project: { _id: 0,assignedUsers: "$_id", cards: 1 } },
      ]).exec((err, result) => res.status(200).json(result.map(r => ({
        userId: r.assignedUsers._id,
        cards: result.cards 
      }))));
  })

}