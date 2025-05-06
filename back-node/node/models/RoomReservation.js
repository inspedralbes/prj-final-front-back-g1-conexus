import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const RoomReservation = sequelize.define('RoomReservation', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    room_id: { type: DataTypes.INTEGER, allowNull: false },
    start_time: { type: DataTypes.DATE, allowNull: false, },
    end_time: { type: DataTypes.DATE, allowNull: false, },
}, {
    tableName: 'RoomReservations',
    timestamps: false,
});

export default RoomReservation;