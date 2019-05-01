var connector = 
{
    connectToMysql: function()
    {
        const Sequelize = require('sequelize');

        // Option 1: Passing parameters separately
        const sequelize = new Sequelize('rio-board', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
        });
        console.log("authenticating");
        return new Promise((resolve, reject) => {
            sequelize.authenticate().then(_ => {
                resolve(sequelize);
            }).catch(err => {
                console.error('Unable to connect to the database:', err);
                reject();
            });
        });
    }
};

module.exports = connector;