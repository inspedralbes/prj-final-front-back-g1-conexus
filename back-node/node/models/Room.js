import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    room_name: { type: DataTypes.TEXT, allowNull: false },
    room_hours_available: { type: DataTypes.JSON, allowNull: true, defaultValue: null },
    room_description: { type: DataTypes.TEXT, allowNull: false },
    available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: { field: 'created_at', type: DataTypes.DATE },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE },
}, {
    tableName: 'Rooms',
    timestamps: true,
});

export default Room;