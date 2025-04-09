import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const TypesUser = sequelize.define('TypesUser', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
    name: { type: DataTypes.STRING(255), allowNull: false,},
});

export default TypesUser;