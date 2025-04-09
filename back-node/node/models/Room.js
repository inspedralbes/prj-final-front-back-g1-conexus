// Import DataTypes from sequelize

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('Room', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        room_name: {
            type: DataTypes.TEXT,
            allowNull: false,
            
        },
        room_hours_available: {
            type: DataTypes.JSON,
            allowNull: false,
            
        },
        room_description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'rooms',
        timestamps: false,
    });
};