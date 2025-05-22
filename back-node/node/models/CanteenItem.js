import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CanteenItem = sequelize.define('CanteenItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    product_name: { type: DataTypes.TEXT, allowNull: false, },
    product_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, },
    product_enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    createdAt: { field: 'created_at', type: DataTypes.DATE },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE },
}, {
    tableName: 'CanteenItems',
    timestamps: true,
});
export default CanteenItem;