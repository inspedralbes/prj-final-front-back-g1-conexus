import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    course_name: { type: DataTypes.TEXT, allowNull: false, },
    course_hours_available: { type: DataTypes.JSON, allowNull: true, defaultValue: null, },
    course_description: { type: DataTypes.TEXT, allowNull: false, },
    course_teacher_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true,
        onDelete: 'SET NULL', // Ensures the teacher reference is set to NULL instead of deleting the course
    },
    course_department_id: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { field: 'created_at', type: DataTypes.DATE },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE },
}, {
    tableName: 'Courses',
    timestamps: true,
});
export default Course;