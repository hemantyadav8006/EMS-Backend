import { Employee } from "../models/employee.model.js";

export const registerUser = async (req, res) => {
  return res.status(200).json({ success: true, message: "register ok" });
};

export const loginUser = async (req, res) => {
  return res.status(200).json({ success: true, message: "login ok" });
};
