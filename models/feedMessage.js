module.exports = function(sequelize, Sequelize) {

    var FeedMessage = sequelize.define('feedMessage', {
        message: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
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
