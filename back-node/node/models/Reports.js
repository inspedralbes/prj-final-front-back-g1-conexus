import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Report = sequelize.define('Report', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    report: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'revising', 'revised'), defaultValue: 'pending' },
    image: { type: DataTypes.TEXT, allowNull: true },
    room_id: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default Report;