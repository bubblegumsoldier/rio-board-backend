module.exports = function(sequelize, Sequelize) {
    
    var FeedMessage = sequelize.define('feedMessage', {
        message: {
            type: Sequelize.STRING,
            allowNull: false
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    FeedMessage.hasMany(FeedMessage);

    return FeedMessage;
}