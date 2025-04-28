import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Department = sequelize.define('Department', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    name: { type: DataTypes.STRING(255), allowNull: false, },
    createdAt: { field: 'created_at', type: DataTypes.DATE },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE },
}, {
    tableName: 'Departments',
    timestamps: true,
});

export default Department;