module.exports = function(sequelize, Sequelize) {
    
    var LinkShareComponent = sequelize.define('linkShareComponent', {
        ...require("./dashboardComponent.abstract")(sequelize, Sequelize)
    });
 
    LinkShareComponent.hasMany(require("./simpleLink")(sequelize, Sequelize));
    LinkShareComponent.hasMany(require("./googleDriveLink")(sequelize, Sequelize));

    return LinkShareComponent;
}