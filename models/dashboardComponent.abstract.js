module.exports = function(sequelize, Sequelize) {
    return {
        active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }
}