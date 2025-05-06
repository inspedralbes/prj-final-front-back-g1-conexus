import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    room_name: { type: DataTypes.TEXT, allowNull: false },
    room_hours_available: { type: DataTypes.JSON, allowNull: true, defaultValue: null },
    room_description: { type: DataTypes.TEXT, allowNull: false },
}, {
    tableName: 'Rooms',
    timestamps: false,
});

export default Room;