module.exports = function(sequelize, Sequelize) {

    var PasswordShareComponent = sequelize.define('passwordShareComponent', {
        ...require("./dashboardComponent.abstract")(sequelize, Sequelize),
        password: {
            //hashed with SHA-1
            type: Sequelize.STRING,
            allowNull: false
        },
        encryptedText: {
            //encrypted with AES, KEY = SHA-2(PASSWORD)
            //decryption: AES(encryptedText, SHA-2(KEY))
            type: Sequelize.TEXT,
            allowNull: false
        }
    });

    return PasswordShareComponent;
}
