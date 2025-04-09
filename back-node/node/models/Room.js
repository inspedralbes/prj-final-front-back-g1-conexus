import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Asegúrate de que este archivo apunta a tu configuración de Sequelize

const Room = sequelize.define('Room', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
    room_name: { type: DataTypes.TEXT, allowNull: false,},
    room_hours_available: { type: DataTypes.JSON, allowNull: true, defaultValue: null,},
    room_description: { type: DataTypes.TEXT, allowNull: false,},
});

export default Room;