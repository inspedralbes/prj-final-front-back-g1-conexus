import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Asegúrate de que este archivo apunta a tu configuración de Sequelize

const Response = sequelize.define('Response', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Nombre de la tabla referenciada
            key: 'id',
        },
    },
    lostAndFound_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'lostObjects', // Nombre de la tabla referenciada
            key: 'id',
        },
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

export default Response;