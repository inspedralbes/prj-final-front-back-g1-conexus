const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que este archivo apunta a tu configuración de Sequelize

const Department = sequelize.define('Department', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
    name: { type: DataTypes.STRING(255), allowNull: false,},
});

export default Department;