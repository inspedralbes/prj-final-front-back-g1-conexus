import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { hashPassword } from '../routes/userRoutes.js';

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    typesUsers_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    name: { type: DataTypes.STRING(255), allowNull: false, },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true, },
    password: { type: DataTypes.STRING(255), allowNull: false, },
    banner: { type: DataTypes.STRING(255), allowNull: true, },
    profile: { type: DataTypes.STRING(255), allowNull: true, },
    department_id: { type: DataTypes.INTEGER, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    description: { type: DataTypes.TEXT, allowNull: true, defaultValue: null, },
});


User.beforeCreate(async (user) => {
    user.password = await hashPassword(user.password);
});

export default User;