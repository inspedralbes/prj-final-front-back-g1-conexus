import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const LostObject = sequelize.define('LostObject', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    title: { type: DataTypes.STRING(255), allowNull: false, },
    description: { type: DataTypes.TEXT, allowNull: false, },
    image: { type: DataTypes.STRING(255), allowNull: true, },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { field: 'created_at', type: DataTypes.DATE },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE },
}, {
    tableName: 'LostObjects',
    timestamps: true,
});

export default LostObject;