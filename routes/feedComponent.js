var models = require("../models");
const FeedComponent = models.feedComponent;
const Project = models.project;
const FeedMessage = models.feedMessage;

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

    createFeedComponent:(req, res, next) => {
        let userId = req.userId;
        let projectId = req.projectId;
        let body = req.body;
        Project.findOne({where: {
                userId: userId,
                id: projectId
            },
            include: getIncludeModels(req)
        }).then(project => {
            project.createFeedComponent(body).then((result) => {
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

    /* GET feedMessages. */
    getFeedMessages: (req, res, next) => {
        console.log("HERE!");
        let userId = req.userId;
        let projectId = req.projectId;
        console.log(req.projectId);
        let models = [];
        models.push({model: FeedMessage})
        Project.findOne({where: {
            userId: userId,
            id: projectId
        }
        }).then(result => {
            //project is project of user.
            //continue
            FeedComponent.findOne({where: {
                projectId: projectId
            }, include: models
            }).then((feedComponent) => {
                res.send(feedComponent.feedMessages);
            }).catch(error => {
                console.log(error);
                res.send(error);
            });;
        }).catch(error => {
            console.log(error);
            res.send(error);
        });
    },

    addFeedMessage: (req, res, next) => {
        console.log("FEED MESSAGE!");
        let userId = req.userId;
        let projectId = req.projectId;

        let body = req.body;
        if(!req.user)
        {
          body.userId = -1;
        }

        FeedComponent.findOne({where: {
            projectId: projectId
        }
        }).then((feedComponent) => {
            feedComponent.createFeedMessage(body).then((result) => {
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

    deleteFeedMessage: (req, res, next) => {
      let userId = req.userId;
      let projectId = req.projectId;
      let feedMessageId = req.feedMessageId;

      FeedComponent.findOne({where: {
          projectId: projectId
      }
      }).then((feedComponent) => {
        FeedMessage.update({
          deleted: true
        }, {
          where: {
            feedComponentId: feedComponent.id,
            id: feedMessageId
          }
        }).then(_ => {
          res.status(200).json({message: "Successfully deleted feed message"});
        }).catch(e => {
          console.log(error);
          res.send(error);
        });
      }).catch(error => {
          console.log(error);
          res.send(error);
      });;
    }
};
