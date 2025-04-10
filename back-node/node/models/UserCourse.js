import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserCourse = sequelize.define('UserCourse', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
});

export default UserCourse;