const db = require('./db')
const Interesses = require('./Interesses')
const Redessociais = require('./Redessociais')

const Usuarios = db.sequelize.define('usuarios', {
    id: {
        type: db.Sequelize.INTEGER(2),
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: db.Sequelize.STRING
    },
    email: {
        type: db.Sequelize.STRING
    },
    matricula: {
        type: db.Sequelize.DOUBLE
    },
    curso: {
        type: db.Sequelize.STRING
    },
    senha: {
        type: db.Sequelize.DOUBLE,
    },
    },
    {freezeTableName: true})

//Usuarios.sync({force: true})

module.exports = Usuarios