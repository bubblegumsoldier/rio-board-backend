var models = require("../models");
const FeedComponent = models.feedComponent;
const Project = models.project;

function getIncludeModels(req)
{
    if(req.query.extended === 'true')
    {
        return [{ all: true, nested: true }]
    }
    return [{model: FeedComponent}];
}

module.exports = {
    /* GET feedComponent. */
    getFeedComponent: (req, res, next) => {
        console.log("HERE!");
        let userId = req.userId;
        let projectId = req.projectId;
        console.log(projectId);
            
        Project.findOne({where: {
                userId: userId,
                id: projectId
            },
            include: getIncludeModels(req)
        }).then(result => {
            console.log(result.feedComponent);
            res.send(result.feedComponent);
        }).catch(error => {
            console.log(error);
            res.send(error);
        });
    },
    /* GET feedMessages. */
    getFeedMessages: (req, res, next) => {
        console.log("HERE!");
        let userId = req.userId;
        let projectId = req.projectId;
        console.log(req.projectId);
            
        Project.findOne({where: {
                userId: userId,
                id: projectId
            },
            include: getIncludeModels(req)
        }).then(result => {
            console.log(result.feedComponent.feedMessages);
            res.send(result.feedComponent.feedMessages);
        }).catch(error => {
            console.log(error);
            res.send(error);
        });
    }
};
