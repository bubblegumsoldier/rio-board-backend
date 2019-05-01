module.exports = function(sequelize, Sequelize) {
 
    var Project = sequelize.define('project', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        image: {
            type: Sequelize.STRING,
            allowNull: false
        },
        securityToken: {
            type: Sequelize.STRING,
            allowNull: true
        },
        publicAccess: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        deleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    Project.hasOne(require("./linkShareComponent")(sequelize, Sequelize));
    Project.hasOne(require("./feedComponent")(sequelize, Sequelize));
    Project.hasOne(require("./changeLogComponent")(sequelize, Sequelize));
    Project.hasOne(require("./progressComponent")(sequelize, Sequelize));

    return Project;
}