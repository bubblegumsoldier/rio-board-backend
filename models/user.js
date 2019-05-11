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
        },

        deactivated: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },

        image: {
            type: Sequelize.STRING,
            defaultValue: false
        }
    },{
        indexes: [
          // Create a unique index on email
          {
            unique: true,
            fields: ['email']
          }
        ],
        instanceMethods: {
            toJSON: function () {
                const userObj = Object.assign({}, this.dataValues);
      
                delete userObj.password;
      
                return userObj
            }
        }
    });
 
    User.hasMany(require("./project")(sequelize, Sequelize));
    require("./project")(sequelize, Sequelize).belongsTo(User);

    return User;
}