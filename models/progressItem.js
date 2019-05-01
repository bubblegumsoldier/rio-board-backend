module.exports = function(sequelize, Sequelize) {
    
    var ProgressItem = sequelize.define('progressItem', {
        title:{
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });   

    return ProgressItem;
}