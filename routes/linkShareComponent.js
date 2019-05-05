const Project = require("../models").project;
const LinkShareComponent = require("../models").linkShareComponent;

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
    }
};