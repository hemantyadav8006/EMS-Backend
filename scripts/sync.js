import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "../src/config/database.js";
import { Employee } from "../src/models/employee.model.js";

const syncDatabase = async () => {
  try {
    console.log("⏳ Syncing database...");
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully");
  } catch (error) {
    console.error("❌ Failed to sync database:", error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
