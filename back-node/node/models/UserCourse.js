import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserCourse = sequelize.define('UserCourse', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { field: 'created_at', type: DataTypes.DATE },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE },
}, {
    tableName: 'UserCourses',
    timestamps: true,
});

export default UserCourse;