const jwt = require('jsonwebtoken');
const passport = require("passport");

var jwtSecret = require("../auth/secret");

var User = require("../models").user;
var Project = require("../models").project;
var sequelize = require("sequelize");
var Op = sequelize.Op;

function publicProjectKeyIsValid(projectId, key, readOrWrite = "read")
{
    let necessaryValue = (readOrWrite === "read") ? 1 : 2;
    console.log({where: {
        id: projectId,
        securityToken: key,
        [Op.gte]: {
            publicAccess: necessaryValue
        }
    }});
    return new Promise((resolve, reject) => {
        Project.findOne({
            where: {
                [Op.and]:
                {
                    id: projectId,
                    securityToken: key,
                    publicAccess: {
                        [Op.gte]: necessaryValue
                    }
                }
            }
        }).then((project) => {
            if(!project)
            {
                return reject();
            }
            resolve();
        }).catch(e => {
            reject(e);
        })
    });
}

function accessingUserIsProjectOwner(user, projectId)
{
    return new Promise((resolve, reject) => {
        if(!user)
        {
            reject("User was not authorized from middleware");
        }
        let authenticatedUserId = user.id;
        Project.findOne({
            where: {
                id: projectId,
                userId: authenticatedUserId
            }
        }).then((project) => {
            resolve();
        }).catch(_ => {
            reject("User is not owner of project or project doesn't exist");
        })
    });
}

module.exports = {
    validateUsernameAndPassword: (req, res) => {
        passport.authenticate('local', {session: false}, (err, user, info) => {
            if (err || !user) {
                console.log(err);
                console.log(user);
                return res.status(400).json({
                    message: "Username or Password wrong",
                    user   : user
                });
            }
            User.findByPk(user.id).then(fullUser => {
                fullUser.update({
                    lastLogin: sequelize.fn('NOW')
                }, {
                    include: [{ all: true, nested: true }]
                }).then(newUser => {
                    req.login(user, {session: false}, (err) => {
                        if (err) {
                            res.send(err);
                        }
                        // generate a signed son web token with the contents of user object and return it in the response
                        const token = jwt.sign(user, jwtSecret);
                        user.token = token;


                         return res.json(user);
                    });
                }).catch(e => {
                    console.log(e);
                    return res.status(401).json({
                        message: e,
                        user   : user
                    });
                })
            }).catch(_ => {
                return res.status(400).json({
                    message: "Username or Password wrong 3",
                    user   : user
                });
            });

        })(req, res);
    },

    requiresValidToken: passport.authenticate('jwt', {session: false}),

    requiresValidProjectAccess: (accessType = "write") => {
        return (req, res, next) =>
        {
            console.log("trying passport");
            passport.authenticate('jwt', {session: false}, function(err, user, info){
                console.log("authenticated");
                req.user = user;
                let projectId = req.projectId;
                let key = req.query.PPK;
                if(key)
                {
                    return publicProjectKeyIsValid(projectId, key, accessType).then(() => {next()}).catch(() => {
                        res.status(401).send({message: "Insufficient rights (1)"});
                    });
                }
                if(!user)
                {
                    res.status(401).send({message: "Insufficient rights (2)"});
                }
                accessingUserIsProjectOwner(user, projectId).then(() => {next()}).catch(() => {{
                    res.status(401).send({message: "Insufficient rights (3)"});
                }});
            })(req, res);
        }
    },

    requiresMatchingUserId: (req, res, next) => {
        console.log(req.userId);
        console.log(req.user.id);
        if(req.userId != req.user.id)
        {
            return res.status(401).json("Insufficient rights. (3)");
        }
        return next();
    }
};
