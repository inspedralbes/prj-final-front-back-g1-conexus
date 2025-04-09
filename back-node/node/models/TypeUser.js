// Import DataTypes from sequelize

import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('TypesUser', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
           
            
        },
    }, {
        tableName: 'typesUsers',
        timestamps: false,
    });
};