import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Asegúrate de que este archivo apunta a tu configuración de Sequelize

const RoomReservation = sequelize.define('RoomReservation', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id', },},  
    room_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'rooms', key: 'id', },},   
    start_time: { type: DataTypes.DATE, allowNull: false,},
    end_time: { type: DataTypes.DATE, allowNull: false,},
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW,},
});

export default RoomReservation;