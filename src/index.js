import express from "express";
import dotenv from "dotenv";
import {
  get_all,
  getById,
  create_employee,
  update_employee,
  delete_employee,
  registerUsers,
  loginUsers,
} from "./routes/employee.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/get-all", get_all);
app.use("/getById", getById);
app.use("/create_employee", create_employee);
app.use("/update_employee", update_employee);
app.use("/delete_employee", delete_employee);

// auth users
app.use("/api/v1/users", registerUsers);
app.use("/api/v1/users", loginUsers);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
