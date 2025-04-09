// Import DataTypes from sequelize

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('UserCourse', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // Name of the target table
                key: 'id', // Key in the target table
            },
        },
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'courses', // Name of the target table
                key: 'id', // Key in the target table
            },
        },
    }, {
        tableName: 'UserCourse',
        timestamps: false,
    });
};