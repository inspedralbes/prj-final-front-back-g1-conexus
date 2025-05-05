import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Asegúrate de que este archivo apunta a tu configuración de Sequelize

const Response = sequelize.define('Response', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    lostAndFound_id: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false, },

}, {
    tableName: 'Responses',
    timestamps: false,
});

export default Response;