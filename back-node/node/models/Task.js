import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Task = sequelize.define('Task', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    task_name: { type: DataTypes.TEXT, allowNull: false, },
    task_description: { type: DataTypes.TEXT, allowNull: false, },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
});

export default Task;