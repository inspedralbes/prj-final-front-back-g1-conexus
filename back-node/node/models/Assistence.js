import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Asegúrate de que este archivo apunta a tu configuración de Sequelize

const Assistence = sequelize.define('Assistence', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    hour: { type: DataTypes.DATE, allowNull: false },
    assisted: { type: DataTypes.ENUM('yes', 'unjustified', 'justified'), defaultValue: 'unjustified' },
});

export default Assistence;