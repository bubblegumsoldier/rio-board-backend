module.exports = function(sequelize, Sequelize) {
    
    var FeedComponent = sequelize.define('feedComponent', {
        ...require("./dashboardComponent.abstract")(sequelize, Sequelize)
    });

    FeedComponent.hasMany(require("./feedMessage")(sequelize, Sequelize));

    return FeedComponent;
}