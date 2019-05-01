module.exports = function(sequelize, Sequelize) {
 
    var User = sequelize.define('user', {
    });
 
    User.hasMany(require("./project")(sequelize, Sequelize));
    require("./project")(sequelize, Sequelize).belongsTo(User);

    return User;
}