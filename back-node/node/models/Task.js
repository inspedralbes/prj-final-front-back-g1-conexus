import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Task = sequelize.define('Task', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    task_name: { type: DataTypes.TEXT, allowNull: false, },
    task_description: { type: DataTypes.TEXT, allowNull: false, },
    task_ended: { type: DataTypes.BOOLEAN, defaultValue: false, },
    createdAt: { field: 'created_at', type: DataTypes.DATE },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE },
}, {
    tableName: 'Tasks',
    timestamps: true,
});

export default Task;