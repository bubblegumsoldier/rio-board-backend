
var models = require("../models");
const Project = models.project;
const User = models.user;

function getIncludeModels(req)
{
    if(req.query.extended === 'true')
    {
        return [{ all: true, nested: true }]
    }
    return [];
}

function generateSecurityToken(length = 48){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports ={
    /* GET all projects. */
    getAllProjects: (req, res, next) => {
        let userId = req.userId;
        
        Project.findAll({
        where: {
            userId: userId,
            deleted: false
        },
        include: getIncludeModels(req)
        }).then(result => {
            console.log(result);
            res.send(result);
        }).catch(error => {
            console.log(error);
            res.send(error);
        });
    },

    initializeProjectId: (req, res, next) =>
    {
        req.projectId = req.params.projectId;
        next();
    },

    getProject: (req, res, next) => {
        let userId = req.userId;
        let projectId = req.projectId;
        
        Project.findOne({where: {
                userId: userId,
                id: projectId
            },
            include: getIncludeModels(req)
        }).then(result => {
        if("passwordShareComponent" in result)
        {
            delete result.passwordShareComponent.password;
            delete result.passwordShareComponent.encryptedText;
        }
        console.log(result);
        res.send(result);
        }).catch(error => {
        console.log(error);
        res.send(error);
        });
    },

    createProject: (req, res) => {
        let body = req.body;
        let userId = req.userId;
        
        User.findByPk(req.userId).then(user => {
            console.log(body);
            body.securityToken = generateSecurityToken();
            user.createProject(body).then(result => {
                console.log(result);
                res.send(result);
            }).catch(error => {
                console.log(error)
                res.send(error);
            });
        }).catch(error => {
            console.log(error)
            res.send(error);
        });
    },

    updateProject: (req, res) => {
        let body = req.body;
        delete body.securityToken;
        let userId = req.userId;
        let projectId = req.userId;
        Project.update(body, {where: {
                userId: userId,
                id: projectId
            }
        }).then(result => {
            Project.findOne({where: {
                userId: userId,
                id: projectId
            }
            }).then(result => {
                res.send(result);
            });
        }).catch(error => {
            console.log(error);
            res.send(error);
        }); 
    },

    deleteProject: (req, res) => {
        let userId = req.userId;
        let projectId = req.userId;
        Project.update({deleted: true}, {where: {
            userId: userId,
            id: projectId
            }
        }).then(result => {
            res.send({"message": "Successfully deleted"});
        }).catch(error => {
            console.log(error);
            res.send(error);
        }); 
    },

    projectBelongsToUser: (req, res, next) => {
        let userId = req.userId;
        let projectId = req.userId;
        Project.findOne({where: {
            userId: userId,
            id: projectId
        }}).then(result => {
            if(result)
            {
                return next();
            }
            res.status(404).json({message: "Project for user could not be found"});
        }).catch((e) => {
            res.status(404).json({message: "Project for user could not be found"});
        })
    }
}

