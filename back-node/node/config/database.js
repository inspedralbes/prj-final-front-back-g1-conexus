import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.NODE_DB_NAME, process.env.NODE_DB_USER, process.env.NODE_DB_PASSWORD, {
    host: process.env.NODE_DB_HOST,
    dialect: "mysql",
});

export default sequelize;
