import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Assistence = sequelize.define('Assistence', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    hour: { type: DataTypes.DATE, allowNull: false },
    assisted: { type: DataTypes.ENUM('yes', 'unjustified', 'justified'), defaultValue: 'unjustified' },
    createdAt: { field: 'created_at', type: DataTypes.DATE },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE },
}, {
    tableName: 'Assistance',
    timestamps: true,
});

export default Assistence;