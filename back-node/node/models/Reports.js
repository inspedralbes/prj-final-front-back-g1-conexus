import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Room from './Room.js';
import User from './User.js';


const Report = sequelize.define('Report', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    report: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'revising', 'revised'), defaultValue: 'pending' },
    image: { type: DataTypes.TEXT, allowNull: true },
    room_id: { type: DataTypes.INTEGER, allowNull: false },
    user_assigned: { type: DataTypes.INTEGER, allowNull: true },
    note: { type: DataTypes.TEXT, allowNull: true },
    createdAt: { field: 'created_at', type: DataTypes.DATE },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE },
}, {    
    tableName: 'Reports',
    timestamps: true,
});

Report.belongsTo(Room, { foreignKey: 'room_id', onDelete: 'CASCADE' });
Report.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'SET NULL' });
Report.belongsTo(User, { foreignKey: 'user_assigned', as: 'AssignedUser', onDelete: 'SET NULL' });

export default Report;