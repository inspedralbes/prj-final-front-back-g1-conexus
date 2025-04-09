// Import DataTypes from sequelize

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('Room_reservation', {
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
        room_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'rooms', // Name of the target table
                key: 'id', // Key in the target table
            },
           
        },
        start_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'room_reservations',
        timestamps: false,
    });
};