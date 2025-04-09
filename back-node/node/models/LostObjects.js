import { DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Asegúrate de que este archivo apunta a tu configuración de Sequelize

const LostObject = sequelize.define('LostObject', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    title: { type: DataTypes.STRING(255), allowNull: false, },
    description: { type: DataTypes.TEXT, allowNull: false, },
    image: { type: DataTypes.STRING(255), allowNull: true, },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id',}, },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, },
    expired_at: { type: DataTypes.DATE, allowNull: true, },
});

export default LostObject;