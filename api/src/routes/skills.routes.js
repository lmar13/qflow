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

  app.post('/skill', auth.required, (req, res) => {
    log('POST /skill', req.body);
    const newSkill = new Skill(req.body);
    newSkill.save((err, newSkill) => err ? res.json({
      info: 'error during board create',
      error: err
    }) : res.json(newSkill));
  });

  app.put('/skill/:id', auth.required, (req, res) => {
    log('PUT /skill/:id');
    Skill.replaceOne({
      _id: req.params.id
    }, req.body, (err) => err ? res.status(404).json({
      info: 'error during updating board',
      error: err
    }) : res.status(200).json(req.body));
  });

  app.delete('/skill/:id', auth.required, (req, res) => {
    Skill.findByIdAndRemove(req.params.id, (err) => err ? res.json({
      info: 'error during remove board',
      error: err
    }) : res.status(200).json({
      info: 'board removed successfully'
    }))
  });

}