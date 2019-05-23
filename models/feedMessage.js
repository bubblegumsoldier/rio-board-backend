
const uuid = require('uuid/v4'); // ES5
module.exports = function(sequelize, Sequelize) {

    var FeedMessage = sequelize.define('feedMessage', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        message: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        userId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        attachment: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        deleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
    });

    FeedMessage.hasMany(FeedMessage);

    return FeedMessage;
}
