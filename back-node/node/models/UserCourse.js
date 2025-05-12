import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserCourse = sequelize.define('UserCourse', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    course_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'Courses',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    createdAt: { field: 'created_at', type: DataTypes.DATE },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE },
}, {
    tableName: 'UserCourses',
    timestamps: true,
});

export default UserCourse;