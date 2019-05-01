module.exports = function(sequelize, Sequelize) {
    
    var ProgressComponent = sequelize.define('progressComponent', {
        ...require("./dashboardComponent.abstract")(sequelize, Sequelize),
        progress: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.0
        }
    });
 
    ProgressComponent.hasMany(require("./progressItem")(sequelize, Sequelize));

    return ProgressComponent;
}