const Project = require("../models").project;
const LinkShareComponent = require("../models").linkShareComponent;
const SimpleLink = require("../models").simpleLink;

function getIncludeModels(req)
{
    if(req.query.extended === 'true')
    {
        return [{ all: true, nested: true }]
    }
    return [];
}

module.exports = {
    getLinkShareComponent: (req, res) =>
    {
        let includes = getIncludeModels(req);
        if(includes.length == 0)
            includes.push(LinkShareComponent);
        Project.findOne({
            where: {
                id: req.projectId
            },
            include: includes
        }).then((project) => 
        {
            res.send(project.linkShareComponent);
        }).catch((e) => {
            console.log(e);
            res.status(400).json({message: e});
        });
    },
    createLinkShareComponent: (req, res) => 
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
            if(!project)
            {
                return res.status(404);
            }
            project.createLinkShareComponent(body).then((result) => {
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
    updateLinkShareComponent: (req, res) => 
    {
        let userId = req.userId;
        let projectId = req.projectId;
        let body = req.body;
        console.log(body);
        LinkShareComponent.update(body, {where: {
            projectId: projectId
            },
            include: [{
                model: SimpleLink
            }]
        }).then((rows, updated) => {
            LinkShareComponent.findOne({
                where: {
                    projectId: projectId
                }
            }).then(e => {
                SimpleLink.destroy({
                    where: {
                        linkShareComponentId: e.id
                    }
                }).then(_ => {
                    let promises = [];
                    for(var i = 0;i < body.simpleLinks.length; ++i)
                    {
                        promises.push(
                            e.createSimpleLink(body.simpleLinks[i])
                        );
                    }
                    Promise.all(promises).then(_ => {
                        res.status(200).send(body);
                    }).catch(e => {
                        res.status(500).json({"message": "Couldn't add links"});
                    });
                  }).catch(e => {
                      console.log(e);
                      res.status(500).json({"message": "Couldn't delete old links"});
                  })
            }).catch(e => {
                console.log(e);
                res.status(500);
            })
            
            
        }).catch(error => {
            console.log(error);
            res.status(404).send(error);
        });
    }
};