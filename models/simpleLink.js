module.exports = function(sequelize, Sequelize) {
 
    var SimpleLink = sequelize.define('simpleLink', {
        ...require("./link.abstract")(sequelize, Sequelize),
        link: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });

    return SimpleLink;
}