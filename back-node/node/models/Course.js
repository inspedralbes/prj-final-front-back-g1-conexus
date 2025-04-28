import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    course_name: { type: DataTypes.TEXT, allowNull: false, },
    course_hours_available: { type: DataTypes.JSON, allowNull: true, defaultValue: null, },
    course_description: { type: DataTypes.TEXT, allowNull: false, },
    course_teacher_id: { type: DataTypes.INTEGER, allowNull: true },
    course_department_id: { type: DataTypes.INTEGER, allowNull: false },
});

export default Course;