const Project = require("../models").project;
const ProgressComponent = require("../models").progressComponent;
const ProgressItem = require("../models").progressItem;

function getIncludeModels(req)
{
    if(req.query.extended === 'true')
    {
        return [{ all: true, nested: true }]
    }
    return [];
}

module.exports = {
    getProgressComponent: (req, res) =>
    {
        let includes = getIncludeModels(req);
        if(includes.length == 0)
            includes.push(ProgressComponent);
        Project.findOne({
            where: {
                id: req.projectId
            },
            include: includes
        }).then((project) =>
        {
            res.send(project.progressComponent);
        }).catch((e) => {
            console.log(e);
            res.status(400).json({message: e});
        });
    },
    createProgressComponent: (req, res) =>
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
            ProgressComponent.destroy({
                where:
                {
                    projectId: projectId
                }
            }).then(_ => {
                project.createProgressComponent(body).then((result) => {
                    res.send(result);
                }).catch(error => {
                    console.log(error);
                    res.send(error);
                });
            }).catch(error => {
                console.log(error);
                res.send(error);
            });
        }).catch(error => {
            console.log(error);
            res.send(error);
        });
    },
    updateProgressComponent: (req, res) =>
    {
        let userId = req.userId;
        let projectId = req.projectId;
        let body = req.body;
        console.log(body);
        ProgressComponent.update(body, {where: {
            projectId: projectId
            },
            include: [{
                model: ProgressItem
            }]
        }).then((rows, updated) => {
            ProgressComponent.findOne({
                where: {
                    projectId: projectId
                }
            }).then(e => {
                ProgressItem.destroy({
                    where: {
                        progressComponentId: e.id
                    }
                }).then(_ => {
                    let promises = [];
                    for(var i = 0;i < body.progressItems.length; ++i)
                    {
                        promises.push(
                            e.createProgressItem(body.progressItems[i])
                        );
                    }
                    Promise.all(promises).then(_ => {
                        res.status(200).send(body);
                    }).catch(e => {
                      console.log(e);
                        res.status(500).json({"message": "Couldn't add progress component"});
                    });
                  }).catch(e => {
                      console.log(e);
                      res.status(500).json({"message": "Couldn't delete old progress component"});
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
