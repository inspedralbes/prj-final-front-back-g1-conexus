import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Asegúrate de que este archivo apunta a tu configuración de Sequelize

const Assistance = sequelize.define('Assistance', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id', }, },
    course_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'courses', key: 'id', }, },
    hour: { type: DataTypes.DATE, allowNull: false, },
    assisted: { type: DataTypes.ENUM('yes', 'unjustified', 'justified'), defaultValue: 'unjustified', },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
});

export default Assistance;