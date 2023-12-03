import { Sequelize } from "sequelize";

const db = new Sequelize("pengaduan_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
