module.exports = function(sequelize, Sequelize) {
    
    var ChangeLogComponent = sequelize.define('changeLogComponent', {
        ...require("./dashboardComponent.abstract")(sequelize, Sequelize)
    });
 
    ChangeLogComponent.hasMany(require("./changeLogItem")(sequelize, Sequelize));

    return ChangeLogComponent;
}