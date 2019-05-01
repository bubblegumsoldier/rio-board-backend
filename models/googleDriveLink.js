module.exports = function(sequelize, Sequelize) {
 
    var GoogleDriveLink = sequelize.define('googleDriveLink', {
        ...require("./link.abstract")(sequelize, Sequelize),
        link: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return GoogleDriveLink;
}