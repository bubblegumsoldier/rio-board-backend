var models = require("../models");
const User = models.user;

function getIncludeModels(req)
{
    if(req.query.extended === 'true')
    {
        return [{ all: true, nested: true }]
    }
    return [];
}

module.exports = {
  /* GET all users. */
  getAllUsers: (req, res, next) => {
    console.log("Getting all users");
    User.findAll({
      include: getIncludeModels(req)
    }).then(result => {
      res.send(result);
    }).catch(error => {
      res.send(error);
    });
  },

  initializeUserId: (req, res, next) =>
  {
    req.userId = req.params.userId;
    next();
  },

  getUser: (req, res, next) => {
    let userId = req.userId;
  
    User.findByPk(userId, {
      include: getIncludeModels(req)
    }).then(result => {
      res.send(result);
    }).catch(error => {
      res.send(error);
    });
  }
};
