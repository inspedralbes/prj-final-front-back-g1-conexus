import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Response = sequelize.define('Response', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id', },},
    lostAndFound_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'lost_objects', key: 'id', },},
    comment: { type: DataTypes.TEXT, allowNull: false,},
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW,},
});

export default Response;