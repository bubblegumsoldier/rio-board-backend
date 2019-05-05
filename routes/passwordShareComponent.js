const PasswordShareComponent = require("../models").passwordShareComponent;
const Project = require("../models").project;

function getIncludeModels(req)
{
    if(req.query.extended === 'true')
    {
        return [{ all: true, nested: true }]
    }
    return [{model: PasswordShareComponent}];
}

module.exports = {
    getPasswordShareComponent: function(req, res)
    {
        //requires query param "password" (= SHA-1 encrypted password)
        let hashedPassword = req.query.password;
        let projectId = req.projectId;

        PasswordShareComponent.findOne({
            where:
            {
                projectId: projectId,
                password: hashedPassword
            }
        }).then((share) => {
            if(!share)
            {
                return res.status(404).json({
                    message: "Couldn't be found"
                });
            }
            return res.status(200).json(share);
        }).catch(e => {
            console.log(e);
            res.status(404).json({
                message: "Couldn't be found"
            })
        });
    },

    createPasswordShareComponent: function(req, res)
    {
        let userId = req.userId;
        let projectId = req.projectId;
        let body = req.body;
        Project.findOne({where: {
                userId: userId,
                id: projectId
            },
            include: getIncludeModels(req)
        }).then(project => {
            project.createPasswordShareComponent(body).then((result) => {
                res.send(result);
            }).catch(error => {
                console.log(error);
                res.send(error);
            });
        }).catch(error => {
            console.log(error);
            res.send(error);
        });
    },

    updatePasswordShareComponent: function(req, res)
    {
        let projectId = req.projectId;
        let body = req.body;
        PasswordShareComponent.update(body, {where: {
            projectId: projectId,
            password: req.query.password
        }}).then((passwordShare) => {
            res.status(200).json(passwordShare);
        }).catch(e => {
            console.log(e);
            res.status(500).send("An internal server error has occurred");
        });
    }
}