import express from "express";
import cors from "cors";
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

let whitelist = ["http://localhost:3000", "http://localhost:3001"];
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`Blocked CORS request from: ${origin}`);
      callback(new Error("Not allowed by CORS, Blocked BY CORS!"));
    }
  },
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/get-all", get_all);
app.use("/getById", getById);
app.use("/create_employee", create_employee);
app.use("/update_employee", update_employee);
app.use("/delete_employee", delete_employee);

// auth users
app.use("/api/v1/users", cors(corsOptions), registerUsers);
app.use("/api/v1/users", cors(corsOptions), loginUsers);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});
