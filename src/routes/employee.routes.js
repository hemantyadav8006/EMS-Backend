import express from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../controllers/employee.controller.js";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { verifyAccessToken } from "../middleware/verifyToken.js";

const router = express.Router();

const get_all = router.get("/", getAll);
const getById = router.get("/:id", getOne);
const create_employee = router.post(
  "/",
  upload.single("profile_photo"),
  create
);
const update_employee = router.put(
  "/:id",
  upload.single("profile_photo"),
  update
);
const delete_employee = router.delete("/:id", remove);

// Users
const registerUsers = router.post(
  "/register",
  (req, res, next) => {
    console.log("🔥 Headers:", req.headers["content-type"]);
    next();
  },
  upload.single("profile_photo"),
  (req, res) => {
    console.log("✅ Got body:", req.body);
    console.log("✅ Got file:", req.file);
    registerUser(req, res);
  }
);

const loginUsers = router.post("/login", verifyAccessToken, loginUser);

export {
  get_all,
  getById,
  create_employee,
  update_employee,
  delete_employee,
  registerUsers,
  loginUsers,
};
