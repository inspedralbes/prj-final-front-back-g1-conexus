import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Grade = sequelize.define('Grade', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,},
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id', },},
    course_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'courses', key: 'id',},},
    grade: { type: DataTypes.FLOAT, allowNull: false, },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW,},
});

export default Grade;