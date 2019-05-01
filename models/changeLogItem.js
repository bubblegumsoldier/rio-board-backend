module.exports = function(sequelize, Sequelize) {
    
    var ChangeLogItem = sequelize.define('changeLogItem', {
        message: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    
    return ChangeLogItem;
}