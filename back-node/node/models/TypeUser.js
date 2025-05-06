import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TypeUser = sequelize.define('TypeUser', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    name: { type: DataTypes.STRING(255), allowNull: false, },
    createdAt: { field: 'created_at', type: DataTypes.DATE },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE },
}, {
    tableName: 'TypeUsers',
    timestamps: false,
});

export default TypeUser;