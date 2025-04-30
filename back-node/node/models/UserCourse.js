import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserCourse = sequelize.define('UserCourse', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    
}, {
    tableName: 'UserCourses',
    timestamps: false,
});

export default UserCourse;