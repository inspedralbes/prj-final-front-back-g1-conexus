const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de que este archivo apunta a tu configuración de Sequelize

const UserCourse = sequelize.define('UserCourse', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id', }, },
    course_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'courses', key: 'id',},},
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW,},
});

export default UserCourse;