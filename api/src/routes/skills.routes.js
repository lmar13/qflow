const _ = require('lodash');
const log = require('./../dev-logger');
const auth = require('./../auth-config/auth');
const sql = require('mssql');
const Card = require('./../models/card');
const Skill = require('./../models/skill');

module.exports = (app) => {
  app.get('/skills', auth.required, (req, res) => {
    log('GET /skills');
    const request = new sql.Request();
    request.query(`select [Skill],
                          [Type],
                          [Category] 
                  from [ResearchBriefs].[dbo].[SkillReference]`)
      .then(data => res.status(200).json(data.recordset))
      .catch(err => res.status(400).json({
        error: err
      }));
  });

  app.get('/usersForSkills', auth.required, (req, res) => {
    const skillName = req.params.skillName;
    const request = new sql.Request();
    request.query(`select distinct 
                      TS.[EmployeeID], 
                      TS.[TechnicalSkill],
                      UP.[EmailID],
                      UP.[EmployeeName]
                  from [ResearchBriefs].[dbo].[Technical_Skill] as TS
                  join [ResearchBriefs].[dbo].[UserProfile] as UP
                      on TS.[EmployeeID] = UP.[EmployeeID] `)
      .then(data => {
        const mockArray = [
          // 'test@example.com',
          'admin@example.com'
        ]
        Card.aggregate([{
          $match: {
            'assignedUsers.display': {
              // $in: data.recordset.map(user => user.EmailID)
              $in: mockArray
            }
          }
        }]).exec((err, result) => {
          return res.status(200).json(data.recordset.map(data => ({
            ...data,
            cards: result.length,
          })));
        });
      })
      .catch(err => res.status(400).json({
        error: err
      }));

  });

  app.get('/usersForSkills/:skillName', auth.required, (req, res) => {
    const skillName = req.params.skillName;
    const request = new sql.Request();
    request.query(`select TS.[EmployeeID],
                          UP.[EmailID]
                  from [ResearchBriefs].[dbo].[Technical_Skill] as TS
                  join [ResearchBriefs].[dbo].[UserProfile] as UP
                        on TS.[EmployeeID] = UP.[EmployeeID] 
                  where TechnicalSkill = '${skillName}'`)
      .then(data => res.status(200).json(data.recordset))
      .catch(err => res.status(400).json({
        error: err
      }));

  });
}