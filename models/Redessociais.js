const db = require('./db')
const Usuarios = require('./Usuarios');

const Redessociais = db.sequelize.define('redessociais', {
    id: {
        type: db.Sequelize.INTEGER(2),
        autoIncrement: true,
        primaryKey: true
    },
    whatsapp: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    discord: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    instagram: {
        type: db.Sequelize.STRING,
        allowNull: true
    },
    twitter: {
        type: db.Sequelize.STRING,
        allowNull: true
    }
})


//Redessociais.sync({force: true})

module.exports = Redessociais 