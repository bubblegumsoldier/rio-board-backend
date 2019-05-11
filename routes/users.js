var models = require("../models");
const User = models.user;

const md5 = require("md5");
var passwordValidator = require('password-validator');


function getIncludeModels(req)
{
    if(req.query.extended === 'true')
    {
        return [{ all: true, nested: true }]
    }
    return [];
}

function createUserNoCheck(body)
{
  return new Promise((resolve, reject) => {
    User.create(body).then((user) => {resolve(user)}, e => {reject(e)});
  });
}

function validatePassword(password)
{
  var schema = new passwordValidator();
  schema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits()                                 // Must have digits
  return schema.validate(password);
}

module.exports = {
  /* GET all users. */
  getAllUsers: (req, res, next) => {
    console.log("Getting all users");
    User.findAll({
      include: getIncludeModels(req),
      attributes: { exclude: ['password'] }
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
      include: getIncludeModels(req),
      attributes: { exclude: ['password'] }
    }).then(result => {
      res.send(result);
    }).catch(error => {
      res.send(error);
    });
  },

  getCurrentUser: (req, res, next) => {
    let userId = req.user.id;
    User.findByPk(userId, {
      include: getIncludeModels(req),
      attributes: { exclude: ['password'] }
    }).then(result => {
      res.send(result);
    }).catch(error => {
      res.send(error);
    });
  },

  createUser: (req, res, next) => {
    let body = req.body;
    if("password" in body)
    {
      if(!validatePassword(body.password))
      {
        return res.status(300).json({message: "Invalid Password"});
      }
      body.password = md5(body.password);
    }
    User.findOne({where: {email: body.email}, attributes: ["id"]}).then((user) => {
      if(user)
      {
        return res.status(300).json({message: "User with email address already exists"});
      }
      createUserNoCheck(body).then((user) => {
        let rawUser = user.get({plain: true});
        delete rawUser.password;
        res.send(rawUser);
      }).catch(e => {
        console.log(e);
        res.status(500).json({message: "An error occurred"});
      });
    }).catch(e => {
      createUserNoCheck(body).then((user) => {
        let rawUser = user.get({plain: true});
        delete rawUser.password;
        res.send(rawUser);
      }).catch(e => {
        console.log(e);
        res.status(500).json({message: "An error occurred"});
      });
    });
  },

  updateUser: (req, res, next) => {
    let body = req.body;
    let additionalWhere = {};
    if("password" in body)
    {
      if(!validatePassword(body.password))
      {
        return res.status(300).json({message: "Password doesn't match minimal security requirements."});
      }
      body.password = md5(body.password);
      body.currentPassword = md5(body.currentPassword);
      additionalWhere["password"] = body.currentPassword;
    }
    User.update(body, {
      where: {
        id: req.user.id,
        ...additionalWhere
      }
    }).then((user) => {
      if(!user)
      {
        return res.status(400).json({message: "Current password is not correct."});
      }
      res.json({message: "Successfully updated user"});
    }).catch((e) => {
      if(e.name == "SequelizeUniqueConstraintError")
      {
        return res.status(403).json({message: "Email address is already in use."});
      }
      console.log(e);
      res.status(500).json({message: "An error occurred"});
    });
  },

  deleteUser: (req, res, next) =>
  {
    User.update({
      deactivated: true
    }, {
      where: {
        id: req.user.id
      }
    }).then((user) => {
      res.json({message: "Successfully deleted user"});
    }).catch((e) => {
      console.log(e);
      res.status(500).json({message: "An error occurred"});
    });
  }
};
