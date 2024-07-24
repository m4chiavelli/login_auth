import { Sequelize } from "sequelize";

const db = new Sequelize("db_auth", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
