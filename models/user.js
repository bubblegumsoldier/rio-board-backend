module.exports = function(sequelize, Sequelize) {
 
    var User = sequelize.define('user', {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        firstname: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        lastname: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        about: {
            type: Sequelize.TEXT
        },
 
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true
            }
        },
 
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
 
        lastLogin: {
            type: Sequelize.DATE
        },
 
        plan: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    });
 
    User.hasMany(require("./project")(sequelize, Sequelize));
    require("./project")(sequelize, Sequelize).belongsTo(User);

    return User;
}